import { Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Plataforma Completa",
    text: "O Barber Maestro é uma plataforma completa de gestão desenvolvida especialmente para barbearias modernas que desejam otimizar processos, aumentar a produtividade e proporcionar uma experiência diferenciada aos seus clientes.",
  },
  {
    title: "Foco no Dia a Dia",
    text: "Criado para atender as necessidades reais do dia a dia de barbeiros e gestores, o sistema reúne em um único lugar todas as ferramentas necessárias para administrar o negócio com eficiência.",
  },
  {
    title: "Simplifique para Crescer",
    text: "Nosso objetivo é simplificar a gestão da sua barbearia para que você possa dedicar mais tempo ao que realmente importa: oferecer atendimento de excelência e fazer seu negócio crescer.",
  },
  {
    title: "Tecnologia & Escalabilidade",
    text: "Combinamos tecnologia, praticidade e inteligência para transformar a forma como as barbearias administram suas operações. Do autônomo à rede com múltiplas unidades.",
  },
  {
    title: "Parceiro Estratégico",
    text: "Mais do que um sistema de gestão, somos um parceiro estratégico para impulsionar resultados, organizar processos e elevar o nível de profissionalismo do seu estabelecimento.",
  },
];

const About = () => {
  return (
    <section
      id="sobre"
      className="relative bg-[#0a0a0a] text-white font-body scroll-mt-24 overflow-hidden py-24 md:py-32 border-b border-white/10"
    >
      {/* Texto gigante decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap opacity-[0.04]">
        <span className="font-display text-[22vw] leading-none uppercase tracking-tighter">
          MAESTRO
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Coluna esquerda */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 border border-[#dc2626]/40 bg-[#dc2626]/10 px-3 py-1 mb-6 text-xs uppercase tracking-[0.2em] text-[#dc2626] font-semibold">
              <Sparkles className="h-3 w-3" />
              Sobre nós
            </div>
            <h2 className="font-display text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-8">
              Mais que <br />
              um sistema. <br />
              <span className="text-[#dc2626]">Um aliado.</span>
            </h2>
            <div className="w-24 h-1 bg-[#dc2626] mb-8" />
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Nascemos da necessidade de elevar o nível da gestão em barbearias,
              unindo tecnologia de ponta com a realidade do dia a dia do
              barbeiro.
            </p>
          </div>

          {/* Coluna direita — lista numerada */}
          <div className="lg:col-span-7 space-y-1">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group relative p-6 md:p-8 transition-all duration-300 border-l-2 border-white/10 hover:border-[#dc2626] hover:bg-white/[0.02]"
              >
                <div className="flex items-start gap-5 md:gap-6">
                  <span className="font-display text-3xl md:text-4xl text-[#dc2626] tabular-nums leading-none pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm md:text-base">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
