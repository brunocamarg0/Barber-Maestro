import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, CreditCard, TrendingUp, XCircle, Loader2 } from "lucide-react";

const formatMoeda = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const formatData = (d: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR") : "-");

export default function FinanceiroDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    mrr: 0,
    totalRecebido: 0,
    totalPendente: 0,
    ticketMedio: 0,
    ativas: 0,
    canceladas: 0,
    pagamentos: [] as any[],
    receitaMes: [] as { mes: string; valor: number }[],
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [assRes, pagRes] = await Promise.all([
        supabase.from("assinaturas")
          .select("id, status, plano:planos(valor_mensal), barbearia:barbearias(nome)"),
        supabase.from("pagamentos_assinatura")
          .select("id, valor, status, data_pagamento, data_vencimento, assinatura:assinaturas(barbearia:barbearias(nome))")
          .order("data_pagamento", { ascending: false })
          .limit(50),
      ]);

      const assinaturas = (assRes.data as any[]) || [];
      const pagamentos = (pagRes.data as any[]) || [];

      const ativas = assinaturas.filter((a) => a.status === "ativa" || a.status === "em_dia");
      const canceladas = assinaturas.filter((a) => a.status === "cancelada");
      const mrr = ativas.reduce((s, a) => s + Number(a.plano?.valor_mensal || 0), 0);
      const pagas = pagamentos.filter((p) => p.status === "paga" || p.status === "pago");
      const totalRecebido = pagas.reduce((s, p) => s + Number(p.valor || 0), 0);
      const totalPendente = pagamentos
        .filter((p) => p.status === "pendente")
        .reduce((s, p) => s + Number(p.valor || 0), 0);
      const ticketMedio = pagas.length > 0 ? totalRecebido / pagas.length : 0;

      // Agrupar por mês (últimos 6)
      const porMes: Record<string, number> = {};
      pagas.forEach((p) => {
        if (!p.data_pagamento) return;
        const d = new Date(p.data_pagamento);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        porMes[key] = (porMes[key] || 0) + Number(p.valor || 0);
      });
      const receitaMes = Object.entries(porMes)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 6)
        .map(([mes, valor]) => ({ mes, valor }));

      setData({
        mrr,
        totalRecebido,
        totalPendente,
        ticketMedio,
        ativas: ativas.length,
        canceladas: canceladas.length,
        pagamentos: pagamentos.slice(0, 20),
        receitaMes,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro da Plataforma</h2>
        <p className="text-muted-foreground">Métricas reais consolidadas das barbearias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoeda(data.mrr)}</div>
            <p className="text-xs text-muted-foreground">{data.ativas} assinaturas ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoeda(data.totalRecebido)}</div>
            <p className="text-xs text-muted-foreground">Pagamentos confirmados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoeda(data.ticketMedio)}</div>
            <p className="text-xs text-muted-foreground">Por pagamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pendente</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoeda(data.totalPendente)}</div>
            <p className="text-xs text-muted-foreground">{data.canceladas} canceladas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            {data.receitaMes.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Sem dados</p>
            ) : (
              <div className="space-y-3">
                {data.receitaMes.map((r) => (
                  <div key={r.mes} className="flex justify-between">
                    <span className="text-sm">{r.mes}</span>
                    <span className="font-bold">{formatMoeda(r.valor)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumo</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span>Receita anual projetada</span>
              <span className="font-bold">{formatMoeda(data.mrr * 12)}</span></div>
            <div className="flex justify-between"><span>Assinaturas ativas</span>
              <span className="font-bold">{data.ativas}</span></div>
            <div className="flex justify-between"><span>Assinaturas canceladas</span>
              <span className="font-bold">{data.canceladas}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barbearia</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pagamentos.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  Nenhum pagamento registrado
                </TableCell></TableRow>
              ) : data.pagamentos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.assinatura?.barbearia?.nome || "-"}</TableCell>
                  <TableCell>{formatData(p.data_vencimento)}</TableCell>
                  <TableCell>{formatData(p.data_pagamento)}</TableCell>
                  <TableCell>{formatMoeda(Number(p.valor))}</TableCell>
                  <TableCell><Badge variant={p.status === "paga" || p.status === "pago" ? "default" : "secondary"}>
                    {p.status}
                  </Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
