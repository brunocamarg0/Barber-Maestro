export type StatusTicket = "aberto" | "em_andamento" | "aguardando_cliente" | "resolvido" | "fechado";

export type PrioridadeTicket = "baixa" | "media" | "alta" | "urgente";

export interface Ticket {
  id: string;
  barbeariaId: string;
  barbeariaNome: string;
  titulo: string;
  descricao: string;
  status: StatusTicket;
  prioridade: PrioridadeTicket;
  categoria: string;
  criadoPor: string;
  atribuidoA?: string;
  dataAbertura: string;
  dataResolucao?: string;
  sla: {
    tempoLimite: number; // em horas
    tempoDecorrido: number;
    dentroDoSLA: boolean;
  };
  mensagens: MensagemTicket[];
  anexos?: string[];
}

export interface MensagemTicket {
  id: string;
  ticketId: string;
  autor: string;
  autorTipo: "admin" | "barbearia";
  mensagem: string;
  data: string;
  anexos?: string[];
}

export interface SLA {
  id: string;
  nome: string;
  prioridade: PrioridadeTicket;
  tempoResposta: number; // em horas
  tempoResolucao: number; // em horas
  ativo: boolean;
}

