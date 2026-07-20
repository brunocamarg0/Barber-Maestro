import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface PlanoOpcao {
  slug: "basico" | "profissional";
  nome: string;
  valor: number;
  descricao: string;
  recursos: string[];
  permiteExtras?: boolean;
}

const PLANOS: PlanoOpcao[] = [
  {
    slug: "basico",
    nome: "Plano Básico",
    valor: 99.9,
    descricao: "Ideal para começar",
    recursos: [
      "Agenda e agendamentos ilimitados",
      "Gestão de clientes e serviços",
      "1 profissional incluso",
      "R$20/mês por profissional extra",
    ],
    permiteExtras: true,
  },
  {
    slug: "profissional",
    nome: "Plano Profissional",
    valor: 197,
    descricao: "Recursos avançados sem limites",
    recursos: [
      "Tudo do Básico",
      "Profissionais ilimitados",
      "Relatórios avançados",
      "Fidelidade, promoções e comissões",
      "Integração Mercado Pago Connect",
    ],
  },
];

interface Props {
  planoAtualNome: string;
  onAssinar: (slug: "basico" | "profissional", extras: number) => void;
}

export default function SeletorDePlanos({ planoAtualNome, onAssinar }: Props) {
  const [extras, setExtras] = useState(0);
  const nomeLower = (planoAtualNome || "").toLowerCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolher / trocar plano</CardTitle>
        <CardDescription>
          Selecione o plano que quer assinar. O pagamento é feito via Mercado Pago.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLANOS.map((p) => {
            const atual = nomeLower.includes(p.slug === "profissional" ? "prof" : "básic")
              || nomeLower.includes(p.slug === "profissional" ? "prof" : "basic");
            const totalMensal = p.permiteExtras ? p.valor + extras * 20 : p.valor;
            return (
              <div
                key={p.slug}
                className="relative border rounded-lg p-5 flex flex-col gap-4 bg-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{p.nome}</h3>
                    <p className="text-sm text-muted-foreground">{p.descricao}</p>
                  </div>
                  {atual && <Badge variant="secondary">Plano atual</Badge>}
                </div>

                <div>
                  <span className="text-3xl font-bold">
                    R$ {totalMensal.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-sm text-muted-foreground"> /mês</span>
                </div>

                <ul className="space-y-2 text-sm">
                  {p.recursos.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                {p.permiteExtras && (
                  <div className="space-y-1">
                    <Label htmlFor={`extras-${p.slug}`} className="text-xs">
                      Profissionais extras (R$20/mês cada)
                    </Label>
                    <Input
                      id={`extras-${p.slug}`}
                      type="number"
                      min={0}
                      max={50}
                      value={extras}
                      onChange={(e) =>
                        setExtras(Math.max(0, Math.min(50, Number(e.target.value) || 0)))
                      }
                    />
                  </div>
                )}

                <Button
                  className="mt-auto"
                  onClick={() => onAssinar(p.slug, p.permiteExtras ? extras : 0)}
                >
                  Assinar {p.nome}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
