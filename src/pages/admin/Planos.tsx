import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FEATURES } from "@/config/features";

type Plano = {
  id: string;
  slug: string | null;
  nome: string;
  descricao: string | null;
  valorMensal: number;
  limiteBarbeiros: number | null;
  limiteAgendamentos: number | null;
  recursos: string[];
  ativo: boolean;
};

type FormState = {
  nome: string;
  descricao: string;
  valorMensal: number;
  limiteBarbeiros: number;
  limiteAgendamentos: number;
  recursos: string[];
};

const FEATURES_LIST = Object.values(FEATURES);

export default function Planos() {
  const { toast } = useToast();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    nome: "",
    descricao: "",
    valorMensal: 0,
    limiteBarbeiros: 1,
    limiteAgendamentos: 100,
    recursos: [],
  });

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("planos")
      .select("*")
      .order("valor_mensal", { ascending: true });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setPlanos(
        (data ?? []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          nome: p.nome,
          descricao: p.descricao,
          valorMensal: Number(p.valor_mensal),
          limiteBarbeiros: p.limite_barbeiros,
          limiteAgendamentos: p.limite_agendamentos,
          recursos: p.recursos ?? [],
          ativo: p.ativo,
        }))
      );
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const formatarValor = (valor: number) =>
    valor === 0
      ? "Sob consulta"
      : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const abrirDialogNovo = () => {
    setPlanoEditando(null);
    setFormData({
      nome: "",
      descricao: "",
      valorMensal: 0,
      limiteBarbeiros: 1,
      limiteAgendamentos: 100,
      recursos: [],
    });
    setIsDialogOpen(true);
  };

  const abrirDialogEditar = (plano: Plano) => {
    setPlanoEditando(plano);
    setFormData({
      nome: plano.nome,
      descricao: plano.descricao ?? "",
      valorMensal: plano.valorMensal,
      limiteBarbeiros: plano.limiteBarbeiros ?? 1,
      limiteAgendamentos: plano.limiteAgendamentos ?? 100,
      recursos: plano.recursos,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) {
      toast({ title: "Erro", description: "Informe o nome do plano.", variant: "destructive" });
      return;
    }
    setSalvando(true);
    const payload = {
      nome: formData.nome,
      descricao: formData.descricao || null,
      valor_mensal: formData.valorMensal,
      limite_barbeiros: formData.limiteBarbeiros,
      limite_agendamentos: formData.limiteAgendamentos,
      recursos: formData.recursos,
    };
    const { error } = planoEditando
      ? await supabase.from("planos").update(payload).eq("id", planoEditando.id)
      : await supabase.from("planos").insert({ ...payload, ativo: true });
    setSalvando(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: planoEditando ? "Plano atualizado" : "Plano criado", description: formData.nome });
    setIsDialogOpen(false);
    carregar();
  };

  const handleExcluir = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja desativar o plano "${nome}"?`)) return;
    const { error } = await supabase.from("planos").update({ ativo: false }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Plano desativado", description: nome });
    carregar();
  };

  const toggleRecurso = (recursoId: string) => {
    setFormData((prev) => ({
      ...prev,
      recursos: prev.recursos.includes(recursoId)
        ? prev.recursos.filter((r) => r !== recursoId)
        : [...prev.recursos, recursoId],
    }));
  };

  // Estilos para forçar fundo branco / texto preto dentro do dialog
  const inputCls =
    "bg-white text-black border-gray-300 placeholder:text-gray-400 focus-visible:ring-gray-400";
  const labelCls = "text-black font-semibold";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planos & Assinaturas</h2>
          <p className="text-muted-foreground">
            Gerencie os planos disponíveis e suas configurações
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogNovo}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-black border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-black">
                {planoEditando ? "Editar Plano" : "Novo Plano"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {planoEditando
                  ? "Atualize as informações do plano"
                  : "Preencha os dados para criar um novo plano"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className={labelCls}>Nome do Plano *</Label>
                <Input
                  id="nome"
                  className={inputCls}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className={labelCls}>Descrição</Label>
                <Textarea
                  id="descricao"
                  className={inputCls}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorMensal" className={labelCls}>Valor Mensal (R$)</Label>
                  <Input
                    id="valorMensal"
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputCls}
                    value={formData.valorMensal}
                    onChange={(e) =>
                      setFormData({ ...formData, valorMensal: parseFloat(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-gray-500">Use 0 para "Sob consulta".</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limiteBarbeiros" className={labelCls}>Limite de Barbeiros *</Label>
                  <Input
                    id="limiteBarbeiros"
                    type="number"
                    min="1"
                    className={inputCls}
                    value={formData.limiteBarbeiros}
                    onChange={(e) =>
                      setFormData({ ...formData, limiteBarbeiros: parseInt(e.target.value) || 1 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limiteAgendamentos" className={labelCls}>
                  Limite de Agendamentos *
                </Label>
                <Input
                  id="limiteAgendamentos"
                  type="number"
                  min="1"
                  className={inputCls}
                  value={formData.limiteAgendamentos}
                  onChange={(e) =>
                    setFormData({ ...formData, limiteAgendamentos: parseInt(e.target.value) || 100 })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className={labelCls}>Recursos Liberados</Label>
                <p className="text-xs text-gray-600">
                  Marque as funcionalidades que serão liberadas para barbearias deste plano.
                  Estes IDs são usados pelo sistema para liberar (ou bloquear) cada tela.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-2 border border-gray-300 rounded-md bg-white">
                  {FEATURES_LIST.map((recurso) => {
                    const selecionado = formData.recursos.includes(recurso.id);
                    return (
                      <label
                        key={recurso.id}
                        className="flex items-start gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer text-black"
                      >
                        <Checkbox
                          checked={selecionado}
                          onCheckedChange={() => toggleRecurso(recurso.id)}
                          className="mt-0.5 border-gray-400 data-[state=checked]:bg-black data-[state=checked]:text-white"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-black">{recurso.nome}</div>
                          <div className="text-xs text-gray-600">{recurso.descricao}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">id: {recurso.id}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white text-black border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={salvando} className="bg-black text-white hover:bg-gray-800">
                  {salvando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {planoEditando ? "Salvar Alterações" : "Criar Plano"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <CardDescription>
            Lista de todos os planos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Limite Barbeiros</TableHead>
                <TableHead>Limite Agendamentos</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : planos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum plano cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                planos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell className="font-medium">{plano.nome}</TableCell>
                    <TableCell>{formatarValor(plano.valorMensal)}</TableCell>
                    <TableCell>{plano.limiteBarbeiros ?? "Ilimitado"}</TableCell>
                    <TableCell>{plano.limiteAgendamentos ?? "Ilimitado"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {plano.recursos.slice(0, 2).map((rid) => (
                          <Badge key={rid} variant="secondary" className="text-xs">
                            {FEATURES[rid]?.nome ?? rid}
                          </Badge>
                        ))}
                        {plano.recursos.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{plano.recursos.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {plano.ativo ? (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <X className="h-3 w-3" />
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirDialogEditar(plano)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExcluir(plano.id, plano.nome)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
