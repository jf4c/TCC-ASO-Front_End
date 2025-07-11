# 05_List_Campaigns

## Overview
Implementação da funcionalidade de listagem de campanhas de RPG, incluindo campanhas próprias, participações, convites pendentes e sistema de filtros avançados.

## Status: 📋 PLANEJADO  
**Started:** [Data de início]  
**Last Updated:** 11 de Julho de 2025

## Fases de Desenvolvimento

### 📋 Parte 1 - BÁSICO (Objetivo Atual)
**Meta**: Listagem básica de campanhas com roles de usuário

### 🚀 Parte 2 - MELHORIAS (Futuro)
**Meta**: Sistema de convites, notificações e recursos avançados

## Funcionalidades

### 🎨 Layout e Design
- [ ] Componente de página de listagem (`list-campaigns.page.ts`)
- [ ] Cards de campanha com informações relevantes
- [ ] Distinção visual entre roles (Mestre/Jogador)
- [ ] Grid responsivo para campanhas
- [ ] Filtros e busca integrados
- [ ] Estados vazios (sem campanhas)
- [ ] Indicadores de status (ativa, pausada, finalizada)

### 👥 Sistema de Roles e Permissões
- [ ] Diferenciação Mestre vs Jogador
- [ ] Campanhas como Mestre
- [ ] Campanhas como Jogador
- [ ] Convites pendentes
- [ ] Permissões por role
- [ ] Indicadores visuais de role

### 📝 Filtros e Busca
- [ ] Filtro por role (Mestre/Jogador/Todos)
- [ ] Filtro por status (Ativa/Pausada/Finalizada)
- [ ] Busca por nome da campanha
- [ ] Filtro por sistema de RPG
- [ ] Ordenação (nome, data, atividade)
- [ ] Filtros salvos/favoritos

### 🔗 Backend e Integração
- [ ] API de listagem (`GET /api/campaigns`)
- [ ] Filtros baseados no usuário logado
- [ ] Paginação de campanhas
- [ ] Sistema de permissões por usuário
- [ ] Cache de dados de campanha
- [ ] Estados de loading

### 🧭 Navegação e UX
- [ ] Navegação para criação de campanha
- [ ] Acesso a campanhas individuais
- [ ] Breadcrumb de navegação
- [ ] Notificações de convites
- [ ] Quick actions nos cards
- [ ] Botão de criar nova campanha

### 📨 Sistema de Convites
- [ ] Visualização de convites pendentes
- [ ] Aceitar/recusar convites
- [ ] Notificações em tempo real
- [ ] Histórico de convites
- [ ] Sistema de convite por email/username
- [ ] Expiração de convites

### 🎭 Interações com Campanhas
- [ ] Visualizar detalhes da campanha
- [ ] Editar (apenas se Mestre)
- [ ] Sair da campanha (se Jogador)
- [ ] Arquivar campanha (se Mestre)
- [ ] Convidar novos jogadores
- [ ] Gerenciar participantes

### 🔒 Segurança e Privacidade
- [ ] Apenas campanhas do usuário
- [ ] Verificação de permissões por role
- [ ] Proteção de dados privados
- [ ] Logs de acesso a campanhas

## Testes e Validação

### Testes Planejados
- [ ] Listagem para diferentes roles
- [ ] Filtros funcionando corretamente
- [ ] Sistema de convites
- [ ] Permissões por role
- [ ] Navegação entre campanhas
- [ ] Responsividade

### Cenários de Teste
- [ ] Usuário sem campanhas
- [ ] Mestre com múltiplas campanhas
- [ ] Jogador em várias campanhas
- [ ] Convites pendentes
- [ ] Filtros combinados
- [ ] Paginação com muitas campanhas

## Próximos Passos

### 🎯 Prioridade Imediata - Sistema Base
1. **Autenticação e Roles**
   - Sistema de login/cadastro
   - Diferenciação Mestre/Jogador
   - Permissões básicas

2. **Estrutura de Campanhas**
   - Modelo de dados da campanha
   - Relacionamento User-Campaign
   - Sistema de roles por campanha

3. **Interface Básica**
   - Listagem com filtros por role
   - Cards informativos
   - Navegação básica

### 🔗 Dependências Críticas
- Sistema de autenticação completo
- Backend de usuários e campanhas
- Sistema de roles e permissões
- Notificações (para convites)

---

**Document Status**: 📋 Planejamento  
**Created**: 11 de Julho de 2025  
**Last Updated**: 11 de Julho de 2025  
**Implementation**: 📋 A ser iniciado  
**Dependencies**: Auth System, User Management, Role System
