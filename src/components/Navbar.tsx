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

  const navLink =
    "font-body text-white/70 hover:text-[#dc2626] transition-colors font-semibold uppercase text-xs tracking-[0.18em] cursor-pointer";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="bg-[#dc2626] p-1.5 sm:p-2 shrink-0">
              <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="font-display text-lg sm:text-2xl text-white uppercase tracking-wide truncate">
              Barber Maestro
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#sobre" onClick={goToAnchor("sobre")} className={navLink}>
              Sobre
            </a>
            <a href="#funcionalidades" onClick={goToAnchor("funcionalidades")} className={navLink}>
              Funcionalidades
            </a>
            <a href="#planos" onClick={goToAnchor("planos")} className={navLink}>
              Planos
            </a>
            <a href="#contato" onClick={goToAnchor("contato")} className={navLink}>
              Contato
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              asChild
              className="bg-transparent text-white hover:bg-white/5 font-semibold uppercase tracking-wider text-xs rounded-none border border-transparent hover:border-white/20"
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              asChild
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold uppercase tracking-wider text-xs rounded-none hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
            >
              <Link to="/cadastro">Começar Agora</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 text-white shrink-0"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-3 pb-2 flex flex-col gap-1 border-t border-white/10 pt-3">
            <a href="#sobre" onClick={goToAnchor("sobre")} className="px-2 py-2 text-white hover:text-[#dc2626] font-semibold uppercase text-xs tracking-wider">
              Sobre
            </a>
            <a href="#funcionalidades" onClick={goToAnchor("funcionalidades")} className="px-2 py-2 text-white hover:text-[#dc2626] font-semibold uppercase text-xs tracking-wider">
              Funcionalidades
            </a>
            <a href="#planos" onClick={goToAnchor("planos")} className="px-2 py-2 text-white hover:text-[#dc2626] font-semibold uppercase text-xs tracking-wider">
              Planos
            </a>
            <a href="#contato" onClick={goToAnchor("contato")} className="px-2 py-2 text-white hover:text-[#dc2626] font-semibold uppercase text-xs tracking-wider">
              Contato
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                asChild
                onClick={() => setOpen(false)}
                className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-none uppercase tracking-wider text-xs"
              >
                <Link to="/login">Entrar</Link>
              </Button>
              <Button
                asChild
                onClick={() => setOpen(false)}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-none uppercase tracking-wider text-xs"
              >
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
