import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calendar, Loader2, CheckCircle2, RefreshCw, Ban, Check, X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FEATURES } from "@/config/features";

const formatMoeda = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const formatData = (d: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR") : "-");
const STATUS_OPTIONS = ["ativa", "atrasada", "pendente", "cancelada"];

function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

export default function DetalhesAssinatura() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assinatura, setAssinatura] = useState<any>(null);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const [novoPlano, setNovoPlano] = useState("");
  const [valorPagamento, setValorPagamento] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");

  const carregar = async () => {
    if (!id) return;
    setLoading(true);
    const [aRes, pRes, planosRes] = await Promise.all([
      supabase.from("assinaturas")
        .select("*, barbearia:barbearias(id,nome,email), plano:planos(id,nome,valor_mensal)")
        .eq("id", id).maybeSingle(),
      supabase.from("pagamentos_assinatura").select("*").eq("assinatura_id", id).order("created_at", { ascending: false }),
      supabase.from("planos").select("id,nome,valor_mensal,ativo").eq("ativo", true),
    ]);
    if (aRes.error) toast({ title: "Erro", description: aRes.error.message, variant: "destructive" });
    setAssinatura(aRes.data);
    setPagamentos(pRes.data || []);
    setPlanos(planosRes.data || []);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, [id]);

  const alterarStatus = async (status: string) => {
    setSaving(true);
    const { error } = await supabase.from("assinaturas").update({ status }).eq("id", id!);
    setSaving(false);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Status atualizado" }); carregar(); }
  };

  const trocarPlano = async () => {
    if (!novoPlano) return;
    setSaving(true);
    const { error } = await supabase.from("assinaturas").update({ plano_id: novoPlano }).eq("id", id!);
    setSaving(false);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Plano alterado" }); setNovoPlano(""); carregar(); }
  };

  const toggleRecorrente = async (checked: boolean) => {
    setSaving(true);
    const payload: any = { pagamento_recorrente: checked };
    if (!checked) payload.mercadopago_subscription_id = null;
    const { error } = await supabase.from("assinaturas").update(payload).eq("id", id!);
    setSaving(false);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      toast({
        title: checked ? "Cobrança recorrente ativada" : "Cobrança recorrente desativada",
        description: checked
          ? "A assinatura será renovada automaticamente todo mês."
          : "Pagamentos passarão a ser manuais.",
      });
      carregar();
    }
  };

  const registrarPagamento = async () => {
    if (!assinatura) return;
    const valor = parseFloat(valorPagamento || String(assinatura.plano?.valor_mensal || 0));
    if (!valor || valor <= 0) {
      toast({ title: "Valor inválido", variant: "destructive" });
      return;
    }
    setSaving(true);
    const vencimentoAtual = assinatura.proximo_vencimento ? new Date(assinatura.proximo_vencimento) : new Date();
    const novoVencimento = addMonths(vencimentoAtual, 1);
    const agora = new Date().toISOString();

    const { error: pagError } = await supabase.from("pagamentos_assinatura").insert({
      assinatura_id: id!,
      valor,
      data_vencimento: vencimentoAtual.toISOString(),
      data_pagamento: agora,
      status: "paga",
      metodo_pagamento: metodoPagamento,
      observacoes: "Pagamento registrado manualmente pelo admin",
    });

    if (pagError) {
      setSaving(false);
      toast({ title: "Erro", description: pagError.message, variant: "destructive" });
      return;
    }

    const { error: assError } = await supabase.from("assinaturas").update({
      status: "ativa",
      proximo_vencimento: novoVencimento.toISOString(),
      data_vencimento: novoVencimento.toISOString(),
    }).eq("id", id!);

    setSaving(false);
    if (assError) toast({ title: "Erro", description: assError.message, variant: "destructive" });
    else {
      toast({ title: "Pagamento registrado", description: `Próximo vencimento: ${novoVencimento.toLocaleDateString("pt-BR")}` });
      setValorPagamento("");
      carregar();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>;
  }

  if (!assinatura) {
    return <div className="text-center py-8">
      <p className="text-muted-foreground">Assinatura não encontrada</p>
      <Button asChild className="mt-4"><Link to="/admin/assinaturas">Voltar</Link></Button>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/assinaturas"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Detalhes da Assinatura</h2>
          <p className="text-muted-foreground">{assinatura.barbearia?.nome}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label className="text-muted-foreground">Barbearia</Label>
              <p className="font-medium">{assinatura.barbearia?.nome}</p></div>
            <div><Label className="text-muted-foreground">Plano</Label>
              <p className="font-medium">{assinatura.plano?.nome} — {formatMoeda(assinatura.plano?.valor_mensal)}</p></div>
            <div><Label className="text-muted-foreground">Status</Label>
              <div><Badge>{assinatura.status}</Badge></div></div>
            <div><Label className="text-muted-foreground">Cobrança recorrente</Label>
              <div><Badge variant={assinatura.pagamento_recorrente ? "default" : "outline"}>
                {assinatura.pagamento_recorrente ? "Ativa (automática)" : "Manual"}
              </Badge></div></div>
            <div><Label className="text-muted-foreground">Início</Label>
              <p className="font-medium">{formatData(assinatura.data_inicio)}</p></div>
            <div><Label className="text-muted-foreground">Próximo vencimento</Label>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {formatData(assinatura.proximo_vencimento)}
              </p></div>
            {assinatura.mercadopago_subscription_id && (
              <div><Label className="text-muted-foreground">ID Mercado Pago</Label>
                <p className="font-mono text-xs">{assinatura.mercadopago_subscription_id}</p></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controle de Cobrança</CardTitle>
            <CardDescription>Gerencie a recorrência e status do pagamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="font-medium">Cobrança automática mensal</Label>
                <p className="text-xs text-muted-foreground">
                  Quando ativa, o Mercado Pago cobra todo mês automaticamente
                </p>
              </div>
              <Switch
                checked={!!assinatura.pagamento_recorrente}
                onCheckedChange={toggleRecorrente}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Alterar Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <Button key={s} size="sm" variant={assinatura.status === s ? "default" : "outline"}
                    onClick={() => alterarStatus(s)} disabled={saving}>{s}</Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trocar Plano</Label>
              <div className="flex gap-2">
                <Select value={novoPlano} onValueChange={setNovoPlano}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {planos.filter((p) => p.id !== assinatura.plano_id).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome} — {formatMoeda(p.valor_mensal)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={trocarPlano} disabled={!novoPlano || saving}>Trocar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Pagamento Manual</CardTitle>
          <CardDescription>
            Use quando receber por fora (PIX direto, dinheiro). Renova o vencimento por +1 mês.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder={String(assinatura.plano?.valor_mensal || "0,00")}
                value={valorPagamento}
                onChange={(e) => setValorPagamento(e.target.value)}
              />
            </div>
            <div>
              <Label>Método</Label>
              <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={registrarPagamento} disabled={saving} className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar Pagamento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>{pagamentos.length} pagamento(s) registrado(s)</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={carregar}>
              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vencimento</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  Nenhum pagamento registrado
                </TableCell></TableRow>
              ) : pagamentos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{formatData(p.data_vencimento)}</TableCell>
                  <TableCell>{formatData(p.data_pagamento)}</TableCell>
                  <TableCell>{formatMoeda(Number(p.valor))}</TableCell>
                  <TableCell>{p.metodo_pagamento || "-"}</TableCell>
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
