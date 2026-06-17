import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { funcionalidades, Funcionalidade } from "@/data/funcionalidades";
import { Check, ArrowLeft, Search, ArrowUpRight, Sparkles, X } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Tudo" },
  { value: "geral", label: "Geral" },
  { value: "dono", label: "Para Donos" },
  { value: "cliente", label: "Para Clientes" },
] as const;

// Padrão bento: alturas/larguras variadas no grid de 6 colunas
const bentoSpan = (i: number) => {
  const patterns = [
    "md:col-span-3 lg:col-span-3 lg:row-span-2", // grande
    "md:col-span-3 lg:col-span-2",
    "md:col-span-2 lg:col-span-1",
    "md:col-span-2 lg:col-span-2",
    "md:col-span-2 lg:col-span-3",
    "md:col-span-3 lg:col-span-2",
    "md:col-span-3 lg:col-span-2",
    "md:col-span-2 lg:col-span-2",
    "md:col-span-2 lg:col-span-2",
  ];
  return patterns[i % patterns.length];
};

const Funcionalidades = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<"all" | "dono" | "cliente" | "geral">("all");
  const navigate = useNavigate();

  const publicFeatures = useMemo(
    () => funcionalidades.filter((f) => f.category !== "admin"),
    []
  );

  const filteredFeatures = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return publicFeatures.filter((feature) => {
      const matchesSearch =
        !term ||
        feature.title.toLowerCase().includes(term) ||
        feature.shortDescription.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === "all" || feature.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publicFeatures, searchTerm, selectedCategory]);

  const feature = selectedFeature
    ? publicFeatures.find((f) => f.id === selectedFeature)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body">
      <Helmet>
        <title>Funcionalidades - Barber Maestro</title>
        <meta
          name="description"
          content="Conheça todas as funcionalidades do Barber Maestro para donos de barbearias e clientes: agenda, pagamentos, fidelidade, relatórios e mais."
        />
        <link rel="canonical" href="https://www.barbermaestro.com/funcionalidades" />
      </Helmet>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Red glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#dc2626]/20 blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto px-4 pt-12 pb-20">
          <Button
            variant="ghost"
            className="mb-8 text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-[#dc2626]/40 bg-[#dc2626]/10 px-3 py-1 mb-6 text-xs uppercase tracking-[0.2em] text-[#dc2626] font-semibold">
              <Sparkles className="h-3 w-3" />
              {publicFeatures.length} funcionalidades
            </div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-6">
              TUDO QUE SUA <br />
              BARBEARIA <br />
              <span className="text-[#dc2626]">PRECISA.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl">
              Da agenda ao financeiro, do cliente ao caixa. Explore cada
              ferramenta criada para profissionalizar seu negócio.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="mt-12 max-w-4xl">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-[#dc2626] transition-colors" />
              <input
                type="text"
                placeholder="Buscar funcionalidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-16 pl-14 pr-14 bg-white/5 border border-white/10 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#dc2626] focus:bg-white/[0.07] transition-all font-body"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-white/40 hover:text-white"
                  aria-label="Limpar busca"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value as any)}
                    className={`px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all border ${
                      active
                        ? "bg-[#dc2626] text-white border-[#dc2626]"
                        : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
              <div className="ml-auto flex items-center text-sm text-white/40 px-3">
                {filteredFeatures.length} resultado
                {filteredFeatures.length !== 1 && "s"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10">
              <p className="font-display text-4xl text-white/40 mb-2">
                NADA POR AQUI
              </p>
              <p className="text-white/50">
                Tente outro termo ou filtro diferente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 auto-rows-[220px] gap-4">
              {filteredFeatures.map((f, i) => {
                const Icon = f.icon;
                const isLarge = i % 9 === 0;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFeature(f.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`group relative overflow-hidden text-left p-6 lg:p-7 bg-[#111] border border-white/10 hover:border-[#dc2626] transition-all duration-300 ${bentoSpan(
                      i
                    )}`}
                  >
                    {/* Hover red glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/0 via-transparent to-[#dc2626]/0 group-hover:from-[#dc2626]/10 group-hover:to-[#dc2626]/0 transition-all duration-500" />

                    {/* Number watermark */}
                    <span className="absolute top-4 right-5 font-display text-2xl text-white/10 group-hover:text-[#dc2626]/40 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative h-full flex flex-col">
                      <div
                        className={`flex items-center justify-center bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#dc2626] mb-5 ${
                          isLarge ? "h-16 w-16" : "h-12 w-12"
                        }`}
                      >
                        <Icon className={isLarge ? "h-8 w-8" : "h-6 w-6"} />
                      </div>

                      <h3
                        className={`font-display tracking-wide uppercase text-white leading-tight mb-3 ${
                          isLarge ? "text-4xl lg:text-5xl" : "text-2xl"
                        }`}
                      >
                        {f.title}
                      </h3>

                      <p
                        className={`text-white/60 leading-relaxed line-clamp-3 ${
                          isLarge ? "text-base" : "text-sm"
                        }`}
                      >
                        {f.shortDescription}
                      </p>

                      <div className="mt-auto pt-5 flex items-center gap-2 text-[#dc2626] text-sm font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                        Ver detalhes
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Modal */}
      <Dialog
        open={!!selectedFeature}
        onOpenChange={(open) => !open && setSelectedFeature(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/10 text-white">
          {feature && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 p-3">
                    <feature.icon className="h-8 w-8 text-[#dc2626]" />
                  </div>
                  <DialogTitle className="font-display text-3xl uppercase tracking-wide text-white">
                    {feature.title}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base text-white/60">
                  {feature.fullDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <h4 className="font-display text-xl uppercase tracking-wide mb-3 text-white">
                  Principais Recursos
                </h4>
                <ul className="space-y-2">
                  {feature.features.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-white/70"
                    >
                      <Check className="h-5 w-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/5"
                  onClick={() => setSelectedFeature(null)}
                >
                  Fechar
                </Button>
                {feature.route && (
                  <Button
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                    onClick={() => {
                      navigate(feature.route!);
                      setSelectedFeature(null);
                    }}
                  >
                    Acessar Funcionalidade
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Funcionalidades;
