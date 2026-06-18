import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-modern-barber.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-white font-body">
      {/* Foto cinematográfica */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.25) contrast(1.1) saturate(0.6)",
        }}
      />
      {/* Vinheta vermelha */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#dc2626]/20 via-[#0a0a0a]/60 to-[#0a0a0a]" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow vermelho */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 z-10 h-[600px] w-[900px] rounded-full bg-[#dc2626]/25 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 py-24 sm:py-32 relative z-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 border border-[#dc2626]/40 bg-[#dc2626]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#dc2626] font-semibold">
            <Sparkles className="h-3 w-3" />
            Sistema profissional para barbearias
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.88] tracking-tight uppercase">
            Gestão pro <br />
            para sua <br />
            <span className="text-[#dc2626]">barbearia.</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-medium">
            Agendamento online, controle financeiro e gestão completa. Tudo que
            sua barbearia precisa em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6">
            <Button
              size="lg"
              asChild
              className="px-10 py-7 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold uppercase tracking-wider text-sm border border-[#dc2626] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all rounded-none"
            >
              <Link to="/cadastro">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="px-10 py-7 bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5 font-semibold uppercase tracking-wider text-sm rounded-none"
              onClick={() => {
                const el = document.getElementById("planos");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Ver Planos
            </Button>
          </div>

          <div className="pt-16 flex justify-center">
            <button
              onClick={() => {
                const el = document.getElementById("sobre");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-[#dc2626] transition-colors text-xs uppercase tracking-[0.3em] font-semibold"
            >
              Explorar
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
