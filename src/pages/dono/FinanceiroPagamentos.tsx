import { useState } from "react";
import { useDono } from "@/context/DonoContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, DollarSign, CreditCard, Wallet, QrCode } from "lucide-react";

export default function FinanceiroPagamentos() {
  const { pagamentos, agendamentos } = useDono();
  const [periodo, setPeriodo] = useState<"hoje" | "semana" | "mes">("mes");

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const pagamentosPix = pagamentos.filter((p) => p.metodo === "pix");
  const pagamentosCartao = pagamentos.filter((p) => p.metodo === "cartao_credito" || p.metodo === "cartao_debito");
  const pagamentosDinheiro = pagamentos.filter((p) => p.metodo === "dinheiro");

  const totalPix = pagamentosPix.reduce((sum, p) => sum + p.valor, 0);
  const totalCartao = pagamentosCartao.reduce((sum, p) => sum + p.valor, 0);
  const totalDinheiro = pagamentosDinheiro.reduce((sum, p) => sum + p.valor, 0);
  const totalGeral = totalPix + totalCartao + totalDinheiro;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financeiro & Pagamentos</h2>
          <p className="text-muted-foreground">
            Controle financeiro completo da sua barbearia
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(totalGeral)}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PIX</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(totalPix)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pagamentosPix.length} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartão</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(totalCartao)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pagamentosCartao.length} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dinheiro</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(totalDinheiro)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pagamentosDinheiro.length} transações
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pix">PIX</TabsTrigger>
          <TabsTrigger value="cartao">Cartão</TabsTrigger>
          <TabsTrigger value="dinheiro">Dinheiro</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell>
                        {pagamento.dataPagamento
                          ? new Date(pagamento.dataPagamento).toLocaleDateString("pt-BR")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{pagamento.metodo}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatarMoeda(pagamento.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pagamento.status === "pago"
                              ? "default"
                              : pagamento.status === "pendente"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {pagamento.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pix">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos PIX</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pagamentosPix.length} pagamento(s) via PIX
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cartao">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Cartão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pagamentosCartao.length} pagamento(s) via Cartão
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dinheiro">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos em Dinheiro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pagamentosDinheiro.length} pagamento(s) em Dinheiro
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pagamentos.filter((p) => p.status === "pendente").length} pagamento(s) pendente(s)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



