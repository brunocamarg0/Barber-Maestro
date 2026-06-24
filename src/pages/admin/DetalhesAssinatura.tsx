import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatMoeda = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const formatData = (d: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR") : "-");

const STATUS_OPTIONS = ["ativa", "atrasada", "pendente", "cancelada"];

export default function DetalhesAssinatura() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assinatura, setAssinatura] = useState<any>(null);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const [novoPlano, setNovoPlano] = useState("");

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
    const { error } = await supabase.from("assinaturas").update({ status }).eq("id", id!);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Status atualizado" }); carregar(); }
  };

  const trocarPlano = async () => {
    if (!novoPlano) return;
    const { error } = await supabase.from("assinaturas").update({ plano_id: novoPlano }).eq("id", id!);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Plano alterado" }); setNovoPlano(""); carregar(); }
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
            <div><Label className="text-muted-foreground">Início</Label>
              <p className="font-medium">{formatData(assinatura.data_inicio)}</p></div>
            <div><Label className="text-muted-foreground">Próximo vencimento</Label>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {formatData(assinatura.proximo_vencimento)}
              </p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Alterar Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <Button key={s} size="sm" variant={assinatura.status === s ? "default" : "outline"}
                    onClick={() => alterarStatus(s)}>{s}</Button>
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
                <Button onClick={trocarPlano} disabled={!novoPlano}>Trocar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>{pagamentos.length} pagamento(s) registrado(s)</CardDescription>
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
