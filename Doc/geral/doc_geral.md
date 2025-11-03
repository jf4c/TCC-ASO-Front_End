# Artificial Story Oracle - Documentação Geral

## 📖 Visão Geral do Projeto

O **Artificial Story Oracle** é uma aplicação web desenvolvida em Angular que funciona como um oráculo artificial para criação e gerenciamento de histórias, focado em elementos de RPG (Role Playing Game). O sistema permite criar e visualizar personagens com diferentes classes e ancestralidades.

## 🎯 Objetivo

Desenvolver uma plataforma interativa que auxilie na criação de narrativas e gerenciamento de personagens para jogos de RPG, utilizando inteligência artificial para enriquecer a experiência do usuário.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 19.2.0** - Framework principal
- **TypeScript 5.7.2** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **PrimeNG 19.1.3** - Biblioteca de componentes UI
- **PrimeIcons 7.0.0** - Ícones
- **RxJS 7.8.0** - Programação reativa

### Ferramentas de Desenvolvimento
- **Angular CLI 19.2.13** - Ferramenta de linha de comando
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Jasmine & Karma** - Testes unitários
- **TypeScript ESLint** - Linting específico para TypeScript

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── app/
│   ├── core/                    # Módulos centrais da aplicação
│   │   └── layout/              # Componentes de layout
│   ├── features/                # Funcionalidades específicas
│   │   ├── character/           # Módulo de personagens
│   │   │   ├── components/      # Componentes de personagem
│   │   │   ├── interface/       # Interfaces e modelos
│   │   │   ├── pages/          # Páginas do módulo
│   │   │   └── services/       # Serviços do módulo
│   │   └── home/               # Módulo da página inicial
│   ├── shared/                 # Componentes compartilhados
│   │   └── components/         # Componentes reutilizáveis
│   └── theme/                  # Configurações de tema
├── assets/                     # Recursos estáticos
└── styles/                     # Estilos globais
```

### Padrões Arquiteturais

- **Arquitetura por Features**: Organização modular baseada em funcionalidades
- **Component-Based Architecture**: Componentes reutilizáveis e independentes
- **Reactive Programming**: Uso de RxJS para gerenciamento de estado reativo
- **Lazy Loading**: Carregamento sob demanda de módulos (preparado para implementação)

##  Sistema de Temas

O projeto implementa um sistema de temas dinâmico:
- **Tema Escuro** (padrão)
- **Tema Claro**
- Alternância dinâmica entre temas

## 🧩 Componentes Principais

### Core Components
- **LayoutComponent**: Layout principal da aplicação
- **HeaderComponent**: Cabeçalho da aplicação

### Feature Components
- **HomeComponent**: Página inicial
- **ListCharacterComponent**: Lista de personagens
- **CharacterCardComponent**: Card individual de personagem

### Shared Components
- **ButtonComponent**: Botão reutilizável
- **InputComponent**: Campo de entrada reutilizável
- **DropdownInputComponent**: Dropdown reutilizável

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Inicia servidor de desenvolvimento
npm run watch               # Build em modo watch

# Qualidade de Código
npm run lint                # Executa linting
npm test                    # Executa testes
npm run format:all          # Formata todo o código
npm run format:css          # Formata apenas CSS/SCSS

# Build
npm run build               # Build de produção
```

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento**:
   ```bash
   npm start
   ```

3. **Acessar a aplicação**:
   ```
   http://localhost:4200
   ```

## 📋 Rotas da Aplicação

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Redirect para `/home` | Rota raiz |
| `/home` | HomeComponent | Página inicial |
| `/personagens` | ListCharacterComponent | Lista de personagens |

## 🎯 Roadmap e Próximos Passos

### Funcionalidades Planejadas
- Sistema de criação de histórias
- Integração com IA para geração de conteúdo
- Sistema de campanhas
- Batalhas automáticas
- Sistema de inventário
- Exportação de personagens

### Melhorias Técnicas
- Implementação de lazy loading
- Adicionar testes unitários completos
- Implementar interceptors HTTP
- Adicionar guards de rota
- Implementar PWA (Progressive Web App)

## 📞 Contato e Contribuição

Este projeto faz parte de um TCC (Trabalho de Conclusão de Curso) e está em desenvolvimento ativo.

---

**Versão da Documentação**: 1.0  
**Última Atualização**: 30 de Junho de 2025  
**Framework**: Angular 19.2.0
