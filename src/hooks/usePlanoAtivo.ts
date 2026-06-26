import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDono } from "@/context/DonoContext";
import type { PlanoSlug } from "@/config/features";

export interface PlanoAtivo {
  planoId: string;
  slug: PlanoSlug;
  nome: string;
  valorMensal: number;
  limiteBarbeiros: number | null; // null = ilimitado
  limiteAgendamentos: number | null;
  recursos: string[];
  status: string;
}

interface UsePlanoAtivoResult {
  plano: PlanoAtivo | null;
  loading: boolean;
  temAcesso: (featureId: string) => boolean;
  dentroDoLimite: (tipo: "profissionais" | "agendamentos", atual: number) => boolean;
  recarregar: () => Promise<void>;
}

export function usePlanoAtivo(): UsePlanoAtivoResult {
  const { barbeariaId } = useDono();
  const [plano, setPlano] = useState<PlanoAtivo | null>(null);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    if (!barbeariaId) {
      setPlano(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc("get_plano_ativo", {
      _barbearia_id: barbeariaId,
    });
    if (error || !data || data.length === 0) {
      setPlano(null);
    } else {
      const row = data[0] as any;
      setPlano({
        planoId: row.plano_id,
        slug: (row.slug ?? "basico") as PlanoSlug,
        nome: row.nome,
        valorMensal: Number(row.valor_mensal),
        limiteBarbeiros: row.limite_barbeiros,
        limiteAgendamentos: row.limite_agendamentos,
        recursos: row.recursos ?? [],
        status: row.status,
      });
    }
    setLoading(false);
  }, [barbeariaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const temAcesso = useCallback(
    (featureId: string) => {
      if (!plano) return false;
      return plano.recursos.includes(featureId);
    },
    [plano]
  );

  const dentroDoLimite = useCallback(
    (tipo: "profissionais" | "agendamentos", atual: number) => {
      if (!plano) return false;
      const limite =
        tipo === "profissionais" ? plano.limiteBarbeiros : plano.limiteAgendamentos;
      if (limite === null || limite === undefined) return true; // ilimitado
      return atual < limite;
    },
    [plano]
  );

  return { plano, loading, temAcesso, dentroDoLimite, recarregar: carregar };
}
