import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Scissors,
  Building2,
  LogOut,
  CreditCard,
  FileText,
  DollarSign,
  Users,
  Activity,
  Bell,
  Plug,
  Shield,
  MessageCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    { title: "Barbearias", url: "/admin", icon: Building2 },
    { title: "Planos", url: "/admin/planos", icon: FileText },
    { title: "Assinaturas", url: "/admin/assinaturas", icon: CreditCard },
    { title: "Financeiro", url: "/admin/financeiro", icon: DollarSign },
    { title: "Usuários", url: "/admin/usuarios", icon: Users },
    { title: "Monitoramento", url: "/admin/monitoramento", icon: Activity },
    { title: "Notificações", url: "/admin/notificacoes", icon: Bell },
    { title: "Integrações Globais", url: "/admin/integracoes-globais", icon: Plug },
    { title: "Segurança", url: "/admin/seguranca", icon: Shield },
    { title: "Suporte", url: "/admin/suporte", icon: MessageCircle },
    { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
  ];

  return (
    <div className="min-h-screen font-body" id="admin-panel" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Red glow */}
      <div className="pointer-events-none fixed -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-[#dc2626]/20 blur-[140px]" />

      <SidebarProvider>
        <Sidebar className="border-r border-white/10 bg-black/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-white/10 bg-black/60">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-4 group">
              <div className="bg-[#dc2626] p-2 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_28px_rgba(220,38,38,0.6)] transition-shadow">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display tracking-[0.2em] text-white text-base uppercase">
                  Barber Maestro
                </span>
                <span className="text-[10px] text-[#dc2626] uppercase tracking-[0.3em] font-bold">
                  Admin Panel
                </span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="bg-black/60">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold px-4 pt-4">
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const active =
                      location.pathname === item.url ||
                      (item.url !== "/admin" && location.pathname.startsWith(item.url));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className={`relative rounded-none border-l-2 transition-all ${
                            active
                              ? "border-[#dc2626] bg-[#dc2626]/10 text-white"
                              : "border-transparent text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <Link to={item.url}>
                            <item.icon className={`h-4 w-4 ${active ? "text-[#dc2626]" : ""}`} />
                            <span className="uppercase tracking-wider text-xs font-semibold">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="p-4 border-t border-white/10 bg-black/60">
            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-[#dc2626]/10 rounded-sm uppercase tracking-wider text-xs font-bold"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <header className="relative z-10 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-black/40 backdrop-blur-sm px-4">
            <SidebarTrigger className="-ml-1 text-white/80 hover:text-white hover:bg-white/10" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#dc2626]" />
              <h1 className="text-base font-display tracking-[0.2em] uppercase text-white">
                Painel Administrativo
              </h1>
            </div>
          </header>
          <div className="relative z-10 flex flex-1 flex-col gap-4 p-4 md:p-6 text-white">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
