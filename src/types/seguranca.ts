export interface LogAcesso {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  barbeariaId?: string;
  barbeariaNome?: string;
  acao: string;
  recurso: string;
  ip: string;
  userAgent: string;
  data: string;
  sucesso: boolean;
}

export interface AcaoCritica {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  tipo: string;
  descricao: string;
  dados: Record<string, any>;
  data: string;
  ip: string;
}

export interface Backup {
  id: string;
  tipo: "completo" | "incremental";
  data: string;
  tamanho: number;
  status: "sucesso" | "falha" | "em_andamento";
  localizacao: string;
}

export interface ExportacaoLGPD {
  id: string;
  barbeariaId: string;
  tipo: "exportar" | "excluir";
  status: "pendente" | "processando" | "concluido" | "falhou";
  dataSolicitacao: string;
  dataConclusao?: string;
  arquivo?: string;
}







