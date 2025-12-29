import { useMonitoramento } from "@/context/MonitoramentoContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Monitoramento() {
  const { statusSistema, marcarErroResolvido } = useMonitoramento();

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString("pt-BR");
  };

  const severidadeConfig = {
    baixa: { label: "Baixa", variant: "secondary" as const, icon: CheckCircle },
    media: { label: "Média", variant: "default" as const, icon: AlertTriangle },
    alta: { label: "Alta", variant: "destructive" as const, icon: XCircle },
    critica: { label: "Crítica", variant: "destructive" as const, icon: XCircle },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monitoramento & Saúde do Sistema</h2>
        <p className="text-muted-foreground">
          Acompanhe a saúde e performance do sistema em tempo real
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Barbearias Online</CardDescription>
            <CardTitle className="text-3xl">{statusSistema.barbeariasOnline}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Agendamentos Hoje</CardDescription>
            <CardTitle className="text-3xl">{statusSistema.agendamentosHoje}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Agendamentos</CardDescription>
            <CardTitle className="text-3xl">{statusSistema.agendamentosTotal}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uso por Módulo</CardTitle>
            <CardDescription>Utilização dos módulos hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusSistema.usoModulos.map((modulo) => (
                <div key={modulo.modulo} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{modulo.modulo}</span>
                    <span>{modulo.uso} usos ({modulo.percentual}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${modulo.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Erros do Sistema</CardTitle>
            <CardDescription>Erros recentes que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusSistema.errosSistema
                .filter((e) => !e.resolvido)
                .map((erro) => {
                  const config = severidadeConfig[erro.severidade];
                  const Icon = config.icon;
                  return (
                    <div key={erro.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4" />
                          <Badge variant={config.variant}>{config.label}</Badge>
                          <span className="text-sm font-medium">{erro.tipo}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{erro.mensagem}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatarData(erro.data)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => marcarErroResolvido(erro.id)}
                      >
                        Resolver
                      </Button>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs Críticos</CardTitle>
          <CardDescription>Eventos críticos do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusSistema.logsCriticos.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="destructive">{log.tipo}</Badge>
                  </TableCell>
                  <TableCell>{log.mensagem}</TableCell>
                  <TableCell>{formatarData(log.data)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

