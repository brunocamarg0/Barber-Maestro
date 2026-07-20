import { traduzirErro } from "@/lib/traduzirErro";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha redefinida com sucesso!");
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err: any) {
      toast.error(traduzirErro(err.message) || "Erro ao redefinir senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden"
      id="reset-password-page"
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
            <span className="text-3xl text-white font-display tracking-[0.05em] uppercase">
              Barber Maestro
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-body mt-3">
            Nova senha
          </p>
        </div>

        <div className="relative border border-white/10 bg-black/40 backdrop-blur-sm p-8">
          {/* Corner accents */}
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#dc2626]" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[#dc2626]" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[#dc2626]" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#dc2626]" />

          <div className="mb-6 flex items-start gap-3">
            <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 p-2.5 shrink-0">
              <KeyRound className="h-5 w-5 text-[#dc2626]" />
            </div>
            <div>
              <h2 className="text-3xl font-display tracking-wide uppercase text-white leading-tight">
                Redefinir senha
              </h2>
              <p className="text-sm text-white/50 font-body mt-1">
                Crie uma nova senha para sua conta
              </p>
            </div>
          </div>

          {!ready ? (
            <p className="text-sm text-white/50 text-center py-6 uppercase tracking-[0.2em] font-body">
              Verificando link de recuperação...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="senha"
                  className="text-xs uppercase tracking-[0.2em] text-white/60 font-body"
                >
                  Nova senha
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  className="h-12 rounded-none bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-[#dc2626] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm"
                  className="text-xs uppercase tracking-[0.2em] text-white/60 font-body"
                >
                  Confirmar senha
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={6}
                  required
                  className="h-12 rounded-none bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-[#dc2626] transition-colors"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-none bg-[#dc2626] hover:bg-[#b91c1c] text-white font-display tracking-[0.15em] text-lg uppercase shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all"
              >
                {isLoading ? "Salvando..." : "Redefinir senha"}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs uppercase tracking-[0.25em] text-white/40 mt-8 font-body">
          <Link to="/login" className="hover:text-[#dc2626] transition-colors">
            ← Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
