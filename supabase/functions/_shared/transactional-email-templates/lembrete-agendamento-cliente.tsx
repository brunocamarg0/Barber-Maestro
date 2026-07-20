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
  antecedencia?: '24h' | '2h' | string
}

const Email = ({ nome = 'Cliente', barbearia = 'a barbearia', servico = 'seu serviço', dataHora = '', horario = '', antecedencia = '24h' }: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Lembrete: seu agendamento em {barbearia} está próximo</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Faltam {antecedencia} para o seu horário ⏰</Heading>
        <Text style={text}>Olá, <strong>{nome}</strong>! Este é um lembrete do seu agendamento em <strong>{barbearia}</strong>.</Text>
        <Section style={box}>
          <Text style={boxLine}><strong>Serviço:</strong> {servico}</Text>
          <Text style={boxLine}><strong>Data:</strong> {dataHora}</Text>
          {horario ? <Text style={boxLine}><strong>Horário:</strong> {horario}</Text> : null}
        </Section>
        <Text style={text}>Se precisar remarcar ou cancelar, acesse sua conta o quanto antes. Até breve! ✂️</Text>
        <Text style={signature}>Barber Maestro</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) => `Lembrete: seu agendamento em ${data?.antecedencia ?? '24h'}`,
  displayName: 'Agendamento — Lembrete (cliente)',
  previewData: { nome: 'João', barbearia: 'Barbearia do Bruno', servico: 'Corte + Barba', dataHora: '25/07/2026 14:30', horario: '14:30', antecedencia: '24h' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const box = { background: '#f6f6f6', borderLeft: '3px solid #dc2626', padding: '14px 18px', margin: '0 0 20px' }
const boxLine = { fontSize: '15px', color: '#111', margin: '4px 0' }
const signature = { fontSize: '13px', color: '#666', margin: '24px 0 0' }
