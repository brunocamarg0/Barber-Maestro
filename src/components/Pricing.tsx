import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Básico",
    slug: "basico",
    price: "R$ 99,90",
    description: "Ideal para barbearias iniciantes",
    features: [
      "1 profissional incluso",
      "+ R$ 20/mês por profissional adicional",
      "Agendamentos ilimitados",
      "Agendamento online",
      "Notificações por email",
      "Suporte por email",
    ],
  },
  {
    name: "Profissional",
    slug: "profissional",
    price: "R$ 197",
    description: "Perfeito para barbearias em crescimento",
    features: [
      "Agendamentos ilimitados",
      "Até 5 barbeiros",
      "Agendamento online",
      "Notificações SMS e WhatsApp",
      "Relatórios avançados",
      "Suporte prioritário",
      "App personalizado",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    price: "Sob consulta",
    description: "Para redes de barbearias",
    features: [
      "Tudo do Profissional",
      "Barbeiros ilimitados",
      "Múltiplas unidades",
      "API personalizada",
      "Gerente de conta dedicado",
      "Treinamento personalizado",
    ],
  },
];

const Pricing = () => {
  return (
    <section
      id="planos"
      className="relative py-24 lg:py-32 bg-[#0a0a0a] text-white font-body overflow-hidden border-b border-white/10"
    >
      {/* Glow vermelho central */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#dc2626]/15 blur-[140px] pointer-events-none" />

      <div className="container relative mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 border border-[#dc2626]/40 bg-[#dc2626]/10 px-3 py-1 mb-6 text-xs uppercase tracking-[0.2em] text-[#dc2626] font-semibold">
            <Sparkles className="h-3 w-3" />
            Planos
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-6">
            Sem <span className="text-[#dc2626]">enrolação.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60">
            Preço justo para o que você precisa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 lg:p-10 bg-[#111] border transition-all duration-300 ${
                plan.popular
                  ? "border-[#dc2626] shadow-[0_0_60px_rgba(220,38,38,0.25)] md:scale-[1.03]"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#dc2626] text-white px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em]">
                  Mais Popular
                </div>
              )}

              <span className="absolute top-5 right-6 font-display text-2xl text-white/10">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-display text-4xl uppercase tracking-wide mb-2">
                {plan.name}
              </h3>
              <p className="text-white/50 text-sm mb-6">{plan.description}</p>

              <div className="font-display text-6xl text-[#dc2626] leading-none mb-1">
                {plan.price}
              </div>
              {plan.price !== "Sob consulta" && (
                <div className="text-white/40 text-sm uppercase tracking-wider mb-8">
                  por mês
                </div>
              )}
              {plan.price === "Sob consulta" && <div className="mb-8" />}

              <div className="h-px bg-white/10 mb-6" />

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 h-5 w-5 flex items-center justify-center bg-[#dc2626]/10 border border-[#dc2626]/30">
                      <Check className="h-3 w-3 text-[#dc2626] stroke-[3]" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full py-6 uppercase tracking-wider text-sm font-semibold rounded-none transition-all ${
                  plan.popular
                    ? "bg-[#dc2626] hover:bg-[#b91c1c] text-white hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                    : "bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/50"
                }`}
              >
                {plan.price === "Sob consulta" ? (
                  <Link to="/login">
                    Falar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link to={`/cadastro?tipo=dono&plano=${plan.slug}`}>
                    Assinar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
