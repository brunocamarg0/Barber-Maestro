import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  RefreshCw,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Assinatura {
  id: string;
  status: string;
  plano: {
    id: string;
    nome: string;
    valorMensal: number;
  };
  dataVencimento: string;
  proximoVencimento: string;
  trialAte?: string | null;
  bloqueadaEm?: string | null;
  motivoBloqueio?: string | null;
}

interface Fatura {
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
  const { barbeariaId } = useDono();
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagandoFatura, setPagandoFatura] = useState<string | null>(null);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [faturaSelecionada, setFaturaSelecionada] = useState<Fatura | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("pix");

  useEffect(() => {
    carregarDados();
  }, [barbeariaId]);

  const carregarDados = async () => {
    if (!barbeariaId) return;

    setLoading(true);
    try {
      const { data: ass, error: errAss } = await supabase
        .from("assinaturas")
        .select("id, status, data_vencimento, proximo_vencimento, trial_ate, bloqueada_em, motivo_bloqueio, plano:planos(id, nome, valor_mensal)")
        .eq("barbearia_id", barbeariaId)
        .maybeSingle();

      if (errAss) throw errAss;

      if (!ass) {
        setAssinatura(null);
        setFaturas([]);
        return;
      }

      const planoRel: any = (ass as any).plano;
      setAssinatura({
        id: ass.id,
        status: ass.status,
        dataVencimento: ass.data_vencimento,
        proximoVencimento: ass.proximo_vencimento,
        trialAte: (ass as any).trial_ate,
        bloqueadaEm: (ass as any).bloqueada_em,
        motivoBloqueio: (ass as any).motivo_bloqueio,
        plano: {
          id: planoRel?.id,
          nome: planoRel?.nome,
          valorMensal: Number(planoRel?.valor_mensal) || 0,
        },
      });

      // Carrega cobranças recorrentes (fonte usada pelo cron/webhook) e faturas legadas
      const [{ data: pags }, { data: fats }] = await Promise.all([
        supabase
          .from("pagamentos_assinatura")
          .select("id, valor, data_vencimento, data_pagamento, status, metodo_pagamento, link_pagamento, qr_code_pix")
          .eq("assinatura_id", ass.id)
          .order("data_vencimento", { ascending: false }),
        supabase
          .from("faturas")
          .select("id, valor, data_vencimento, data_pagamento, status, metodo_pagamento, link_pagamento, qr_code_pix")
          .eq("assinatura_id", ass.id)
          .order("data_vencimento", { ascending: false }),
      ]);

      const mapear = (f: any): Fatura => ({
        id: f.id,
        valor: Number(f.valor) || 0,
        dataVencimento: f.data_vencimento,
        dataPagamento: f.data_pagamento,
        status: f.status === "pago" ? "paga" : f.status,
        metodoPagamento: f.metodo_pagamento,
        linkPagamento: f.link_pagamento,
        qrCodePix: f.qr_code_pix,
      });

      const combinadas = [...(pags || []).map(mapear), ...(fats || []).map(mapear)]
        .sort((a, b) => (a.dataVencimento < b.dataVencimento ? 1 : -1));
      setFaturas(combinadas);
    } catch (error: any) {
      console.error("Erro ao carregar assinatura:", error);
      toast.error("Erro ao carregar dados da assinatura");
    } finally {
      setLoading(false);
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

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      paga: { label: "Paga", variant: "default" },
      pendente: { label: "Pendente", variant: "secondary" },
      vencida: { label: "Vencida", variant: "destructive" },
      cancelada: { label: "Cancelada", variant: "outline" },
    };

    return configs[status] || { label: status, variant: "default" as const };
  };

  const handlePagarFatura = async () => {
    if (!faturaSelecionada) return;

    if (faturaSelecionada.linkPagamento) {
      window.open(faturaSelecionada.linkPagamento, "_blank");
      setModalPagamento(false);
      return;
    }

    toast.info("Pagamento online via Mercado Pago em breve. Entre em contato com o suporte para regularizar.");
    setModalPagamento(false);
  };

  const abrirModalPagamento = (fatura: Fatura) => {
    setFaturaSelecionada(fatura);
    setMetodoPagamento("pix");
    setModalPagamento(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados da assinatura...</p>
        </div>
      </div>
    );
  }

  if (!assinatura) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Assinatura não encontrada</p>
          <p className="text-muted-foreground">
            Entre em contato com o suporte para ativar sua assinatura.
          </p>
        </div>
      </div>
    );
  }

  const faturaPendente = faturas.find(f => f.status === 'pendente' || f.status === 'vencida');
  const proximaFatura = faturas[0];

  // Estado do trial / atraso
  const agora = new Date();
  const trialAte = assinatura.trialAte ? new Date(assinatura.trialAte) : null;
  const emTrial = assinatura.status === 'em_teste' && trialAte;
  const diasTrialRestantes = emTrial ? Math.max(0, Math.ceil((trialAte!.getTime() - agora.getTime()) / 86400000)) : 0;
  const vencimento = new Date(assinatura.proximoVencimento);
  const diasAtraso = vencimento < agora ? Math.floor((agora.getTime() - vencimento.getTime()) / 86400000) : 0;
  const bloqueada = !!assinatura.bloqueadaEm || assinatura.status === 'suspensa';
  const emAtraso = diasAtraso > 0 && !bloqueada && !emTrial;

  const iniciarRenovacao = async (planoOverride?: string) => {
    toast.info("Gerando link de pagamento...");
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email || "";
      const nome = (userData.user?.user_metadata as any)?.nome || (userData.user?.user_metadata as any)?.full_name || email;
      let planoSlug = planoOverride;
      if (!planoSlug) {
        const planoNome = (assinatura.plano.nome || "").toLowerCase();
        planoSlug = planoNome.includes("prof") ? "profissional" : "basico";
      }
      const { data, error } = await supabase.functions.invoke("mercadopago-assinatura-checkout", {
        body: { plano: planoSlug, nome, email, profissionaisExtras: 0 },
      });
      if (error) throw error;
      const link = (data as any)?.link || (data as any)?.init_point;
      if (link) window.location.href = link;
      else toast.error("Não foi possível gerar o link. Tente novamente.");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao iniciar renovação");
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Minha Assinatura</h2>
        <p className="text-muted-foreground">
          Gerencie sua assinatura e pagamentos
        </p>
      </div>

      {bloqueada && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" /> Assinatura suspensa
            </CardTitle>
            <CardDescription>
              {assinatura.motivoBloqueio === 'trial_expirado'
                ? 'Seu teste gratuito de 7 dias terminou. Ative um plano para voltar a usar o Barber Maestro.'
                : 'Sua assinatura foi suspensa por falta de pagamento. Regularize para reativar o acesso.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => iniciarRenovacao()} size="lg">
              <CreditCard className="h-4 w-4 mr-2" /> Assinar / Renovar agora
            </Button>
          </CardContent>
        </Card>
      )}

      {emTrial && !bloqueada && (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardHeader>
            <CardTitle className="text-amber-500 flex items-center gap-2">
              <Clock className="h-5 w-5" /> Período de teste: {diasTrialRestantes} dia(s) restante(s)
            </CardTitle>
            <CardDescription>
              Você está no teste gratuito de 7 dias. Assine antes do fim para não perder o acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => iniciarRenovacao()}>
              <CreditCard className="h-4 w-4 mr-2" /> Assinar agora
            </Button>
          </CardContent>
        </Card>
      )}

      {emAtraso && (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardHeader>
            <CardTitle className="text-amber-500 flex items-center gap-2">
              <Clock className="h-5 w-5" /> Pagamento em atraso: {diasAtraso} dia(s)
            </CardTitle>
            <CardDescription>
              Regularize sua assinatura para evitar a suspensão automática após 6 dias de atraso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => iniciarRenovacao()}>
              <CreditCard className="h-4 w-4 mr-2" /> Renovar agora
            </Button>
          </CardContent>
        </Card>
      )}


      {/* Card de Assinatura Atual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>
                {assinatura.plano.nome}
              </CardDescription>
            </div>
            <Badge variant={assinatura.status === 'ativa' ? 'default' : 'destructive'}>
              {assinatura.status === 'ativa' ? 'Ativa' : 'Suspensa'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor Mensal</p>
              <p className="text-2xl font-bold">{formatarMoeda(assinatura.plano.valorMensal)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Próximo Vencimento</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatarData(assinatura.proximoVencimento)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-semibold">
                {assinatura.status === 'ativa' ? (
                  <span className="text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Ativa
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Suspensa
                  </span>
                )}
              </p>
            </div>
          </div>

          {faturaPendente && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                    Fatura Pendente
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Valor: {formatarMoeda(faturaPendente.valor)} • Vencimento: {formatarData(faturaPendente.dataVencimento)}
                  </p>
                </div>
                <Button onClick={() => abrirModalPagamento(faturaPendente)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar Agora
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Faturas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>
                Todas as faturas da sua assinatura
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={carregarDados}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {faturas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma fatura encontrada
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faturas.map((fatura) => {
                  const statusConfig = getStatusBadge(fatura.status);
                  return (
                    <TableRow key={fatura.id}>
                      <TableCell className="font-medium">
                        {formatarMoeda(fatura.valor)}
                      </TableCell>
                      <TableCell>
                        {formatarData(fatura.dataVencimento)}
                      </TableCell>
                      <TableCell>
                        {fatura.dataPagamento ? (
                          formatarData(fatura.dataPagamento)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {fatura.metodoPagamento ? (
                          <Badge variant="outline">{fatura.metodoPagamento}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {fatura.status === 'pendente' || fatura.status === 'vencida' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => abrirModalPagamento(fatura)}
                            disabled={pagandoFatura === fatura.id}
                          >
                            {pagandoFatura === fatura.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processando...
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pagar
                              </>
                            )}
                          </Button>
                        ) : fatura.status === 'paga' && fatura.linkPagamento ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(fatura.linkPagamento, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Comprovante
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Pagamento */}
      <Dialog open={modalPagamento} onOpenChange={setModalPagamento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagar Fatura</DialogTitle>
            <DialogDescription>
              Escolha o método de pagamento para a fatura de {faturaSelecionada && formatarMoeda(faturaSelecionada.valor)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="metodo">Método de Pagamento</Label>
              <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                <SelectTrigger id="metodo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX (Pagamento Instantâneo)</SelectItem>
                  <SelectItem value="boleto">Boleto Bancário</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {faturaSelecionada && (
              <div className="p-4 bg-muted rounded-md">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-bold text-lg">
                      {formatarMoeda(faturaSelecionada.valor)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vencimento:</span>
                    <span>{formatarData(faturaSelecionada.dataVencimento)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalPagamento(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePagarFatura} disabled={pagandoFatura !== null}>
              {pagandoFatura ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Continuar para Pagamento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

