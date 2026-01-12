import { useState, useMemo } from "react";
import { useDono } from "@/context/DonoContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Scissors, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addDays, subDays, startOfMonth, endOfMonth, eachWeekOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AgendaInteligente() {
  const { agendamentos, profissionais } = useDono();
  const [visualizacao, setVisualizacao] = useState<"dia" | "semana" | "mes">("dia");
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [filtroProfissional, setFiltroProfissional] = useState<string>("todos");

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Filtrar agendamentos por profissional
  const agendamentosFiltrados = useMemo(() => {
    let filtrados = filtroProfissional === "todos"
      ? agendamentos
      : agendamentos.filter((a) => a.profissionalId === filtroProfissional);
    return filtrados;
  }, [agendamentos, filtroProfissional]);

  // Agendamentos do dia selecionado
  const agendamentosDoDia = useMemo(() => {
    const dataFormatada = format(dataSelecionada, "yyyy-MM-dd");
    return agendamentosFiltrados
      .filter((a) => a.data === dataFormatada)
      .sort((a, b) => a.horario.localeCompare(b.horario));
  }, [agendamentosFiltrados, dataSelecionada]);

  // Agendamentos da semana
  const semanaInicio = startOfWeek(dataSelecionada, { weekStartsOn: 0 });
  const semanaFim = endOfWeek(dataSelecionada, { weekStartsOn: 0 });
  const diasDaSemana = eachDayOfInterval({ start: semanaInicio, end: semanaFim });

  const agendamentosDaSemana = useMemo(() => {
    return diasDaSemana.map((dia) => {
      const dataFormatada = format(dia, "yyyy-MM-dd");
      const agendamentosDia = agendamentosFiltrados
        .filter((a) => a.data === dataFormatada)
        .sort((a, b) => a.horario.localeCompare(b.horario));
      return {
        dia,
        agendamentos: agendamentosDia,
      };
    });
  }, [agendamentosFiltrados, diasDaSemana]);

  // Agendamentos do mês
  const mesInicio = startOfMonth(dataSelecionada);
  const mesFim = endOfMonth(dataSelecionada);
  const semanasDoMes = eachWeekOfInterval(
    { start: mesInicio, end: mesFim },
    { weekStartsOn: 0 }
  );

  const agendamentosDoMes = useMemo(() => {
    return semanasDoMes.map((semanaInicio) => {
      const semanaFim = endOfWeek(semanaInicio, { weekStartsOn: 0 });
      const dias = eachDayOfInterval({ start: semanaInicio, end: semanaFim });
      
      return dias.map((dia) => {
        const dataFormatada = format(dia, "yyyy-MM-dd");
        const agendamentosDia = agendamentosFiltrados.filter((a) => a.data === dataFormatada);
        return {
          dia,
          agendamentos: agendamentosDia,
          pertenceAoMes: isSameMonth(dia, dataSelecionada),
        };
      });
    });
  }, [agendamentosFiltrados, dataSelecionada, semanasDoMes]);

  const navegarData = (direcao: "anterior" | "proxima") => {
    if (visualizacao === "dia") {
      setDataSelecionada(direcao === "anterior" 
        ? subDays(dataSelecionada, 1) 
        : addDays(dataSelecionada, 1));
    } else if (visualizacao === "semana") {
      setDataSelecionada(direcao === "anterior" 
        ? subDays(dataSelecionada, 7) 
        : addDays(dataSelecionada, 7));
    } else {
      setDataSelecionada(direcao === "anterior" 
        ? subDays(dataSelecionada, 30) 
        : addDays(dataSelecionada, 30));
    }
  };

  const irParaHoje = () => {
    setDataSelecionada(new Date());
  };

  const getStatusColor = (status: string) => {
    const cores: Record<string, string> = {
      confirmado: "bg-green-100 text-green-800 border-green-300",
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      cancelado: "bg-red-100 text-red-800 border-red-300",
      realizado: "bg-blue-100 text-blue-800 border-blue-300",
    };
    return cores[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navegarData("anterior")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navegarData("proxima")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={irParaHoje}>
              Hoje
            </Button>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {visualizacao === "dia" && format(dataSelecionada, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              {visualizacao === "semana" && `${format(semanaInicio, "d 'de' MMM", { locale: ptBR })} - ${format(semanaFim, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`}
              {visualizacao === "mes" && format(dataSelecionada, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-sm text-muted-foreground">
              {agendamentosDoDia.length} agendamento(s) no dia selecionado
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Painel de Data e Hora */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data e Hora Atual</CardTitle>
              <CardDescription>
                Selecione uma data no calendário para ver os agendamentos
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {format(new Date(), "HH:mm")}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="border rounded-md p-3">
              <Calendar
                mode="single"
                selected={dataSelecionada}
                onSelect={(date) => date && setDataSelecionada(date)}
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Filtrar por Profissional</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={filtroProfissional}
                  onChange={(e) => setFiltroProfissional(e.target.value)}
                >
                  <option value="todos">Todos os profissionais</option>
                  {profissionais.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Agendamentos de {format(dataSelecionada, "dd/MM/yyyy")}</h3>
                {agendamentosDoDia.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum agendamento para este dia</p>
                ) : (
                  <div className="space-y-2">
                    {agendamentosDoDia.map((agendamento) => (
                      <div
                        key={agendamento.id}
                        className="p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{agendamento.horario}</span>
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{agendamento.clienteNome}</span>
                            <Scissors className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agendamento.servicoNome}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(agendamento.status)}>
                              {agendamento.status}
                            </Badge>
                            <span className="font-medium">{formatarMoeda(agendamento.valor)}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Profissional: {agendamento.profissionalNome} • Duração: {agendamento.duracao}min
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Visualização */}
      <Tabs value={visualizacao} onValueChange={(v) => setVisualizacao(v as "dia" | "semana" | "mes")}>
        <TabsList>
          <TabsTrigger value="dia">Dia</TabsTrigger>
          <TabsTrigger value="semana">Semana</TabsTrigger>
          <TabsTrigger value="mes">Mês</TabsTrigger>
        </TabsList>

        <TabsContent value="dia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda do Dia</CardTitle>
              <CardDescription>
                {format(dataSelecionada, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agendamentosDoDia.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum agendamento para este dia</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {agendamentosDoDia.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{agendamento.horario}</span>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{agendamento.clienteNome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-muted-foreground" />
                          <span>{agendamento.servicoNome}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(agendamento.status)}>
                          {agendamento.status}
                        </Badge>
                        <span className="font-medium">{formatarMoeda(agendamento.valor)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semana" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda da Semana</CardTitle>
              <CardDescription>
                {format(semanaInicio, "d 'de' MMM", { locale: ptBR })} - {format(semanaFim, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {agendamentosDaSemana.map(({ dia, agendamentos }) => (
                  <div
                    key={dia.toISOString()}
                    className={`border rounded-lg p-2 min-h-[200px] ${
                      isSameDay(dia, new Date()) ? "bg-blue-50 border-blue-300" : ""
                    } ${isSameDay(dia, dataSelecionada) ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="font-semibold text-sm mb-2">
                      {format(dia, "EEE", { locale: ptBR })}
                      <br />
                      <span className="text-lg">{format(dia, "d")}</span>
                    </div>
                    <div className="space-y-1">
                      {agendamentos.map((agendamento) => (
                        <div
                          key={agendamento.id}
                          className={`text-xs p-1 rounded ${getStatusColor(agendamento.status)} cursor-pointer hover:opacity-80`}
                          onClick={() => setDataSelecionada(dia)}
                        >
                          <div className="font-medium">{agendamento.horario}</div>
                          <div className="truncate">{agendamento.clienteNome}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda do Mês</CardTitle>
              <CardDescription>
                {format(dataSelecionada, "MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
                    <div key={dia} className="text-center font-semibold text-sm text-muted-foreground">
                      {dia}
                    </div>
                  ))}
                </div>
                {/* Semanas do mês */}
                {agendamentosDoMes.map((semana, semanaIndex) => (
                  <div key={semanaIndex} className="grid grid-cols-7 gap-2">
                    {semana.map(({ dia, agendamentos, pertenceAoMes }) => (
                      <div
                        key={dia.toISOString()}
                        className={`border rounded-lg p-2 min-h-[120px] ${
                          !pertenceAoMes ? "opacity-40" : ""
                        } ${
                          isSameDay(dia, new Date()) ? "bg-blue-50 border-blue-300" : ""
                        } ${
                          isSameDay(dia, dataSelecionada) ? "ring-2 ring-primary" : ""
                        } cursor-pointer hover:bg-accent`}
                        onClick={() => {
                          setDataSelecionada(dia);
                          setVisualizacao("dia");
                        }}
                      >
                        <div className="font-semibold text-sm mb-1">
                          {format(dia, "d")}
                        </div>
                        <div className="space-y-1">
                          {agendamentos.slice(0, 3).map((agendamento) => (
                            <div
                              key={agendamento.id}
                              className={`text-xs p-1 rounded ${getStatusColor(agendamento.status)}`}
                            >
                              <div className="font-medium truncate">{agendamento.horario}</div>
                              <div className="truncate">{agendamento.clienteNome}</div>
                            </div>
                          ))}
                          {agendamentos.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{agendamentos.length - 3} mais
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
