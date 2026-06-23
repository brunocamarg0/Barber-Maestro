import { useCliente } from "@/context/ClienteContext";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  DollarSign,
  CalendarCheck,
  History,
  UserCircle,
  Gift,
  MapPin,
  Phone,
  Search,
  RefreshCw,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    cliente,
    getProximoAgendamento,
    fidelidade,
    barbearias,
    cancelarAgendamento,
    carregarDados,
    loading,
  } = useCliente();
  const primeiroNome = cliente?.nome?.trim()?.split(/\s+/)[0] || "Cliente";

  React.useEffect(() => {
    if (!cliente && !loading && carregarDados) carregarDados();
  }, [cliente, loading, carregarDados]);

  if (loading || !cliente || !getProximoAgendamento || !fidelidade) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626] mx-auto mb-4" />
          <p className="text-white/60">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  const proximoAgendamento = getProximoAgendamento();

  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const calcularTempoRestante = () => {
    if (!proximoAgendamento) return null;
    const dataAgendamento = new Date(
      `${proximoAgendamento.data}T${proximoAgendamento.horario || proximoAgendamento.hora}`
    );
    const agora = new Date();
    if (dataAgendamento < agora) return null;
    const diffMs = dataAgendamento.getTime() - agora.getTime();
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (horas > 0) return `Faltam ${horas}h e ${minutos}min para seu corte`;
    return `Faltam ${minutos}min para seu corte`;
  };

  const formatarData = (data: string, horario: string) => {
    try {
      const date = new Date(`${data}T${horario}`);
      const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
      ];
      return `${date.getDate()} de ${meses[date.getMonth()]} às ${horario}`;
    } catch {
      return `${data} às ${horario}`;
    }
  };

  const handleCancelarAgendamento = async () => {
    if (!proximoAgendamento) return;
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    try {
      await cancelarAgendamento(proximoAgendamento.id);
      toast({ title: "Agendamento cancelado", description: "Seu agendamento foi cancelado com sucesso." });
      if (carregarDados) await carregarDados();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cancelar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const tempoRestante = calcularTempoRestante();

  const statusLabel: Record<string, string> = {
    confirmado: "Confirmado",
    aguardando_pagamento: "Aguardando Pagamento",
    pendente: "Pendente",
    concluido: "Concluído",
    cancelado: "Cancelado",
    reagendado: "Reagendado",
  };

  const atalhos = [
    { to: "/cliente/agendar", icon: Calendar, label: "Agendar", desc: "Marque seu próximo corte" },
    { to: "/cliente/historico", icon: History, label: "Histórico", desc: "Agendamentos anteriores" },
    { to: "/cliente/perfil", icon: UserCircle, label: "Meu Perfil", desc: "Dados pessoais" },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Hero */}
      <div className="relative rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#dc2626]/30 blur-[120px]" />
        <div className="absolute top-0 left-0 h-1 w-24 bg-[#dc2626]" />
        <div className="relative p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-[#dc2626]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#dc2626] font-bold">
                Área do Cliente
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display tracking-[0.1em] uppercase">
              Olá, {primeiroNome}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Bem-vindo ao seu painel de agendamentos
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (carregarDados) {
                await carregarDados();
                toast({ title: "Atualizado", description: "Dados sincronizados." });
              }
            }}
            className="text-white/70 hover:text-white hover:bg-white/5 border border-white/10 rounded-sm uppercase tracking-wider text-xs font-bold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Próximo agendamento */}
      {proximoAgendamento ? (
        <Card className="relative border-[#dc2626]/40 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1 bg-[#dc2626]" />
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 text-[#dc2626] mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                    Próximo Agendamento
                  </span>
                </div>
                {tempoRestante && (
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5" /> {tempoRestante}
                  </p>
                )}
              </div>
              <Badge className="bg-[#dc2626] text-white border-0 rounded-sm uppercase tracking-wider text-[10px]">
                {statusLabel[proximoAgendamento.status] || proximoAgendamento.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">
                  Data
                </p>
                <p className="font-semibold">
                  {formatarData(
                    proximoAgendamento.data,
                    proximoAgendamento.horario || proximoAgendamento.hora
                  )}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">
                  Profissional
                </p>
                <p className="font-semibold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#dc2626]" />
                  {proximoAgendamento.profissionalNome || "A definir"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">
                  Serviço
                </p>
                <p className="font-semibold flex items-center gap-1.5">
                  <Scissors className="h-3.5 w-3.5 text-[#dc2626]" />
                  {proximoAgendamento.servicoNome || proximoAgendamento.servico?.nome || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">
                  Valor
                </p>
                <p className="font-semibold flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-[#dc2626]" />
                  {formatarMoeda(proximoAgendamento.valor || proximoAgendamento.servico?.preco || 0)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              <Button
                asChild
                variant="ghost"
                className="text-white hover:bg-white/5 border border-white/10 rounded-sm uppercase tracking-wider text-xs font-bold"
              >
                <Link to={`/cliente/agendar?reagendar=${proximoAgendamento.id}`}>
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Reagendar
                </Link>
              </Button>
              <Button
                onClick={handleCancelarAgendamento}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm uppercase tracking-wider text-xs font-bold"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-white/10 bg-black/40 backdrop-blur-sm rounded-sm">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-display uppercase tracking-[0.15em]">
                Nenhum agendamento próximo
              </h3>
              <p className="text-white/60 text-sm mt-1">
                Você não possui agendamentos confirmados no momento
              </p>
            </div>
            <Button
              asChild
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm uppercase tracking-wider text-xs font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              <Link to="/cliente/agendar">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Agora
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Atalhos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {atalhos.map((a) => (
          <Link key={a.to} to={a.to} className="group">
            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden h-full hover:border-[#dc2626]/50 transition-colors">
              <div className="absolute top-0 left-0 h-1 w-12 bg-[#dc2626] group-hover:w-full transition-all duration-500" />
              <CardContent className="p-5 flex items-start gap-4">
                <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 p-3 rounded-sm">
                  <a.icon className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div className="flex-1">
                  <p className="font-display uppercase tracking-[0.15em] text-sm">{a.label}</p>
                  <p className="text-xs text-white/60 mt-1">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Fidelidade + Créditos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-12 bg-[#dc2626]" />
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-4 w-4 text-[#dc2626]" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#dc2626]">
                Fidelidade
              </span>
            </div>
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <p className="text-4xl font-display tracking-wider">{fidelidade.pontos}</p>
                <p className="text-xs text-white/60 uppercase tracking-wider mt-1">
                  pontos • {fidelidade.cortesRealizados} cortes • Nível {fidelidade.nivel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  Faltam {fidelidade.proximoDesconto?.cortesNecessarios || 5} cortes
                </p>
                <p className="text-xs text-white/50">
                  para {fidelidade.proximoDesconto?.desconto || 5}% de desconto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {((cliente as any).creditos || 0) > 0 && (
          <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-12 bg-[#dc2626]" />
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-[#dc2626]" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#dc2626]">
                  Créditos
                </span>
              </div>
              <p className="text-4xl font-display tracking-wider">
                {formatarMoeda((cliente as any).creditos || 0)}
              </p>
              <p className="text-xs text-white/60 mt-2">Use seus créditos no próximo pagamento</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Barbearias */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-6 bg-[#dc2626]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#dc2626] font-bold">
                Para você
              </span>
            </div>
            <h2 className="text-2xl font-display tracking-[0.15em] uppercase">
              Barbearias Disponíveis
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/cliente/agendar")}
            className="text-white/70 hover:text-white hover:bg-white/5 border border-white/10 rounded-sm uppercase tracking-wider text-xs font-bold"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar Mais
          </Button>
        </div>

        {barbearias.length === 0 ? (
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm rounded-sm">
            <CardContent className="py-10 text-center">
              <p className="text-white/60">Nenhuma barbearia disponível no momento.</p>
              <Button
                className="mt-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm uppercase tracking-wider text-xs font-bold"
                onClick={() => navigate("/cliente/agendar")}
              >
                Buscar Barbearias
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbearias
              .filter((b: any) => b && b.id && b.nome)
              .slice(0, 6)
              .map((b: any) => {
                const nome = b.nome || "Barbearia sem nome";
                const inicial = nome.charAt(0).toUpperCase();
                return (
                  <Card
                    key={b.id}
                    onClick={() => navigate(`/cliente/agendar?barbearia=${b.id}`)}
                    className="group relative cursor-pointer border-white/10 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden hover:border-[#dc2626]/50 transition-colors"
                  >
                    <div className="absolute top-0 left-0 h-1 w-12 bg-[#dc2626] group-hover:w-full transition-all duration-500" />
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        {b.foto ? (
                          <Avatar className="h-12 w-12 border border-[#dc2626]/30 rounded-sm">
                            <AvatarImage src={b.foto} alt={nome} />
                            <AvatarFallback className="bg-[#dc2626]/20 text-[#dc2626] font-bold rounded-sm">
                              {inicial}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="bg-[#dc2626] p-2.5 rounded-sm">
                            <Scissors className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-display uppercase tracking-[0.1em] text-base truncate">
                            {nome}
                          </p>
                          {(b?.endereco || b?.cidade || b?.bairro) && (
                            <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">
                                {[b?.endereco, b?.bairro, b?.cidade].filter(Boolean).join(", ")}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {b?.telefone && (
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Phone className="h-3 w-3" />
                          {b.telefone}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-white/50">
                        {b?.totalServicos > 0 && (
                          <span className="flex items-center gap-1">
                            <Scissors className="h-3 w-3" />
                            {b.totalServicos} serviços
                          </span>
                        )}
                        {b?.profissionais?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {b.profissionais.length} profissionais
                          </span>
                        )}
                      </div>

                      {b?.servicos?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {b.servicos
                            .filter((s: any) => s && s.id && s.nome)
                            .slice(0, 2)
                            .map((s: any) => (
                              <Badge
                                key={s.id}
                                variant="outline"
                                className="text-[10px] border-white/20 text-white/70 rounded-sm uppercase tracking-wider"
                              >
                                {s.nome}
                              </Badge>
                            ))}
                          {b.servicos.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-[#dc2626]/40 text-[#ef4444] rounded-sm"
                            >
                              +{b.servicos.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm uppercase tracking-wider text-xs font-bold">
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        Agendar Agora
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {barbearias.length > 6 && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/cliente/agendar")}
              className="text-white/70 hover:text-white hover:bg-white/5 border border-white/10 rounded-sm uppercase tracking-wider text-xs font-bold"
            >
              Ver Todas as {barbearias.length} Barbearias
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
