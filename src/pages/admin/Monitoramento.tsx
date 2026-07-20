import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  Building2,
  CreditCard,
  Mail,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
} from "lucide-react";

type StatusCount = { label: string; value: number };

interface EmailFail {
  template_name: string | null;
  recipient_email: string | null;
  error_message: string | null;
  created_at: string;
}

interface Stats {
  barbeariasPorStatus: StatusCount[];
  assinaturasPorStatus: StatusCount[];
  agendamentosHoje: number;
  agendamentos7d: number;
  agendamentosPorStatus7d: StatusCount[];
  emails24h: { total: number; sent: number; failed: number; pending: number };
  ultimasFalhasEmail: EmailFail[];
}

const STATUS_COLOR: Record<string, string> = {
  ativa: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  em_teste: "bg-secondary/20 text-secondary border-secondary/30",
  suspensa: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  bloqueada: "bg-primary/15 text-primary border-primary/30",
  cancelada: "bg-muted text-muted-foreground border-border",
  em_dia: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pendente: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  confirmado: "bg-secondary/20 text-secondary border-secondary/30",
  concluido: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  cancelado: "bg-muted text-muted-foreground border-border",
  sent: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  failed: "bg-primary/15 text-primary border-primary/30",
  dlq: "bg-primary/15 text-primary border-primary/30",
};

function groupCount(rows: { [k: string]: any }[], key: string): StatusCount[] {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const k = String(r[key] ?? "desconhecido");
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default function Monitoramento() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    const hojeInicio = new Date();
    hojeInicio.setHours(0, 0, 0, 0);
    const hojeFim = new Date();
    hojeFim.setHours(23, 59, 59, 999);
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const um24hAtras = new Date();
    um24hAtras.setHours(um24hAtras.getHours() - 24);

    const [
      barbeariasRes,
      assinaturasRes,
      agHojeRes,
      ag7dRes,
      emailsRes,
      falhasRes,
    ] = await Promise.all([
      supabase.from("barbearias").select("status"),
      supabase.from("assinaturas").select("status"),
      supabase
        .from("agendamentos")
        .select("id", { count: "exact", head: true })
        .gte("data", hojeInicio.toISOString())
        .lte("data", hojeFim.toISOString()),
      supabase
        .from("agendamentos")
        .select("status")
        .gte("data", seteDiasAtras.toISOString()),
      supabase
        .from("email_send_log")
        .select("message_id, status, created_at")
        .gte("created_at", um24hAtras.toISOString())
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("email_send_log")
        .select("template_name, recipient_email, error_message, created_at, status")
        .in("status", ["failed", "dlq"])
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // dedup emails por message_id (mantém última entrada = status mais recente)
    const seen = new Set<string>();
    const emailsDedup: { status: string }[] = [];
    (emailsRes.data ?? []).forEach((r: any) => {
      const key = r.message_id ?? Math.random().toString();
      if (!seen.has(key)) {
        seen.add(key);
        emailsDedup.push({ status: r.status });
      }
    });
    const emailsTotal = emailsDedup.length;
    const emailsSent = emailsDedup.filter((e) => e.status === "sent").length;
    const emailsFailed = emailsDedup.filter(
      (e) => e.status === "failed" || e.status === "dlq"
    ).length;
    const emailsPending = emailsDedup.filter((e) => e.status === "pending").length;

    const ag7d = ag7dRes.data ?? [];

    setStats({
      barbeariasPorStatus: groupCount(barbeariasRes.data ?? [], "status"),
      assinaturasPorStatus: groupCount(assinaturasRes.data ?? [], "status"),
      agendamentosHoje: agHojeRes.count ?? 0,
      agendamentos7d: ag7d.length,
      agendamentosPorStatus7d: groupCount(ag7d, "status"),
      emails24h: {
        total: emailsTotal,
        sent: emailsSent,
        failed: emailsFailed,
        pending: emailsPending,
      },
      ultimasFalhasEmail: (falhasRes.data ?? []) as EmailFail[],
    });
    setRefreshedAt(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Monitoramento & Saúde do Sistema
          </h2>
          <p className="text-muted-foreground">
            Dados reais de barbearias, assinaturas, agendamentos e envio de e-mails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {refreshedAt && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {refreshedAt.toLocaleTimeString("pt-BR")}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Barbearias</CardDescription>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading
                ? "..."
                : stats?.barbeariasPorStatus.reduce((s, x) => s + x.value, 0) ?? 0}
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
            <CardDescription>Agendamentos 7d</CardDescription>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "..." : stats?.agendamentos7d ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>E-mails 24h</CardDescription>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "..." : stats?.emails24h.total ?? 0}
            </div>
            {!loading && stats && (
              <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                <span className="text-emerald-500">✓ {stats.emails24h.sent}</span>
                {stats.emails24h.failed > 0 && (
                  <span className="text-primary">✕ {stats.emails24h.failed}</span>
                )}
                {stats.emails24h.pending > 0 && (
                  <span className="text-amber-500">⏳ {stats.emails24h.pending}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribuições */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Barbearias por status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(stats?.barbeariasPorStatus ?? []).map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <Badge variant="outline" className={STATUS_COLOR[s.label] ?? ""}>
                  {s.label}
                </Badge>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
            {!loading && !stats?.barbeariasPorStatus.length && (
              <p className="text-xs text-muted-foreground">Sem dados.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Assinaturas por status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(stats?.assinaturasPorStatus ?? []).map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <Badge variant="outline" className={STATUS_COLOR[s.label] ?? ""}>
                  {s.label}
                </Badge>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
            {!loading && !stats?.assinaturasPorStatus.length && (
              <p className="text-xs text-muted-foreground">Sem dados.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Agendamentos 7d por status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(stats?.agendamentosPorStatus7d ?? []).map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <Badge variant="outline" className={STATUS_COLOR[s.label] ?? ""}>
                  {s.label}
                </Badge>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
            {!loading && !stats?.agendamentosPorStatus7d.length && (
              <p className="text-xs text-muted-foreground">Sem dados.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Falhas de e-mail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {stats && stats.ultimasFalhasEmail.length === 0 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-primary" />
            )}
            Últimas falhas de envio de e-mail
          </CardTitle>
          <CardDescription>
            Emails com status <code>failed</code> ou <code>dlq</code> (retentativas
            esgotadas).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats && stats.ultimasFalhasEmail.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma falha recente. 🎉
            </p>
          ) : (
            <div className="space-y-2">
              {(stats?.ultimasFalhasEmail ?? []).map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 p-3 rounded-md border border-border bg-muted/20"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {f.template_name ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {f.recipient_email ?? "—"} ·{" "}
                      {new Date(f.created_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="text-xs text-primary md:max-w-[50%] md:text-right truncate">
                    {f.error_message ?? "sem detalhe"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
