-- CreateTable
CREATE TABLE "Membro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCompleto" TEXT NOT NULL,
    "apelido" TEXT,
    "fotoUrl" TEXT,
    "dataNascimento" DATETIME,
    "sexo" TEXT,
    "estadoCivil" TEXT,
    "naturalidade" TEXT,
    "nacionalidade" TEXT DEFAULT 'Brasileira',
    "rg" TEXT,
    "cpf" TEXT,
    "cep" TEXT,
    "endereco" TEXT,
    "numeroCasa" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "profissao" TEXT,
    "escolaridade" TEXT,
    "nomeConjuge" TEXT,
    "nomePai" TEXT,
    "nomeMae" TEXT,
    "dataConversao" DATETIME,
    "dataAdmissao" DATETIME,
    "formaAdmissao" TEXT,
    "congregacaoId" INTEGER NOT NULL,
    "cargoId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "dataSaida" DATETIME,
    "motivoSaida" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Membro_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membro_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Congregacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matriz" BOOLEAN NOT NULL DEFAULT false,
    "endereco" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "telefone" TEXT,
    "pastorResponsavel" TEXT,
    "dataFundacao" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CargoHistorico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "membroId" INTEGER NOT NULL,
    "cargoId" INTEGER NOT NULL,
    "congregacaoId" INTEGER,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME,
    "observacao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CargoHistorico_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CargoHistorico_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CargoHistorico_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batismo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "membroId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    "local" TEXT,
    "oficiante" TEXT,
    "testemunhas" TEXT,
    "congregacaoId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Batismo_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Batismo_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApresentacaoCrianca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCrianca" TEXT NOT NULL,
    "dataNascimento" DATETIME,
    "nomePai" TEXT,
    "nomeMae" TEXT,
    "data" DATETIME NOT NULL,
    "oficiante" TEXT,
    "congregacaoId" INTEGER,
    "responsavelId" INTEGER,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApresentacaoCrianca_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ApresentacaoCrianca_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Membro" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cargaHoraria" INTEGER,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CursoConclusao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cursoId" INTEGER NOT NULL,
    "membroId" INTEGER NOT NULL,
    "dataConclusao" DATETIME NOT NULL,
    "instrutor" TEXT,
    "nota" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CursoConclusao_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CursoConclusao_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CartaRecomendacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "membroId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "destinatario" TEXT,
    "finalidade" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CartaRecomendacao_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CartaMudanca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "membroId" INTEGER NOT NULL,
    "congregacaoOrigemId" INTEGER,
    "congregacaoDestinoId" INTEGER,
    "igrejaDestinoTexto" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CartaMudanca_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartaMudanca_congregacaoOrigemId_fkey" FOREIGN KEY ("congregacaoOrigemId") REFERENCES "Congregacao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CartaMudanca_congregacaoDestinoId_fkey" FOREIGN KEY ("congregacaoDestinoId") REFERENCES "Congregacao" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "dataEmissao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'EMITIDO',
    "membroId" INTEGER,
    "referenciaId" INTEGER,
    "validade" DATETIME,
    "emitidoPorId" INTEGER NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Documento_emitidoPorId_fkey" FOREIGN KEY ("emitidoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventoAgenda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "inicio" DATETIME NOT NULL,
    "fim" DATETIME NOT NULL,
    "local" TEXT,
    "tipo" TEXT,
    "congregacaoId" INTEGER,
    "responsavelId" INTEGER,
    "recorrencia" TEXT DEFAULT 'NENHUMA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventoAgenda_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EventoAgenda_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Membro" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SECRETARIA',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "membroId" INTEGER,
    "congregacaoId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeIgreja" TEXT NOT NULL,
    "cnpj" TEXT,
    "logoUrl" TEXT,
    "enderecoSede" TEXT,
    "telefoneSede" TEXT,
    "nomePresidente" TEXT,
    "cargoPresidente" TEXT DEFAULT 'Pastor Presidente',
    "assinaturaUrl" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Membro_cpf_key" ON "Membro"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_nome_key" ON "Cargo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Documento_numero_key" ON "Documento"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_membroId_key" ON "User"("membroId");
