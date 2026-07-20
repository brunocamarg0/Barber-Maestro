/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  nome?: string
  barbearia?: string
  servico?: string
  dataHora?: string
  horario?: string
}

const Email = ({ nome = 'Cliente', barbearia = 'a barbearia', servico = 'seu serviço', dataHora = '', horario = '' }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu agendamento em {barbearia} foi confirmado ✅</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Agendamento confirmado ✅</Heading>
        <Text style={text}>Olá, <strong>{nome}</strong>! A <strong>{barbearia}</strong> confirmou seu horário.</Text>
        <Section style={box}>
          <Text style={boxLine}><strong>Serviço:</strong> {servico}</Text>
          <Text style={boxLine}><strong>Data:</strong> {dataHora}</Text>
          {horario ? <Text style={boxLine}><strong>Horário:</strong> {horario}</Text> : null}
        </Section>
        <Text style={text}>Você receberá lembretes 24h e 2h antes do atendimento. Até breve! ✂️</Text>
        <Text style={signature}>Barber Maestro</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Seu agendamento foi confirmado',
  displayName: 'Agendamento — Confirmado (cliente)',
  previewData: { nome: 'João', barbearia: 'Barbearia do Bruno', servico: 'Corte + Barba', dataHora: '25/07/2026 14:30', horario: '14:30' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const box = { background: '#f6f6f6', borderLeft: '3px solid #16a34a', padding: '14px 18px', margin: '0 0 20px' }
const boxLine = { fontSize: '15px', color: '#111', margin: '4px 0' }
const signature = { fontSize: '13px', color: '#666', margin: '24px 0 0' }
