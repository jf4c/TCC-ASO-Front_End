# 07_View_Campaign

## Overview
Implementação da funcionalidade de visualização de campanhas de RPG, incluindo dashboard para mestres e jogadores, informações da campanha, personagens participantes e progresso.

## Status: ✅ IMPLEMENTADO - FASE 1 BÁSICA  
**Started:** 24 de Agosto de 2025  
**Last Updated:** 24 de Agosto de 2025

## Fases de Desenvolvimento

### ✅ Parte 1 - BÁSICO (IMPLEMENTADO)
**Meta**: Dashboard básico com informações da campanha

### 🚀 Parte 2 - MELHORIAS (Futuro)
**Meta**: Recursos avançados, timeline e interatividade

## Funcionalidades

### 🎨 Layout e Design
- [x] Componente de página de visualização (`view-campaign.page.ts`)
- [x] Dashboard diferenciado por role (Mestre/Jogador)
- [x] Layout responsivo em seções
- [x] Informações da campanha destacadas
- [x] Cards para personagens participantes
- [x] Indicadores de status e progresso

### 📊 Informações da Campanha
- [x] Dados básicos (nome, descrição, sistema)
- [x] Status atual (ativa, pausada, finalizada)
- [x] Informações do mestre
- [x] Número de sessões realizadas
- [x] Progresso geral da campanha
- [ ] Calendário da campanha
- [x] Estatísticas gerais

### 👥 Participantes da Campanha
- [x] Lista de jogadores ativos
- [x] Personagens de cada jogador
- [x] Status de aprovação de personagens
- [x] Informações de participação
- [ ] Últimas atividades
- [ ] Convites pendentes

### 👑 Visão do Mestre
- [x] Ferramentas de gerenciamento
- [ ] Aprovação de personagens
- [ ] Configurações da campanha
- [x] Estatísticas detalhadas
- [ ] Controle de acesso
- [ ] Logs de atividade

### 🎭 Visão do Jogador
- [x] Informações relevantes para jogador
- [ ] Seus personagens na campanha
- [ ] Progresso individual
- [ ] Próximas sessões
- [ ] Notas e lembretes
- [ ] Comunicação com o grupo

### 🔗 Backend e Integração
- [x] API de visualização (`GET /api/campaigns/:id`) - Mock implementado
- [x] Verificação de permissões por role
- [x] Carregamento de dados relacionados
- [x] Estados de loading
- [ ] Cache de dados da campanha
- [ ] Atualizações em tempo real

### 🧭 Navegação e Ações
- [x] Rota parametrizada `/campanhas/:id`
- [ ] Breadcrumb contextual
- [x] Botões de ação por role
- [x] Navegação para edição (se Mestre) - redireciona para view
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

**Document Status**: ✅ Implementado - Fase 1 Básica Completa  
**Created**: 11 de Julho de 2025  
**Last Updated**: 24 de Agosto de 2025  
**Implementation**: ✅ Funcionalidade base implementada e funcionando  
**Dependencies**: ✅ Auth System (mock), ✅ Campaign Backend (mock), ✅ Role System
