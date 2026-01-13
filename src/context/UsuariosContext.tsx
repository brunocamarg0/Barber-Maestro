import { createContext, useContext, useState, ReactNode } from "react";
import { Usuario, NovoUsuario, TipoUsuario, StatusUsuario } from "@/types/usuario";
import { useBarbearias } from "./BarbeariasContext";

interface UsuariosContextType {
  usuarios: Usuario[];
  adicionarUsuario: (usuario: NovoUsuario) => void;
  editarUsuario: (id: string, dados: Partial<Usuario>) => void;
  resetarSenha: (id: string) => void;
  bloquearUsuario: (id: string) => void;
  desbloquearUsuario: (id: string) => void;
  getUsuario: (id: string) => Usuario | undefined;
  getUsuariosPorBarbearia: (barbeariaId: string) => Usuario[];
}

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

export function UsuariosProvider({ children }: { children: ReactNode }) {
  const { barbearias } = useBarbearias();
  // Removidos dados mockados - usuários serão carregados da API quando necessário
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const adicionarUsuario = (novoUsuario: NovoUsuario) => {
    const barbearia = barbearias.find((b) => b.id === novoUsuario.barbeariaId);
    const usuario: Usuario = {
      id: Date.now().toString(),
      ...novoUsuario,
      barbeariaNome: barbearia?.nome || "",
      status: "ativo",
      dataCriacao: new Date().toISOString().split("T")[0],
      permissoes: novoUsuario.permissoes || [],
    };
    setUsuarios([...usuarios, usuario]);
  };

  const editarUsuario = (id: string, dados: Partial<Usuario>) => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, ...dados } : u))
    );
  };

  const resetarSenha = (id: string) => {
    // Em produção, isso enviaria um email com link de reset
    console.log(`Resetando senha do usuário ${id}`);
  };

  const bloquearUsuario = (id: string) => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, status: "bloqueado" } : u))
    );
  };

  const desbloquearUsuario = (id: string) => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, status: "ativo" } : u))
    );
  };

  const getUsuario = (id: string) => {
    return usuarios.find((u) => u.id === id);
  };

  const getUsuariosPorBarbearia = (barbeariaId: string) => {
    return usuarios.filter((u) => u.barbeariaId === barbeariaId);
  };

  return (
    <UsuariosContext.Provider
      value={{
        usuarios,
        adicionarUsuario,
        editarUsuario,
        resetarSenha,
        bloquearUsuario,
        desbloquearUsuario,
        getUsuario,
        getUsuariosPorBarbearia,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
}

export function useUsuarios() {
  const context = useContext(UsuariosContext);
  if (!context) {
    throw new Error("useUsuarios deve ser usado dentro de UsuariosProvider");
  }
  return context;
}







