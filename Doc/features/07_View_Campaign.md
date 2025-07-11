# 07_View_Campaign

## Overview
Implementação da funcionalidade de visualização de campanhas de RPG, incluindo dashboard para mestres e jogadores, informações da campanha, personagens participantes e progresso.

## Status: 📋 PLANEJADO  
**Started:** [Data de início]  
**Last Updated:** 11 de Julho de 2025

## Fases de Desenvolvimento

### 📋 Parte 1 - BÁSICO (Objetivo Atual)
**Meta**: Dashboard básico com informações da campanha

### 🚀 Parte 2 - MELHORIAS (Futuro)
**Meta**: Recursos avançados, timeline e interatividade

## Funcionalidades

### 🎨 Layout e Design
- [ ] Componente de página de visualização (`view-campaign.page.ts`)
- [ ] Dashboard diferenciado por role (Mestre/Jogador)
- [ ] Layout responsivo em seções
- [ ] Informações da campanha destacadas
- [ ] Cards para personagens participantes
- [ ] Indicadores de status e progresso

### 📊 Informações da Campanha
- [ ] Dados básicos (nome, descrição, sistema)
- [ ] Status atual (ativa, pausada, finalizada)
- [ ] Informações do mestre
- [ ] Número de sessões realizadas
- [ ] Progresso geral da campanha
- [ ] Calendário da campanha
- [ ] Estatísticas gerais

### 👥 Participantes da Campanha
- [ ] Lista de jogadores ativos
- [ ] Personagens de cada jogador
- [ ] Status de aprovação de personagens
- [ ] Informações de participação
- [ ] Últimas atividades
- [ ] Convites pendentes

### 👑 Visão do Mestre
- [ ] Ferramentas de gerenciamento
- [ ] Aprovação de personagens
- [ ] Configurações da campanha
- [ ] Estatísticas detalhadas
- [ ] Controle de acesso
- [ ] Logs de atividade

### 🎭 Visão do Jogador
- [ ] Informações relevantes para jogador
- [ ] Seus personagens na campanha
- [ ] Progresso individual
- [ ] Próximas sessões
- [ ] Notas e lembretes
- [ ] Comunicação com o grupo

### 🔗 Backend e Integração
- [ ] API de visualização (`GET /api/campaigns/:id`)
- [ ] Verificação de permissões por role
- [ ] Carregamento de dados relacionados
- [ ] Estados de loading
- [ ] Cache de dados da campanha
- [ ] Atualizações em tempo real

### 🧭 Navegação e Ações
- [ ] Rota parametrizada `/campanhas/:id`
- [ ] Breadcrumb contextual
- [ ] Botões de ação por role
- [ ] Navegação para edição (se Mestre)
- [ ] Compartilhamento da campanha
- [ ] Convite de novos jogadores

### 📝 Conteúdo da Campanha
- [ ] Descrição e sinopse
- [ ] Regras customizadas
- [ ] Documentos anexos
- [ ] Mapas e imagens
- [ ] NPCs importantes
- [ ] Localidades principais

### 🔒 Segurança e Privacidade
- [ ] Verificação de participação
- [ ] Controle de acesso por role
- [ ] Informações sensíveis (apenas mestre)
- [ ] Logs de acesso
- [ ] Proteção de dados privados

## Testes e Validação

### Testes Planejados
- [ ] Visualização como mestre
- [ ] Visualização como jogador
- [ ] Verificação de permissões
- [ ] Carregamento de dados
- [ ] Responsividade
- [ ] Ações contextuais

### Cenários de Teste
- [ ] Campanha com múltiplos jogadores
- [ ] Campanha em diferentes status
- [ ] Usuário sem permissão
- [ ] Personagens em aprovação
- [ ] Diferentes roles na mesma campanha
- [ ] Campanha sem participantes

## Próximos Passos

### 🎯 Prioridade Imediata - Dashboard Base
1. **Estrutura da Visualização**
   - Dashboard responsivo
   - Diferenciação por role
   - Informações básicas

2. **Integração com Dados**
   - API de campanha por ID
   - Sistema de permissões
   - Carregamento de relacionamentos

3. **UX por Role**
   - Visão específica do mestre
   - Visão específica do jogador
   - Ações contextuais

### 🚀 Recursos Avançados (Fase 2)
- Timeline de eventos da campanha
- Chat/comunicação integrada
- Sistema de notas colaborativas
- Calendário de sessões
- Estatísticas avançadas

---

**Document Status**: 📋 Planejamento  
**Created**: 11 de Julho de 2025  
**Last Updated**: 11 de Julho de 2025  
**Implementation**: 📋 A ser iniciado  
**Dependencies**: Auth System, Campaign Backend, Role System
