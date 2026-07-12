import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlatformSettings {
  nome_sistema: string;
  dominio: string;
  email_contato: string;
  telefone_contato: string | null;
  termos_uso: string | null;
  politica_privacidade: string | null;
  modo_manutencao: boolean;
  mensagem_manutencao: string | null;
}

const defaultSettings: PlatformSettings = {
  nome_sistema: "Barber Maestro",
  dominio: "barbermaestro.com",
  email_contato: "suporte.barbermaestro@hotmail.com",
  telefone_contato: "",
  termos_uso: "",
  politica_privacidade: "",
  modo_manutencao: false,
  mensagem_manutencao: "",
};

export default function Configuracoes() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PlatformSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) {
        toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
      } else if (data) {
        setFormData({
          nome_sistema: data.nome_sistema,
          dominio: data.dominio,
          email_contato: data.email_contato,
          telefone_contato: data.telefone_contato ?? "",
          termos_uso: data.termos_uso ?? "",
          politica_privacidade: data.politica_privacidade ?? "",
          modo_manutencao: data.modo_manutencao,
          mensagem_manutencao: data.mensagem_manutencao ?? "",
        });
      }
      setLoading(false);
    })();
  }, [toast]);

  const handleSalvar = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("platform_settings")
      .update({
        nome_sistema: formData.nome_sistema,
        dominio: formData.dominio,
        email_contato: formData.email_contato,
        telefone_contato: formData.telefone_contato || null,
        termos_uso: formData.termos_uso || null,
        politica_privacidade: formData.politica_privacidade || null,
        modo_manutencao: formData.modo_manutencao,
        mensagem_manutencao: formData.mensagem_manutencao || null,
      })
      .eq("id", 1);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Configurações salvas", description: "As alterações foram aplicadas." });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações da Plataforma</h2>
        <p className="text-muted-foreground">
          Configure as opções gerais da plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomeSistema">Nome do Sistema</Label>
            <Input
              id="nomeSistema"
              value={formData.nome_sistema}
              onChange={(e) => setFormData({ ...formData, nome_sistema: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dominio">Domínio</Label>
            <Input
              id="dominio"
              value={formData.dominio}
              onChange={(e) => setFormData({ ...formData, dominio: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailContato">Email de Contato</Label>
            <Input
              id="emailContato"
              type="email"
              value={formData.email_contato}
              onChange={(e) => setFormData({ ...formData, email_contato: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefoneContato">Telefone de Contato</Label>
            <Input
              id="telefoneContato"
              value={formData.telefone_contato ?? ""}
              onChange={(e) => setFormData({ ...formData, telefone_contato: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Termos e Políticas</CardTitle>
          <CardDescription>
            O conteúdo aqui salvo é exibido publicamente nas páginas de Termos de Uso e Política de Privacidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="termosUso">Termos de Uso</Label>
            <Textarea
              id="termosUso"
              value={formData.termos_uso ?? ""}
              onChange={(e) => setFormData({ ...formData, termos_uso: e.target.value })}
              rows={8}
              placeholder="Escreva aqui os Termos de Uso da plataforma..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="politicaPrivacidade">Política de Privacidade</Label>
            <Textarea
              id="politicaPrivacidade"
              value={formData.politica_privacidade ?? ""}
              onChange={(e) => setFormData({ ...formData, politica_privacidade: e.target.value })}
              rows={8}
              placeholder="Escreva aqui a Política de Privacidade..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modo Manutenção</CardTitle>
          <CardDescription>
            Quando ativado, o sistema exibe uma tela de manutenção para os usuários.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar Modo Manutenção</Label>
              <p className="text-sm text-muted-foreground">
                Bloqueia o acesso durante manutenções (administradores continuam com acesso).
              </p>
            </div>
            <Switch
              checked={formData.modo_manutencao}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, modo_manutencao: checked })
              }
            />
          </div>
          {formData.modo_manutencao && (
            <div className="space-y-2">
              <Label htmlFor="mensagemManutencao">Mensagem de Manutenção</Label>
              <Textarea
                id="mensagemManutencao"
                value={formData.mensagem_manutencao ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, mensagem_manutencao: e.target.value })
                }
                placeholder="Sistema em manutenção. Voltaremos em breve."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSalvar} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
