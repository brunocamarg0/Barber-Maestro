import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goToAnchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-6">
            <div className="bg-primary p-2">
              <Scissors className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black text-foreground uppercase tracking-tight">Barber Maestro</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" onClick={goToAnchor("funcionalidades")} className="text-foreground hover:text-primary transition-colors font-bold uppercase text-sm cursor-pointer">
              Funcionalidades
            </a>
            <a href="#planos" onClick={goToAnchor("planos")} className="text-foreground hover:text-primary transition-colors font-bold uppercase text-sm cursor-pointer">
              Planos
            </a>
            <a href="#contato" onClick={goToAnchor("contato")} className="text-foreground hover:text-primary transition-colors font-bold uppercase text-sm cursor-pointer">
              Contato
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/cadastro">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
