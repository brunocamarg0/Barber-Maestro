import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Check } from "lucide-react";

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Filtrar funcionalidades que não são de admin e pegar as primeiras 6 principais
  const publicFeatures = funcionalidades.filter(f => f.category !== 'admin');
  const mainFeatures = publicFeatures.slice(0, 6);

  const feature = selectedFeature 
    ? publicFeatures.find(f => f.id === selectedFeature)
    : null;

  return (
    <>
      <section id="funcionalidades" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 uppercase">
              Tudo que você precisa em{" "}
              <span className="text-primary drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">um só lugar</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Ferramentas modernas para barbeiros modernos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.id} 
                  className="bg-card border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-primary group flex flex-col"
                >
                  <CardHeader>
                    <div className="bg-primary/10 w-fit p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-foreground font-black uppercase text-lg">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="text-muted-foreground font-medium mb-4 flex-1">
                      {feature.shortDescription}
                    </CardDescription>
                    <Button
                      variant="outline"
                      className="w-full mt-auto"
                      onClick={() => setSelectedFeature(feature.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/funcionalidades">
                Ver Todas as Funcionalidades
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {feature && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl font-black uppercase">
                    {feature.title}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base text-muted-foreground">
                  {feature.fullDescription}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h4 className="font-bold text-lg mb-3 text-foreground">Principais Recursos:</h4>
                <ul className="space-y-2">
                  {feature.features.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFeature(null)}
                >
                  Fechar
                </Button>
                {feature.route && (
                  <Button asChild>
                    <Link to={feature.route} onClick={() => setSelectedFeature(null)}>
                      Acessar Funcionalidade
                    </Link>
                  </Button>
                )}
                <Button variant="secondary" asChild>
                  <Link to="/funcionalidades" onClick={() => setSelectedFeature(null)}>
                    Ver Todas as Funcionalidades
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Features;
