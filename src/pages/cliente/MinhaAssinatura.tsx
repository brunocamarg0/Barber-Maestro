import { useState, useEffect } from "react";
import { useCliente } from "@/context/ClienteContext";
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
import {
  Package,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  User,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AssinaturaCliente {
  id: string;
  status: string;
  dataInicio: string;
  dataVencimento: string;
  proximoVencimento: string;
  pagamentoRecorrente: boolean;
  plano: {
    id: string;
    nome: string;
    descricao?: string;
    valor: number;
    duracaoMeses: number;
    beneficios: string[];
  };
  profissional?: {
    id: string;
    nome: string;
  };
}

interface PagamentoAssinatura {
  id: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
  metodoPagamento?: string;
  linkPagamento?: string;
  qrCodePix?: string;
}

export default function MinhaAssinatura() {
  const { cliente } = useCliente();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [assinatura, setAssinatura] = useState<AssinaturaCliente | null>(null);
  const [pagamentos, setPagamentos] = useState<PagamentoAssinatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPagamentos, setLoadingPagamentos] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    if (cliente?.id) {
      carregarAssinatura();
    }
  }, [cliente?.id]);

  const carregarAssinatura = async () => {
    if (!cliente?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("assinaturas_cliente")
        .select(
          `id, status, data_inicio, data_vencimento, proximo_vencimento, pagamento_recorrente,
           plano:planos_cliente!plano_id ( id, nome, descricao, valor, duracao_meses, beneficios ),
           profissional:profissionais!profissional_id ( id, nome )`,
        )
        .eq("cliente_id", cliente.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setAssinatura(null);
      } else {
        const a: AssinaturaCliente = {
          id: data.id,
          status: data.status,
          dataInicio: data.data_inicio,
          dataVencimento: data.data_vencimento,
          proximoVencimento: data.proximo_vencimento,
          pagamentoRecorrente: data.pagamento_recorrente,
          plano: {
            id: (data as any).plano?.id,
            nome: (data as any).plano?.nome,
            descricao: (data as any).plano?.descricao ?? undefined,
            valor: Number((data as any).plano?.valor ?? 0),
            duracaoMeses: (data as any).plano?.duracao_meses ?? 1,
            beneficios: (data as any).plano?.beneficios ?? [],
          },
          profissional: (data as any).profissional
            ? { id: (data as any).profissional.id, nome: (data as any).profissional.nome }
            : undefined,
        };
        setAssinatura(a);
        await carregarPagamentos(a.id);
      }
    } catch (error: any) {
      console.error("Erro ao carregar assinatura:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar dados da assinatura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarPagamentos = async (assinaturaId: string) => {
    setLoadingPagamentos(true);
    try {
      const { data, error } = await supabase
        .from("pagamentos_assinatura")
        .select(
          "id, valor, data_vencimento, data_pagamento, status, metodo_pagamento, link_pagamento, qr_code_pix",
        )
        .eq("assinatura_id", assinaturaId)
        .order("data_vencimento", { ascending: false });

      if (error) throw error;

      setPagamentos(
        (data ?? []).map((p: any) => ({
          id: p.id,
          valor: Number(p.valor ?? 0),
          dataVencimento: p.data_vencimento,
          dataPagamento: p.data_pagamento ?? undefined,
          status: p.status,
          metodoPagamento: p.metodo_pagamento ?? undefined,
          linkPagamento: p.link_pagamento ?? undefined,
          qrCodePix: p.qr_code_pix ?? undefined,
        })),
      );
    } catch (error: any) {
      console.error("Erro ao carregar pagamentos:", error);
    } finally {
      setLoadingPagamentos(false);
    }
  };

  const cancelarAssinatura = async () => {
    if (!assinatura) return;
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;
    setCancelando(true);
    try {
      const { error } = await supabase
        .from("assinaturas_cliente")
        .update({ status: "cancelada" })
        .eq("id", assinatura.id);
      if (error) throw error;
      toast({ title: "Assinatura cancelada", description: "Você já pode contratar outro plano." });
      await carregarAssinatura();
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCancelando(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: any }> = {
      ativa: { label: "Ativa", variant: "default", icon: CheckCircle },
      pendente: { label: "Pendente", variant: "secondary", icon: Clock },
      suspensa: { label: "Suspensa", variant: "secondary", icon: Clock },
      cancelada: { label: "Cancelada", variant: "destructive", icon: XCircle },
      vencida: { label: "Vencida", variant: "destructive", icon: AlertCircle },
    };
    return configs[status] || { label: status, variant: "default" as const, icon: Package };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando assinatura...</p>
      </div>
    );
  }

  if (!assinatura) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Minha Assinatura</h2>
          <p className="text-muted-foreground">
            Gerencie sua assinatura e pagamentos
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Você não possui uma assinatura</h3>
              <p className="text-muted-foreground mb-6">
                Veja os planos disponíveis nas barbearias e contrate o seu.
              </p>
              <Button onClick={() => navigate("/cliente/planos-disponiveis")}>
                Ver planos disponíveis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(assinatura.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Minha Assinatura</h2>
          <p className="text-muted-foreground">
            Gerencie sua assinatura e acompanhe seus pagamentos
          </p>
        </div>
        {assinatura.status !== "cancelada" && (
          <Button
            variant="destructive"
            onClick={cancelarAssinatura}
            disabled={cancelando}
          >
            {cancelando ? "Cancelando..." : "Cancelar assinatura"}
          </Button>
        )}
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Plano
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold">{assinatura.plano.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {assinatura.plano.duracaoMeses} {assinatura.plano.duracaoMeses === 1 ? "mês" : "meses"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Mensal</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarMoeda(assinatura.plano.valor)}
                    </p>
                  </div>
                  {assinatura.plano.descricao && (
                    <p className="text-sm text-muted-foreground">
                      {assinatura.plano.descricao}
                    </p>
                  )}
                  {assinatura.plano.beneficios.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Benefícios:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {assinatura.plano.beneficios.map((beneficio, index) => (
                          <li key={index}>{beneficio}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-5 w-5 ${
                      assinatura.status === "ativa" ? "text-green-600" :
                      assinatura.status === "vencida" || assinatura.status === "cancelada" ? "text-red-600" :
                      "text-gray-600"
                    }`} />
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Início:</span>
                      <span>{formatarData(assinatura.dataInicio)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vencimento:</span>
                      <span>{formatarData(assinatura.dataVencimento)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Próximo:</span>
                      <span>{formatarData(assinatura.proximoVencimento)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Pagamento Recorrente:</span>
                      <Badge variant={assinatura.pagamentoRecorrente ? "default" : "secondary"}>
                        {assinatura.pagamentoRecorrente ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {assinatura.profissional && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profissional Responsável
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{assinatura.profissional.nome}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pagamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Acompanhe todos os pagamentos da sua assinatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPagamentos ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Carregando pagamentos...</p>
                </div>
              ) : pagamentos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum pagamento registrado ainda.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagamentos.map((pagamento) => (
                      <TableRow key={pagamento.id}>
                        <TableCell className="font-medium">
                          {formatarMoeda(pagamento.valor)}
                        </TableCell>
                        <TableCell>
                          {formatarData(pagamento.dataVencimento)}
                        </TableCell>
                        <TableCell>
                          {pagamento.dataPagamento
                            ? formatarData(pagamento.dataPagamento)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {pagamento.metodoPagamento || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              pagamento.status === "paga"
                                ? "default"
                                : pagamento.status === "vencida"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {pagamento.status === "paga"
                              ? "Paga"
                              : pagamento.status === "vencida"
                              ? "Vencida"
                              : "Pendente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
