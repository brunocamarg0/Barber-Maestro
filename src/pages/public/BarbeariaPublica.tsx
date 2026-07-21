import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, MapPin, Phone, Scissors, Clock, CheckCircle2, ArrowLeft,
  LogIn, UserPlus, Zap, History, Bell, ShieldCheck, Calendar as CalendarIcon,
  User as UserIcon, Sparkles as SparklesIcon,
} from "lucide-react";
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

/** Botão azul moderno: fundo suave, borda e texto azul (não bloco cheio). */
const blueGhost =
  "border border-secondary/40 bg-secondary/5 text-secondary hover:bg-secondary/15 hover:border-secondary/70 transition-colors";

const softCard =
  "bg-card/70 backdrop-blur-sm border border-border/60 rounded-2xl shadow-[0_1px_0_hsl(var(--border))]";

export default function BarbeariaPublica() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [barbearia, setBarbearia] = useState<Barbearia | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  const [modoAcesso, setModoAcesso] = useState<"escolha" | "login" | "cadastro" | "convidado">("escolha");
  const [autenticado, setAutenticado] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authSenha, setAuthSenha] = useState("");
  const [authNome, setAuthNome] = useState("");
  const [authTel, setAuthTel] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [servicoIds, setServicoIds] = useState<string[]>([]);
  const [profissionalId, setProfissionalId] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setAutenticado(true);
        setModoAcesso("convidado");
        const { data: prof } = await supabase
          .from("profiles").select("nome, email").eq("user_id", session.user.id).maybeSingle();
        const { data: cli } = await supabase
          .from("clientes").select("nome, telefone").eq("user_id", session.user.id).maybeSingle();
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
      toast({ title: "Preencha email e senha", variant: "destructive" }); return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authSenha });
    setAuthLoading(false);
    if (error) { toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Bem-vindo de volta!" });
    setModoAcesso("convidado");
  }

  async function cadastrar() {
    if (!authNome || !authEmail || !authSenha) { toast({ title: "Preencha todos os campos", variant: "destructive" }); return; }
    if (authSenha.length < 6) { toast({ title: "Senha deve ter no mínimo 6 caracteres", variant: "destructive" }); return; }
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({
      email: authEmail, password: authSenha,
      options: { emailRedirectTo: window.location.href, data: { nome: authNome, telefone: authTel } },
    });
    setAuthLoading(false);
    if (error) { toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Conta criada!", description: "Você já pode agendar." });
    setNome(authNome); setTelefone(authTel); setModoAcesso("convidado");
  }

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data: rows, error } = await supabase.rpc("get_barbearia_publica_by_slug" as any, { _slug: slug });
      const row = Array.isArray(rows) ? (rows as any[])[0] : rows;
      if (error || !row) { setNotFound(true); setLoading(false); return; }
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
    if (!barbearia?.id || !data) { setHorariosOcupados([]); return; }
    (async () => {
      const { data: rows } = await supabase.rpc("get_horarios_ocupados" as any, {
        _barbearia_id: barbearia.id, _data: data,
      });
      setHorariosOcupados(((rows as any[]) ?? []).map((r) => r.horario).filter(Boolean));
    })();
  }, [barbearia?.id, data]);

  const servicosSel = servicoIds.map((id) => servicos.find((s) => s.id === id)).filter(Boolean) as Servico[];
  const duracaoTotal = servicosSel.reduce((acc, s) => acc + (s.duracao || 40), 0) || 40;
  const valorTotal = servicosSel.reduce((acc, s) => acc + Number(s.preco || 0), 0);
  const horarioFunc = useMemo(() => parseHorarioFuncionamento(barbearia?.horario_funcionamento), [barbearia?.horario_funcionamento]);
  const horariosDisponiveis = useMemo(() => {
    if (!data || servicosSel.length === 0) return [];
    const todos = gerarHorariosDoDia(horarioFunc, data, duracaoTotal);
    return todos.filter((h) => !horariosOcupados.includes(h));
  }, [data, servicosSel.length, duracaoTotal, horarioFunc, horariosOcupados]);

  const hoje = new Date();
  const minData = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

  async function confirmar() {
    if (!barbearia || servicosSel.length === 0 || !data || !hora) return;
    if (nome.trim().length < 2 || telefone.replace(/\D/g, "").length < 8) {
      toast({ title: "Dados incompletos", description: "Informe nome e telefone válidos.", variant: "destructive" }); return;
    }
    setEnviando(true);
    try {
      const dataISO = `${data}T12:00:00.000Z`;
      const [hh, mm] = hora.split(":").map(Number);
      let offsetMin = 0;
      for (const s of servicosSel) {
        const total = hh * 60 + mm + offsetMin;
        const h2 = String(Math.floor(total / 60)).padStart(2, "0");
        const m2 = String(total % 60).padStart(2, "0");
        const horarioServico = `${h2}:${m2}`;
        const { error } = await supabase.rpc("criar_agendamento_publico" as any, {
          _barbearia_id: barbearia.id, _servico_id: s.id, _profissional_id: profissionalId || null,
          _cliente_nome: nome.trim(), _telefone: telefone.trim(),
          _data: dataISO, _horario: horarioServico, _observacao: observacoes.trim() || null,
        });
        if (error) throw error;
        offsetMin += s.duracao || 40;
      }
      setSucesso(true);
    } catch (err: any) {
      toast({ title: "Erro ao agendar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally { setEnviando(false); }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.15),transparent_60%)]" />
        <Card className={`max-w-md w-full relative ${softCard}`}>
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-secondary/15 p-4 w-fit mb-2 ring-4 ring-secondary/10">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <CardTitle className="text-2xl">Agendamento enviado!</CardTitle>
            <CardDescription>
              {barbearia.nome} recebeu sua solicitação e entrará em contato pelo telefone informado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm space-y-1.5">
              <div><span className="text-muted-foreground">Serviços:</span> <b>{servicosSel.map((s) => s.nome).join(", ")}</b></div>
              <div><span className="text-muted-foreground">Data:</span> <b>{data.split("-").reverse().join("/")}</b></div>
              <div><span className="text-muted-foreground">Horário:</span> <b>{hora}</b></div>
              <div><span className="text-muted-foreground">Cliente:</span> <b>{nome}</b></div>
              <div><span className="text-muted-foreground">Telefone:</span> <b>{telefone}</b></div>
            </div>
            <Button className="w-full rounded-xl" onClick={() => window.location.reload()}>Fazer outro agendamento</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { label: "Serviço", icon: SparklesIcon },
    { label: "Profissional", icon: UserIcon },
    { label: "Data e horário", icon: CalendarIcon },
    { label: "Seus dados", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Backdrop glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.18),transparent_65%)]" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,hsl(var(--primary)/0.12),transparent_60%)]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 bg-card/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-secondary/30 blur-lg" />
              <Avatar className="relative h-20 w-20 border-2 border-secondary/40 ring-4 ring-background">
                <AvatarImage src={barbearia.foto || undefined} alt={barbearia.nome} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary text-2xl font-bold">
                  {barbearia.nome.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <Badge variant="outline" className="border-secondary/40 text-secondary bg-secondary/5 mb-2">
                <SparklesIcon className="w-3 h-3 mr-1" /> Agendamento online
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight truncate">{barbearia.nome}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                {(barbearia.bairro || barbearia.cidade) && (
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />
                    {[barbearia.bairro, barbearia.cidade].filter(Boolean).join(", ")}
                  </span>
                )}
                {barbearia.telefone && (
                  <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{barbearia.telefone}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
        {/* GATE de acesso */}
        {modoAcesso === "escolha" && (
          <div className="space-y-6">
            <div className="text-center space-y-2 pt-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Como você prefere agendar?</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
                Entre na sua conta para agendar em segundos e acompanhar seu histórico — ou continue sem cadastro, é rápido também.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Com conta */}
              <Card className={`relative overflow-hidden ${softCard} border-secondary/30 hover:border-secondary/60 transition-all`}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary/60 via-secondary to-secondary/60" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/15">
                    Recomendado
                  </Badge>
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mb-2 ring-1 ring-secondary/20">
                    <LogIn className="w-5 h-5 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Tenho conta ou quero criar</CardTitle>
                  <CardDescription>Login rápido para clientes cadastrados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-sm space-y-2.5 text-muted-foreground">
                    <li className="flex items-start gap-2"><Zap className="w-4 h-4 mt-0.5 text-secondary shrink-0" /> Agendamento em poucos cliques</li>
                    <li className="flex items-start gap-2"><History className="w-4 h-4 mt-0.5 text-secondary shrink-0" /> Histórico de todos os cortes</li>
                    <li className="flex items-start gap-2"><Bell className="w-4 h-4 mt-0.5 text-secondary shrink-0" /> Lembretes automáticos</li>
                  </ul>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button className={`w-full rounded-xl ${blueGhost}`} variant="outline" onClick={() => setModoAcesso("login")}>
                      Entrar
                    </Button>
                    <Button className={`w-full rounded-xl ${blueGhost}`} variant="outline" onClick={() => setModoAcesso("cadastro")}>
                      <UserPlus className="w-4 h-4 mr-1" /> Criar conta
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sem conta */}
              <Card className={`${softCard} hover:border-muted-foreground/40 transition-all`}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-2 ring-1 ring-border">
                    <ShieldCheck className="w-5 h-5 text-foreground" />
                  </div>
                  <CardTitle className="text-xl">Agendar sem cadastro</CardTitle>
                  <CardDescription>Rápido, só precisa de nome e telefone.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-sm space-y-2.5 text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-foreground/70 shrink-0" /> Sem senha nem confirmação por e-mail</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-foreground/70 shrink-0" /> Confirmação pelo telefone informado</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-foreground/70 shrink-0" /> Sem histórico salvo nem lembretes</li>
                  </ul>
                  <Button className="w-full rounded-xl" variant="secondary" onClick={() => setModoAcesso("convidado")}>
                    Continuar sem cadastro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {modoAcesso === "login" && (
          <Card className={`${softCard} max-w-md mx-auto`}>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>Use o email e a senha da sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input id="loginEmail" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <Label htmlFor="loginSenha">Senha</Label>
                <Input id="loginSenha" type="password" value={authSenha} onChange={(e) => setAuthSenha(e.target.value)} className="rounded-xl" />
              </div>
              <Button className={`w-full rounded-xl ${blueGhost}`} variant="outline" onClick={entrar} disabled={authLoading}>
                {authLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Entrar
              </Button>
              <div className="flex justify-between text-xs">
                <button className="text-secondary hover:underline" onClick={() => setModoAcesso("cadastro")}>Criar conta</button>
                <button className="text-muted-foreground hover:underline" onClick={() => setModoAcesso("convidado")}>Continuar sem cadastro</button>
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setModoAcesso("escolha")}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
            </CardContent>
          </Card>
        )}

        {modoAcesso === "cadastro" && (
          <Card className={`${softCard} max-w-md mx-auto`}>
            <CardHeader>
              <CardTitle>Criar conta rápida</CardTitle>
              <CardDescription>Leva menos de 1 minuto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><Label htmlFor="regNome">Nome completo</Label>
                <Input id="regNome" value={authNome} onChange={(e) => setAuthNome(e.target.value)} className="rounded-xl" /></div>
              <div><Label htmlFor="regTel">Telefone (WhatsApp)</Label>
                <Input id="regTel" value={authTel} onChange={(e) => setAuthTel(e.target.value)} placeholder="(11) 91234-5678" className="rounded-xl" /></div>
              <div><Label htmlFor="regEmail">Email</Label>
                <Input id="regEmail" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="rounded-xl" /></div>
              <div><Label htmlFor="regSenha">Senha (mín. 6 caracteres)</Label>
                <Input id="regSenha" type="password" value={authSenha} onChange={(e) => setAuthSenha(e.target.value)} className="rounded-xl" /></div>
              <Button className={`w-full rounded-xl ${blueGhost}`} variant="outline" onClick={cadastrar} disabled={authLoading}>
                {authLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Criar conta
              </Button>
              <div className="flex justify-between text-xs">
                <button className="text-secondary hover:underline" onClick={() => setModoAcesso("login")}>Já tenho conta</button>
                <button className="text-muted-foreground hover:underline" onClick={() => setModoAcesso("convidado")}>Continuar sem cadastro</button>
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setModoAcesso("escolha")}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
            </CardContent>
          </Card>
        )}

        {modoAcesso === "convidado" && (<>
          {/* Stepper moderno */}
          <div className={`${softCard} p-4`}>
            <div className="flex items-center justify-between gap-2">
              {steps.map((s, i) => {
                const n = (i + 1) as 1 | 2 | 3 | 4;
                const done = step > n;
                const active = step === n;
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                        ${active ? "border-secondary bg-secondary/15 text-secondary ring-4 ring-secondary/10" : ""}
                        ${done ? "border-secondary bg-secondary text-secondary-foreground" : ""}
                        ${!active && !done ? "border-border bg-muted text-muted-foreground" : ""}`}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className={`text-[11px] md:text-xs mt-1.5 font-medium text-center ${active ? "text-secondary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 md:mx-2 -mt-5 rounded ${done ? "bg-secondary" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {!autenticado && (
            <p className="text-xs text-muted-foreground text-center">
              Agendando sem cadastro. <button className="text-secondary hover:underline" onClick={() => setModoAcesso("escolha")}>Entrar ou criar conta</button>
            </p>
          )}

          {step > 1 && (
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => (s - 1) as any)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
          )}

          {step === 1 && (
            <Card className={softCard}>
              <CardHeader>
                <CardTitle>Escolha os serviços</CardTitle>
                <CardDescription>Você pode selecionar mais de um serviço.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {servicos.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum serviço disponível no momento.</p>
                )}
                {servicos.map((s) => {
                  const selecionado = servicoIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setServicoIds((prev) => prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id])}
                      className={`text-left border rounded-xl p-4 transition-all
                        ${selecionado ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20" : "border-border/60 hover:border-secondary/50 hover:bg-muted/30"}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition
                            ${selecionado ? "bg-secondary border-secondary" : "border-muted-foreground/40"}`}>
                            {selecionado && <CheckCircle2 className="w-3.5 h-3.5 text-secondary-foreground" />}
                          </div>
                          <div>
                            <div className="font-semibold">{s.nome}</div>
                            {s.descricao && <div className="text-sm text-muted-foreground">{s.descricao}</div>}
                            <div className="text-xs text-muted-foreground mt-1.5 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {s.duracao} min
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-secondary whitespace-nowrap">{brl(Number(s.preco))}</div>
                      </div>
                    </button>
                  );
                })}
                {servicosSel.length > 0 && (
                  <div className="rounded-xl bg-secondary/5 border border-secondary/20 p-3 text-sm flex justify-between items-center">
                    <span className="text-muted-foreground">{servicosSel.length} serviço(s) • {duracaoTotal} min</span>
                    <span className="font-bold text-secondary text-base">{brl(valorTotal)}</span>
                  </div>
                )}
                <Button className={`w-full rounded-xl ${blueGhost}`} variant="outline" disabled={servicosSel.length === 0} onClick={() => setStep(2)}>
                  Continuar
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className={softCard}>
              <CardHeader>
                <CardTitle>Profissional (opcional)</CardTitle>
                <CardDescription>Escolha um profissional ou deixe a barbearia decidir.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => { setProfissionalId(""); setStep(3); }}
                  className={`border rounded-xl p-4 text-center transition-all
                    ${profissionalId === "" ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20" : "border-border/60 hover:border-secondary/50 hover:bg-muted/30"}`}
                >
                  <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="font-semibold text-sm">Sem preferência</div>
                  <div className="text-xs text-muted-foreground">Qualquer profissional</div>
                </button>
                {profissionais.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProfissionalId(p.id); setStep(3); }}
                    className={`border rounded-xl p-4 text-center transition-all
                      ${profissionalId === p.id ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20" : "border-border/60 hover:border-secondary/50 hover:bg-muted/30"}`}
                  >
                    <Avatar className="h-14 w-14 mx-auto mb-2 ring-2 ring-border">
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
            <Card className={softCard}>
              <CardHeader>
                <CardTitle>Escolha data e horário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input id="data" type="date" min={minData} value={data} onChange={(e) => { setData(e.target.value); setHora(""); }} className="rounded-xl" />
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
                            className={`border rounded-lg px-2 py-2.5 text-sm font-medium transition-all
                              ${hora === h
                                ? "border-secondary bg-secondary/10 text-secondary ring-2 ring-secondary/20"
                                : "border-border/60 hover:border-secondary/50 hover:bg-muted/30"}`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <Button className={`w-full rounded-xl ${blueGhost}`} variant="outline" disabled={!data || !hora} onClick={() => setStep(4)}>Continuar</Button>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className={softCard}>
              <CardHeader>
                <CardTitle>Seus dados</CardTitle>
                <CardDescription>Informe seu nome e telefone.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><Label htmlFor="nome">Nome completo *</Label>
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className="rounded-xl" /></div>
                <div><Label htmlFor="tel">Telefone (WhatsApp) *</Label>
                  <Input id="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 91234-5678" className="rounded-xl" /></div>
                <div><Label htmlFor="obs">Observações</Label>
                  <Input id="obs" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Opcional" className="rounded-xl" /></div>

                <div className="rounded-xl bg-secondary/5 border border-secondary/20 p-4 text-sm space-y-1.5">
                  <div><span className="text-muted-foreground">Serviços:</span> <b>{servicosSel.map((s) => s.nome).join(", ")}</b> — <span className="text-secondary font-bold">{brl(valorTotal)}</span></div>
                  <div><span className="text-muted-foreground">Data:</span> <b>{data.split("-").reverse().join("/")}</b> às <b>{hora}</b></div>
                  {profissionalId && (
                    <div><span className="text-muted-foreground">Profissional:</span> <b>{profissionais.find((p) => p.id === profissionalId)?.nome}</b></div>
                  )}
                </div>

                <Button className="w-full rounded-xl" onClick={confirmar} disabled={enviando}>
                  {enviando ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Confirmar agendamento
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Ao confirmar, você aceita ser contatado pela barbearia para confirmação do horário.
                </p>
              </CardContent>
            </Card>
          )}
        </>)}
      </main>
    </div>
  );
}
