import { Link } from "react-router-dom";
import { Shield, Lock, Database, Mail, Users, FileText, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Trust() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-6 py-20">
        {/* Hero */}
        <header className="mb-16 border-b border-primary/30 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-display">
              Central de Confiança
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-wider mb-4">
            Segurança & Privacidade
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Esta página é mantida pela BarberMaestro para responder perguntas comuns
            sobre segurança, privacidade e tratamento de dados da plataforma. Não constitui
            certificação independente.
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-12">
          <Section icon={Lock} title="Autenticação & Acesso">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Login por email/senha com hashing seguro gerido pela infraestrutura Lovable Cloud.</li>
              <li>• Sessões com refresh tokens rotativos e expiração automática.</li>
              <li>• Controle de acesso por papéis (cliente, profissional, dono, super-admin) aplicado no banco via Row-Level Security.</li>
              <li>• Cada barbearia é isolada das demais por políticas de tenant no banco.</li>
            </ul>
          </Section>

          <Section icon={Database} title="Dados que coletamos">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Dados de cadastro: nome, email, telefone.</li>
              <li>• Dados de barbearia (para donos): razão social, CNPJ/CPF, endereço.</li>
              <li>• Dados operacionais: agendamentos, serviços, avaliações, comissões.</li>
              <li>• Não armazenamos dados completos de cartão — pagamentos são processados pelo Mercado Pago.</li>
            </ul>
          </Section>

          <Section icon={Users} title="Subprocessadores">
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong className="text-foreground">Lovable Cloud</strong> — hospedagem, banco de dados e autenticação.</li>
              <li>• <strong className="text-foreground">Mercado Pago</strong> — processamento de pagamentos (PIX, cartão, assinaturas).</li>
              <li>• <strong className="text-foreground">Resend</strong> — envio de emails transacionais.</li>
            </ul>
          </Section>

          <Section icon={FileText} title="Retenção & exclusão">
            <p className="text-muted-foreground">
              Dados de conta são retidos enquanto a conta estiver ativa. Para solicitar
              exclusão de dados pessoais, entre em contato com o suporte abaixo. Donos de
              barbearia podem exportar e remover dados operacionais a qualquer momento pelo
              painel administrativo.
            </p>
          </Section>

          <Section icon={AlertCircle} title="Relato de vulnerabilidades">
            <p className="text-muted-foreground">
              Se você acredita ter encontrado uma vulnerabilidade, por favor relate de forma
              responsável via email abaixo. Nos comprometemos a responder em até 5 dias úteis
              e a não tomar ações legais contra pesquisas de boa-fé.
            </p>
          </Section>

          <Section icon={Mail} title="Contato">
            <p className="text-muted-foreground">
              Dúvidas de segurança ou privacidade:{" "}
              <a
                href="mailto:contato.barbermaestro@hotmail.com"
                className="text-primary hover:underline"
              >
                contato.barbermaestro@hotmail.com
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">← Voltar ao início</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Shield;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl uppercase tracking-wider">{title}</h2>
      </div>
      <div className="pl-8">{children}</div>
    </section>
  );
}
