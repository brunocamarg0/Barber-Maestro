import { useState } from "react";
import { useDono } from "@/context/DonoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

export default function ConfiguracoesBarbearia() {
  const { configuracao, atualizarConfiguracao } = useDono();
  const { toast } = useToast();
  const [formData, setFormData] = useState(configuracao);
  const [showAlterarSenha, setShowAlterarSenha] = useState(false);
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [isAlterandoSenha, setIsAlterandoSenha] = useState(false);

  const handleSubmit = () => {
    atualizarConfiguracao(formData);
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
  };

  const handleAlterarSenha = async () => {
    if (!senhaForm.senhaAtual || !senhaForm.novaSenha || !senhaForm.confirmarSenha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para alterar a senha.",
        variant: "destructive",
      });
      return;
    }

    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (senhaForm.novaSenha.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsAlterandoSenha(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/dono/alterar-senha`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            senhaAtual: senhaForm.senhaAtual,
            novaSenha: senhaForm.novaSenha,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha');
      }

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso. Use a nova senha no próximo login.",
      });

      setShowAlterarSenha(false);
      setSenhaForm({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro ao alterar a senha.",
        variant: "destructive",
      });
    } finally {
      setIsAlterandoSenha(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações da Barbearia</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua barbearia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Barbearia</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ/CPF</Label>
            <Input
              id="cnpj"
              value={formData.cnpjCpf}
              onChange={(e) => setFormData({ ...formData, cnpjCpf: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horário de Funcionamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(formData.horarioFuncionamento).map(([dia, horario]) => (
            <div key={dia} className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Label className="w-24 capitalize">{dia}</Label>
                <Switch
                  checked={horario.aberto}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      horarioFuncionamento: {
                        ...formData.horarioFuncionamento,
                        [dia]: { ...horario, aberto: checked },
                      },
                    })
                  }
                />
                {horario.aberto && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={horario.inicio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horarioFuncionamento: {
                            ...formData.horarioFuncionamento,
                            [dia]: { ...horario, inicio: e.target.value },
                          },
                        })
                      }
                      className="w-32"
                    />
                    <span>até</span>
                    <Input
                      type="time"
                      value={horario.fim}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horarioFuncionamento: {
                            ...formData.horarioFuncionamento,
                            [dia]: { ...horario, fim: e.target.value },
                          },
                        })
                      }
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Política de Cancelamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prazoMinimo">Prazo Mínimo (horas antes)</Label>
            <Input
              id="prazoMinimo"
              type="number"
              value={formData.politicaCancelamento.prazoMinimo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  politicaCancelamento: {
                    ...formData.politicaCancelamento,
                    prazoMinimo: parseInt(e.target.value) || 0,
                  },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="permitirReagendamento">Permitir Reagendamento</Label>
            <Switch
              id="permitirReagendamento"
              checked={formData.politicaCancelamento.permitirReagendamento}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  politicaCancelamento: {
                    ...formData.politicaCancelamento,
                    permitirReagendamento: checked,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link de Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>URL Pública</Label>
            <Input value={formData.linkAgendamento} readOnly />
            <p className="text-xs text-muted-foreground">
              Este é o link que seus clientes usarão para agendar
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Gerencie a segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Senha da Conta</Label>
                <p className="text-sm text-muted-foreground">
                  Altere sua senha de acesso ao sistema
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAlterarSenha(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Salvar Configurações</Button>
      </div>

      {/* Dialog de Alteração de Senha */}
      <Dialog open={showAlterarSenha} onOpenChange={setShowAlterarSenha}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Digite sua senha atual e a nova senha desejada
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <Input
                id="senhaAtual"
                type="password"
                value={senhaForm.senhaAtual}
                onChange={(e) => setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })}
                placeholder="Digite sua senha atual"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                value={senhaForm.novaSenha}
                onChange={(e) => setSenhaForm({ ...senhaForm, novaSenha: e.target.value })}
                placeholder="Digite a nova senha (mín. 6 caracteres)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                value={senhaForm.confirmarSenha}
                onChange={(e) => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAlterarSenha(false);
                setSenhaForm({
                  senhaAtual: "",
                  novaSenha: "",
                  confirmarSenha: "",
                });
              }}
              disabled={isAlterandoSenha}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAlterarSenha}
              disabled={isAlterandoSenha}
            >
              {isAlterandoSenha ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Alterando...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}







