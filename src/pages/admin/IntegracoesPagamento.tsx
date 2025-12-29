import { useState } from "react";
import { useFinanceiro } from "@/context/FinanceiroContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Check, X, Settings, Link2, Key } from "lucide-react";
import { GatewayPagamento } from "@/types/financeiro";
import { useToast } from "@/hooks/use-toast";

const gatewayConfig: Record<
  GatewayPagamento,
  { nome: string; descricao: string; logo: string }
> = {
  stripe: {
    nome: "Stripe",
    descricao: "Gateway de pagamento internacional",
    logo: "💳",
  },
  mercadopago: {
    nome: "Mercado Pago",
    descricao: "Solução de pagamentos do Mercado Livre",
    logo: "🛒",
  },
  pagar_me: {
    nome: "Pagar.me",
    descricao: "Gateway de pagamento brasileiro",
    logo: "💵",
  },
  asaas: {
    nome: "Asaas",
    descricao: "Plataforma de cobrança recorrente",
    logo: "📊",
  },
};

export default function IntegracoesPagamento() {
  const { integracoes, conectarGateway, desconectarGateway } = useFinanceiro();
  const toast = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gatewaySelecionado, setGatewaySelecionado] = useState<GatewayPagamento | null>(null);
  const [config, setConfig] = useState({
    chavePublica: "",
    chavePrivada: "",
    webhookUrl: "",
    webhookSecret: "",
  });

  const abrirDialog = (gateway: GatewayPagamento) => {
    const integracao = integracoes.find((i) => i.gateway === gateway);
    setGatewaySelecionado(gateway);
    if (integracao) {
      setConfig({
        chavePublica: integracao.chavePublica || "",
        chavePrivada: integracao.chavePrivada || "",
        webhookUrl: integracao.webhookUrl || "",
        webhookSecret: integracao.webhookSecret || "",
      });
    } else {
      setConfig({
        chavePublica: "",
        chavePrivada: "",
        webhookUrl: "",
        webhookSecret: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleConectar = () => {
    if (!gatewaySelecionado) return;

    if (!config.chavePublica || !config.chavePrivada) {
      toast({
        title: "Erro",
        description: "Preencha as chaves de API obrigatórias.",
        variant: "destructive",
      });
      return;
    }

    conectarGateway(gatewaySelecionado, config);
    toast({
      title: "Gateway conectado",
      description: `${gatewayConfig[gatewaySelecionado].nome} foi conectado com sucesso.`,
    });
    setIsDialogOpen(false);
  };

  const handleDesconectar = (gatewayId: string, nome: string) => {
    if (confirm(`Tem certeza que deseja desconectar ${nome}?`)) {
      desconectarGateway(gatewayId);
      toast({
        title: "Gateway desconectado",
        description: `${nome} foi desconectado.`,
      });
    }
  };

  const formatarData = (data?: string) => {
    if (!data) return "-";
    try {
      return new Date(data).toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrações de Pagamento</h2>
        <p className="text-muted-foreground">
          Gerencie as integrações com gateways de pagamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integracoes.map((integracao) => {
          const config = gatewayConfig[integracao.gateway];
          return (
            <Card key={integracao.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{config.logo}</div>
                    <div>
                      <CardTitle>{config.nome}</CardTitle>
                      <CardDescription>{config.descricao}</CardDescription>
                    </div>
                  </div>
                  {integracao.conectado ? (
                    <Badge variant="default" className="gap-1">
                      <Check className="h-3 w-3" />
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <X className="h-3 w-3" />
                      Desconectado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {integracao.conectado && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Conectado em:</span>
                      <span className="font-medium">
                        {formatarData(integracao.dataConexao)}
                      </span>
                    </div>
                    {integracao.chavePublica && (
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Chave Pública:</span>
                        <span className="font-mono text-xs">
                          {integracao.chavePublica.substring(0, 20)}...
                        </span>
                      </div>
                    )}
                    {integracao.webhookUrl && (
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Webhook:</span>
                        <span className="font-mono text-xs truncate">
                          {integracao.webhookUrl}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant={integracao.conectado ? "outline" : "default"}
                        className="flex-1"
                        onClick={() => abrirDialog(integracao.gateway)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {integracao.conectado ? "Configurar" : "Conectar"}
                      </Button>
                    </DialogTrigger>
                    {gatewaySelecionado === integracao.gateway && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {integracao.conectado
                              ? "Configurar"
                              : "Conectar"}{" "}
                            {config.nome}
                          </DialogTitle>
                          <DialogDescription>
                            {integracao.conectado
                              ? "Atualize as configurações da integração"
                              : "Preencha as informações para conectar o gateway"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="chavePublica">Chave Pública *</Label>
                            <Input
                              id="chavePublica"
                              value={config.chavePublica}
                              onChange={(e) =>
                                setConfig({ ...config, chavePublica: e.target.value })
                              }
                              placeholder="pk_live_..."
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="chavePrivada">Chave Privada *</Label>
                            <Input
                              id="chavePrivada"
                              type="password"
                              value={config.chavePrivada}
                              onChange={(e) =>
                                setConfig({ ...config, chavePrivada: e.target.value })
                              }
                              placeholder="sk_live_..."
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="webhookUrl">URL do Webhook</Label>
                            <Input
                              id="webhookUrl"
                              value={config.webhookUrl}
                              onChange={(e) =>
                                setConfig({ ...config, webhookUrl: e.target.value })
                              }
                              placeholder="https://api.groomguru.com/webhooks/..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="webhookSecret">Secret do Webhook</Label>
                            <Input
                              id="webhookSecret"
                              type="password"
                              value={config.webhookSecret}
                              onChange={(e) =>
                                setConfig({ ...config, webhookSecret: e.target.value })
                              }
                              placeholder="whsec_..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleConectar}>
                            {integracao.conectado ? "Salvar" : "Conectar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>

                  {integracao.conectado && (
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleDesconectar(integracao.id, config.nome)
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Desconectar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

