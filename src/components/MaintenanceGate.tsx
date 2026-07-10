import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { Wrench } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

// Rotas onde a manutenção NUNCA bloqueia (admin sempre acessa)
const BYPASS_PREFIXES = ["/admin", "/super-admin"];

export function MaintenanceGate({ children }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const [ativo, setAtivo] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("platform_settings")
        .select("modo_manutencao, mensagem_manutencao")
        .eq("id", 1)
        .maybeSingle();
      setAtivo(!!data?.modo_manutencao);
      setMensagem(data?.mensagem_manutencao ?? null);

      if (user) {
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "super_admin")
          .maybeSingle();
        setIsSuperAdmin(!!role);
      }
      setChecked(true);
    })();
  }, [user]);

  if (!checked) return <>{children}</>;

  const bypass = BYPASS_PREFIXES.some((p) => location.pathname.startsWith(p)) || isSuperAdmin;

  if (ativo && !bypass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-md text-center space-y-4">
          <Wrench className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Em manutenção</h1>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {mensagem?.trim() || "Sistema em manutenção. Voltaremos em breve."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
