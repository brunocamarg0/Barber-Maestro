import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, CreditCard, AlertCircle, LogOut, Shield, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  barbearias: number;
  clientes: number;
  assinaturasAtivas: number;
  ticketsAbertos: number;
}

export default function SuperAdminDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ barbearias: 0, clientes: 0, assinaturasAtivas: 0, ticketsAbertos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [b, c, a, t] = await Promise.all([
        supabase.from("barbearias").select("id", { count: "exact", head: true }),
        supabase.from("clientes").select("id", { count: "exact", head: true }),
        supabase.from("assinaturas").select("id", { count: "exact", head: true }).eq("status", "ativa"),
        supabase.from("tickets_suporte").select("id", { count: "exact", head: true }).eq("status", "aberto"),
      ]);
      setStats({
        barbearias: b.count ?? 0,
        clientes: c.count ?? 0,
        assinaturasAtivas: a.count ?? 0,
        ticketsAbertos: t.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Barbearias", value: stats.barbearias, icon: Building2 },
    { label: "Clientes", value: stats.clientes, icon: Users },
    { label: "Assinaturas ativas", value: stats.assinaturasAtivas, icon: CreditCard },
    { label: "Tickets abertos", value: stats.ticketsAbertos, icon: AlertCircle },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#dc2626]/20 blur-[140px]" />

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-[#dc2626] p-2.5 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-[#dc2626]" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#dc2626] font-bold">
                    Super Admin
                  </span>
                </div>
                <h1 className="text-3xl font-display tracking-[0.15em] uppercase text-white">
                  Painel Super-Admin
                </h1>
                <p className="text-sm text-white/50 mt-1">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white/70 hover:text-white hover:bg-[#dc2626]/10 border border-white/10 rounded-sm uppercase tracking-wider text-xs font-bold"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {cards.map((c) => (
              <Card
                key={c.label}
                className="relative border-white/10 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden group hover:border-[#dc2626]/40 transition-colors"
              >
                <div className="absolute top-0 left-0 h-1 w-12 bg-[#dc2626] group-hover:w-full transition-all duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                    {c.label}
                  </CardTitle>
                  <c.icon className="h-4 w-4 text-[#dc2626]" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-display text-white tracking-wider">
                    {loading ? "..." : c.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-white/10 bg-black/40 backdrop-blur-sm rounded-sm">
            <CardHeader>
              <CardTitle className="text-white font-display uppercase tracking-[0.15em] text-lg">
                Migração Lovable Cloud
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/70">
              <p>✅ Banco de dados migrado (24 tabelas)</p>
              <p>✅ Auth ativo (email/senha + Google)</p>
              <p>✅ RLS multi-tenant configurado</p>
              <p className="text-[#dc2626]">🔄 Próximo: migrar painéis Dono, Profissional, Cliente para usar o novo backend</p>
              <p className="text-[#dc2626]">🔄 Próximo: edge functions Mercado Pago</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
