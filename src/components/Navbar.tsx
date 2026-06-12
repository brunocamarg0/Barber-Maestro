import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scissors, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const goToAnchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
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
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="bg-primary p-1.5 sm:p-2 shrink-0">
              <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-2xl font-black text-foreground uppercase tracking-tight truncate">
              Barber Maestro
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#sobre" onClick={goToAnchor("sobre")} className="text-foreground hover:text-primary transition-colors font-bold uppercase text-sm cursor-pointer">
              Sobre
            </a>
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

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/cadastro">Começar Agora</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 text-foreground shrink-0"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-3 pb-2 flex flex-col gap-1 border-t border-border pt-3">
            <a href="#sobre" onClick={goToAnchor("sobre")} className="px-2 py-2 text-foreground hover:text-primary font-bold uppercase text-sm">
              Sobre
            </a>
            <a href="#funcionalidades" onClick={goToAnchor("funcionalidades")} className="px-2 py-2 text-foreground hover:text-primary font-bold uppercase text-sm">
              Funcionalidades
            </a>
            <a href="#planos" onClick={goToAnchor("planos")} className="px-2 py-2 text-foreground hover:text-primary font-bold uppercase text-sm">
              Planos
            </a>
            <a href="#contato" onClick={goToAnchor("contato")} className="px-2 py-2 text-foreground hover:text-primary font-bold uppercase text-sm">
              Contato
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" asChild onClick={() => setOpen(false)}>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="hero" asChild onClick={() => setOpen(false)}>
                <Link to="/cadastro">Começar Agora</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
