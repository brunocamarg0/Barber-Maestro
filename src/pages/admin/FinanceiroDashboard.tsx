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
  Settings,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FinanceiroDashboard() {
  let faturamento, mrr, ticketMedio, churn, comissao, receitaPeriodo;
  
  try {
    const financeiro = useFinanceiro();
    faturamento = financeiro.faturamento;
    mrr = financeiro.mrr;
    ticketMedio = financeiro.ticketMedio;
    churn = financeiro.churn;
    comissao = financeiro.comissao;
    receitaPeriodo = financeiro.receitaPeriodo;
  } catch (error) {
    console.error("Erro ao carregar dados financeiros:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Erro ao carregar dados financeiros</h3>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
          <pre className="text-xs text-left bg-muted p-4 rounded">
            {error instanceof Error ? error.stack : String(error)}
          </pre>
        </div>
      </div>
    );
  }
  
  if (!faturamento || !mrr || !ticketMedio || !churn || !comissao || !receitaPeriodo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor >= 0 ? "+" : ""}${valor.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financeiro da Plataforma</h2>
          <p className="text-muted-foreground">
            Visão macro do faturamento e métricas financeiras
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/financeiro/integracoes">
              <Settings className="h-4 w-4 mr-2" />
              Integrações
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/financeiro/webhooks">
              <AlertCircle className="h-4 w-4 mr-2" />
              Webhooks & Falhas
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(faturamento.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Período: {faturamento.periodo}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(mrr.valor)}</div>
            <div className="flex items-center gap-1 mt-1">
              {mrr.crescimento >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {formatarPercentual(mrr.crescimento)} este mês
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
            <div className="text-2xl font-bold">{formatarMoeda(ticketMedio.valor)}</div>
            <div className="flex items-center gap-1 mt-1">
              {ticketMedio.crescimento >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {formatarPercentual(ticketMedio.crescimento)} este mês
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
            <div className="text-2xl font-bold">{churn.taxa.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {churn.quantidade} cancelamentos
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
              {receitaPeriodo.map((periodo, index) => (
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
                    {comissao.percentual}% sobre o faturamento
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatarMoeda(comissao.total)}</p>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                {comissao.detalhes.map((detalhe) => (
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
            Cancelamentos do período: {churn.periodo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {churn.detalhes.length === 0 ? (
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
                {churn.detalhes.map((detalhe) => (
                  <TableRow key={detalhe.id}>
                    <TableCell className="font-medium">
                      {detalhe.barbeariaNome}
                    </TableCell>
                    <TableCell>
                      {new Date(detalhe.dataCancelamento).toLocaleDateString("pt-BR")}
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
            <div className="text-2xl font-bold">{formatarMoeda(faturamento.mensal)}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorrente (MRR)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita Anual Projetada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(faturamento.anual)}</div>
            <p className="text-xs text-muted-foreground mt-1">Baseado no MRR atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comissões Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(comissao.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {comissao.percentual}% sobre faturamento
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

