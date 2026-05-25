import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PagamentoSucesso() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const agendamentoId = searchParams.get("agendamento");
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    if (!agendamentoId) {
      navigate("/cliente");
      return;
    }

    const verificarStatus = async () => {
      try {
        const { data } = await supabase
          .from("pagamentos")
          .select("status")
          .eq("agendamento_id", agendamentoId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data?.status === "pago") {
          toast({
            title: "Pagamento confirmado!",
            description: "Seu agendamento foi confirmado com sucesso.",
          });
        }
      } catch (err) {
        console.error("Erro ao verificar status:", err);
      } finally {
        setVerificando(false);
      }
    };

    setTimeout(verificarStatus, 2000);
  }, [agendamentoId, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Pagamento Aprovado!</CardTitle>
          <CardDescription>Seu pagamento foi processado com sucesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificando ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Verificando status do pagamento...
              </span>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                Seu agendamento foi confirmado e você receberá os detalhes em breve.
              </p>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to="/cliente">Ver Meus Agendamentos</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/cliente/agendar">Agendar Outro Serviço</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
