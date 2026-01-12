import { useFinanceiro } from "@/context/FinanceiroContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  XCircle,
} from "lucide-react";

export default function FinanceiroDashboard() {
  let financeiro;
  
  try {
    financeiro = useFinanceiro();
  } catch (error) {
    console.error("Erro ao carregar dados financeiros:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Erro ao carregar dados financeiros</h3>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      </div>
    );
  }
  
  if (!financeiro) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  const { faturamento, mrr, ticketMedio, churn, comissao, receitaPeriodo } = financeiro;
  
  // Valores padrão caso algum esteja undefined
  const safeFaturamento = faturamento || { total: 0, mensal: 0, anual: 0, periodo: "" };
  const safeMrr = mrr || { valor: 0, crescimento: 0, periodo: "" };
  const safeTicketMedio = ticketMedio || { valor: 0, crescimento: 0, periodo: "" };
  const safeChurn = churn || { taxa: 0, quantidade: 0, periodo: "", detalhes: [] };
  const safeComissao = comissao || { total: 0, percentual: 0, periodo: "", detalhes: [] };
  const safeReceitaPeriodo = receitaPeriodo || [];

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor >= 0 ? "+" : ""}${valor.toFixed(2)}%`;
  };

  const formatarData = (data: string) => {
    try {
      return new Date(data).toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro da Plataforma</h2>
        <p className="text-muted-foreground">
          Visão macro do faturamento e métricas financeiras
        </p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(safeFaturamento.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Período: {safeFaturamento.periodo}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(safeMrr.valor)}</div>
            <div className="flex items-center gap-1 mt-1">
              {safeMrr.crescimento >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {formatarPercentual(safeMrr.crescimento)} este mês
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(safeTicketMedio.valor)}</div>
            <div className="flex items-center gap-1 mt-1">
              {safeTicketMedio.crescimento >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {formatarPercentual(safeTicketMedio.crescimento)} este mês
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeChurn.taxa.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {safeChurn.quantidade} cancelamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Receita Mensal e Comissões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeReceitaPeriodo.map((periodo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{periodo.periodo}</p>
                    <p className="text-xs text-muted-foreground">
                      {periodo.assinaturas} assinaturas • {periodo.novosClientes} novos •{" "}
                      {periodo.cancelamentos} cancelados
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatarMoeda(periodo.receita)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comissões</CardTitle>
            <CardDescription>Comissões dos gateways de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total de Comissões</p>
                  <p className="text-xs text-muted-foreground">
                    {safeComissao.percentual}% sobre o faturamento
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatarMoeda(safeComissao.total)}</p>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                {safeComissao.detalhes.map((detalhe) => (
                  <div
                    key={detalhe.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{detalhe.gateway}</span>
                    <span className="font-medium">{formatarMoeda(detalhe.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes do Churn */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Churn</CardTitle>
          <CardDescription>
            Cancelamentos do período: {safeChurn.periodo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {safeChurn.detalhes.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum cancelamento registrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barbearia</TableHead>
                  <TableHead>Data de Cancelamento</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Valor Perdido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeChurn.detalhes.map((detalhe) => (
                  <TableRow key={detalhe.id}>
                    <TableCell className="font-medium">
                      {detalhe.barbeariaNome}
                    </TableCell>
                    <TableCell>
                      {formatarData(detalhe.dataCancelamento)}
                    </TableCell>
                    <TableCell>
                      {detalhe.motivo || (
                        <span className="text-muted-foreground">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatarMoeda(detalhe.valorPerdido)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(safeFaturamento.mensal)}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorrente (MRR)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita Anual Projetada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(safeFaturamento.anual)}</div>
            <p className="text-xs text-muted-foreground mt-1">Baseado no MRR atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comissões Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(safeComissao.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {safeComissao.percentual}% sobre faturamento
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}







