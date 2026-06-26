import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Crown, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlanoAtivo } from "@/hooks/usePlanoAtivo";
import { FEATURES, PLANOS_LABEL, planoMinimoPara } from "@/config/features";

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  /** Quando true, apenas oculta o conteúdo sem mostrar tela de upgrade. */
  silent?: boolean;
}

export function FeatureGate({ feature, children, silent }: FeatureGateProps) {
  const { plano, loading, temAcesso } = usePlanoAtivo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (temAcesso(feature)) return <>{children}</>;
  if (silent) return null;

  const def = FEATURES[feature];
  const planoMin = planoMinimoPara(feature);
  const planoMinLabel = planoMin ? PLANOS_LABEL[planoMin] : "superior";

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-md w-full border-primary/20 bg-card">
        <CardContent className="p-8 text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display tracking-wide uppercase text-foreground mb-2">
              {def?.nome ?? "Funcionalidade bloqueada"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {def?.descricao ?? "Esta funcionalidade não está disponível no seu plano atual."}
            </p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <Crown className="h-4 w-4" />
              Disponível no plano {planoMinLabel}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Seu plano atual: <strong>{plano?.nome ?? "Nenhum"}</strong>
            </p>
          </div>
          <Button asChild className="w-full" size="lg">
            <Link to="/planos">
              Fazer upgrade <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
