import { createContext, useContext, useState, ReactNode } from "react";
import { Ticket, MensagemTicket, SLA, StatusTicket, PrioridadeTicket } from "@/types/suporte";

interface SuporteContextType {
  tickets: Ticket[];
  slas: SLA[];
  criarTicket: (ticket: Omit<Ticket, "id" | "dataAbertura" | "sla" | "mensagens">) => void;
  atualizarTicket: (id: string, dados: Partial<Ticket>) => void;
  adicionarMensagem: (ticketId: string, mensagem: Omit<MensagemTicket, "id" | "data">) => void;
  criarSLA: (sla: Omit<SLA, "id">) => void;
}

const SuporteContext = createContext<SuporteContextType | undefined>(undefined);

const slasIniciais: SLA[] = [
  {
    id: "1",
    nome: "SLA Urgente",
    prioridade: "urgente",
    tempoResposta: 1,
    tempoResolucao: 4,
    ativo: true,
  },
  {
    id: "2",
    nome: "SLA Alta",
    prioridade: "alta",
    tempoResposta: 4,
    tempoResolucao: 24,
    ativo: true,
  },
];

const ticketsIniciais: Ticket[] = [
  {
    id: "1",
    barbeariaId: "1",
    barbeariaNome: "Barbearia do João",
    titulo: "Problema com agendamento",
    descricao: "Não consigo criar novos agendamentos",
    status: "em_andamento",
    prioridade: "alta",
    categoria: "Técnico",
    criadoPor: "João Silva",
    atribuidoA: "Suporte Técnico",
    dataAbertura: new Date(Date.now() - 3600000).toISOString(),
    sla: {
      tempoLimite: 24,
      tempoDecorrido: 1,
      dentroDoSLA: true,
    },
    mensagens: [],
  },
];

export function SuporteProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(ticketsIniciais);
  const [slas, setSlas] = useState<SLA[]>(slasIniciais);

  const criarTicket = (ticket: Omit<Ticket, "id" | "dataAbertura" | "sla" | "mensagens">) => {
    const sla = slas.find((s) => s.prioridade === ticket.prioridade);
    const novo: Ticket = {
      id: Date.now().toString(),
      ...ticket,
      dataAbertura: new Date().toISOString(),
      sla: sla
        ? {
            tempoLimite: sla.tempoResolucao,
            tempoDecorrido: 0,
            dentroDoSLA: true,
          }
        : {
            tempoLimite: 24,
            tempoDecorrido: 0,
            dentroDoSLA: true,
          },
      mensagens: [],
    };
    setTickets([novo, ...tickets]);
  };

  const atualizarTicket = (id: string, dados: Partial<Ticket>) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, ...dados } : t)));
  };

  const adicionarMensagem = (ticketId: string, mensagem: Omit<MensagemTicket, "id" | "data">) => {
    const nova: MensagemTicket = {
      id: Date.now().toString(),
      ...mensagem,
      data: new Date().toISOString(),
    };
    setTickets(
      tickets.map((t) =>
        t.id === ticketId ? { ...t, mensagens: [...t.mensagens, nova] } : t
      )
    );
  };

  const criarSLA = (sla: Omit<SLA, "id">) => {
    const novo: SLA = {
      id: Date.now().toString(),
      ...sla,
    };
    setSlas([...slas, novo]);
  };

  return (
    <SuporteContext.Provider
      value={{
        tickets,
        slas,
        criarTicket,
        atualizarTicket,
        adicionarMensagem,
        criarSLA,
      }}
    >
      {children}
    </SuporteContext.Provider>
  );
}

export function useSuporte() {
  const context = useContext(SuporteContext);
  if (!context) {
    throw new Error("useSuporte deve ser usado dentro de SuporteProvider");
  }
  return context;
}

