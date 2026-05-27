import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PLANOS: Record<string, { nome: string; valor: number; descricao: string; beneficios: string[] }> = {
  basico: {
    nome: "Básico",
    valor: 97,
    descricao: "Ideal para barbearias começando a digitalizar a gestão.",
    beneficios: [
      "Agendamentos online ilimitados",
      "Até 2 profissionais",
      "Painel financeiro essencial",
      "Suporte por e-mail",
    ],
  },
  profissional: {
    nome: "Profissional",
    valor: 197,
    descricao: "Para barbearias em crescimento, com equipe e operação completa.",
    beneficios: [
      "Tudo do plano Básico",
      "Profissionais ilimitados",
      "Pagamentos via Mercado Pago",
      "Programa de fidelidade e promoções",
      "Suporte prioritário",
    ],
  },
  professional: {
    nome: "Profissional",
    valor: 197,
    descricao: "Para barbearias em crescimento, com equipe e operação completa.",
    beneficios: [
      "Tudo do plano Básico",
      "Profissionais ilimitados",
      "Pagamentos via Mercado Pago",
      "Programa de fidelidade e promoções",
      "Suporte prioritário",
    ],
  },
  enterprise: { nome: "Enterprise", valor: 0, descricao: "Plano sob medida.", beneficios: [] },
};

export default function CheckoutAssinatura() {
  const [searchParams] = useSearchParams();
  const planoParam = (searchParams.get("plano") || "basico").toLowerCase().replace(/\s/g, "_");
  const planoKey = PLANOS[planoParam] ? planoParam : "basico";
  const plano = PLANOS[planoKey];

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) {
      toast.error("Preencha seu nome e e-mail para continuar.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("mercadopago-assinatura-checkout", {
        body: { plano: planoKey, nome: nome.trim(), email: email.trim() },
      });

      let serverMsg: string | null = (data as any)?.error ?? null;
      let serverDet: string | null = (data as any)?.detalhes ?? null;
      if ((error || !data?.initPoint) && error) {
        try {
          const ctx: any = (error as any).context;
          if (ctx?.json) {
            const body = await ctx.json().catch(() => null);
            serverMsg = body?.error || serverMsg;
            serverDet = body?.detalhes || serverDet;
          } else if (ctx?.text) {
            const t = await ctx.text().catch(() => "");
            try {
              const b = JSON.parse(t);
              serverMsg = b?.error || serverMsg;
              serverDet = b?.detalhes || serverDet;
            } catch { serverMsg = serverMsg || t; }
          }
        } catch {/* ignore */}
      }

      if (error || (data as any)?.error || !data?.initPoint) {
        toast.error(serverMsg || "Não foi possível iniciar o pagamento.", {
          description: serverDet || "Tente novamente em instantes.",
        });
        setLoading(false);
        return;
      }

      toast.success("Redirecionando para o Mercado Pago...");
      window.location.href = data.initPoint;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao iniciar o pagamento", {
        description: err instanceof Error ? err.message : "Verifique sua conexão e tente novamente.",
      });
      setLoading(false);
    }
  };

  if (plano.valor === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-md mx-auto py-32 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano Enterprise</CardTitle>
              <CardDescription>
                Valor personalizado conforme a operação. Fale com nosso time comercial para fechar sua assinatura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/">Voltar ao início</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl mx-auto py-24 px-4">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/#planos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos planos
          </Link>
        </Button>

        <div className="grid md:grid-cols-5 gap-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-2xl font-black uppercase">
                Finalizar assinatura – Plano {plano.nome}
              </CardTitle>
              <CardDescription>
                Pagamento processado pelo <strong>Mercado Pago</strong> com PIX, cartão de crédito ou boleto.
                Você só é cobrado após confirmar o pagamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do responsável *</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Ex: João da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail para recibo *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enviaremos o comprovante e instruções para este e-mail.
                  </p>
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>Ir para o pagamento seguro</>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Ambiente protegido pelo Mercado Pago. Sem fidelidade, cancele quando quiser.
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="uppercase font-black">{plano.nome}</CardTitle>
              <CardDescription>{plano.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-4xl font-black text-primary">
                  R$ {plano.valor.toFixed(2).replace(".", ",")}
                </div>
                <div className="text-sm text-muted-foreground">por mês</div>
              </div>
              <ul className="space-y-2 text-sm">
                {plano.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
