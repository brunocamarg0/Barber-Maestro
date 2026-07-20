import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { enviarWhatsApp } from '../_shared/whatsapp.ts'

interface Payload {
  audiencia: 'todos_donos' | 'todos_clientes' | 'todos_profissionais'
  titulo: string
  mensagem: string
  tipo?: string
  canais?: { app?: boolean; email?: boolean; whatsapp?: boolean }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Auth: verify caller is super_admin
    const authHeader = req.headers.get('Authorization') || ''
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData?.user) {
      return json({ error: 'não autenticado' }, 401)
    }
    const admin = createClient(supabaseUrl, serviceKey)
    const { data: isAdmin } = await admin.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'super_admin',
    })
    if (!isAdmin) return json({ error: 'somente super_admin' }, 403)

    const body = (await req.json()) as Payload
    const { audiencia, titulo, mensagem, tipo = 'info' } = body
    const canais = { app: true, email: false, whatsapp: false, ...(body.canais || {}) }

    if (!audiencia || !titulo || !mensagem) return json({ error: 'campos obrigatórios ausentes' }, 400)

    // 1) Resolve recipients
    type Recipient = { user_id?: string | null; cliente_id?: string | null; barbearia_id?: string | null; email?: string | null; telefone?: string | null; nome?: string | null }
    let recipients: Recipient[] = []

    if (audiencia === 'todos_donos') {
      const { data: roles } = await admin
        .from('user_roles')
        .select('user_id, barbearia_id')
        .eq('role', 'owner')
      const userIds = (roles || []).map((r: any) => r.user_id).filter(Boolean)
      const [{ data: profiles }, { data: clientes }] = await Promise.all([
        admin.from('profiles').select('user_id, nome, email').in('user_id', userIds),
        admin.from('clientes').select('id, user_id, telefone').in('user_id', userIds),
      ])
      const pm = new Map((profiles || []).map((p: any) => [p.user_id, p]))
      const cm = new Map((clientes || []).map((c: any) => [c.user_id, c]))
      recipients = (roles || []).map((r: any) => ({
        user_id: r.user_id,
        barbearia_id: r.barbearia_id,
        cliente_id: cm.get(r.user_id)?.id ?? null,
        email: pm.get(r.user_id)?.email ?? null,
        nome: pm.get(r.user_id)?.nome ?? null,
        telefone: cm.get(r.user_id)?.telefone ?? null,
      }))
    } else if (audiencia === 'todos_clientes') {
      const { data: clientes } = await admin
        .from('clientes')
        .select('id, user_id, email, nome, telefone')
      recipients = (clientes || []).map((c: any) => ({
        user_id: c.user_id,
        cliente_id: c.id,
        email: c.email,
        nome: c.nome,
        telefone: c.telefone,
      }))
    } else if (audiencia === 'todos_profissionais') {
      const { data: roles } = await admin
        .from('user_roles')
        .select('user_id, barbearia_id')
        .eq('role', 'professional')
      const userIds = (roles || []).map((r: any) => r.user_id).filter(Boolean)
      const [{ data: profs }, { data: clientes }] = await Promise.all([
        admin
          .from('profissionais')
          .select('user_id, nome, telefone, barbearia_id')
          .in('user_id', userIds),
        admin.from('clientes').select('id, user_id, email').in('user_id', userIds),
      ])
      const prm = new Map((profs || []).map((p: any) => [p.user_id, p]))
      const cm = new Map((clientes || []).map((c: any) => [c.user_id, c]))
      recipients = (roles || []).map((r: any) => ({
        user_id: r.user_id,
        barbearia_id: r.barbearia_id ?? prm.get(r.user_id)?.barbearia_id ?? null,
        cliente_id: cm.get(r.user_id)?.id ?? null,
        nome: prm.get(r.user_id)?.nome ?? null,
        telefone: prm.get(r.user_id)?.telefone ?? null,
        email: cm.get(r.user_id)?.email ?? null,
      }))
    } else {
      return json({ error: 'audiência inválida' }, 400)
    }

    const totals = { destinatarios: recipients.length, app: 0, email: 0, email_falhou: 0, whatsapp: 0, whatsapp_falhou: 0 }

    // 2) In-app notifications
    if (canais.app && recipients.length > 0) {
      const inserts = recipients.map((r) => ({
        tipo,
        titulo,
        mensagem,
        lida: false,
        cliente_id: r.cliente_id ?? null,
        barbearia_id: r.barbearia_id ?? null,
      }))
      const { error, count } = await admin
        .from('notificacoes')
        .insert(inserts, { count: 'exact' })
      if (error) console.error('[broadcast] app insert err', error)
      totals.app = count ?? inserts.length
    }

    // 3) Email via queue
    if (canais.email) {
      const withEmail = recipients.filter((r) => !!r.email)
      for (const r of withEmail) {
        try {
          const { error } = await admin.rpc('enqueue_email', {
            queue_name: 'transactional_emails',
            payload: {
              template_name: 'broadcast-admin',
              recipient_email: r.email,
              template_data: {
                titulo,
                mensagem,
                destinatarioNome: r.nome ?? '',
              },
              idempotency_key: `broadcast-${crypto.randomUUID()}`,
              purpose: 'transactional',
            },
          })
          if (error) throw error
          totals.email++
        } catch (e) {
          console.error('[broadcast] email enqueue err', e)
          totals.email_falhou++
        }
      }
    }

    // 4) WhatsApp
    if (canais.whatsapp) {
      const withTel = recipients.filter((r) => !!r.telefone)
      const texto = `*${titulo}*\n\n${mensagem}`
      // limit concurrency: serial to respect Z-API rate limits
      for (const r of withTel) {
        const res = await enviarWhatsApp(r.telefone!, texto)
        if (res.ok) totals.whatsapp++
        else totals.whatsapp_falhou++
      }
    }

    return json({ ok: true, ...totals })
  } catch (e) {
    console.error('[broadcast] erro', e)
    return json({ error: (e as Error).message }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
