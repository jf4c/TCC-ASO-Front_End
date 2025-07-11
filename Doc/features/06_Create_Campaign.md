# 06_Create_Campaign

## Overview
Implementação da funcionalidade de criação de campanhas de RPG, incluindo configurações básicas, sistema de RPG, geração por IA e convite inicial de jogadores.

## Status: 📋 PLANEJADO  
**Started:** [Data de início]  
**Last Updated:** 11 de Julho de 2025

## Fases de Desenvolvimento

### 📋 Parte 1 - BÁSICO (Objetivo Atual)
**Meta**: Criação básica de campanhas com configurações essenciais

### 🚀 Parte 2 - MELHORIAS (Futuro)
**Meta**: IA para geração, templates e recursos avançados

## Funcionalidades

### 🎨 Layout e Design
- [ ] Componente de página de criação (`create-campaign.page.ts`)
- [ ] Formulário modular por seções
- [ ] Preview da campanha em tempo real
- [ ] Steps/wizard de criação
- [ ] Design responsivo
- [ ] Validações visuais em tempo real

### 📝 Configurações Básicas
- [ ] Nome da campanha (obrigatório)
- [ ] Descrição/sinopse
- [ ] Sistema de RPG (D&D 5e, Pathfinder, etc.)
- [ ] Nível inicial dos personagens
- [ ] Configurações de mundo
- [ ] Imagem/banner da campanha
- [ ] Status (Preparação/Ativa/Pausada)

### 👑 Configurações de Mestre
- [ ] Definição automática como Mestre
- [ ] Configurações de permissões
- [ ] Regras customizadas
- [ ] Configurações de progressão
- [ ] Sistema de pontuação/XP
- [ ] Calendário da campanha

### 👥 Sistema de Jogadores
- [ ] Definição de número máximo de jogadores
- [ ] Convites iniciais (opcional)
- [ ] Sistema de aprovação de personagens
- [ ] Configurações de privacidade
- [ ] Requisitos para participação
- [ ] Roles especiais (co-mestre, etc.)

### 🤖 Geração por IA
- [ ] Geração automática de sinopse
- [ ] Sugestões de nome
- [ ] Geração de mundo base
- [ ] NPCs iniciais
- [ ] Missões/aventuras sugeridas
- [ ] Configurações recomendadas por sistema

### 🔗 Backend e Integração
- [ ] API de criação (`POST /api/campaigns`)
- [ ] Validação de dados
- [ ] Sistema de ownership
- [ ] Relacionamento com sistemas de RPG
- [ ] Upload de imagens
- [ ] Notificações de criação

### 🧭 Navegação e UX
- [ ] Wizard de criação em steps
- [ ] Salvamento como rascunho
- [ ] Preview antes de finalizar
- [ ] Navegação pós-criação
- [ ] Breadcrumb contextual
- [ ] Confirmação de criação

### 📊 Templates e Presets
- [ ] Templates por sistema de RPG
- [ ] Campanhas exemplo
- [ ] Configurações rápidas
- [ ] Import de campanhas existentes
- [ ] Biblioteca de recursos
- [ ] Compartilhamento de templates

### 🔒 Privacidade e Segurança
- [ ] Configurações de visibilidade
- [ ] Sistema de convites privados
- [ ] Aprovação de novos jogadores
- [ ] Configurações de moderação
- [ ] Backup de dados da campanha

## Testes e Validação

### Testes Planejados
- [ ] Criação com dados mínimos
- [ ] Validação de formulários
- [ ] Upload de imagens
- [ ] Sistema de convites
- [ ] Geração por IA
- [ ] Templates predefinidos

### Cenários de Teste
- [ ] Primeiro mestre criando campanha
- [ ] Uso de templates
- [ ] Criação com IA
- [ ] Configurações avançadas
- [ ] Fluxo completo com convites
- [ ] Salvamento como rascunho

## Próximos Passos

### 🎯 Prioridade Imediata - Funcionalidade Base
1. **Estrutura de Criação**
   - Formulário básico de campanha
   - Validações essenciais
   - Sistema de ownership

2. **Integração com Sistemas**
   - Backend de campanhas
   - Sistema de usuários
   - Upload de arquivos

3. **UX de Criação**
   - Wizard/steps de criação
   - Preview em tempo real
   - Navegação pós-criação

### 🚀 Recursos Avançados (Fase 2)
- Templates por sistema de RPG
- Geração automática por IA
- Sistema de convites avançado
- Configurações de mundo detalhadas

---

**Document Status**: 📋 Planejamento  
**Created**: 11 de Julho de 2025  
**Last Updated**: 11 de Julho de 2025  
**Implementation**: 📋 A ser iniciado  
**Dependencies**: Auth System, File Upload, RPG Systems Data
