import { createContext, useContext, useState, ReactNode } from "react";
import { ConfiguracaoPlataforma } from "@/types/configuracao";

interface ConfiguracaoContextType {
  configuracao: ConfiguracaoPlataforma;
  atualizarConfiguracao: (dados: Partial<ConfiguracaoPlataforma>) => void;
  alternarModoManutencao: () => void;
}

const ConfiguracaoContext = createContext<ConfiguracaoContextType | undefined>(undefined);

const configuracaoInicial: ConfiguracaoPlataforma = {
  id: "1",
  nomeSistema: "Groom Guru",
  dominio: "groomguru.com",
  modoManutencao: false,
  emailContato: "contato@groomguru.com",
  telefoneContato: "+55 11 99999-9999",
  configuracoesAvancadas: {},
};

export function ConfiguracaoProvider({ children }: { children: ReactNode }) {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoPlataforma>(configuracaoInicial);

  const atualizarConfiguracao = (dados: Partial<ConfiguracaoPlataforma>) => {
    setConfiguracao({ ...configuracao, ...dados });
  };

  const alternarModoManutencao = () => {
    setConfiguracao({
      ...configuracao,
      modoManutencao: !configuracao.modoManutencao,
    });
  };

  return (
    <ConfiguracaoContext.Provider
      value={{
        configuracao,
        atualizarConfiguracao,
        alternarModoManutencao,
      }}
    >
      {children}
    </ConfiguracaoContext.Provider>
  );
}

export function useConfiguracao() {
  const context = useContext(ConfiguracaoContext);
  if (!context) {
    throw new Error("useConfiguracao deve ser usado dentro de ConfiguracaoProvider");
  }
  return context;
}



