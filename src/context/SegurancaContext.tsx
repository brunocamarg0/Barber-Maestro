import { createContext, useContext, useState, ReactNode } from "react";
import { LogAcesso, AcaoCritica, Backup, ExportacaoLGPD } from "@/types/seguranca";

interface SegurancaContextType {
  logsAcesso: LogAcesso[];
  acoesCriticas: AcaoCritica[];
  backups: Backup[];
  exportacoesLGPD: ExportacaoLGPD[];
  criarBackup: (tipo: "completo" | "incremental") => void;
  solicitarExportacaoLGPD: (barbeariaId: string, tipo: "exportar" | "excluir") => void;
}

const SegurancaContext = createContext<SegurancaContextType | undefined>(undefined);

const logsAcessoIniciais: LogAcesso[] = [
  {
    id: "1",
    usuarioId: "1",
    usuarioNome: "João Silva",
    barbeariaId: "1",
    barbeariaNome: "Barbearia do João",
    acao: "login",
    recurso: "/admin",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    data: new Date(Date.now() - 3600000).toISOString(),
    sucesso: true,
  },
];

const acoesCriticasIniciais: AcaoCritica[] = [
  {
    id: "1",
    usuarioId: "1",
    usuarioNome: "João Silva",
    tipo: "exclusao",
    descricao: "Exclusão de barbearia",
    dados: { barbeariaId: "3" },
    data: new Date(Date.now() - 86400000).toISOString(),
    ip: "192.168.1.100",
  },
];

const backupsIniciais: Backup[] = [
  {
    id: "1",
    tipo: "completo",
    data: new Date(Date.now() - 86400000).toISOString(),
    tamanho: 1024 * 1024 * 500, // 500MB
    status: "sucesso",
    localizacao: "/backups/backup_2024-12-28.sql",
  },
];

export function SegurancaProvider({ children }: { children: ReactNode }) {
  const [logsAcesso, setLogsAcesso] = useState<LogAcesso[]>(logsAcessoIniciais);
  const [acoesCriticas, setAcoesCriticas] = useState<AcaoCritica[]>(acoesCriticasIniciais);
  const [backups, setBackups] = useState<Backup[]>(backupsIniciais);
  const [exportacoesLGPD, setExportacoesLGPD] = useState<ExportacaoLGPD[]>([]);

  const criarBackup = (tipo: "completo" | "incremental") => {
    const backup: Backup = {
      id: Date.now().toString(),
      tipo,
      data: new Date().toISOString(),
      tamanho: 0,
      status: "em_andamento",
      localizacao: "",
    };
    setBackups([backup, ...backups]);
    // Simular conclusão
    setTimeout(() => {
      setBackups(
        backups.map((b) =>
          b.id === backup.id
            ? { ...b, status: "sucesso", tamanho: 1024 * 1024 * 500, localizacao: `/backups/backup_${Date.now()}.sql` }
            : b
        )
      );
    }, 2000);
  };

  const solicitarExportacaoLGPD = (barbeariaId: string, tipo: "exportar" | "excluir") => {
    const exportacao: ExportacaoLGPD = {
      id: Date.now().toString(),
      barbeariaId,
      tipo,
      status: "pendente",
      dataSolicitacao: new Date().toISOString(),
    };
    setExportacoesLGPD([exportacao, ...exportacoesLGPD]);
  };

  return (
    <SegurancaContext.Provider
      value={{
        logsAcesso,
        acoesCriticas,
        backups,
        exportacoesLGPD,
        criarBackup,
        solicitarExportacaoLGPD,
      }}
    >
      {children}
    </SegurancaContext.Provider>
  );
}

export function useSeguranca() {
  const context = useContext(SegurancaContext);
  if (!context) {
    throw new Error("useSeguranca deve ser usado dentro de SegurancaProvider");
  }
  return context;
}







