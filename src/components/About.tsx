import { Scissors, Target, Zap, TrendingUp, Award } from "lucide-react";

const highlights = [
  {
    icon: Scissors,
    title: "Plataforma Completa",
    text: "O Barber Maestro é uma plataforma completa de gestão desenvolvida especialmente para barbearias modernas que desejam otimizar processos, aumentar a produtividade e proporcionar uma experiência diferenciada aos seus clientes.",
  },
  {
    icon: Target,
    title: "Foco no Dia a Dia",
    text: "Criado para atender as necessidades reais do dia a dia de barbeiros e gestores, o sistema reúne em um único lugar todas as ferramentas necessárias para administrar o negócio com eficiência. Com ele, é possível gerenciar agendamentos, clientes, serviços, profissionais, pagamentos, comissões, estoque, relatórios financeiros e muito mais.",
  },
  {
    icon: Zap,
    title: "Simplifique para Crescer",
    text: "Nosso objetivo é simplificar a gestão da sua barbearia para que você possa dedicar mais tempo ao que realmente importa: oferecer um atendimento de excelência e fazer seu negócio crescer.",
  },
  {
    icon: TrendingUp,
    title: "Tecnologia & Escalabilidade",
    text: "O Barber Maestro combina tecnologia, praticidade e inteligência para transformar a forma como as barbearias administram suas operações. Seja você um profissional autônomo, uma barbearia em crescimento ou uma rede com múltiplas unidades, nossa plataforma foi desenvolvida para acompanhar a evolução do seu negócio.",
  },
  {
    icon: Award,
    title: "Parceiro Estratégico",
    text: "Mais do que um sistema de gestão, o Barber Maestro é um parceiro estratégico para impulsionar resultados, organizar processos e elevar o nível de profissionalismo do seu estabelecimento.",
  },
];

const About = () => {
  return (
    <section id="sobre" className="relative py-24 bg-background scroll-mt-24 overflow-hidden border-y border-border">
      {/* Glow decorativo ao fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-bold mb-4 block">
            Conheça a Barber Maestro
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase">
            Sobre o{" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              Barber Maestro
            </span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
            <div className="w-2 h-2 bg-primary rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-card/70 backdrop-blur-sm border-2 border-border hover:border-primary transition-all duration-300 p-6 md:p-8 flex flex-col"
              >
                <div className="mb-5">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-foreground font-black uppercase text-lg mb-3 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-base flex-1">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
