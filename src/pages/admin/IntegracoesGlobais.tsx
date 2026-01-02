import { useIntegracoesGlobais } from "@/context/IntegracoesGlobaisContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Check, X } from "lucide-react";

export default function IntegracoesGlobais() {
  const { integracoes, webhooks } = useIntegracoesGlobais();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrações Globais</h2>
        <p className="text-muted-foreground">
          Configurações válidas para todas as barbearias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integracoes.map((integracao) => (
          <Card key={integracao.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{integracao.nome}</CardTitle>
                  <CardDescription>{integracao.provider}</CardDescription>
                </div>
                {integracao.ativa ? (
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    Ativa
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <X className="h-3 w-3" />
                    Inativa
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Custo por uso</p>
                <p className="font-medium">{formatarMoeda(integracao.custos.porUso)}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Uso este mês</p>
                <p className="font-medium">
                  {integracao.custos.usadoEsteMes} / {integracao.custos.limiteMensal}
                </p>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks Globais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{webhook.nome}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{webhook.url}</p>
                    <div className="flex gap-2 mt-2">
                      {webhook.eventos.map((evento) => (
                        <Badge key={evento} variant="secondary">
                          {evento}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={webhook.ativo ? "default" : "secondary"}>
                    {webhook.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



