import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { funcionalidades } from "@/data/funcionalidades";
import { Check, ArrowUpRight, Sparkles, ArrowRight } from "lucide-react";

const bentoSpan = (i: number) => {
  const patterns = [
    "md:col-span-3 lg:col-span-3 lg:row-span-2",
    "md:col-span-3 lg:col-span-2",
    "md:col-span-2 lg:col-span-1",
    "md:col-span-3 lg:col-span-2",
    "md:col-span-3 lg:col-span-2",
    "md:col-span-2 lg:col-span-1",
  ];
  return patterns[i % patterns.length];
};

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const publicFeatures = funcionalidades.filter((f) => f.category !== "admin");
  const mainFeatures = publicFeatures.slice(0, 6);

  const feature = selectedFeature
    ? publicFeatures.find((f) => f.id === selectedFeature)
    : null;

  return (
    <>
      <section
        id="funcionalidades"
        className="relative py-24 lg:py-32 bg-[#0a0a0a] text-white font-body overflow-hidden border-b border-white/10"
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mb-16">
            <div className="inline-flex items-center gap-2 border border-[#dc2626]/40 bg-[#dc2626]/10 px-3 py-1 mb-6 text-xs uppercase tracking-[0.2em] text-[#dc2626] font-semibold">
              <Sparkles className="h-3 w-3" />
              Funcionalidades
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-6">
              Tudo num <br />
              <span className="text-[#dc2626]">só lugar.</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl">
              Ferramentas modernas para barbeiros modernos. Da agenda ao
              financeiro, tudo conectado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[220px] gap-4">
            {mainFeatures.map((f, i) => {
              const Icon = f.icon;
              const isLarge = i === 0;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeature(f.id)}
                  className={`group relative overflow-hidden text-left p-6 lg:p-7 bg-[#111] border border-white/10 hover:border-[#dc2626] transition-all duration-300 ${bentoSpan(
                    i
                  )}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/0 via-transparent to-[#dc2626]/0 group-hover:from-[#dc2626]/10 transition-all duration-500" />

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
                      className={`font-display tracking-wide uppercase leading-tight mb-3 ${
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

          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              asChild
              className="px-10 py-7 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold uppercase tracking-wider text-sm rounded-none hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all"
            >
              <Link to="/funcionalidades">
                Ver Todas as Funcionalidades
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
                <h4 className="font-display text-xl uppercase tracking-wide mb-3">
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
                  className="border-white/20 bg-transparent text-white hover:bg-white/5 rounded-none"
                  onClick={() => setSelectedFeature(null)}
                >
                  Fechar
                </Button>
                {feature.route && (
                  <Button
                    asChild
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-none"
                  >
                    <Link
                      to={feature.route}
                      onClick={() => setSelectedFeature(null)}
                    >
                      Acessar Funcionalidade
                    </Link>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Features;
