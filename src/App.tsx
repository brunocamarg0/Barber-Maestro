import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BarbeariasProvider } from "@/context/BarbeariasContext";
import { PlanosProvider } from "@/context/PlanosContext";
import { FinanceiroProvider } from "@/context/FinanceiroContext";
import { UsuariosProvider } from "@/context/UsuariosContext";
import { MonitoramentoProvider } from "@/context/MonitoramentoContext";
import { NotificacoesProvider } from "@/context/NotificacoesContext";
import { IntegracoesGlobaisProvider } from "@/context/IntegracoesGlobaisContext";
import { SegurancaProvider } from "@/context/SegurancaContext";
import { SuporteProvider } from "@/context/SuporteContext";
import { ConfiguracaoProvider } from "@/context/ConfiguracaoContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CadastrarBarbearia from "./pages/admin/CadastrarBarbearia";
import EditarBarbearia from "./pages/admin/EditarBarbearia";
import DetalhesBarbearia from "./pages/admin/DetalhesBarbearia";
import Planos from "./pages/admin/Planos";
import Assinaturas from "./pages/admin/Assinaturas";
import DetalhesAssinatura from "./pages/admin/DetalhesAssinatura";
import FinanceiroDashboard from "./pages/admin/FinanceiroDashboard";
import Usuarios from "./pages/admin/Usuarios";
import Monitoramento from "./pages/admin/Monitoramento";
import Notificacoes from "./pages/admin/Notificacoes";
import IntegracoesGlobais from "./pages/admin/IntegracoesGlobais";
import Seguranca from "./pages/admin/Seguranca";
import Suporte from "./pages/admin/Suporte";
import Configuracoes from "./pages/admin/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BarbeariasProvider>
        <PlanosProvider>
          <FinanceiroProvider>
            <UsuariosProvider>
              <MonitoramentoProvider>
                <NotificacoesProvider>
                  <IntegracoesGlobaisProvider>
                    <SegurancaProvider>
                      <SuporteProvider>
                        <ConfiguracaoProvider>
                          <Toaster />
                          <Sonner />
                          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="barbearias/nova" element={<CadastrarBarbearia />} />
              <Route path="barbearias/:id" element={<DetalhesBarbearia />} />
              <Route path="barbearias/:id/editar" element={<EditarBarbearia />} />
              <Route path="planos" element={<Planos />} />
              <Route path="assinaturas" element={<Assinaturas />} />
              <Route path="assinaturas/:id" element={<DetalhesAssinatura />} />
              <Route path="financeiro" element={<FinanceiroDashboard />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="monitoramento" element={<Monitoramento />} />
              <Route path="notificacoes" element={<Notificacoes />} />
              <Route path="integracoes-globais" element={<IntegracoesGlobais />} />
              <Route path="seguranca" element={<Seguranca />} />
              <Route path="suporte" element={<Suporte />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
                        </ConfiguracaoProvider>
                      </SuporteProvider>
                    </SegurancaProvider>
                  </IntegracoesGlobaisProvider>
                </NotificacoesProvider>
              </MonitoramentoProvider>
            </UsuariosProvider>
          </FinanceiroProvider>
        </PlanosProvider>
      </BarbeariasProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
