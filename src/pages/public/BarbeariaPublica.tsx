import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Phone, Scissors, Clock, CheckCircle2, ArrowLeft, LogIn, UserPlus, Zap, History, Bell, ShieldCheck } from "lucide-react";
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

  const servicosSel = servicoIds.map((id) => servicos.find((s) => s.id === id)).filter(Boolean) as Servico[];
  const duracaoTotal = servicosSel.reduce((acc, s) => acc + (s.duracao || 40), 0) || 40;
  const valorTotal = servicosSel.reduce((acc, s) => acc + Number(s.preco || 0), 0);
  const horarioFunc = useMemo(
    () => parseHorarioFuncionamento(barbearia?.horario_funcionamento),
    [barbearia?.horario_funcionamento]
  );
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
      toast({ title: "Dados incompletos", description: "Informe nome e telefone válidos.", variant: "destructive" });
      return;
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
          _barbearia_id: barbearia.id,
          _servico_id: s.id,
          _profissional_id: profissionalId || null,
          _cliente_nome: nome.trim(),
          _telefone: telefone.trim(),
          _data: dataISO,
          _horario: horarioServico,
          _observacao: observacoes.trim() || null,
        });
        if (error) throw error;
        offsetMin += s.duracao || 40;
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
              <div><b>Serviços:</b> {servicosSel.map((s) => s.nome).join(", ")}</div>
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
        {modoAcesso === "escolha" && (
          <div className="space-y-4">
            <div className="text-center space-y-2 pt-2">
              <Badge variant="outline" className="border-primary/40 text-primary">Agendamento online</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Como você prefere agendar?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Entre na sua conta para agendar em segundos e acompanhar seu histórico — ou continue sem cadastro, é rápido também.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Opção 1: Com conta */}
              <Card className="relative border-primary/40 hover:border-primary transition-colors overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-primary text-primary-foreground">Recomendado</Badge>
                </div>
                <CardHeader>
                  <div className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center mb-2">
                    <LogIn className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>Tenho conta ou quero criar</CardTitle>
                  <CardDescription>Login rápido para clientes cadastrados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2"><Zap className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Agendamento em poucos cliques</li>
                    <li className="flex items-start gap-2"><History className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Histórico de todos os cortes</li>
                    <li className="flex items-start gap-2"><Bell className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Lembretes automáticos por e-mail e WhatsApp</li>
                  </ul>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button className="w-full" onClick={() => setModoAcesso("login")}>Entrar</Button>
                    <Button className="w-full" variant="outline" onClick={() => setModoAcesso("cadastro")}>
                      <UserPlus className="w-4 h-4 mr-1" /> Criar conta
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Opção 2: Sem conta */}
              <Card className="border-border hover:border-muted-foreground/40 transition-colors">
                <CardHeader>
                  <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center mb-2">
                    <ShieldCheck className="w-5 h-5 text-foreground" />
                  </div>
                  <CardTitle>Agendar sem cadastro</CardTitle>
                  <CardDescription>Rápido, só precisa de nome e telefone.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-foreground shrink-0" /> Sem senhas nem confirmação de e-mail</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-foreground shrink-0" /> A barbearia confirma pelo telefone</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-foreground shrink-0" /> Sem histórico salvo nem lembretes</li>
                  </ul>
                  <Button className="w-full" variant="secondary" onClick={() => setModoAcesso("convidado")}>
                    Continuar sem cadastro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}


        {modoAcesso === "login" && (
          <Card>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>Use o email e a senha da sua conta de cliente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input id="loginEmail" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="loginSenha">Senha</Label>
                <Input id="loginSenha" type="password" value={authSenha} onChange={(e) => setAuthSenha(e.target.value)} />
              </div>
              <Button className="w-full" onClick={entrar} disabled={authLoading}>
                {authLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Entrar
              </Button>
              <div className="flex justify-between text-xs">
                <button className="text-primary hover:underline" onClick={() => setModoAcesso("cadastro")}>Criar conta</button>
                <button className="text-muted-foreground hover:underline" onClick={() => setModoAcesso("convidado")}>Continuar sem cadastro</button>
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setModoAcesso("escolha")}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
            </CardContent>
          </Card>
        )}

        {modoAcesso === "cadastro" && (
          <Card>
            <CardHeader>
              <CardTitle>Criar conta rápida</CardTitle>
              <CardDescription>Leva menos de 1 minuto e você acompanha seus agendamentos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="regNome">Nome completo</Label>
                <Input id="regNome" value={authNome} onChange={(e) => setAuthNome(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="regTel">Telefone (WhatsApp)</Label>
                <Input id="regTel" value={authTel} onChange={(e) => setAuthTel(e.target.value)} placeholder="(11) 91234-5678" />
              </div>
              <div>
                <Label htmlFor="regEmail">Email</Label>
                <Input id="regEmail" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="regSenha">Senha (mín. 6 caracteres)</Label>
                <Input id="regSenha" type="password" value={authSenha} onChange={(e) => setAuthSenha(e.target.value)} />
              </div>
              <Button className="w-full" onClick={cadastrar} disabled={authLoading}>
                {authLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Criar conta
              </Button>
              <div className="flex justify-between text-xs">
                <button className="text-primary hover:underline" onClick={() => setModoAcesso("login")}>Já tenho conta</button>
                <button className="text-muted-foreground hover:underline" onClick={() => setModoAcesso("convidado")}>Continuar sem cadastro</button>
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setModoAcesso("escolha")}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
            </CardContent>
          </Card>
        )}

        {modoAcesso === "convidado" && (<>
        {/* Stepper simples */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {["Serviço", "Profissional", "Data e horário", "Seus dados"].map((label, i) => (
            <div key={label} className={`px-2 py-1 rounded-md ${step === (i + 1) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {i + 1}. {label}
            </div>
          ))}
        </div>
        {!autenticado && (
          <p className="text-xs text-muted-foreground">
            Agendando sem cadastro. <button className="text-primary hover:underline" onClick={() => setModoAcesso("escolha")}>Entrar ou criar conta</button>
          </p>
        )}

        {step > 1 && (
          <Button variant="ghost" size="sm" onClick={() => setStep((s) => (s - 1) as any)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        )}

        {step === 1 && (
          <Card>
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
                    onClick={() =>
                      setServicoIds((prev) =>
                        prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                      )
                    }
                    className={`text-left border rounded-md p-3 hover:border-primary transition ${selecionado ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${selecionado ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                          {selecionado && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div>
                          <div className="font-semibold">{s.nome}</div>
                          {s.descricao && <div className="text-sm text-muted-foreground">{s.descricao}</div>}
                          <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {s.duracao} min
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-primary whitespace-nowrap">{brl(Number(s.preco))}</div>
                    </div>
                  </button>
                );
              })}
              {servicosSel.length > 0 && (
                <div className="rounded-md bg-muted p-3 text-sm flex justify-between">
                  <span>{servicosSel.length} serviço(s) — {duracaoTotal} min</span>
                  <span className="font-bold">{brl(valorTotal)}</span>
                </div>
              )}
              <Button className="w-full" disabled={servicosSel.length === 0} onClick={() => setStep(2)}>
                Continuar
              </Button>
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
                <div><b>Serviços:</b> {servicosSel.map((s) => s.nome).join(", ")} — {brl(valorTotal)}</div>
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
        </>)}
      </div>
    </div>
  );
}
