import { useState, useEffect } from "react";
import { useCliente } from "@/context/ClienteContext";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Star, CalendarCheck, RefreshCw, Eye, XCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusAgendamento } from "@/types/cliente";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function HistoricoAgendamentos() {
  const { agendamentos, getAgendamentosPorStatus, cancelarAgendamento, carregarDados, loading, cliente } = useCliente();
  const { toast } = useToast();
  const [filtroData, setFiltroData] = useState("");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Carregar dados se ainda não foram carregados
  useEffect(() => {
    if (!cliente && !loading && carregarDados) {
      console.log('🔄 [HISTORICO] Cliente não encontrado, carregando dados...');
      carregarDados();
    }
  }, [cliente, loading, carregarDados]);

  // Garantir que agendamentos é um array
  const agendamentosArray = Array.isArray(agendamentos) ? agendamentos : [];

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string, horario?: string) => {
    try {
      if (horario) {
        return new Date(`${data}T${horario}`).toLocaleString("pt-BR");
      }
      return new Date(data).toLocaleDateString("pt-BR");
    } catch {
      return `${data} ${horario || ''}`;
    }
  };

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    confirmado: { label: "Confirmado", variant: "default" },
    pagamento_pendente: { label: "Aguardando Pagamento", variant: "secondary" },
    pendente: { label: "Pendente", variant: "secondary" },
    pago: { label: "Pago", variant: "default" },
    concluido: { label: "Concluído", variant: "outline" },
    cancelado: { label: "Cancelado", variant: "destructive" },
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || { label: status, variant: "default" as const };
  };

  const agendamentosFiltrados = filtroData
    ? agendamentosArray.filter((a) => a.data === filtroData)
    : agendamentosArray;

  // Ordenar por data mais recente
  const agendamentosOrdenados = [...agendamentosFiltrados].sort((a, b) => {
    const dataA = new Date(`${a.data}T${a.hora || '00:00'}`);
    const dataB = new Date(`${b.data}T${b.hora || '00:00'}`);
    return dataB.getTime() - dataA.getTime();
  });

  const handleVerDetalhes = (agendamento: any) => {
    setAgendamentoSelecionado(agendamento);
    setIsDialogOpen(true);
  };

  const handleCancelar = async (agendamentoId: string) => {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      try {
        await cancelarAgendamento(agendamentoId);
        toast({
          title: "Agendamento cancelado",
          description: "Seu agendamento foi cancelado com sucesso.",
        });
        setIsDialogOpen(false);
        if (carregarDados) {
          await carregarDados();
        }
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível cancelar o agendamento.",
          variant: "destructive",
        });
      }
    }
  };

  const renderAgendamentoRow = (agendamento: any) => {
    const status = getStatusConfig(agendamento.status || 'pendente');
    const horario = agendamento.horario || agendamento.hora || '';
    const profissionalNome = agendamento.profissionais?.[0]?.profissional?.nome || agendamento.profissionalNome || 'A definir';
    const servicoNome = agendamento.servico?.nome || 'N/A';
    const valor = agendamento.servico?.preco || agendamento.pagamento?.valor || 0;
    
    return (
      <TableRow key={agendamento.id}>
        <TableCell>
          {agendamento.data ? formatarData(agendamento.data, horario) : 'N/A'}
        </TableCell>
        <TableCell>{servicoNome}</TableCell>
        <TableCell>{profissionalNome}</TableCell>
        <TableCell>{formatarMoeda(valor)}</TableCell>
        <TableCell>
          <Badge variant={status.variant}>{status.label}</Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleVerDetalhes(agendamento)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {agendamento.status === "concluido" && (
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/cliente/avaliacoes?agendamento=${agendamento.id}`}>
                  <Star className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {(agendamento.status === "confirmado" || agendamento.status === "pendente") && (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/cliente/agendar?reagendar=${agendamento.id}`}>
                    <CalendarCheck className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCancelar(agendamento.id)}
                >
                  <XCircle className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Histórico de Agendamentos</h2>
          <p className="text-muted-foreground">
            Veja todos os seus agendamentos realizados
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            placeholder="Filtrar por data"
            className="w-48"
          />
          <Button variant="outline" onClick={() => setFiltroData("")}>
            Limpar
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => carregarDados && carregarDados()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">
            Todos ({agendamentosOrdenados.length})
          </TabsTrigger>
        <TabsTrigger value="pendente">
            Pendentes ({agendamentosOrdenados.filter(a => a.status === 'pendente' || a.status === 'pagamento_pendente').length})
          </TabsTrigger>
          <TabsTrigger value="confirmado">
            Confirmados ({agendamentosOrdenados.filter(a => a.status === 'confirmado').length})
          </TabsTrigger>
          <TabsTrigger value="concluido">
            Concluídos ({agendamentosOrdenados.filter(a => a.status === 'concluido').length})
          </TabsTrigger>
          <TabsTrigger value="cancelado">
            Cancelados ({agendamentosOrdenados.filter(a => a.status === 'cancelado').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Agendamentos</CardTitle>
              <CardDescription>
                Total: {agendamentosOrdenados.length} agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Horário</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendamentosOrdenados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Nenhum agendamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    agendamentosOrdenados.map(renderAgendamentoRow)
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {["pendente", "confirmado", "concluido", "cancelado"].map((statusFilter) => {
          const filtered = agendamentosOrdenados.filter((a) => {
            if (statusFilter === "pendente") {
              return a.status === "pendente" || a.status === "pagamento_pendente";
            }
            return a.status === statusFilter;
          });
          
          return (
            <TabsContent key={statusFilter} value={statusFilter}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {getStatusConfig(statusFilter).label}
                  </CardTitle>
                  <CardDescription>
                    Total: {filtered.length} agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Horário</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Nenhum agendamento {getStatusConfig(statusFilter).label.toLowerCase()} encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.map((agendamento) => {
                          const horario = agendamento.horario || agendamento.hora || '';
                          const profissionalNome = agendamento.profissionais?.[0]?.profissional?.nome || agendamento.profissionalNome || 'A definir';
                          const servicoNome = agendamento.servico?.nome || 'N/A';
                          const valor = agendamento.servico?.preco || agendamento.pagamento?.valor || 0;
                          return (
                            <TableRow key={agendamento.id}>
                              <TableCell>
                                {agendamento.data ? formatarData(agendamento.data, horario) : 'N/A'}
                              </TableCell>
                              <TableCell>{servicoNome}</TableCell>
                              <TableCell>{profissionalNome}</TableCell>
                              <TableCell>{formatarMoeda(valor)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleVerDetalhes(agendamento)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {statusFilter === "concluido" && (
                                    <Button variant="ghost" size="icon" asChild>
                                      <Link to={`/cliente/avaliacoes?agendamento=${agendamento.id}`}>
                                        <Star className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                  )}
                                </div>
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
          );
        })}
      </Tabs>

      {/* Dialog de Detalhes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              Informações completas do agendamento
            </DialogDescription>
          </DialogHeader>
          {agendamentoSelecionado ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {agendamentoSelecionado.data 
                      ? formatarData(agendamentoSelecionado.data) 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="font-medium">
                    {agendamentoSelecionado.horario || agendamentoSelecionado.hora || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Serviço</p>
                  <p className="font-medium">
                    {agendamentoSelecionado.servico?.nome || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {formatarMoeda(
                      agendamentoSelecionado.servico?.preco || 
                      agendamentoSelecionado.pagamento?.valor || 
                      0
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profissional</p>
                  <p className="font-medium">
                    {agendamentoSelecionado.profissionais?.[0]?.profissional?.nome || 
                     agendamentoSelecionado.profissionalNome || 
                     'A definir'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusConfig(agendamentoSelecionado.status || 'pendente').variant}>
                    {getStatusConfig(agendamentoSelecionado.status || 'pendente').label}
                  </Badge>
                </div>
              </div>

              {agendamentoSelecionado.servico?.descricao && (
                <div>
                  <p className="text-sm text-muted-foreground">Descrição do Serviço</p>
                  <p className="font-medium">{agendamentoSelecionado.servico.descricao}</p>
                </div>
              )}

              {agendamentoSelecionado.servico?.duracao && (
                <div>
                  <p className="text-sm text-muted-foreground">Duração</p>
                  <p className="font-medium">{agendamentoSelecionado.servico.duracao} minutos</p>
                </div>
              )}

              {agendamentoSelecionado.pagamento && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-semibold mb-2">Informações de Pagamento</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Método</p>
                      <p className="font-medium">
                        {agendamentoSelecionado.pagamento.metodo || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status do Pagamento</p>
                      <p className="font-medium">
                        {agendamentoSelecionado.pagamento.status || 'N/A'}
                      </p>
                    </div>
                    {agendamentoSelecionado.pagamento.dataPagamento && (
                      <div>
                        <p className="text-sm text-muted-foreground">Data do Pagamento</p>
                        <p className="font-medium">
                          {new Date(agendamentoSelecionado.pagamento.dataPagamento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {agendamentoSelecionado.observacao && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium">{agendamentoSelecionado.observacao}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {(agendamentoSelecionado.status === "confirmado" || agendamentoSelecionado.status === "pendente") && (
                  <>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to={`/cliente/agendar?reagendar=${agendamentoSelecionado.id}`}>
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        Reagendar
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleCancelar(agendamentoSelecionado.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                )}
                {agendamentoSelecionado.status === "concluido" && (
                  <Button asChild className="w-full">
                    <Link to={`/cliente/avaliacoes?agendamento=${agendamentoSelecionado.id}`}>
                      <Star className="h-4 w-4 mr-2" />
                      Avaliar Atendimento
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
