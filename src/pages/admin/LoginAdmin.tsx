import { traduzirErro } from "@/lib/traduzirErro";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Shield, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

export default function LoginAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", senha: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha,
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Falha ao autenticar.");

      // Verifica papel super_admin
      const { data: isAdmin, error: rpcErr } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "super_admin",
      });
      if (rpcErr) throw new Error(rpcErr.message);
      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Acesso restrito a administradores.");
      }

      toast.success("Login admin realizado com sucesso!");
      setTimeout(() => navigate("/admin", { replace: true }), 300);
    } catch (error: any) {
      toast.error(traduzirErro(error.message) || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-[#dc2626]/20 blur-[140px]" />

      <div className="relative w-full max-w-md">
        {/* Corner accents */}
        <div className="absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-[#dc2626]" />
        <div className="absolute -top-2 -right-2 h-6 w-6 border-t-2 border-r-2 border-[#dc2626]" />
        <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-[#dc2626]" />
        <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-[#dc2626]" />

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="bg-[#dc2626] p-2 rounded-sm shadow-[0_0_24px_rgba(220,38,38,0.5)]">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-display tracking-[0.2em] text-white uppercase">
              Barber Maestro
            </span>
          </Link>
        </div>

        <Card className="border-white/10 bg-black/40 backdrop-blur-sm rounded-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#dc2626]" />
              <CardTitle className="text-white font-display uppercase tracking-[0.15em] text-xl">
                Acesso Administrativo
              </CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Área restrita para administradores do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white/80 uppercase text-xs tracking-wider font-bold">
                  Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="bg-white text-black border-white/20 focus:border-[#dc2626] focus:ring-[#dc2626] rounded-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-white/80 uppercase text-xs tracking-wider font-bold">
                  Senha
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="bg-white text-black border-white/20 focus:border-[#dc2626] focus:ring-[#dc2626] rounded-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-display tracking-[0.15em] uppercase rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar como Administrador"
                )}
              </Button>
              <p className="text-center text-sm text-white/60">
                <Link to="/login" className="text-[#dc2626] hover:text-[#ef4444] underline-offset-4 hover:underline transition-colors">
                  Voltar para login normal
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
