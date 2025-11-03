# Documentação - Artificial Story Oracle

## 📖 Índice da Documentação

Bem-vindo à documentação completa do proje### Estrutura Atual
```
📁 artificial-story-oracle/
├── 📄 README.md
├── 📁 Doc/
│   ├── 📄 README.md                       # ✅ Índice da documentação
│   ├── 📄 doc_geral.md                    # ✅ Documentação geral
│   ├── 📄 Doc_Architecture.md             # ✅ Arquitetura
│   ├── 📄 Doc_Development_Guide.md        # ✅ Guia de desenvolvimento
│   ├── 📄 doc_execution_tutorials.md      # ✅ Tutoriais
│   ├── 📄 doc_main_features.md           # ✅ Checklist de features
│   ├── 📁 components/                    # 📁 Padrões de componentes
│   │   └── 📄 component-organization-standards.md  # ✅ Padrões de organização
│   └── 📁 modules/                       # 📁 Módulos específicos
│       ├── 📄 general.md                 # ✅ Módulo geral
│       ├── 📄 login.md                   # ✅ Módulo login
│       ├── 📄 home.md                    # ✅ Módulo home
│       ├── 📄 characters.md              # ✅ Módulo personagens
│       ├── 📄 worlds.md                  # ✅ Módulo mundos
│       └── 📄 campaigns.md               # ✅ Módulo campanhas
└── 📁 src/                               # Código da aplicação
```y Oracle**. Esta página serve como ponto de entrada para toda a documentação do projeto.

---

## 📋 Documentação Geral

### [`doc_geral.md`](./doc_geral.md)
**Visão Geral do Projeto**
- Descrição do projeto
- Tecnologias utilizadas
- Arquitetura base
- Scripts disponíveis
- Estrutura de rotas
- Roadmap do projeto

---

## 🏗️ Documentação Técnica

### [`Doc_Architecture.md`](./Doc_Architecture.md)
**Arquitetura da Aplicação**
- Padrões arquiteturais
- Estrutura de diretórios
- Camadas da aplicação
- Padrões de design
- Sistema de temas
- Estratégias de performance

### [`Doc_Development_Guide.md`](./Doc_Development_Guide.md)
**Guia de Desenvolvimento**
- Convenções de código
- Padrões de componentes
- Padrões de serviços
- Boas práticas
- Configuração de ambiente
- Estratégias de teste

### [`doc_execution_tutorials.md`](./doc_execution_tutorials.md)
**Tutoriais de Execução**
- Configuração inicial
- Comandos de desenvolvimento
- Deploy e build
- Troubleshooting

---

## 📐 Padrões e Convenções

### [`components/component-organization-standards.md`](./components/component-organization-standards.md)
**Padrões de Organização de Componentes**
- Estrutura de imports
- Ordem de propriedades e métodos
- Convenções de nomenclatura
- Injeção de dependências
- Boas práticas
- Exemplos práticos

---

## 🎯 Funcionalidades

### [`doc_main_features.md`](./doc_main_features.md)
**Checklist de Funcionalidades**
- Status de implementação
- Funcionalidades por módulo
- Checklist de desenvolvimento

---

## 📦 Módulos Específicos

### Interface e Layout
- [`modules/general.md`](./modules/general.md) - Layout, header, navegação

### Autenticação
- [`modules/login.md`](./modules/login.md) - Sistema de login com Keycloak

### Páginas Principais
- [`modules/home.md`](./modules/home.md) - Dashboard inicial

### Gestão de Conteúdo
- [`modules/characters.md`](./modules/characters.md) - CRUD de personagens
- [`modules/worlds.md`](./modules/worlds.md) - Gestão de mundos
- [`modules/campaigns.md`](./modules/campaigns.md) - Gestão de campanhas

---

## 🚀 Começando

### Para Desenvolvedores
1. Leia [`doc_geral.md`](./doc_geral.md) para entender o projeto
2. Configure o ambiente seguindo [`doc_execution_tutorials.md`](./doc_execution_tutorials.md)
3. Estude a arquitetura em [`Doc_Architecture.md`](./Doc_Architecture.md)
4. Siga as convenções em [`Doc_Development_Guide.md`](./Doc_Development_Guide.md)

### Para Product Owners
1. Consulte [`doc_main_features.md`](./doc_main_features.md) para status das funcionalidades
2. Veja os módulos específicos para detalhes de cada feature
3. Acompanhe o roadmap em [`doc_geral.md`](./doc_geral.md)

### Para Designers
1. Verifique o sistema de temas em [`Doc_Architecture.md`](./Doc_Architecture.md)
2. Consulte os padrões de componentes em [`Doc_Development_Guide.md`](./Doc_Development_Guide.md)
3. Revise os módulos específicos para entender os fluxos de UI

---

## 📊 Status do Projeto

### Últimas Atualizações
- **Data**: Janeiro 2025
- **Versão**: 1.0.0-alpha
- **Status**: Desenvolvimento Ativo

### Estrutura Atual
```
📁 artificial-story-oracle/
├── 📄 README.md
├── 📁 Doc/
│   ├── 📄 README.md                       # ✅ Índice da documentação
│   ├── 📄 doc_geral.md                    # ✅ Documentação geral
│   ├── 📄 Doc_Architecture.md             # ✅ Arquitetura
│   ├── 📄 Doc_Development_Guide.md        # ✅ Guia de desenvolvimento
│   ├── 📄 doc_execution_tutorials.md      # ✅ Tutoriais
│   ├── 📄 doc_main_features.md           # ✅ Checklist de features
│   └── � modules/                       # 📁 Módulos específicos
│       ├── 📄 general.md                 # ✅ Módulo geral
│       ├── 📄 login.md                   # ✅ Módulo login
│       ├── 📄 home.md                    # ✅ Módulo home
│       ├── 📄 characters.md              # ✅ Módulo personagens
│       ├── 📄 worlds.md                  # ✅ Módulo mundos
│       └── 📄 campaigns.md               # ✅ Módulo campanhas
└── 📁 src/                               # Código da aplicação
```

---

## 🔄 Manutenção da Documentação

### Responsabilidades
- **Arquitetura**: Atualizar quando houver mudanças estruturais
- **Guia de Desenvolvimento**: Revisar quinzenalmente
- **Módulos**: Atualizar conforme implementação de features
- **Tutoriais**: Manter sempre atual com últimos comandos

### Versionamento
- Cada arquivo possui seção de versionamento
- Atualizações devem incluir data e versão
- Mudanças significativas requerem revisão completa

---

## 📞 Contato e Suporte

### Para Dúvidas sobre Documentação
- Consulte primeiro a documentação específica do módulo
- Verifique os tutoriais de execução
- Consulte o guia de desenvolvimento

### Para Contribuições
- Siga os padrões estabelecidos no guia de desenvolvimento
- Mantenha a documentação atualizada junto com o código
- Documente novas features nos módulos correspondentes

---

**Esta documentação é um documento vivo e deve ser atualizada conforme o projeto evolui.**

*Última atualização: Janeiro 2025 • Versão: 1.0*
