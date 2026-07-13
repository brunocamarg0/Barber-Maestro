import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: AppRole;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requireRole, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();
  const [statusBarbearia, setStatusBarbearia] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const isOwnerArea = requireRole === "owner";
  const isOwner = roles.includes("owner");
  const isSuperAdmin = roles.includes("super_admin");

  useEffect(() => {
    if (!user || !isOwnerArea || !isOwner || isSuperAdmin) {
      setStatusBarbearia(null);
      return;
    }
    setCheckingStatus(true);
    (async () => {
      try {
        const { data: roleRow } = await supabase
          .from("user_roles").select("barbearia_id")
          .eq("user_id", user.id).eq("role", "owner").maybeSingle();
        if (!roleRow?.barbearia_id) { setStatusBarbearia(null); return; }
        const { data: barb } = await supabase
          .from("barbearias").select("status").eq("id", roleRow.barbearia_id).maybeSingle();
        setStatusBarbearia(barb?.status ?? null);
      } finally {
        setCheckingStatus(false);
      }
    })();
  }, [user, isOwnerArea, isOwner, isSuperAdmin]);

  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (requireRole && !roles.includes(requireRole) && !roles.includes("super_admin")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Acesso negado</h1>
        <p className="text-muted-foreground mb-6">Você não tem permissão para acessar esta área.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  // Bloqueio: dono não pode acessar quando barbearia está bloqueada/cancelada
  if (isOwnerArea && !isSuperAdmin && (statusBarbearia === "bloqueada" || statusBarbearia === "cancelada")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Conta {statusBarbearia === "cancelada" ? "cancelada" : "suspensa"}</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {statusBarbearia === "cancelada"
            ? "Sua barbearia foi cancelada pelo administrador. Entre em contato com o suporte para mais informações."
            : "Sua barbearia está suspensa. Regularize sua assinatura ou entre em contato com o suporte."}
        </p>
        <a href="mailto:contato.barbermaestro@outlook.com" className="text-primary underline">Falar com o suporte</a>
      </div>
    );
  }

  return <>{children}</>;
}
