import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, Scissors } from "lucide-react";

export default function PagamentoAssinaturaFalha() {
  const [searchParams] = useSearchParams();
  const plano = searchParams.get("plano") || "plano";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#dc2626]/20 blur-[140px]" />

      <div className="relative max-w-md w-full border border-white/10 bg-black/40 backdrop-blur-sm p-8">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#dc2626]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#dc2626]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#dc2626]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#dc2626]" />

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-[#dc2626] flex items-center justify-center">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#dc2626] font-semibold">
            Não concluído
          </div>
        </div>

        <XCircle className="h-12 w-12 text-[#dc2626] mb-4" />
        <h1 className="font-display text-3xl uppercase tracking-wider mb-3">
          Pagamento não concluído
        </h1>
        <p className="text-white/60 text-sm mb-6">
          O pagamento da assinatura do plano <span className="text-white font-semibold uppercase">{plano}</span> não foi aprovado. Você pode tentar novamente quando quiser.
        </p>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-12 rounded-none bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/40 uppercase tracking-wider"
          >
            <Link to="/">Voltar</Link>
          </Button>
          <Button
            asChild
            className="flex-1 h-12 rounded-none bg-[#dc2626] hover:bg-[#b91c1c] text-white uppercase tracking-wider font-semibold hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
          >
            <Link to={`/checkout-assinatura?plano=${plano}`}>Tentar novamente</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
