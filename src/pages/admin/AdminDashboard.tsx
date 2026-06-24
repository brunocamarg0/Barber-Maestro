import { useState, useEffect } from "react";
import { useBarbearias } from "@/context/BarbeariasContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, MoreHorizontal, Eye, Edit, Power, Ban, Check, X, Loader2, Building2, Users, Calendar, RefreshCw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBarbearia } from "@/types/barbearia";
import { useToast } from "@/hooks/use-toast";
import { listarSolicitacoesCloud as listarSolicitacoes, aprovarSolicitacaoCloud as aprovarSolicitacao, rejeitarSolicitacaoCloud as rejeitarSolicitacao, SolicitacaoCadastro } from "@/services/solicitacoesCloud";

const statusConfig: Record<StatusBarbearia, { label: string; className: string }> = {
  ativa: { label: "Ativa", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  em_teste: { label: "Em Teste", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  bloqueada: { label: "Bloqueada", className: "bg-[#dc2626]/15 text-[#ef4444] border-[#dc2626]/40" },
  cancelada: { label: "Cancelada", className: "bg-white/5 text-white/60 border-white/20" },
};

const planoConfig: Record<string, string> = {
  basico: "Básico",
  premium: "Premium",
  enterprise: "Enterprise",
};

export default function AdminDashboard() {
  const { barbearias, isLoading, error, recarregarBarbearias, alterarStatus, suspenderPorInadimplencia, deletarBarbearia } = useBarbearias();
  const { toast } = useToast();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCadastro[]>([]);
  const [isLoadingSolicitacoes, setIsLoadingSolicitacoes] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoCadastro | null>(null);
  const [observacoes, setObservacoes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    setIsLoadingSolicitacoes(true);
    try {
      const data = await listarSolicitacoes('pendente');
      setSolicitacoes(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    } finally {
      setIsLoadingSolicitacoes(false);
    }
  };

  const handleAprovar = async () => {
    if (!selectedSolicitacao) return;
    
    setIsProcessing(true);
    try {
      await aprovarSolicitacao(selectedSolicitacao.id, observacoes);

      toast({
        title: "Solicitação aprovada!",
        description: "A senha foi enviada por email para o dono da barbearia.",
      });

      setSelectedSolicitacao(null);
      setObservacoes("");
      carregarSolicitacoes();
      recarregarBarbearias();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar",
        description: error.message || "Ocorreu um erro ao aprovar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejeitar = async () => {
    if (!selectedSolicitacao) return;
    
    setIsProcessing(true);
    try {
      await rejeitarSolicitacao(selectedSolicitacao.id, observacoes);

      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação foi rejeitada com sucesso.",
      });

      setSelectedSolicitacao(null);
      setObservacoes("");
      carregarSolicitacoes();
    } catch (error: any) {
      toast({
        title: "Erro ao rejeitar",
        description: error.message || "Ocorreu um erro ao rejeitar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAlterarStatus = async (id: string, status: StatusBarbearia) => {
    try {
      await alterarStatus(id, status);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleSuspender = async (id: string) => {
    try {
      await suspenderPorInadimplencia(id);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja remover a barbearia "${nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    
    setDeletingId(id);
    try {
      await deletarBarbearia(id);
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setDeletingId(null);
    }
  };

  // Estatísticas
  const stats = {
    total: barbearias.length,
    ativas: barbearias.filter(b => b.status === 'ativa').length,
    emTeste: barbearias.filter(b => b.status === 'em_teste').length,
    bloqueadas: barbearias.filter(b => b.status === 'bloqueada').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-[#dc2626]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#dc2626] font-bold">
              Visão Geral
            </span>
          </div>
          <h2 className="text-3xl font-display tracking-[0.15em] uppercase text-white">Barbearias</h2>
          <p className="text-white/50 text-sm mt-1">
            Gerencie todas as barbearias cadastradas no sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={recarregarBarbearias}
            disabled={isLoading}
            className="text-white/70 hover:text-white hover:bg-white/5 border border-white/10 rounded-sm uppercase tracking-wider text-xs font-bold"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button
            asChild
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm uppercase tracking-wider text-xs font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <Link to="/admin/barbearias/nova">
              <Plus className="h-4 w-4 mr-2" />
              Nova Barbearia
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: Building2, desc: "Cadastradas", color: "text-white" },
          { label: "Ativas", value: stats.ativas, icon: Check, desc: "Funcionando", color: "text-emerald-400" },
          { label: "Em Teste", value: stats.emTeste, icon: Calendar, desc: "Avaliação", color: "text-amber-400" },
          { label: "Bloqueadas", value: stats.bloqueadas, icon: Ban, desc: "Suspensas", color: "text-[#ef4444]" },
        ].map((c) => (
          <Card
            key={c.label}
            className="relative border-white/10 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden group hover:border-[#dc2626]/40 transition-colors"
          >
            <div className="absolute top-0 left-0 h-1 w-12 bg-[#dc2626] group-hover:w-full transition-all duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                {c.label}
              </CardTitle>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-display tracking-wider ${c.color}`}>
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : c.value}
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{c.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Solicitações pendentes */}
      {solicitacoes.length > 0 && (
        <div className="relative rounded-sm border border-[#dc2626]/40 bg-[#dc2626]/5 backdrop-blur-sm p-5">
          <div className="absolute top-0 left-0 h-full w-1 bg-[#dc2626]" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-display uppercase tracking-[0.15em] text-white">
                Solicitações Pendentes
              </h3>
              <p className="text-sm text-white/60 mt-1">
                {solicitacoes.length} solicitação(ões) aguardando aprovação
              </p>
            </div>
            <Badge className="bg-[#dc2626] text-white border-0 rounded-sm uppercase tracking-wider">
              {solicitacoes.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {solicitacoes.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-black/40 rounded-sm border border-white/10 hover:border-[#dc2626]/40 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white">{s.nome}</p>
                  <p className="text-sm text-white/60">
                    {s.responsavel} • {s.email}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Solicitado em {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedSolicitacao(s)}
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm uppercase tracking-wider text-xs font-bold"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-sm border border-[#dc2626]/60 bg-[#dc2626]/10 p-4">
          <p className="text-sm text-[#ef4444]">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-white hover:bg-[#dc2626]/20 border border-[#dc2626]/40 rounded-sm"
            onClick={recarregarBarbearias}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Nome</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">CNPJ/CPF</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Responsável</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Plano</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Vencimento</TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Email</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2 text-white/60">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Carregando barbearias...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : barbearias.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell colSpan={8} className="text-center py-10 text-white/50">
                  Nenhuma barbearia cadastrada
                </TableCell>
              </TableRow>
            ) : (
              barbearias.map((barbearia) => {
                const cfg = statusConfig[barbearia.status];
                return (
                  <TableRow key={barbearia.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-semibold text-white">{barbearia.nome}</TableCell>
                    <TableCell className="text-white/70">{barbearia.cnpjCpf}</TableCell>
                    <TableCell className="text-white/70">{barbearia.responsavel}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/20 text-white/80 rounded-sm uppercase text-[10px] tracking-wider">
                        {planoConfig[barbearia.plano] || barbearia.plano}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-sm uppercase text-[10px] tracking-wider ${cfg?.className || "border-white/20 text-white/70"}`}
                      >
                        {cfg?.label || barbearia.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {barbearia.dataVencimento ? new Date(barbearia.dataVencimento).toLocaleDateString("pt-BR") : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-white/60">{barbearia.email || "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10">
                            {deletingId === barbearia.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/95 border-white/10 text-white rounded-sm">
                          <DropdownMenuLabel className="text-white/50 uppercase tracking-wider text-[10px]">
                            Ações
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white">
                            <Link to={`/admin/barbearias/${barbearia.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white">
                            <Link to={`/admin/barbearias/${barbearia.id}/editar`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => handleAlterarStatus(barbearia.id, "ativa")}
                            disabled={barbearia.status === "ativa"}
                            className="focus:bg-white/10 focus:text-white"
                          >
                            <Power className="h-4 w-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAlterarStatus(barbearia.id, "em_teste")}
                            disabled={barbearia.status === "em_teste"}
                            className="focus:bg-white/10 focus:text-white"
                          >
                            <Power className="h-4 w-4 mr-2" />
                            Colocar em Teste
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAlterarStatus(barbearia.id, "bloqueada")}
                            disabled={barbearia.status === "bloqueada"}
                            className="focus:bg-white/10 focus:text-white"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Bloquear
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAlterarStatus(barbearia.id, "cancelada")}
                            disabled={barbearia.status === "cancelada"}
                            className="focus:bg-white/10 focus:text-white"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => handleDeletar(barbearia.id, barbearia.nome)}
                            className="text-[#ef4444] focus:bg-[#dc2626]/20 focus:text-[#ef4444]"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover Permanentemente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Aprovação/Rejeição */}
      <Dialog open={!!selectedSolicitacao} onOpenChange={(open) => !open && setSelectedSolicitacao(null)}>
        <DialogContent className="max-w-2xl bg-black/95 border-white/10 text-white rounded-sm">
          <DialogHeader>
            <DialogTitle>Solicitação de Cadastro</DialogTitle>
            <DialogDescription>
              Revise os dados da solicitação antes de aprovar ou rejeitar
            </DialogDescription>
          </DialogHeader>
          
          {selectedSolicitacao && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Barbearia</Label>
                  <p className="font-medium">{selectedSolicitacao.nome}</p>
                </div>
                <div>
                  <Label>CNPJ/CPF</Label>
                  <p className="font-medium">{selectedSolicitacao.cnpjCpf}</p>
                </div>
                <div>
                  <Label>Responsável</Label>
                  <p className="font-medium">{selectedSolicitacao.responsavel}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedSolicitacao.email}</p>
                </div>
                {selectedSolicitacao.telefone && (
                  <div>
                    <Label>Telefone</Label>
                    <p className="font-medium">{selectedSolicitacao.telefone}</p>
                  </div>
                )}
                <div>
                  <Label>Plano</Label>
                  <Badge variant="outline">{planoConfig[selectedSolicitacao.plano] || selectedSolicitacao.plano}</Badge>
                </div>
                {selectedSolicitacao.endereco && (
                  <div className="col-span-2">
                    <Label>Endereço</Label>
                    <p className="font-medium">{selectedSolicitacao.endereco}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Input
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Adicione observações sobre esta solicitação..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSolicitacao(null);
                setObservacoes("");
              }}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejeitar}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Rejeitar
                </>
              )}
            </Button>
            <Button
              onClick={handleAprovar}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar e Enviar Senha
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
