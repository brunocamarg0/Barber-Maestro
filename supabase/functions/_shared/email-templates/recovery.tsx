/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Redefina sua senha do Barber Maestro</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>💈 Barber Maestro</Heading>
        <Heading style={h1}>Redefinição de senha</Heading>
        <Text style={text}>
          Olá! Recebemos uma solicitação para redefinir a senha da sua conta no
          <strong> Barber Maestro</strong>, a plataforma de gestão para barbearias.
        </Text>
        <Text style={text}>
          Clique no botão abaixo para criar uma nova senha de acesso. Este link
          é válido por tempo limitado.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Redefinir minha senha
        </Button>
        <Text style={text}>
          Se o botão acima não funcionar, copie e cole o link abaixo no seu
          navegador:
        </Text>
        <Text style={linkText}>{confirmationUrl}</Text>
        <Text style={footer}>
          Se você não solicitou a redefinição, ignore este e-mail — sua senha
          permanecerá a mesma.
        </Text>
        <Text style={footer}>
          Atenciosamente,<br />
          Equipe Barber Maestro
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brand = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#dc2626',
  letterSpacing: '0.5px',
  margin: '0 0 16px',
}
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0f172a',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const linkText = {
  fontSize: '13px',
  color: '#2563eb',
  wordBreak: 'break-all' as const,
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '4px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 24px',
}
const footer = { fontSize: '12px', color: '#94a3b8', margin: '20px 0 0', lineHeight: '1.5' }
