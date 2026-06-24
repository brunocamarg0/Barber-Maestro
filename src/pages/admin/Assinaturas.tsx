import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AssinaturaRow {
  id: string;
  status: string;
  data_inicio: string;
  proximo_vencimento: string | null;
  barbearia: { id: string; nome: string } | null;
  plano: { id: string; nome: string; valor_mensal: number } | null;
}

const statusLabel = (s: string) => {
  const map: Record<string, { label: string; variant: any }> = {
    ativa: { label: "Ativa", variant: "default" },
    em_dia: { label: "Em Dia", variant: "default" },
    atrasada: { label: "Atrasada", variant: "destructive" },
    atrasado: { label: "Atrasado", variant: "destructive" },
    vencida: { label: "Vencida", variant: "destructive" },
    cancelada: { label: "Cancelada", variant: "outline" },
    pendente: { label: "Pendente", variant: "secondary" },
  };
  return map[s] || { label: s, variant: "secondary" };
};

const formatMoeda = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

const formatData = (d: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR") : "-");

export default function Assinaturas() {
  const [rows, setRows] = useState<AssinaturaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const { toast } = useToast();

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("assinaturas")
      .select("id, status, data_inicio, proximo_vencimento, barbearia:barbearias(id,nome), plano:planos(id,nome,valor_mensal)")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setRows((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const stats = {
    total: rows.length,
    ativa: rows.filter((r) => r.status === "ativa" || r.status === "em_dia").length,
    atrasada: rows.filter((r) => r.status === "atrasada" || r.status === "atrasado").length,
    cancelada: rows.filter((r) => r.status === "cancelada").length,
    pendente: rows.filter((r) => r.status === "pendente").length,
  };

  const filtrados = filtro === "todos" ? rows : rows.filter((r) => r.status === filtro);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assinaturas</h2>
          <p className="text-muted-foreground">Assinaturas das barbearias no sistema</p>
        </div>
        <Button variant="outline" onClick={carregar} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "" },
          { label: "Ativas", value: stats.ativa, color: "text-green-500" },
          { label: "Atrasadas", value: stats.atrasada, color: "text-red-500" },
          { label: "Pendentes", value: stats.pendente, color: "text-yellow-500" },
          { label: "Canceladas", value: stats.cancelada, color: "text-gray-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className={`text-2xl ${s.color}`}>{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Assinaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filtro} onValueChange={setFiltro}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="ativa">Ativas</TabsTrigger>
              <TabsTrigger value="atrasada">Atrasadas</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes</TabsTrigger>
              <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
            </TabsList>
            <TabsContent value={filtro} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barbearia</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Próx. Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Carregando...
                    </TableCell></TableRow>
                  ) : filtrados.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhuma assinatura encontrada
                    </TableCell></TableRow>
                  ) : (
                    filtrados.map((a) => {
                      const s = statusLabel(a.status);
                      return (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.barbearia?.nome || "-"}</TableCell>
                          <TableCell>{a.plano?.nome || "-"}</TableCell>
                          <TableCell>{formatMoeda(a.plano?.valor_mensal || 0)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatData(a.proximo_vencimento)}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant={s.variant}>{s.label}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/assinaturas/${a.id}`}><Eye className="h-4 w-4" /></Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
