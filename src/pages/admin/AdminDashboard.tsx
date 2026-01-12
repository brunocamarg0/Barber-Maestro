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
import { Plus, MoreHorizontal, Eye, Edit, Power, Ban, Check, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBarbearia } from "@/types/barbearia";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<StatusBarbearia, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ativa: { label: "Ativa", variant: "default" },
  em_teste: { label: "Em Teste", variant: "secondary" },
  bloqueada: { label: "Bloqueada", variant: "destructive" },
  cancelada: { label: "Cancelada", variant: "outline" },
};

const planoConfig: Record<string, string> = {
  basico: "Básico",
  premium: "Premium",
  enterprise: "Enterprise",
};

interface Solicitacao {
  id: string;
  nome: string;
  cnpjCpf: string;
  responsavel: string;
  email: string;
  telefone?: string;
  endereco?: string;
  plano: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { barbearias, alterarStatus, suspenderPorInadimplencia } = useBarbearias();
  const { toast } = useToast();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoadingSolicitacoes, setIsLoadingSolicitacoes] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null);
  const [observacoes, setObservacoes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    setIsLoadingSolicitacoes(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/solicitacoes/admin?status=pendente`);
      if (response.ok) {
        const data = await response.json();
        setSolicitacoes(data);
      }
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/solicitacoes/admin/${selectedSolicitacao.id}/aprovar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ observacoes }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao aprovar solicitação');
      }

      toast({
        title: "Solicitação aprovada!",
        description: "A senha foi enviada por email para o dono da barbearia.",
      });

      setSelectedSolicitacao(null);
      setObservacoes("");
      carregarSolicitacoes();
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/solicitacoes/admin/${selectedSolicitacao.id}/rejeitar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ observacoes }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao rejeitar solicitação');
      }

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

  const handleAlterarStatus = (id: string, status: StatusBarbearia) => {
    alterarStatus(id, status);
    toast({
      title: "Status alterado",
      description: `Barbearia ${statusConfig[status].label.toLowerCase()} com sucesso.`,
    });
  };

  const handleSuspender = (id: string) => {
    suspenderPorInadimplencia(id);
    toast({
      title: "Barbearia suspensa",
      description: "Barbearia bloqueada por inadimplência.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Seção de Solicitações Pendentes */}
      {solicitacoes.length > 0 && (
        <div className="rounded-md border bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Solicitações Pendentes</h3>
              <p className="text-sm text-muted-foreground">
                {solicitacoes.length} solicitação(ões) aguardando aprovação
              </p>
            </div>
            <Badge variant="secondary">{solicitacoes.length}</Badge>
          </div>
          <div className="space-y-2">
            {solicitacoes.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className="flex items-center justify-between p-3 bg-background rounded-md border"
              >
                <div className="flex-1">
                  <p className="font-medium">{solicitacao.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {solicitacao.responsavel} • {solicitacao.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Solicitado em {new Date(solicitacao.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setSelectedSolicitacao(solicitacao)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Barbearias</h2>
          <p className="text-muted-foreground">
            Gerencie todas as barbearias cadastradas no sistema
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/barbearias/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova Barbearia
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ/CPF</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbearias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhuma barbearia cadastrada
                </TableCell>
              </TableRow>
            ) : (
              barbearias.map((barbearia) => (
                <TableRow key={barbearia.id}>
                  <TableCell className="font-medium">{barbearia.nome}</TableCell>
                  <TableCell>{barbearia.cnpjCpf}</TableCell>
                  <TableCell>{barbearia.responsavel}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{planoConfig[barbearia.plano]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[barbearia.status].variant}>
                      {statusConfig[barbearia.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(barbearia.dataVencimento).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    {barbearia.gatewayPagamento.conectado ? (
                      <Badge variant="default" className="bg-green-500">
                        {barbearia.gatewayPagamento.nome}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não conectado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/barbearias/${barbearia.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/barbearias/${barbearia.id}/editar`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleAlterarStatus(barbearia.id, "ativa")}
                          disabled={barbearia.status === "ativa"}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          Ativar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAlterarStatus(barbearia.id, "em_teste")}
                          disabled={barbearia.status === "em_teste"}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          Colocar em Teste
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAlterarStatus(barbearia.id, "bloqueada")}
                          disabled={barbearia.status === "bloqueada"}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Bloquear
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAlterarStatus(barbearia.id, "cancelada")}
                          disabled={barbearia.status === "cancelada"}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Cancelar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleSuspender(barbearia.id)}
                          className="text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspender por Inadimplência
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Aprovação/Rejeição */}
      <Dialog open={!!selectedSolicitacao} onOpenChange={(open) => !open && setSelectedSolicitacao(null)}>
        <DialogContent className="max-w-2xl">
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
                  <Badge variant="outline">{planoConfig[selectedSolicitacao.plano]}</Badge>
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

