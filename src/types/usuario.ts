export type TipoUsuario = "admin_barbearia" | "gerente" | "operador";

export type StatusUsuario = "ativo" | "bloqueado" | "suspenso";

export interface Usuario {
  id: string;
  barbeariaId: string;
  barbeariaNome: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  status: StatusUsuario;
  ultimoLogin?: string;
  dataCriacao: string;
  permissoes: string[];
}

export interface NovoUsuario {
  barbeariaId: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  senha: string;
  permissoes?: string[];
}







