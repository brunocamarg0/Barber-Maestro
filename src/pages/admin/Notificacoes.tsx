import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Loader2, RefreshCw, Send, Mail, MessageCircle, AppWindow } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NotifRow {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  cliente_id: string | null;
  barbearia_id: string | null;
}

const AUDIENCIAS = [
  { value: "todos_donos", label: "Todos os donos" },
  { value: "todos_clientes", label: "Todos os clientes" },
  { value: "todos_profissionais", label: "Todos os profissionais" },
];

export default function Notificacoes() {
  const { toast } = useToast();
  const [rows, setRows] = useState<NotifRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    mensagem: "",
    tipo: "info",
    audiencia: "todos_donos",
    canalApp: true,
    canalEmail: false,
    canalWhatsapp: false,
  });

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notificacoes")
      .select("id, tipo, titulo, mensagem, data, lida, cliente_id, barbearia_id")
      .order("data", { ascending: false })
      .limit(100);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const enviar = async () => {
    if (!form.titulo || !form.mensagem) {
      toast({ title: "Preencha título e mensagem", variant: "destructive" });
      return;
    }
    if (!form.canalApp && !form.canalEmail && !form.canalWhatsapp) {
      toast({ title: "Selecione ao menos um canal", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("broadcast-notification", {
        body: {
          audiencia: form.audiencia,
          titulo: form.titulo,
          mensagem: form.mensagem,
          tipo: form.tipo,
          canais: {
            app: form.canalApp,
            email: form.canalEmail,
            whatsapp: form.canalWhatsapp,
          },
        },
      });
      if (error) throw error;
      const r = data as any;
      toast({
        title: "Envio concluído",
        description: `${r.destinatarios} destinatários · App ${r.app} · E-mail ${r.email}${r.email_falhou ? ` (${r.email_falhou} falhas)` : ""} · WhatsApp ${r.whatsapp}${r.whatsapp_falhou ? ` (${r.whatsapp_falhou} falhas)` : ""}`,
      });
      setOpen(false);
      setForm({
        titulo: "", mensagem: "", tipo: "info", audiencia: "todos_donos",
        canalApp: true, canalEmail: false, canalWhatsapp: false,
      });
      carregar();
    } catch (e: any) {
      toast({ title: "Erro ao enviar", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">Envio real em massa via app, e-mail e WhatsApp</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={carregar} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Atualizar
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Nova Notificação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova Notificação em Massa</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Audiência</Label>
                  <Select value={form.audiencia} onValueChange={(v) => setForm({ ...form, audiencia: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AUDIENCIAS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informativa</SelectItem>
                      <SelectItem value="aviso">Aviso</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="promocao">Promoção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Título</Label>
                  <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
                </div>
                <div>
                  <Label>Mensagem</Label>
                  <Textarea rows={5} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} />
                </div>
                <div>
                  <Label>Canais de envio</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <label className="flex items-center gap-2 p-2 rounded-md border cursor-pointer">
                      <Checkbox checked={form.canalApp} onCheckedChange={(v) => setForm({ ...form, canalApp: !!v })} />
                      <AppWindow className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">No app (histórico + sino)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-md border cursor-pointer">
                      <Checkbox checked={form.canalEmail} onCheckedChange={(v) => setForm({ ...form, canalEmail: !!v })} />
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">E-mail (fila transacional)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-md border cursor-pointer">
                      <Checkbox checked={form.canalWhatsapp} onCheckedChange={(v) => setForm({ ...form, canalWhatsapp: !!v })} />
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">WhatsApp (Z-API)</span>
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={enviar} disabled={sending}>
                  {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Últimas {rows.length} notificações in-app</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></div>
          ) : rows.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma notificação ainda</p>
          ) : (
            <div className="space-y-3">
              {rows.map((n) => (
                <div key={n.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{n.titulo}</h4>
                        <Badge variant="outline">{n.tipo}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{n.mensagem}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(n.data).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <Badge variant={n.lida ? "secondary" : "default"}>
                      {n.lida ? "Lida" : "Não lida"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
