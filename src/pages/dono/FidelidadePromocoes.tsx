import { useState } from "react";
import { useDono } from "@/context/DonoContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Gift, Tag } from "lucide-react";

export default function FidelidadePromocoes() {
  const { promocoes, criarPromocao } = useDono();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fidelidade & Promoções</h2>
          <p className="text-muted-foreground">
            Gerencie programas de fidelidade e promoções
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Promoção
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Promoções Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promocoes.filter((p) => p.ativo).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Promoções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promocoes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Programa de Pontos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativo</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promoções</CardTitle>
        </CardHeader>
        <CardContent>
          {promocoes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma promoção cadastrada
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promocoes.map((promocao) => (
                  <TableRow key={promocao.id}>
                    <TableCell className="font-medium">{promocao.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{promocao.tipo}</Badge>
                    </TableCell>
                    <TableCell>{promocao.valor}</TableCell>
                    <TableCell>
                      {new Date(promocao.validoDe).toLocaleDateString("pt-BR")} até{" "}
                      {new Date(promocao.validoAte).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={promocao.ativo ? "default" : "secondary"}>
                        {promocao.ativo ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}







