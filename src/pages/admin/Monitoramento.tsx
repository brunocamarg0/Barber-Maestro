import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Calendar, Building2, CreditCard, Bell } from "lucide-react";

interface UsoModulo {
  modulo: string;
  uso: number;
  percentual: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface Stats {
  barbeariasOnline: number;
  agendamentosHoje: number;
  agendamentosTotal: number;
  usoModulos: UsoModulo[];
}

export default function Monitoramento() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const hojeInicio = new Date();
      hojeInicio.setHours(0, 0, 0, 0);
      const hojeFim = new Date();
      hojeFim.setHours(23, 59, 59, 999);

      const [barbeariasRes, agHojeRes, agTotalRes, pagHojeRes] = await Promise.all([
        supabase
          .from("barbearias")
          .select("id", { count: "exact", head: true })
          .in("status", ["ativa", "em_teste"]),
        supabase
          .from("agendamentos")
          .select("id", { count: "exact", head: true })
          .gte("data", hojeInicio.toISOString())
          .lte("data", hojeFim.toISOString()),
        supabase
          .from("agendamentos")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("agendamentos")
          .select("id", { count: "exact", head: true })
          .gte("data", hojeInicio.toISOString())
          .lte("data", hojeFim.toISOString())
          .eq("pago", true),
      ]);

      const barbeariasOnline = barbeariasRes.count ?? 0;
      const agendamentosHoje = agHojeRes.count ?? 0;
      const agendamentosTotal = agTotalRes.count ?? 0;
      const pagamentosHoje = pagHojeRes.count ?? 0;
      // Notificações não têm tabela dedicada acessível aqui — estimativa: 1 por agendamento do dia
      const notificacoesHoje = agendamentosHoje;

      const maxUso = Math.max(agendamentosHoje, pagamentosHoje, notificacoesHoje, 1);

      const usoModulos: UsoModulo[] = [
        {
          modulo: "Agendamento",
          uso: agendamentosHoje,
          percentual: Math.round((agendamentosHoje / maxUso) * 100),
          icon: Calendar,
        },
        {
          modulo: "Pagamento",
          uso: pagamentosHoje,
          percentual: Math.round((pagamentosHoje / maxUso) * 100),
          icon: CreditCard,
        },
        {
          modulo: "Notificações",
          uso: notificacoesHoje,
          percentual: Math.round((notificacoesHoje / maxUso) * 100),
          icon: Bell,
        },
      ];

      setStats({ barbeariasOnline, agendamentosHoje, agendamentosTotal, usoModulos });
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monitoramento & Saúde do Sistema</h2>
        <p className="text-muted-foreground">
          Acompanhe a saúde e performance do sistema em tempo real
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Barbearias Ativas</CardDescription>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "..." : stats?.barbeariasOnline ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Agendamentos Hoje</CardDescription>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "..." : stats?.agendamentosHoje ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Total de Agendamentos</CardDescription>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "..." : stats?.agendamentosTotal ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uso por Módulo</CardTitle>
          <CardDescription>Utilização dos módulos hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(stats?.usoModulos ?? []).map((modulo) => {
              const Icon = modulo.icon;
              return (
                <div key={modulo.modulo} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {modulo.modulo}
                    </span>
                    <span className="text-muted-foreground">
                      {modulo.uso} {modulo.uso === 1 ? "uso" : "usos"} ({modulo.percentual}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${modulo.percentual}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {!loading && stats?.usoModulos.every((m) => m.uso === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma atividade registrada hoje.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
