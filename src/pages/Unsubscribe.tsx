import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | { kind: "loading" }
  | { kind: "ready"; email?: string }
  | { kind: "already" }
  | { kind: "invalid"; message: string }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid", message: "Token ausente." });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState({ kind: "invalid", message: data.error || "Link inválido." });
          return;
        }
        if (data.alreadyUnsubscribed) {
          setState({ kind: "already" });
        } else {
          setState({ kind: "ready", email: data.email });
        }
      } catch (e: any) {
        setState({ kind: "invalid", message: e?.message || "Erro ao validar." });
      }
    })();
  }, [token]);

  const confirm = async () => {
    setState({ kind: "submitting" });
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ kind: "error", message: data.error || "Falha ao processar." });
        return;
      }
      setState({ kind: "done" });
    } catch (e: any) {
      setState({ kind: "error", message: e?.message || "Erro inesperado." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-sm p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Gerenciar e-mails do Barber Maestro
        </h1>

        {state.kind === "loading" && (
          <p className="text-muted-foreground">Validando seu link...</p>
        )}

        {state.kind === "ready" && (
          <>
            <p className="text-muted-foreground mb-6">
              {state.email
                ? `Deseja parar de receber e-mails em ${state.email}?`
                : "Deseja parar de receber nossos e-mails?"}
            </p>
            <button
              onClick={confirm}
              className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-semibold hover:opacity-90 transition"
            >
              Confirmar descadastro
            </button>
          </>
        )}

        {state.kind === "submitting" && (
          <p className="text-muted-foreground">Processando...</p>
        )}

        {state.kind === "done" && (
          <p className="text-foreground">
            Pronto! Você não receberá mais nossos e-mails.
          </p>
        )}

        {state.kind === "already" && (
          <p className="text-foreground">Você já está descadastrado.</p>
        )}

        {state.kind === "invalid" && (
          <p className="text-destructive">{state.message}</p>
        )}

        {state.kind === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
      </div>
    </div>
  );
}
