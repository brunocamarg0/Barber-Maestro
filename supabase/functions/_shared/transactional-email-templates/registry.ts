/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as boasVindasDono } from './boas-vindas-dono.tsx'
import { template as suporteCliente } from './suporte-cliente.tsx'
import { template as cobrancaGerada } from './cobranca-gerada.tsx'
import { template as agendamentoCriadoCliente } from './agendamento-criado-cliente.tsx'
import { template as agendamentoConfirmadoCliente } from './agendamento-confirmado-cliente.tsx'
import { template as lembreteAgendamentoCliente } from './lembrete-agendamento-cliente.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'boas-vindas-dono': boasVindasDono,
  'suporte-cliente': suporteCliente,
  'cobranca-gerada': cobrancaGerada,
  'agendamento-criado-cliente': agendamentoCriadoCliente,
  'agendamento-confirmado-cliente': agendamentoConfirmadoCliente,
  'lembrete-agendamento-cliente': lembreteAgendamentoCliente,
}
