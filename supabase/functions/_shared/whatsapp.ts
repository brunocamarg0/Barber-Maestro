// Integração com Z-API (https://z-api.io)
// Envia mensagens de texto via WhatsApp usando a instância conectada.

function sanitizeNumero(numero: string): string {
  // Remove tudo que não é dígito
  let n = (numero || "").replace(/\D/g, "");
  // Se veio sem DDI, assume Brasil (55)
  if (n.length <= 11) n = "55" + n;
  return n;
}

export async function enviarWhatsApp(
  numero: string,
  mensagem: string
): Promise<{ ok: boolean; providerId?: string; error?: string }> {
  const instanceId = Deno.env.get("ZAPI_INSTANCE_ID");
  const token = Deno.env.get("ZAPI_TOKEN");
  const clientToken = Deno.env.get("ZAPI_CLIENT_TOKEN");

  if (!instanceId || !token || !clientToken) {
    console.error("[whatsapp] credenciais Z-API ausentes");
    return { ok: false, error: "credenciais Z-API não configuradas" };
  }

  const phone = sanitizeNumero(numero);
  if (phone.length < 10) {
    return { ok: false, error: "número inválido" };
  }

  const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Token": clientToken,
      },
      body: JSON.stringify({ phone, message: mensagem }),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      console.error("[whatsapp] Z-API erro", resp.status, data);
      return { ok: false, error: (data as any)?.error || `HTTP ${resp.status}` };
    }

    const providerId = (data as any)?.messageId || (data as any)?.id;
    console.log(`[whatsapp] enviado para ${phone} (id=${providerId})`);
    return { ok: true, providerId };
  } catch (e) {
    console.error("[whatsapp] falha ao chamar Z-API", e);
    return { ok: false, error: (e as Error).message };
  }
}

export function formatarDataHoraBR(data: string, horario?: string | null): string {
  try {
    const d = new Date(data);
    const dia = d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    });
    return horario ? `${dia} às ${horario}` : dia;
  } catch {
    return `${data}${horario ? " às " + horario : ""}`;
  }
}
