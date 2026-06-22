import { traduzirErro } from "@/lib/traduzirErro";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, MailCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EsqueciSenha = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailEnviado, setEmailEnviado] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") || "cliente";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isLocalhost =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const baseUrl = isLocalhost ? window.location.origin : "https://www.barbermaestro.com";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${baseUrl}/reset-password`,
      });

      if (error) throw error;

      toast.success("Se o email estiver cadastrado, você receberá um link para redefinir sua senha.");
      setEmailEnviado(true);
    } catch (error: any) {
      console.error("[ESQUECI SENHA] erro:", error);
      toast.error(traduzirErro(error.message) || "Erro ao solicitar recuperação de senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden"
      id="esqueci-senha-page"
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
            Recuperar acesso
          </p>
        </div>

        <div className="relative border border-white/10 bg-black/40 backdrop-blur-sm p-8">
          {/* Corner accents */}
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#dc2626]" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[#dc2626]" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[#dc2626]" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#dc2626]" />

          {emailEnviado ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 p-4">
                  <MailCheck className="h-8 w-8 text-[#dc2626]" />
                </div>
                <h2 className="text-3xl font-display tracking-wide uppercase text-white">
                  Email enviado
                </h2>
                <p className="text-sm text-white/60 font-body">
                  Se <strong className="text-white">{email}</strong> estiver cadastrado, você
                  receberá um link para redefinir sua senha.
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-body">
                  Verifique também a caixa de spam
                </p>
              </div>
              <Button
                onClick={() => navigate(tipo === "dono" ? "/login?tab=owner" : "/login?tab=client")}
                className="w-full h-12 rounded-none bg-[#dc2626] hover:bg-[#b91c1c] text-white font-display tracking-[0.15em] text-lg uppercase shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all"
              >
                Voltar para Login
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-display tracking-wide uppercase text-white">
                  Esqueci minha senha
                </h2>
                <p className="text-sm text-white/50 font-body mt-1">
                  Digite seu email para receber o link de redefinição
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs uppercase tracking-[0.2em] text-white/60 font-body"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-none bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-[#dc2626] transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-none bg-[#dc2626] hover:bg-[#b91c1c] text-white font-display tracking-[0.15em] text-lg uppercase shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all"
                >
                  {isLoading ? "Enviando..." : "Enviar link"}
                </Button>
                <p className="text-center text-xs uppercase tracking-[0.15em] text-white/40 font-body pt-2">
                  Lembrou sua senha?{" "}
                  <Link
                    to={`/login?tab=${tipo === "dono" ? "owner" : "client"}`}
                    className="text-[#dc2626] hover:text-white transition-colors"
                  >
                    Fazer login
                  </Link>
                </p>
              </form>
            </>
          )}
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

export default EsqueciSenha;
