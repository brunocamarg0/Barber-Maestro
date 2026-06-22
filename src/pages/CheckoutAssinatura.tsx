import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck, Loader2, CheckCircle2, Scissors } from "lucide-react";
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
      <div className="min-h-screen bg-[#0a0a0a] text-white font-body flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#dc2626]/20 blur-[140px]" />
        <div className="relative max-w-md w-full border border-white/10 bg-black/40 backdrop-blur-sm p-8">
          <h1 className="font-display text-4xl uppercase tracking-wider mb-3">Plano Enterprise</h1>
          <p className="text-white/60 mb-6">
            Valor personalizado conforme a operação. Fale com nosso time comercial para fechar sua assinatura.
          </p>
          <Button asChild className="w-full rounded-none bg-[#dc2626] hover:bg-[#b91c1c] uppercase tracking-wider">
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      {/* Red glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[#dc2626]/15 blur-[160px] pointer-events-none" />

      <div className="relative container max-w-5xl mx-auto py-16 px-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-8 text-white/70 hover:text-white hover:bg-white/5 rounded-none uppercase tracking-wider text-xs"
        >
          <Link to="/#planos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos planos
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 bg-[#dc2626] flex items-center justify-center">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#dc2626] font-semibold">Checkout</div>
            <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider leading-none">
              Finalizar assinatura
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Form */}
          <div className="md:col-span-3 relative border border-white/10 bg-black/40 backdrop-blur-sm p-8">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#dc2626]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#dc2626]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#dc2626]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#dc2626]" />

            <h2 className="font-display text-2xl uppercase tracking-wider mb-2">
              Plano {plano.nome}
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Pagamento processado pelo <span className="text-white font-semibold">Mercado Pago</span> com PIX, cartão ou boleto. Você só é cobrado após confirmar.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-xs uppercase tracking-wider text-white/70">
                  Nome do responsável *
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="rounded-none bg-white text-black border-white/10 focus-visible:ring-0 focus-visible:border-[#dc2626] h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-white/70">
                  E-mail para recibo *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none bg-white text-black border-white/10 focus-visible:ring-0 focus-visible:border-[#dc2626] h-11"
                />
                <p className="text-xs text-white/40">
                  Enviaremos o comprovante e instruções para este e-mail.
                </p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-none bg-[#dc2626] hover:bg-[#b91c1c] text-white uppercase tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>Ir para o pagamento seguro</>
                )}
              </Button>
              <p className="text-xs text-center text-white/40 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#dc2626]" />
                Protegido pelo Mercado Pago. Sem fidelidade, cancele quando quiser.
              </p>
            </form>
          </div>

          {/* Summary */}
          <div className="md:col-span-2 relative border border-[#dc2626]/40 bg-[#111] p-8 shadow-[0_0_40px_rgba(220,38,38,0.15)]">
            <div className="text-xs uppercase tracking-[0.25em] text-[#dc2626] font-semibold mb-2">
              Resumo
            </div>
            <h3 className="font-display text-3xl uppercase tracking-wider mb-2">{plano.nome}</h3>
            <p className="text-white/50 text-sm mb-6">{plano.descricao}</p>

            <div className="h-px bg-white/10 mb-6" />

            <div className="mb-6">
              <div className="font-display text-5xl text-[#dc2626] leading-none">
                R$ {plano.valor.toFixed(2).replace(".", ",")}
              </div>
              <div className="text-white/40 text-xs uppercase tracking-wider mt-1">por mês</div>
            </div>

            <ul className="space-y-3 text-sm">
              {plano.beneficios.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5 h-4 w-4 flex items-center justify-center bg-[#dc2626]/10 border border-[#dc2626]/40">
                    <CheckCircle2 className="h-3 w-3 text-[#dc2626]" />
                  </div>
                  <span className="text-white/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
