import { useState } from "react";
import { useDono } from "@/context/DonoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Crown, Search } from "lucide-react";
import { toast } from "sonner";

export default function GestaoClientes() {
  const { clientes, marcarClienteVIP, adicionarCliente } = useDono();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formCliente, setFormCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const clientesFiltrados = busca
    ? clientes.filter((c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.telefone.includes(busca)
      )
    : clientes;

  const handleSalvar = async () => {
    if (!formCliente.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!formCliente.email.trim()) {
      toast.error("Email é obrigatório");
      return;
    }

    if (!formCliente.telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    try {
      await adicionarCliente({
        nome: formCliente.nome.trim(),
        email: formCliente.email.trim(),
        telefone: formCliente.telefone.trim(),
      });

      // Limpar formulário e fechar modal
      setFormCliente({
        nome: "",
        email: "",
        telefone: "",
      });
      setModalAberto(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar cliente");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-muted-foreground">
            CRM simples e poderoso para gerenciar seus clientes
          </p>
        </div>
        <Button onClick={() => setModalAberto(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente por nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.filter((c) => c.vip).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarMoeda(
                clientes.length > 0
                  ? clientes.reduce((sum, c) => sum + c.ticketMedio, 0) / clientes.length
                  : 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Clientes Recorrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientes.filter((c) => c.frequencia >= 2).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {clientesFiltrados.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Agendamentos</TableHead>
                <TableHead>Ticket Médio</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Último Atendimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {cliente.nome}
                      {cliente.vip && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.totalAgendamentos}</TableCell>
                  <TableCell>{formatarMoeda(cliente.ticketMedio)}</TableCell>
                  <TableCell>{cliente.frequencia}/mês</TableCell>
                  <TableCell>
                    {cliente.ultimoAgendamento
                      ? new Date(cliente.ultimoAgendamento).toLocaleDateString("pt-BR")
                      : "Nunca"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cliente.vip ? "default" : "secondary"}>
                      {cliente.vip ? "VIP" : "Regular"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => marcarClienteVIP(cliente.id, !cliente.vip)}
                    >
                      {cliente.vip ? "Remover VIP" : "Marcar VIP"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para adicionar novo cliente */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Novo Cliente</DialogTitle>
            <DialogDescription className="text-gray-600">
              Adicione um novo cliente ao sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-900">
                Nome *
              </Label>
              <Input
                id="nome"
                placeholder="Nome completo do cliente"
                value={formCliente.nome}
                onChange={(e) =>
                  setFormCliente({ ...formCliente, nome: e.target.value })
                }
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formCliente.email}
                onChange={(e) =>
                  setFormCliente({ ...formCliente, email: e.target.value })
                }
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-gray-900">
                Telefone *
              </Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={formCliente.telefone}
                onChange={(e) =>
                  setFormCliente({ ...formCliente, telefone: e.target.value })
                }
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalAberto(false)}
              className="text-gray-900 border-gray-300"
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="bg-blue-600 hover:bg-blue-700">
              Salvar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}







