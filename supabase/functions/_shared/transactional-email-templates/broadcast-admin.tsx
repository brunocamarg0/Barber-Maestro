/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BroadcastProps {
  titulo?: string
  mensagem?: string
  destinatarioNome?: string
}

const BroadcastEmail = ({
  titulo = 'Comunicado',
  mensagem = '',
  destinatarioNome = '',
}: BroadcastProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>{titulo}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{titulo}</Heading>
        {destinatarioNome ? (
          <Text style={greeting}>Olá, {destinatarioNome}!</Text>
        ) : null}
        <Section style={card}>
          <Text style={message}>{mensagem}</Text>
        </Section>
        <Text style={footer}>Barber Maestro · Equipe da Plataforma</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BroadcastEmail,
  subject: (data: Record<string, any>) => data?.titulo || 'Comunicado Barber Maestro',
  displayName: 'Comunicado da Plataforma (Admin)',
  previewData: {
    titulo: 'Novidades da plataforma',
    mensagem: 'Estamos com novidades para você...',
    destinatarioNome: 'João',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#f6f6f7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '600px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 16px' }
const greeting = { fontSize: '15px', color: '#333', margin: '0 0 16px' }
const card = { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e5e5' }
const message = { fontSize: '15px', color: '#333', margin: '0', whiteSpace: 'pre-wrap' as const, lineHeight: '1.6' }
const footer = { fontSize: '12px', color: '#737373', textAlign: 'center' as const, margin: '24px 0 0' }
