# Artificial Story Oracle - Tutoriais de Execução

## 🚀 Guia de Início Rápido

Este documento fornece tutoriais abrangentes para configurar, executar e desenvolver a aplicação Artificial Story Oracle.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados em seu sistema:

### Software Necessário
- **Node.js** (versão 18.x ou superior)
- **npm** (vem com Node.js) ou **yarn**
- **Git** (para controle de versão)
- **Angular CLI** (será instalado globalmente)

### Requisitos do Sistema
- **Sistema Operacional**: Windows 10/11, macOS ou Linux
- **RAM**: Mínimo 4GB (8GB recomendado)
- **Armazenamento**: Pelo menos 1GB de espaço livre
- **Navegador**: Chrome, Firefox, Safari ou Edge (versões mais recentes)

## 🔧 Tutorial de Instalação

### Passo 1: Clonar o Repositório
```bash
# Clonar o repositório do projeto
git clone [url-do-repositorio]

# Navegar para o diretório do projeto
cd artificial-story-oracle
```

### Passo 2: Instalar Dependências
```bash
# Instalar dependências do projeto
npm install

# Alternativa com yarn
yarn install
```

### Passo 3: Instalar Angular CLI (se não instalado)
```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli

# Verificar instalação
ng version
```

### Passo 4: Verificar Instalação
```bash
# Verificar se todas as dependências foram instaladas corretamente
npm list

# Verificar vulnerabilidades de segurança
npm audit
```

## 🏃‍♂️ Executando a Aplicação

### Modo de Desenvolvimento

#### Servidor de Desenvolvimento Básico
```bash
# Iniciar servidor de desenvolvimento
npm start

# Comando alternativo
ng serve
```

**O que acontece:**
- Inicia o servidor de desenvolvimento em `http://localhost:4200`
- Habilita hot reload para atualizações em tempo real
- Abre o navegador padrão automaticamente
- Exibe erros de compilação no console

#### Opções Avançadas de Desenvolvimento
```bash
# Servir em porta específica
ng serve --port 4300

# Servir em host específico
ng serve --host 0.0.0.0

# Abrir navegador automaticamente
ng serve --open

# Habilitar source maps para debugging
ng serve --source-map
```

### Modo Watch
```bash
# Build em modo watch (reconstrói quando arquivos mudam)
npm run watch

# Alternativa
ng build --watch --configuration development
```

### Build de Produção
```bash
# Build para produção
npm run build

# Build com configuração específica
ng build --configuration production

# Build com otimização (comando antigo)
ng build --prod
```

## 🧪 Tutoriais de Teste

### Executando Testes Unitários
```bash
# Executar todos os testes unitários
npm test

# Comando alternativo
ng test

# Executar testes em modo watch
ng test --watch

# Executar testes com cobertura de código
ng test --code-coverage
```

### Configuração de Testes
```bash
# Executar testes em modo headless (para CI/CD)
ng test --browsers ChromeHeadless --watch=false

# Executar arquivo de teste específico
ng test --include="**/character.component.spec.ts"
```

## 🎨 Fluxos de Trabalho de Desenvolvimento

### Qualidade de Código e Formatação

#### Linting
```bash
# Executar ESLint
npm run lint

# Corrigir problemas auto-corrigíveis
ng lint --fix
```

#### Formatação de Código
```bash
# Formatar todos os arquivos de código
npm run format:all

# Formatar apenas arquivos CSS/SCSS
npm run format:css

# Verificar formatação sem corrigir
npm run format:css:check
```

### Geração de Componentes
```bash
# Gerar novo componente
ng generate component features/nova-funcionalidade

# Gerar componente com roteamento
ng generate component features/nova-funcionalidade --routing

# Gerar componente em módulo específico
ng generate component features/character/components/novo-componente
```

### Geração de Serviços
```bash
# Gerar novo serviço
ng generate service features/character/services/novo-servico

# Gerar serviço com interface
ng generate service features/character/services/novo-servico --interface
```

## 🔍 Tutoriais de Debug

### DevTools do Navegador
1. Abrir DevTools do navegador (F12)
2. Navegar para a aba Sources
3. Definir breakpoints nos arquivos TypeScript
4. Usar console para debug em tempo de execução

### Angular DevTools
```bash
# Instalar extensão Angular DevTools
# Disponível para Chrome e Firefox
# Fornece inspeção da árvore de componentes e profiling
```

### Debug no VS Code
Criar `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Executar Chrome contra localhost",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## 🚀 Tutoriais de Deploy

### Build de Produção Local
```bash
# Build para produção
npm run build

# Servir build de produção localmente
npx http-server dist/artificial-story-oracle -p 8080
```

### Deploy no Firebase (Exemplo)
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar Firebase
firebase init

# Build e deploy
npm run build
firebase deploy
```

### Deploy com Docker
Criar `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist/artificial-story-oracle /usr/share/nginx/html
```

## 🛠️ Configuração do Ambiente de Desenvolvimento

### Extensões do VS Code (Recomendadas)
- Angular Language Service
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Angular Snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Configurações do VS Code
Criar `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🔄 Melhores Práticas de Fluxo de Trabalho

### Fluxo de Trabalho Diário de Desenvolvimento
1. **Baixar últimas alterações**
   ```bash
   git pull origin main
   ```

2. **Instalar/atualizar dependências**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Executar testes durante desenvolvimento**
   ```bash
   npm test
   ```

5. **Formatar e fazer lint antes do commit**
   ```bash
   npm run format:all
   npm run lint
   ```

### Fluxo de Trabalho para Desenvolvimento de Funcionalidades
1. **Criar branch da funcionalidade**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

2. **Gerar componentes/serviços**
   ```bash
   ng generate component features/nova-funcionalidade
   ```

3. **Implementar funcionalidade com testes**
4. **Executar verificações de qualidade**
   ```bash
   npm run lint
   npm test
   ```

5. **Commit e push**
   ```bash
   git add .
   git commit -m "feat: adicionar nova funcionalidade"
   git push origin feature/nova-funcionalidade
   ```

## 🚨 Resolução de Problemas

### Problemas Comuns e Soluções

#### Porta Já em Uso
```bash
# Encontrar processo usando porta 4200
netstat -ano | findstr :4200  # Windows
lsof -ti:4200                 # macOS/Linux

# Matar o processo
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

#### Problemas com Node Modules
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules & del package-lock.json  # Windows
npm install
```

#### Problemas com Angular CLI
```bash
# Limpar cache do Angular CLI
ng cache clean

# Atualizar Angular CLI
npm update -g @angular/cli
```

#### Problemas de Memória
```bash
# Aumentar limite de memória do Node.js
set NODE_OPTIONS=--max_old_space_size=8192  # Windows
export NODE_OPTIONS=--max_old_space_size=8192  # macOS/Linux
```

## 📊 Otimização de Performance

### Otimização de Build
```bash
# Analisar tamanho do bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/artificial-story-oracle/stats.json
```

### Performance de Desenvolvimento
```bash
# Desabilitar source maps para builds mais rápidos
ng serve --source-map=false

# Usar source maps inline
ng serve --source-map --inline-source-map
```

## 📚 Recursos Adicionais

### Documentação Oficial
- [Documentação Angular](https://angular.io/docs)
- [Documentação PrimeNG](https://primeng.org/)
- [Manual TypeScript](https://www.typescriptlang.org/docs/)

### Ferramentas de Desenvolvimento
- [Angular DevTools](https://angular.io/guide/devtools)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [VS Code Angular Extension Pack](https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials)

---

**Versão do Documento**: 1.0  
**Última Atualização**: 30 de Junho de 2025  
**Ambiente**: Angular 19.2.0, Node.js 18+
