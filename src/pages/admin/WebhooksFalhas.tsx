import { useState } from "react";
import { useFinanceiro } from "@/context/FinanceiroContext";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WebhooksFalhas() {
  const { webhooks, falhasCobranca, resolverFalhaCobranca } = useFinanceiro();
  const toast = useToast();
  const [webhookSelecionado, setWebhookSelecionado] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogFalhaOpen, setIsDialogFalhaOpen] = useState(false);
  const [falhaSelecionada, setFalhaSelecionada] = useState<any>(null);
  const [acaoResolucao, setAcaoResolucao] = useState("");

  const formatarData = (data: string) => {
    try {
      return new Date(data).toLocaleString("pt-BR");
    } catch {
      return data;
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const statusConfig = {
    sucesso: { label: "Sucesso", variant: "default" as const, icon: CheckCircle },
    falha: { label: "Falha", variant: "destructive" as const, icon: XCircle },
    pendente: { label: "Pendente", variant: "secondary" as const, icon: Clock },
  };

  const statusFalhaConfig = {
    pendente: { label: "Pendente", variant: "destructive" as const, icon: AlertCircle },
    resolvida: { label: "Resolvida", variant: "default" as const, icon: CheckCircle },
    cancelada: { label: "Cancelada", variant: "secondary" as const, icon: XCircle },
  };

  const abrirDialogWebhook = (webhook: any) => {
    setWebhookSelecionado(webhook);
    setIsDialogOpen(true);
  };

  const abrirDialogFalha = (falha: any) => {
    setFalhaSelecionada(falha);
    setAcaoResolucao("");
    setIsDialogFalhaOpen(true);
  };

  const handleResolverFalha = () => {
    if (!falhaSelecionada || !acaoResolucao) {
      toast({
        title: "Erro",
        description: "Preencha a ação de resolução.",
        variant: "destructive",
      });
      return;
    }

    resolverFalhaCobranca(falhaSelecionada.id, acaoResolucao);
    toast({
      title: "Falha resolvida",
      description: "A falha foi marcada como resolvida.",
    });
    setIsDialogFalhaOpen(false);
    setFalhaSelecionada(null);
    setAcaoResolucao("");
  };

  const webhooksSucesso = webhooks.filter((w) => w.status === "sucesso").length;
  const webhooksFalha = webhooks.filter((w) => w.status === "falha").length;
  const falhasPendentes = falhasCobranca.filter((f) => f.status === "pendente").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Webhooks e Falhas de Cobrança</h2>
        <p className="text-muted-foreground">
          Monitore webhooks de pagamento e falhas de cobrança
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Webhooks Sucesso</CardDescription>
            <CardTitle className="text-2xl text-green-600">{webhooksSucesso}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Webhooks com Falha</CardDescription>
            <CardTitle className="text-2xl text-red-600">{webhooksFalha}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Falhas Pendentes</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{falhasPendentes}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="falhas">Falhas de Cobrança</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Webhooks</CardTitle>
              <CardDescription>
                Últimos webhooks receidos dos gateways de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        Nenhum webhook registrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    webhooks.map((webhook) => {
                      const status = statusConfig[webhook.status];
                      const StatusIcon = status.icon;
                      return (
                        <TableRow key={webhook.id}>
                          <TableCell className="font-medium capitalize">
                            {webhook.gateway}
                          </TableCell>
                          <TableCell>{webhook.tipo}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatarData(webhook.data)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => abrirDialogWebhook(webhook)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="falhas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Falhas de Cobrança</CardTitle>
              <CardDescription>
                Falhas no processamento de pagamentos recorrentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barbearia</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Tentativas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {falhasCobranca.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        Nenhuma falha registrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    falhasCobranca.map((falha) => {
                      const status = statusFalhaConfig[falha.status];
                      const StatusIcon = status.icon;
                      return (
                        <TableRow key={falha.id}>
                          <TableCell className="font-medium">
                            {falha.barbeariaNome}
                          </TableCell>
                          <TableCell>{formatarMoeda(falha.valor)}</TableCell>
                          <TableCell>{formatarData(falha.dataVencimento)}</TableCell>
                          <TableCell>{falha.tentativas}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {falha.status === "pendente" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirDialogFalha(falha)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes do Webhook */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Webhook</DialogTitle>
            <DialogDescription>
              Informações completas do webhook recebido
            </DialogDescription>
          </DialogHeader>
          {webhookSelecionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gateway</Label>
                  <p className="font-medium capitalize">{webhookSelecionado.gateway}</p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <p className="font-medium">{webhookSelecionado.tipo}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={statusConfig[webhookSelecionado.status].variant}>
                    {statusConfig[webhookSelecionado.status].label}
                  </Badge>
                </div>
                <div>
                  <Label>Data</Label>
                  <p className="font-medium">{formatarData(webhookSelecionado.data)}</p>
                </div>
              </div>
              <div>
                <Label>Payload</Label>
                <Textarea
                  readOnly
                  value={JSON.stringify(webhookSelecionado.payload, null, 2)}
                  className="font-mono text-xs"
                  rows={10}
                />
              </div>
              {webhookSelecionado.resposta && (
                <div>
                  <Label>Resposta</Label>
                  <p className="text-sm">{webhookSelecionado.resposta}</p>
                </div>
              )}
              {webhookSelecionado.erro && (
                <div>
                  <Label className="text-destructive">Erro</Label>
                  <p className="text-sm text-destructive">{webhookSelecionado.erro}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Resolver Falha */}
      <Dialog open={isDialogFalhaOpen} onOpenChange={setIsDialogFalhaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Falha de Cobrança</DialogTitle>
            <DialogDescription>
              Registre a ação tomada para resolver esta falha
            </DialogDescription>
          </DialogHeader>
          {falhaSelecionada && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Barbearia</Label>
                <p className="font-medium">{falhaSelecionada.barbeariaNome}</p>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <p className="font-medium">{formatarMoeda(falhaSelecionada.valor)}</p>
              </div>
              <div className="space-y-2">
                <Label>Motivo</Label>
                <p className="text-sm text-muted-foreground">
                  {falhaSelecionada.motivo || "Não informado"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acao">Ação de Resolução *</Label>
                <Select value={acaoResolucao} onValueChange={setAcaoResolucao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pagamento_manual">
                      Pagamento realizado manualmente
                    </SelectItem>
                    <SelectItem value="cartao_atualizado">
                      Cartão atualizado pelo cliente
                    </SelectItem>
                    <SelectItem value="cobranca_retentada">
                      Cobrança retentada com sucesso
                    </SelectItem>
                    <SelectItem value="assinatura_cancelada">
                      Assinatura cancelada
                    </SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogFalhaOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleResolverFalha}>Resolver Falha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

