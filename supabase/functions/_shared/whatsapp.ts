// Placeholder da integração de WhatsApp.
// Substituir depois pela chamada real da API do provedor.
export async function enviarWhatsApp(numero: string, mensagem: string): Promise<{ ok: boolean; providerId?: string; error?: string }> {
  console.log(`[whatsapp:placeholder] -> ${numero}\n${mensagem}`);
  // TODO: chamar a API real do provedor de WhatsApp aqui.
  // Ex.: await fetch(WHATSAPP_API_URL, { headers: { Authorization: `Bearer ${WHATSAPP_API_KEY}` }, ... })
  return { ok: true, providerId: "placeholder" };
}

export function formatarDataHoraBR(data: string, horario?: string | null): string {
  try {
    const d = new Date(data);
    const dia = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });
    return horario ? `${dia} às ${horario}` : dia;
  } catch {
    return `${data}${horario ? " às " + horario : ""}`;
  }
}
