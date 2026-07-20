import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  campo: "termos_uso" | "politica_privacidade";
  titulo: string;
}

export default function PaginaLegal({ campo, titulo }: Props) {
  const [conteudo, setConteudo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_legal_text", { _campo: campo });
      setConteudo((data as string | null) ?? "");
      setLoading(false);
    })();
  }, [campo]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">Barber Maestro</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">{titulo}</h1>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : conteudo && conteudo.trim().length > 0 ? (
          <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
            {conteudo}
          </div>
        ) : (
          <p className="text-muted-foreground">
            O conteúdo desta página ainda não foi definido pelo administrador.
          </p>
        )}
      </main>
    </div>
  );
}
