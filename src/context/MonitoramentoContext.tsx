import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { StatusSistema, UsoModulo, ErroSistema, LogCritico } from "@/types/monitoramento";
import { useBarbearias } from "./BarbeariasContext";
import { usePlanos } from "./PlanosContext";

interface MonitoramentoContextType {
  statusSistema: StatusSistema;
  atualizarStatus: () => void;
  marcarErroResolvido: (erroId: string) => void;
}

const MonitoramentoContext = createContext<MonitoramentoContextType | undefined>(undefined);

const errosIniciais: ErroSistema[] = [
  {
    id: "1",
    tipo: "API",
    mensagem: "Timeout na requisição de pagamento",
    data: new Date(Date.now() - 3600000).toISOString(),
    severidade: "media",
    resolvido: false,
  },
  {
    id: "2",
    tipo: "Database",
    mensagem: "Conexão lenta com banco de dados",
    data: new Date(Date.now() - 7200000).toISOString(),
    severidade: "alta",
    resolvido: false,
  },
];

const logsCriticosIniciais: LogCritico[] = [
  {
    id: "1",
    tipo: "Segurança",
    mensagem: "Tentativa de acesso não autorizado",
    data: new Date(Date.now() - 1800000).toISOString(),
    contexto: { ip: "192.168.1.100", usuario: "admin" },
  },
];

export function MonitoramentoProvider({ children }: { children: ReactNode }) {
  const { barbearias } = useBarbearias();
  const { assinaturas } = usePlanos();
  const [erros, setErros] = useState<ErroSistema[]>(errosIniciais);
  const [logsCriticos, setLogsCriticos] = useState<LogCritico[]>(logsCriticosIniciais);

  const calcularStatusSistema = (): StatusSistema => {
    const barbeariasAtivas = assinaturas.filter(
      (a) => a.status === "em_dia" || a.status === "atrasado"
    ).length;

    // Mock de dados
    const agendamentosHoje = Math.floor(Math.random() * 100) + 50;
    const agendamentosTotal = Math.floor(Math.random() * 1000) + 500;

    const usoModulos: UsoModulo[] = [
      {
        modulo: "Agendamento",
        uso: 850,
        percentual: 85,
        periodo: "hoje",
      },
      {
        modulo: "Pagamento",
        uso: 420,
        percentual: 42,
        periodo: "hoje",
      },
      {
        modulo: "Notificações",
        uso: 1200,
        percentual: 100,
        periodo: "hoje",
      },
    ];

    return {
      barbeariasOnline: barbeariasAtivas,
      agendamentosHoje,
      agendamentosTotal,
      usoModulos,
      errosSistema: erros,
      logsCriticos,
    };
  };

  const statusSistema = useMemo(() => calcularStatusSistema(), [barbearias, assinaturas, erros, logsCriticos]);

  const atualizarStatus = () => {
    // Força atualização
  };

  const marcarErroResolvido = (erroId: string) => {
    setErros(
      erros.map((e) => (e.id === erroId ? { ...e, resolvido: true } : e))
    );
  };

  return (
    <MonitoramentoContext.Provider
      value={{
        statusSistema,
        atualizarStatus,
        marcarErroResolvido,
      }}
    >
      {children}
    </MonitoramentoContext.Provider>
  );
}

export function useMonitoramento() {
  const context = useContext(MonitoramentoContext);
  if (!context) {
    throw new Error("useMonitoramento deve ser usado dentro de MonitoramentoProvider");
  }
  return context;
}



