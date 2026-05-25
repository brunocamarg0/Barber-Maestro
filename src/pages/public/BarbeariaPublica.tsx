import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function BarbeariaPublica() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "found"; id: string } | { kind: "notfound" }
  >({ kind: "loading" });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase
        .from("barbearias_publicas" as any)
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (error || !data) {
        setState({ kind: "notfound" });
      } else {
        setState({ kind: "found", id: (data as any).id });
      }
    })();
  }, [slug]);

  if (state.kind === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state.kind === "notfound") {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/cliente/agendar?barbearia=${state.id}`} replace />;
}
