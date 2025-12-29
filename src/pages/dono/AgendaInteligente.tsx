import { useState } from "react";
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
import { Calendar, Clock, User, Scissors, GripVertical } from "lucide-react";

export default function AgendaInteligente() {
  const { agendamentos, profissionais } = useDono();
  const [visualizacao, setVisualizacao] = useState<"dia" | "semana" | "mes">("dia");
  const [filtroProfissional, setFiltroProfissional] = useState<string>("todos");

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const agendamentosFiltrados = filtroProfissional === "todos"
    ? agendamentos
    : agendamentos.filter((a) => a.profissionalId === filtroProfissional);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agenda Inteligente</h2>
          <p className="text-muted-foreground">
            Gerencie todos os agendamentos da sua barbearia
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

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
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agendamentosFiltrados
                  .filter((a) => a.data === new Date().toISOString().split("T")[0])
                  .sort((a, b) => a.horario.localeCompare(b.horario))
                  .map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-move"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
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
                        <Badge variant={agendamento.status === "confirmado" ? "default" : "secondary"}>
                          {agendamento.status}
                        </Badge>
                        <span className="font-medium">{formatarMoeda(agendamento.valor)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semana">
          <Card>
            <CardHeader>
              <CardTitle>Agenda da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Visualização semanal em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mes">
          <Card>
            <CardHeader>
              <CardTitle>Agenda do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Visualização mensal em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

