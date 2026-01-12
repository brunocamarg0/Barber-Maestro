-- CreateTable
CREATE TABLE "SolicitacaoCadastro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpjCpf" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "plano" TEXT NOT NULL DEFAULT 'basico',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "observacoes" TEXT,
    "barbeariaId" TEXT,
    "aprovadaEm" DATETIME,
    "aprovadaPor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SolicitacaoCadastro_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SolicitacaoCadastro_barbeariaId_key" ON "SolicitacaoCadastro"("barbeariaId");
