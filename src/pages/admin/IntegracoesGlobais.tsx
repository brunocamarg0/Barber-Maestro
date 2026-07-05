import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IntegracaoGlobal } from "@/types/integracao";

export default function IntegracoesGlobais() {
  const { integracoes, webhooks, atualizarIntegracao } = useIntegracoesGlobais();
  const { toast } = useToast();

  const [integracaoAberta, setIntegracaoAberta] = useState<IntegracaoGlobal | null>(null);
  const [form, setForm] = useState({
    nome: "",
    provider: "",
    ativa: true,
    porUso: 0,
    limiteMensal: 0,
    configuracoes: {} as Record<string, any>,
  });

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const abrirConfigurar = (integracao: IntegracaoGlobal) => {
    setIntegracaoAberta(integracao);
    setForm({
      nome: integracao.nome,
      provider: integracao.provider,
      ativa: integracao.ativa,
      porUso: integracao.custos.porUso,
      limiteMensal: integracao.custos.limiteMensal,
      configuracoes: { ...integracao.configuracoes },
    });
  };

  const salvar = () => {
    if (!integracaoAberta) return;
    atualizarIntegracao(integracaoAberta.id, {
      nome: form.nome,
      provider: form.provider,
      ativa: form.ativa,
      configuracoes: form.configuracoes,
      custos: {
        ...integracaoAberta.custos,
        porUso: Number(form.porUso) || 0,
        limiteMensal: Number(form.limiteMensal) || 0,
      },
    });
    toast({
      title: "Integração atualizada",
      description: `${form.nome} foi salva com sucesso.`,
    });
    setIntegracaoAberta(null);
  };

  const configKeys = Object.keys(form.configuracoes);

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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => abrirConfigurar(integracao)}
              >
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

      <Dialog open={!!integracaoAberta} onOpenChange={(o) => !o && setIntegracaoAberta(null)}>
        <DialogContent className="max-w-lg !bg-neutral-950 !text-neutral-50 border-2 border-primary/40">
          <DialogHeader>
            <DialogTitle className="!text-neutral-50 text-xl font-bold">Configurar Integração</DialogTitle>
            <DialogDescription className="!text-neutral-300">
              Ajuste os dados, credenciais e limites de uso da integração.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between rounded-lg border-2 border-primary/40 bg-primary/5 p-3">
              <div>
                <p className="font-semibold text-foreground">Integração ativa</p>
                <p className="text-sm text-foreground/70">
                  Habilita o uso em todas as barbearias
                </p>
              </div>
              <Switch
                checked={form.ativa}
                onCheckedChange={(v) => setForm((f) => ({ ...f, ativa: v }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Nome</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Provider</Label>
                <Input
                  value={form.provider}
                  onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Custo por uso (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.porUso}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, porUso: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Limite mensal</Label>
                <Input
                  type="number"
                  value={form.limiteMensal}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, limiteMensal: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            {configKeys.length > 0 && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <Label className="text-sm font-bold text-primary uppercase tracking-wide">
                  Credenciais
                </Label>
                {configKeys.map((key) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground/90">{key}</Label>
                    <Input
                      value={String(form.configuracoes[key] ?? "")}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          configuracoes: { ...f.configuracoes, [key]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIntegracaoAberta(null)}>
              Cancelar
            </Button>
            <Button onClick={salvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
