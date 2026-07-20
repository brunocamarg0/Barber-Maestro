import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

function formatarDataBR(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  })
}

async function loadAgendamento(id: string) {
  const { data: ag } = await supabase
    .from('agendamentos')
    .select('id, data, horario, status, cliente_id, cliente_nome, barbearia_id, servico_id, lembrete_24h_enviado, lembrete_2h_enviado')
    .eq('id', id).maybeSingle()
  if (!ag) return null

  let email: string | null = null
  let nome: string = ag.cliente_nome || 'Cliente'
  let prefs = { notificacoes_email: true, lembretes: true }

  if (ag.cliente_id) {
    const { data: cli } = await supabase
      .from('clientes')
      .select('email, nome').eq('id', ag.cliente_id).maybeSingle()
    if (cli) { email = cli.email; nome = cli.nome || nome }
    const { data: pref } = await supabase
      .from('cliente_preferencias_notificacao')
      .select('notificacoes_email, lembretes').eq('cliente_id', ag.cliente_id).maybeSingle()
    if (pref) prefs = { ...prefs, ...pref }
  }

  const { data: barb } = await supabase
    .from('barbearias').select('nome').eq('id', ag.barbearia_id).maybeSingle()
  const { data: srv } = ag.servico_id
    ? await supabase.from('servicos').select('nome').eq('id', ag.servico_id).maybeSingle()
    : { data: null } as any

  return {
    ag, email, nome, prefs,
    barbeariaNome: barb?.nome ?? 'Barbearia',
    servicoNome: srv?.nome ?? 'Serviço',
  }
}

async function sendTemplate(templateName: string, recipientEmail: string, templateData: Record<string, any>, idempotencyKey: string) {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ templateName, recipientEmail, templateData, idempotencyKey }),
  })
  if (!resp.ok) {
    const txt = await resp.text()
    console.error(`send-transactional-email failed [${resp.status}]: ${txt}`)
  }
}

async function sendForAgendamento(action: 'criado' | 'confirmado', agendamentoId: string) {
  const info = await loadAgendamento(agendamentoId)
  if (!info || !info.email || !info.prefs.notificacoes_email) return
  const template = action === 'criado' ? 'agendamento-criado-cliente' : 'agendamento-confirmado-cliente'
  await sendTemplate(template, info.email, {
    nome: info.nome,
    barbearia: info.barbeariaNome,
    servico: info.servicoNome,
    dataHora: formatarDataBR(info.ag.data),
    horario: info.ag.horario,
  }, `${template}-${agendamentoId}`)
}

async function processLembretes() {
  // 24h window: data entre now+23h e now+25h, ainda não enviado
  const now = new Date()
  const in23 = new Date(now.getTime() + 23 * 3600 * 1000).toISOString()
  const in25 = new Date(now.getTime() + 25 * 3600 * 1000).toISOString()
  const in1  = new Date(now.getTime() +  1 * 3600 * 1000).toISOString()
  const in3  = new Date(now.getTime() +  3 * 3600 * 1000).toISOString()

  const windows: Array<{ col: 'lembrete_24h_enviado' | 'lembrete_2h_enviado'; from: string; to: string; label: '24h' | '2h' }> = [
    { col: 'lembrete_24h_enviado', from: in23, to: in25, label: '24h' },
    { col: 'lembrete_2h_enviado',  from: in1,  to: in3,  label: '2h'  },
  ]

  for (const w of windows) {
    const { data: rows } = await supabase
      .from('agendamentos')
      .select('id')
      .gte('data', w.from).lte('data', w.to)
      .in('status', ['pendente', 'confirmado'])
      .eq(w.col, false)
      .limit(200)

    for (const r of rows ?? []) {
      const info = await loadAgendamento(r.id)
      if (!info || !info.email || !info.prefs.notificacoes_email || !info.prefs.lembretes) {
        await supabase.from('agendamentos').update({ [w.col]: true }).eq('id', r.id)
        continue
      }
      await sendTemplate('lembrete-agendamento-cliente', info.email, {
        nome: info.nome,
        barbearia: info.barbeariaNome,
        servico: info.servicoNome,
        dataHora: formatarDataBR(info.ag.data),
        horario: info.ag.horario,
        antecedencia: w.label,
      }, `lembrete-${w.label}-${r.id}`)
      await supabase.from('agendamentos').update({ [w.col]: true }).eq('id', r.id)
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const body = await req.json().catch(() => ({}))
    const action = body.action as string
    if (action === 'criado' || action === 'confirmado') {
      if (!body.agendamento_id) {
        return new Response(JSON.stringify({ error: 'agendamento_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      await sendForAgendamento(action, body.agendamento_id)
    } else if (action === 'lembretes') {
      await processLembretes()
    } else {
      return new Response(JSON.stringify({ error: 'invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('agendamento-emails error', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
