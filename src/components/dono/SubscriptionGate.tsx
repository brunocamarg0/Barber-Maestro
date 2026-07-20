import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDono } from "@/context/DonoContext";

/**
 * Bloqueia acesso às rotas do dono quando a assinatura está suspensa
 * (trial expirado ou inadimplência acima do limite). Sempre libera
 * a página "Minha Assinatura" para o dono poder regularizar.
 */
export function SubscriptionGate() {
  const { barbeariaId } = useDono();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "ok" | "blocked">("loading");

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!barbeariaId) return;
      const { data } = await supabase
        .from("assinaturas")
        .select("status, bloqueada_em")
        .eq("barbearia_id", barbeariaId)
        .maybeSingle();
      if (cancel) return;
      const isBlocked =
        !!data?.bloqueada_em || data?.status === "suspensa" || data?.status === "cancelada";
      setStatus(isBlocked ? "blocked" : "ok");
    })();
    return () => {
      cancel = true;
    };
  }, [barbeariaId, location.pathname]);

  if (status === "loading") return <Outlet />;
  if (status === "blocked" && !location.pathname.includes("/dono/minha-assinatura")) {
    return <Navigate to="/dono/minha-assinatura" replace />;
  }
  return <Outlet />;
}
