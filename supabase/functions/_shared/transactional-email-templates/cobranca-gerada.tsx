/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface CobrancaGeradaProps {
  nomeDono?: string
  nomeBarbearia?: string
  planoNome?: string
  valor?: string
  dataVencimento?: string
  linkPagamento?: string
}

const CobrancaGeradaEmail = ({
  nomeDono = 'Barbeiro',
  nomeBarbearia = 'sua barbearia',
  planoNome = 'seu plano',
  valor = 'R$ 0,00',
  dataVencimento = '',
  linkPagamento = 'https://barbermaestro.com/dono/minha-assinatura',
}: CobrancaGeradaProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Sua mensalidade do Barber Maestro está disponível para pagamento</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Olá, {nomeDono}!</Heading>

        <Text style={text}>
          Uma nova cobrança da mensalidade da <strong>{nomeBarbearia}</strong> foi
          gerada e já está disponível para pagamento.
        </Text>

        <Section style={box}>
          <Text style={boxLine}><strong>Plano:</strong> {planoNome}</Text>
          <Text style={boxLine}><strong>Valor:</strong> {valor}</Text>
          <Text style={boxLine}><strong>Vencimento:</strong> {dataVencimento}</Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button href={linkPagamento} style={button}>Pagar agora</Button>
        </Section>

        <Text style={text}>
          O pagamento pode ser feito via PIX, boleto ou cartão diretamente pelo
          Mercado Pago. Assim que o pagamento for aprovado, sua assinatura é
          renovada automaticamente por mais um mês.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          Barber Maestro — A nova era da sua barbearia.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template: TemplateEntry = {
  component: CobrancaGeradaEmail,
  subject: (d) => `Mensalidade Barber Maestro — ${d?.valor ?? ''}`.trim(),
  displayName: 'Cobrança recorrente gerada',
  previewData: {
    nomeDono: 'Bernardo',
    nomeBarbearia: 'Barbearia Teste',
    planoNome: 'Profissional',
    valor: 'R$ 99,90',
    dataVencimento: '10/07/2026',
    linkPagamento: 'https://barbermaestro.com/dono/minha-assinatura',
  },
}

const main: React.CSSProperties = { backgroundColor: '#f6f6f6', fontFamily: 'sans-serif' }
const container: React.CSSProperties = { backgroundColor: '#ffffff', margin: '0 auto', padding: '32px', maxWidth: '560px' }
const h1: React.CSSProperties = { color: '#111', fontSize: '24px', margin: '0 0 16px' }
const text: React.CSSProperties = { color: '#333', fontSize: '15px', lineHeight: '22px', margin: '0 0 12px' }
const box: React.CSSProperties = { backgroundColor: '#f4f4f4', padding: '16px', borderRadius: '6px', margin: '16px 0' }
const boxLine: React.CSSProperties = { color: '#111', fontSize: '15px', margin: '4px 0' }
const button: React.CSSProperties = {
  backgroundColor: '#e11d48', color: '#fff', padding: '12px 24px',
  borderRadius: '6px', textDecoration: 'none', fontWeight: 600,
}
const hr: React.CSSProperties = { borderColor: '#eee', margin: '24px 0' }
const footer: React.CSSProperties = { color: '#888', fontSize: '12px', textAlign: 'center' }

export default CobrancaGeradaEmail
