import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Users, RefreshCw, Shield, Briefcase, Scissors, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";

interface UserRow {
  user_id: string;
  role: string;
  barbearia_id: string | null;
  created_at: string;
  nome: string | null;
  email: string | null;
  barbearia_nome: string | null;
}

const roleConfig: Record<string, { label: string; icon: any; color: string }> = {
  super_admin: { label: "Super Admin", icon: Shield, color: "text-red-500" },
  owner: { label: "Dono", icon: Briefcase, color: "text-blue-500" },
  professional: { label: "Profissional", icon: Scissors, color: "text-green-500" },
  client: { label: "Cliente", icon: UserIcon, color: "text-gray-400" },
};

export default function Usuarios() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const { toast } = useToast();

  const carregar = async () => {
    setLoading(true);
    const [rolesRes, profilesRes, barbeariasRes] = await Promise.all([
      supabase.from("user_roles").select("user_id, role, barbearia_id, created_at"),
      supabase.from("profiles").select("user_id, nome, email"),
      supabase.from("barbearias").select("id, nome"),
    ]);
    if (rolesRes.error) {
      toast({ title: "Erro", description: rolesRes.error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const profMap = new Map((profilesRes.data || []).map((p: any) => [p.user_id, p]));
    const barbMap = new Map((barbeariasRes.data || []).map((b: any) => [b.id, b.nome]));
    const merged: UserRow[] = (rolesRes.data || []).map((r: any) => ({
      user_id: r.user_id,
      role: r.role,
      barbearia_id: r.barbearia_id,
      created_at: r.created_at,
      nome: profMap.get(r.user_id)?.nome || null,
      email: profMap.get(r.user_id)?.email || null,
      barbearia_nome: r.barbearia_id ? barbMap.get(r.barbearia_id) || null : null,
    }));
    setRows(merged);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const remover = async (user_id: string, role: string) => {
    if (!confirm(`Remover papel "${role}" deste usuário?`)) return;
    const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", role);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Papel removido" }); carregar(); }
  };

  const stats = {
    total: rows.length,
    super_admin: rows.filter((r) => r.role === "super_admin").length,
    owner: rows.filter((r) => r.role === "owner").length,
    professional: rows.filter((r) => r.role === "professional").length,
    client: rows.filter((r) => r.role === "client").length,
  };

  const filtrados = filtro === "todos" ? rows : rows.filter((r) => r.role === filtro);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários do Sistema</h2>
          <p className="text-muted-foreground">Todos os usuários e seus papéis</p>
        </div>
        <Button variant="outline" onClick={carregar} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Super Admin", value: stats.super_admin },
          { label: "Donos", value: stats.owner },
          { label: "Profissionais", value: stats.professional },
          { label: "Clientes", value: stats.client },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>{s.label}</CardDescription>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Usuários</CardTitle></CardHeader>
        <CardContent>
          <Tabs value={filtro} onValueChange={setFiltro}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="super_admin">Admins</TabsTrigger>
              <TabsTrigger value="owner">Donos</TabsTrigger>
              <TabsTrigger value="professional">Profissionais</TabsTrigger>
              <TabsTrigger value="client">Clientes</TabsTrigger>
            </TabsList>
            <TabsContent value={filtro} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Barbearia</TableHead>
                    <TableHead>Desde</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Carregando...
                    </TableCell></TableRow>
                  ) : filtrados.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhum usuário encontrado
                    </TableCell></TableRow>
                  ) : filtrados.map((u) => {
                    const cfg = roleConfig[u.role] || { label: u.role, icon: UserIcon, color: "" };
                    const Icon = cfg.icon;
                    return (
                      <TableRow key={`${u.user_id}-${u.role}`}>
                        <TableCell className="font-medium">{u.nome || "—"}</TableCell>
                        <TableCell>{u.email || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <Icon className={`h-3 w-3 ${cfg.color}`} />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{u.barbearia_nome || "—"}</TableCell>
                        <TableCell>{new Date(u.created_at).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          {u.role !== "super_admin" && (
                            <Button size="sm" variant="ghost" onClick={() => remover(u.user_id, u.role)}>
                              Remover papel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
