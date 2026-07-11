import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Phone, Scissors, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { gerarHorariosDoDia, parseHorarioFuncionamento } from "@/lib/horarios";

type Barbearia = {
  id: string;
  slug: string;
  nome: string;
  foto?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  bairro?: string | null;
  telefone?: string | null;
  horario_funcionamento?: any;
};

type Servico = {
  id: string;
  nome: string;
  descricao?: string | null;
  duracao: number;
  preco: number;
  ativo: boolean;
};

type Profissional = {
  id: string;
  nome: string;
  foto?: string | null;
  especialidades?: string[] | null;
};

const brl = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function BarbeariaPublica() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [barbearia, setBarbearia] = useState<Barbearia | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  // Gate de acesso: escolha inicial entre login, cadastro ou seguir como convidado
  const [modoAcesso, setModoAcesso] = useState<"escolha" | "login" | "cadastro" | "convidado">("escolha");
  const [autenticado, setAutenticado] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authSenha, setAuthSenha] = useState("");
  const [authNome, setAuthNome] = useState("");
  const [authTel, setAuthTel] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [servicoId, setServicoId] = useState<string>("");
  const [profissionalId, setProfissionalId] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Detecta sessão ativa e pré-preenche dados
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setAutenticado(true);
        setModoAcesso("convidado"); // pula gate
        const { data: prof } = await supabase
          .from("profiles")
          .select("nome, email")
          .eq("user_id", session.user.id)
          .maybeSingle();
        const { data: cli } = await supabase
          .from("clientes")
          .select("nome, telefone")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setNome(cli?.nome || prof?.nome || session.user.user_metadata?.nome || "");
        setTelefone(cli?.telefone || "");
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAutenticado(!!session?.user);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function entrar() {
    if (!authEmail || !authSenha) {
      toast({ title: "Preencha email e senha", variant: "destructive" });
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authSenha });
    setAuthLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Bem-vindo de volta!" });
    setModoAcesso("convidado");
  }

  async function cadastrar() {
    if (!authNome || !authEmail || !authSenha) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (authSenha.length < 6) {
      toast({ title: "Senha deve ter no mínimo 6 caracteres", variant: "destructive" });
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authSenha,
      options: {
        emailRedirectTo: window.location.href,
        data: { nome: authNome, telefone: authTel },
      },
    });
    setAuthLoading(false);
    if (error) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Conta criada!", description: "Você já pode agendar." });
    setNome(authNome);
    setTelefone(authTel);
    setModoAcesso("convidado");
  }


  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data: rows, error } = await supabase.rpc("get_barbearia_publica_by_slug" as any, { _slug: slug });
      const row = Array.isArray(rows) ? (rows as any[])[0] : rows;
      if (error || !row) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setBarbearia(row as any);

      const [{ data: servs }, { data: profs }] = await Promise.all([
        supabase.from("servicos").select("*").eq("barbearia_id", (row as any).id).eq("ativo", true).order("ordem", { ascending: true }),
        supabase.rpc("get_profissionais_publicos_by_barbearia" as any, { _barbearia_ids: [(row as any).id] }),
      ]);
      setServicos((servs ?? []) as Servico[]);
      setProfissionais(((profs as any[]) ?? []).filter((p) => p.ativo !== false));
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!barbearia?.id || !data) {
      setHorariosOcupados([]);
      return;
    }
    (async () => {
      const { data: rows } = await supabase.rpc("get_horarios_ocupados" as any, {
        _barbearia_id: barbearia.id,
        _data: data,
      });
      setHorariosOcupados(((rows as any[]) ?? []).map((r) => r.horario).filter(Boolean));
    })();
  }, [barbearia?.id, data]);

  const servicoSel = servicos.find((s) => s.id === servicoId);
  const horarioFunc = useMemo(
    () => parseHorarioFuncionamento(barbearia?.horario_funcionamento),
    [barbearia?.horario_funcionamento]
  );
  const horariosDisponiveis = useMemo(() => {
    if (!data || !servicoSel) return [];
    const todos = gerarHorariosDoDia(horarioFunc, data, servicoSel.duracao || 40);
    return todos.filter((h) => !horariosOcupados.includes(h));
  }, [data, servicoSel, horarioFunc, horariosOcupados]);

  const hoje = new Date();
  const minData = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

  async function confirmar() {
    if (!barbearia || !servicoSel || !data || !hora) return;
    if (nome.trim().length < 2 || telefone.replace(/\D/g, "").length < 8) {
      toast({ title: "Dados incompletos", description: "Informe nome e telefone válidos.", variant: "destructive" });
      return;
    }
    setEnviando(true);
    try {
      // Data como ISO com meio-dia UTC (padrão do projeto)
      const dataISO = `${data}T12:00:00.000Z`;
      const { error } = await supabase.from("agendamentos").insert({
        barbearia_id: barbearia.id,
        servico_id: servicoSel.id,
        cliente_id: null,
        cliente_nome: nome.trim(),
        telefone: telefone.trim(),
        data: dataISO,
        horario: hora,
        status: "pendente",
        observacao: observacoes.trim() || null,
        confirmado_automaticamente: false,
      } as any);
      if (error) throw error;

      if (profissionalId) {
        // best-effort: liga profissional (ignora erro se policy negar)
        try {
          const { data: created } = await supabase
            .from("agendamentos")
            .select("id")
            .eq("barbearia_id", barbearia.id)
            .eq("horario", hora)
            .eq("data", dataISO)
            .order("created_at", { ascending: false })
            .limit(1);
          const agId = created?.[0]?.id;
          if (agId) {
            await supabase.from("agendamento_profissional").insert({
              agendamento_id: agId,
              profissional_id: profissionalId,
            } as any);
          }
        } catch { /* ignore */ }
      }

      setSucesso(true);
    } catch (err: any) {
      toast({ title: "Erro ao agendar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setEnviando(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !barbearia) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <Scissors className="w-10 h-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Barbearia não encontrada</h1>
        <Link to="/"><Button variant="outline">Voltar</Button></Link>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-primary/10 p-3 w-fit mb-2">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Agendamento enviado!</CardTitle>
            <CardDescription>
              {barbearia.nome} recebeu sua solicitação e entrará em contato pelo telefone informado para confirmar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border p-3 text-sm space-y-1">
              <div><b>Serviço:</b> {servicoSel?.nome}</div>
              <div><b>Data:</b> {data.split("-").reverse().join("/")}</div>
              <div><b>Horário:</b> {hora}</div>
              <div><b>Cliente:</b> {nome}</div>
              <div><b>Telefone:</b> {telefone}</div>
            </div>
            <Button className="w-full" onClick={() => window.location.reload()}>Fazer outro agendamento</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header da barbearia */}
      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={barbearia.foto || undefined} alt={barbearia.nome} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {barbearia.nome.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{barbearia.nome}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
              {(barbearia.bairro || barbearia.cidade) && (
                <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />
                  {[barbearia.bairro, barbearia.cidade].filter(Boolean).join(", ")}
                </span>
              )}
              {barbearia.telefone && (
                <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{barbearia.telefone}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        {/* Stepper simples */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {["Serviço", "Profissional", "Data e horário", "Seus dados"].map((label, i) => (
            <div key={label} className={`px-2 py-1 rounded-md ${step === (i + 1) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {step > 1 && (
          <Button variant="ghost" size="sm" onClick={() => setStep((s) => (s - 1) as any)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha o serviço</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {servicos.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum serviço disponível no momento.</p>
              )}
              {servicos.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setServicoId(s.id); setStep(2); }}
                  className={`text-left border rounded-md p-3 hover:border-primary transition ${servicoId === s.id ? "border-primary bg-primary/5" : ""}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="font-semibold">{s.nome}</div>
                      {s.descricao && <div className="text-sm text-muted-foreground">{s.descricao}</div>}
                      <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {s.duracao} min
                      </div>
                    </div>
                    <div className="font-bold text-primary whitespace-nowrap">{brl(Number(s.preco))}</div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Profissional (opcional)</CardTitle>
              <CardDescription>Escolha um profissional ou deixe a barbearia decidir.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => { setProfissionalId(""); setStep(3); }}
                className={`border rounded-md p-3 text-center hover:border-primary ${profissionalId === "" ? "border-primary bg-primary/5" : ""}`}
              >
                <div className="font-semibold">Sem preferência</div>
                <div className="text-xs text-muted-foreground">Qualquer profissional</div>
              </button>
              {profissionais.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setProfissionalId(p.id); setStep(3); }}
                  className={`border rounded-md p-3 text-center hover:border-primary ${profissionalId === p.id ? "border-primary bg-primary/5" : ""}`}
                >
                  <Avatar className="h-14 w-14 mx-auto mb-2">
                    <AvatarImage src={p.foto || undefined} alt={p.nome} />
                    <AvatarFallback>{p.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-sm">{p.nome}</div>
                  {p.especialidades && p.especialidades.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {p.especialidades.slice(0, 2).map((e) => (
                        <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha data e horário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="data">Data</Label>
                <Input id="data" type="date" min={minData} value={data} onChange={(e) => { setData(e.target.value); setHora(""); }} />
              </div>
              {data && (
                <div>
                  <Label>Horários disponíveis</Label>
                  {horariosDisponiveis.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-2">Nenhum horário disponível neste dia.</p>
                  ) : (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                      {horariosDisponiveis.map((h) => (
                        <button
                          key={h}
                          onClick={() => setHora(h)}
                          className={`border rounded-md px-2 py-2 text-sm hover:border-primary ${hora === h ? "border-primary bg-primary text-primary-foreground" : ""}`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Button className="w-full" disabled={!data || !hora} onClick={() => setStep(4)}>Continuar</Button>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Seus dados</CardTitle>
              <CardDescription>Informe seu nome e telefone. Não é necessário criar conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="nome">Nome completo *</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
              </div>
              <div>
                <Label htmlFor="tel">Telefone (WhatsApp) *</Label>
                <Input id="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 91234-5678" />
              </div>
              <div>
                <Label htmlFor="obs">Observações</Label>
                <Input id="obs" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Opcional" />
              </div>

              <div className="rounded-md bg-muted p-3 text-sm space-y-1">
                <div><b>Serviço:</b> {servicoSel?.nome} — {brl(Number(servicoSel?.preco ?? 0))}</div>
                <div><b>Data:</b> {data.split("-").reverse().join("/")} às {hora}</div>
                {profissionalId && (
                  <div><b>Profissional:</b> {profissionais.find((p) => p.id === profissionalId)?.nome}</div>
                )}
              </div>

              <Button className="w-full" onClick={confirmar} disabled={enviando}>
                {enviando ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirmar agendamento
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Ao confirmar, você aceita ser contatado pela barbearia para confirmação do horário.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
