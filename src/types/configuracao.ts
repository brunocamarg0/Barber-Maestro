export interface ConfiguracaoPlataforma {
  id: string;
  nomeSistema: string;
  logo?: string;
  dominio: string;
  termosUso?: string;
  politicaPrivacidade?: string;
  modoManutencao: boolean;
  mensagemManutencao?: string;
  emailContato: string;
  telefoneContato?: string;
  redesSociais?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  configuracoesAvancadas: Record<string, any>;
}







