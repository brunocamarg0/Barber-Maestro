import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      id="contato"
      className="relative bg-[#0a0a0a] text-white font-body border-t border-white/10 overflow-hidden"
    >
      {/* Mega texto decorativo */}
      <div className="pointer-events-none select-none overflow-hidden">
        <div className="font-display text-[18vw] leading-[0.85] uppercase text-white/[0.03] tracking-tighter whitespace-nowrap text-center">
          MAESTRO
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 -mt-8 relative">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="bg-[#dc2626] p-2">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-2xl uppercase tracking-wide">
                Barber Maestro
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Sistema de gestão pro para barbearias modernas.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base mb-5 uppercase tracking-[0.2em] text-[#dc2626]">
              Produto
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#funcionalidades" className="text-white/60 hover:text-white transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#planos" className="text-white/60 hover:text-white transition-colors">
                  Planos
                </a>
              </li>
              <li>
                <Link to="/funcionalidades" className="text-white/60 hover:text-white transition-colors">
                  Ver Tudo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base mb-5 uppercase tracking-[0.2em] text-[#dc2626]">
              Empresa
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#sobre" className="text-white/60 hover:text-white transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#contato" className="text-white/60 hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base mb-5 uppercase tracking-[0.2em] text-[#dc2626]">
              Suporte
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="#" className="text-white/60 hover:text-white transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/60 hover:text-white transition-colors">
                  Portal do Cliente
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row gap-3 justify-between items-center text-xs uppercase tracking-wider text-white/40">
          <p>&copy; 2026 Barber Maestro. Todos os direitos reservados.</p>
          <p>Feito com precisão para barbeiros.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
