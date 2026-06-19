import { traduzirErro } from "@/lib/traduzirErro";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";


const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{ portal: "owner" | "client"; userId: string } | null>(null);
  const { user, roles, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const redirectUrl = searchParams.get('redirect');
  const getInitialTab = () => {
    if (tabFromUrl === 'client') return 'client';
    if (tabFromUrl === 'owner') return 'owner';
    if (redirectUrl && redirectUrl.startsWith('/cliente')) return 'client';
    if (redirectUrl && redirectUrl.startsWith('/dono')) return 'owner';
    return 'owner';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  const [formData, setFormData] = useState({
    owner: { email: "", senha: "" },
    client: { email: "", senha: "" },
  });

  useEffect(() => {
    if (!pendingLogin || authLoading || !user) return;
    if (user.id !== pendingLogin.userId) return;

    const roleSet = new Set(roles);
    const expectedRole = pendingLogin.portal === "owner" ? "owner" : "client";

    if (roleSet.has(expectedRole)) {
      toast.success("Login realizado com sucesso!");
      const defaultDest = pendingLogin.portal === "owner" ? "/dono" : "/cliente";
      navigate(redirectUrl || defaultDest, { replace: true });
      setPendingLogin(null);
      setIsLoading(false);
      return;
    }

    if (roleSet.has("super_admin") && roleSet.size === 1) {
      toast.success("Login realizado com sucesso!");
      navigate("/super-admin", { replace: true });
      setPendingLogin(null);
      setIsLoading(false);
      return;
    }

    const rejectAccess = async () => {
      await signOut();
      toast.error(
        pendingLogin.portal === "owner"
          ? "Esta conta não tem acesso ao Portal do Dono."
          : "Esta conta não tem acesso ao Portal do Cliente."
      );
      setPendingLogin(null);
      setIsLoading(false);
    };

    void rejectAccess();
  }, [pendingLogin, authLoading, user, roles, navigate, signOut, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentTab = activeTab as 'owner' | 'client';
    const { email, senha } = formData[currentTab];

    setIsLoading(true);
    let shouldKeepLoading = false;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error || !data.user) {
        throw new Error(traduzirErro(error?.message) === 'Invalid login credentials'
          ? 'Email ou senha incorretos.'
          : (traduzirErro(error?.message) || 'Erro ao fazer login.'));
      }

      shouldKeepLoading = true;
      setPendingLogin({ portal: currentTab, userId: data.user.id });
    } catch (err: any) {
      console.error('[LOGIN] erro:', err);
      toast.error(traduzirErro(err.message) || 'Erro ao fazer login.');
    } finally {
      if (!shouldKeepLoading) {
        setIsLoading(false);
      }
    }
  };

  const renderForm = (portal: 'owner' | 'client') => {
    const data = formData[portal];
    const setField = (field: 'email' | 'senha', value: string) =>
      setFormData({ ...formData, [portal]: { ...data, [field]: value } });
    const tipoSenha = portal === 'owner' ? 'dono' : 'cliente';

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor={`${portal}-email`} className="text-xs uppercase tracking-[0.2em] text-white/60 font-body">Email</Label>
          <Input
            id={`${portal}-email`}
            type="email"
            placeholder="seu@email.com"
            value={data.email}
            onChange={(e) => setField('email', e.target.value)}
            required
            className="h-12 rounded-none bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-[#dc2626] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${portal}-password`} className="text-xs uppercase tracking-[0.2em] text-white/60 font-body">Senha</Label>
          <Input
            id={`${portal}-password`}
            type="password"
            placeholder="••••••••"
            value={data.senha}
            onChange={(e) => setField('senha', e.target.value)}
            required
            className="h-12 rounded-none bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-[#dc2626] transition-colors"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-none bg-[#dc2626] hover:bg-[#b91c1c] text-white font-display tracking-[0.15em] text-lg uppercase shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        <div className="space-y-2 pt-2">
          <p className="text-center text-xs uppercase tracking-[0.15em] text-white/40 font-body">
            <Link to={`/esqueci-senha?tipo=${tipoSenha}`} className="hover:text-[#dc2626] transition-colors">
              Esqueci minha senha
            </Link>
          </p>
          <p className="text-center text-xs uppercase tracking-[0.15em] text-white/40 font-body">
            Não tem conta?{" "}
            <Link to={`/cadastro?tipo=${tipoSenha}`} className="text-[#dc2626] hover:text-white transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden"
      id="login-page"
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#dc2626]/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-2 group">
            <div className="bg-[#dc2626] p-3 shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-shadow">
              <Scissors className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl text-white font-display tracking-[0.05em] uppercase">Barber Maestro</span>
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-body mt-3">Acesse sua conta</p>
        </div>

        <div className="relative border border-white/10 bg-black/40 backdrop-blur-sm">
          {/* Corner accents */}
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#dc2626]" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[#dc2626]" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[#dc2626]" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#dc2626]" />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-transparent border-b border-white/10 h-auto p-0">
              <TabsTrigger
                value="owner"
                className="rounded-none h-14 font-display tracking-[0.15em] uppercase text-base text-white/50 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#dc2626] transition-colors"
              >
                Dono
              </TabsTrigger>
              <TabsTrigger
                value="client"
                className="rounded-none h-14 font-display tracking-[0.15em] uppercase text-base text-white/50 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#dc2626] transition-colors"
              >
                Cliente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="owner" className="p-8 mt-0">
              <div className="mb-6">
                <h2 className="text-3xl font-display tracking-wide uppercase text-white">Portal do Dono</h2>
                <p className="text-sm text-white/50 font-body mt-1">Painel de gestão da sua barbearia</p>
              </div>
              {renderForm('owner')}
            </TabsContent>

            <TabsContent value="client" className="p-8 mt-0">
              <div className="mb-6">
                <h2 className="text-3xl font-display tracking-wide uppercase text-white">Portal do Cliente</h2>
                <p className="text-sm text-white/50 font-body mt-1">Faça login para agendar serviços</p>
              </div>
              {renderForm('client')}
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs uppercase tracking-[0.25em] text-white/40 mt-8 font-body">
          <Link to="/" className="hover:text-[#dc2626] transition-colors">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
