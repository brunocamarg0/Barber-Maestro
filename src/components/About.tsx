const highlights = [
  {
    title: "Plataforma Completa",
    text: "O Barber Maestro é uma plataforma completa de gestão desenvolvida especialmente para barbearias modernas que desejam otimizar processos, aumentar a produtividade e proporcionar uma experiência diferenciada aos seus clientes.",
  },
  {
    title: "Foco no Dia a Dia",
    text: "Criado para atender as necessidades reais do dia a dia de barbeiros e gestores, o sistema reúne em um único lugar todas as ferramentas necessárias para administrar o negócio com eficiência. Com ele, é possível gerenciar agendamentos, clientes, serviços, profissionais, pagamentos, comissões, estoque, relatórios financeiros e muito mais.",
  },
  {
    title: "Simplifique para Crescer",
    text: "Nosso objetivo é simplificar a gestão da sua barbearia para que você possa dedicar mais tempo ao que realmente importa: oferecer um atendimento de excelência e fazer seu negócio crescer.",
  },
  {
    title: "Tecnologia & Escalabilidade",
    text: "O Barber Maestro combina tecnologia, praticidade e inteligência para transformar a forma como as barbearias administram suas operações. Seja você um profissional autônomo, uma barbearia em crescimento ou uma rede com múltiplas unidades, nossa plataforma foi desenvolvida para acompanhar a evolução do seu negócio.",
  },
  {
    title: "Parceiro Estratégico",
    text: "Mais do que um sistema de gestão, o Barber Maestro é um parceiro estratégico para impulsionar resultados, organizar processos e elevar o nível de profissionalismo do seu estabelecimento.",
  },
];

const About = () => {
  return (
    <section
      id="sobre"
      className="relative bg-background scroll-mt-24 overflow-hidden py-20 md:py-28 px-6 md:px-12 lg:px-16"
    >
      {/* Texto gigante decorativo ao fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap opacity-[0.03]">
        <span className="text-[22vw] leading-none uppercase font-black text-foreground tracking-tighter">
          MAESTRO
        </span>
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Coluna esquerda — declaração de marca */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="inline-block px-4 py-1.5 border border-primary/30 bg-primary/10 rounded-full mb-6">
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                Conheça a Barber Maestro
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-foreground mb-8">
              Sobre o{" "}
              <span className="text-primary drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                Barber
              </span>
              <br />
              Maestro
            </h2>
            <div className="w-24 h-1.5 bg-primary mb-8" />
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md font-medium">
              Nascemos da necessidade de elevar o nível da gestão em barbearias,
              unindo tecnologia de ponta com a realidade do dia a dia do barbeiro.
            </p>
          </div>

          {/* Coluna direita — lista narrativa numerada */}
          <div className="lg:col-span-7 space-y-1">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group relative p-6 md:p-8 lg:p-10 transition-all duration-300 border-l-2 border-border hover:border-primary hover:bg-foreground/[0.02]"
              >
                <div className="flex items-start gap-5 md:gap-6">
                  <span className="text-primary font-black text-xl md:text-2xl py-1 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-black text-foreground mb-3 uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
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
