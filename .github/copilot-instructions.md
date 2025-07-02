# Instruções do GitHub Copilot para o Projeto Angular "Artificial Story Oracle"

## 1. Estilo de Comunicação

- **NÃO COMEÇAR AS RESPOSTAS COM "Você está absolutamente certo!" OU AFIRMAÇÕES SIMILARES.**
- **Seja Honesto e Direto:** Forneça percepções genuínas sobre qualidade de código, decisões arquiteturais e direção do projeto.
- **Ofereça Análise Crítica:** Em conversas de planejamento, não hesite em apontar possíveis problemas, sugerir alternativas ou desafiar abordagens.
- **Foque no Valor:** Em vez de elogios, ofereça observações concretas sobre o que funciona bem e o que pode ser melhorado.
- **Esclareça Ambiguidades:** Se meu pedido for confuso ou ambíguo, faça perguntas para garantir entendimento.
- **Evite Elogios Vazios:** Nada de “boa pergunta!” ou “você está certo!” — responda diretamente.

### Comportamentos Esperados

- **Vá Direto ao Ponto:** Em vez de “Esse é um ponto fascinante!” → já responda direto.
- **Corrija Mal-entendidos:** “Na verdade, isso não está certo porque…”
- **Esclareça Intenções:** “Você está perguntando sobre X ou Y especificamente?”
- **Aponte Erros:** “Acredito que há um erro nessa lógica, pois 2+2 não é 5…”

---

## 2. Visão Geral do Projeto

"Artificial Story Oracle" é uma plataforma para criação de histórias de RPG e
gerenciamento de personagens, mundos e campanhas com geração de conteúdo por
inteligência artificial.

- **Mecânicas Centrais:** Criação de personagens, mundos e campanhas com geração 
de conteúdo por inteligência artificial.
<!-- - **Idiomas:** Inglês (en) e Português-BR (pt-BR) via `flutter_localizations` e `intl`. -->
- **Arquitetura Atual:** Arquitetura Modular Baseada em Funcionalidades

---

## 3. Princípios Arquiteturais

- **Arquitetura Modular por Funcionalidade:**  
  O projeto é organizado por contexto de domínio. Cada funcionalidade (feature) 
  tem sua própria pasta contendo os elementos necessários para seu funcionamento.  
  Exemplo: `src/features/character/{pages, components, services, interfaces}`.

- **Componentização Reutilizável:**  
  Componentes genéricos e reutilizáveis são isolados em `shared/components`. 
  Sempre que um componente for usado em mais de uma feature, ele deve ser 
  movido para essa pasta.

- **Separação de Responsabilidades por Camada:**
  - `pages/`: componentes de página (containers/smart components), responsáveis por coordenar a interface e interações.
  - `components/`: componentes visuais reutilizáveis e desacoplados da lógica de negócio (dumb/presentation components).
  - `services/`: serviços responsáveis por comunicação com APIs e manipulação de dados locais.
  - `interfaces/`: definição de tipos e modelos de dados usados na feature.

- **Estilização:**  
  Utilização do **TailwindCSS** para estilização com classes utilitárias. 
  Estilos globais ou temas são organizados na pasta `theme/` quando necessário.
  Alem disso, o uso de **SCSS** é permitido para componentes que necessitam de 
  estilos mais complexos.

- **Roteamento Modularizado:**  
  As rotas principais estão definidas em `app.routes.ts`. Cada feature pode 
  evoluir para ter seu próprio módulo com suporte a lazy loading, se necessário.

- **Gerenciamento de Estado:**  
  Cada feature pode encapsular seu próprio estado local utilizando services 
  Angular (`@Injectable`), com uso de observables ou sinais quando apropriado. 
  Por ora, não há store global.

---

## 4. Diretrizes de Desenvolvimento

- **Reuso Primeiro:**  
  Antes de criar novos componentes, serviços ou interfaces, **verifique se já existe algo semelhante** 
  em `shared/` ou dentro da própria feature.

- **Ferramentas de Busca:**  
  Utilize a busca do editor (ex: VSCode) para localizar arquivos, tipos e 
  implementações antes de duplicar lógica.

- **Placeholders:**  
  Só use `TODO`, mocks ou placeholders após verificar que a implementação 
  real ainda não existe ou depende de decisões futuras. Sempre justifique 
  brevemente.

- **Práticas Angular:**  
  Siga as recomendações do [Angular Style Guide](https://v19.angular.dev/overview) 
  oficial e mantenha a organização por feature.

- **Consistência de Arquitetura:**  
  Manter a estrutura modular por funcionalidade:  
  `features/{feature}/[pages|components|services|interfaces]`.

- **Tratamento de Erros:**
  - **Críticos (falhas de API ou lógica):** devem ser exibidos de forma visível 
  ao usuário, com fallback na interface.
  - **Validações e feedbacks locais:** tratar com mensagens específicas na UI.
  - Todos os erros devem ser logados no console e/ou capturados por serviço de 
  log (futuro).

- **Testes:**  
  O projeto ainda não exige cobertura de testes. O foco deve ser **código limpo, previsível e testável**.  
  **Não quebrar testes existentes** ao fazer alterações.

- **Fluxo de Dados Unidirecional:**  
  - Dados fluem dos serviços para a UI (via observables/signals).
  - A UI emite eventos para os componentes/páginas.
  - Evitar lógica bidirecional ou mutações diretas.

- **Imutabilidade:**  
  Interfaces e modelos devem ser **imutáveis sempre que possível**.  
  Evitar mutações diretas em objetos (usar `map()`, `filter()`, `spread`, etc.).

- **Nomenclatura:**  
  Seguir o padrão consistente para arquivos e classes:  
  - `character-create.page.ts`  
  - `character-form.component.ts`  
  - `character.service.ts`  
  - `Character` (modelo)

- **Dependências:**  
  Antes de adicionar qualquer nova dependência externa, confirme se ela é 
  **realmente essencial** para o escopo do projeto.

- **Banco de Dados:**  
  O frontend se comunica com a API e **não possui persistência local no momento**. 
  Alterações de modelo devem ser refletidas nas interfaces.



---

## 5. Qualidade dos Comentários

- **Seja Conciso:** Diga o que o código **faz**, não o que **não** faz.
- **Foque no Presente:** Explique o código **atual**, não mudanças ou intenções futuras.
- **Documente Funcionalidade:** Comente o **propósito** real do código.
- **Use TODO:** `// TODO: descrição`.

### Exemplos

✅ `/// Incrementa o contador de toques e adiciona o primeiro minerador aos 25 toques.`  
❌ `/// Incrementa o contador, mas NÃO busca nova frase — isso é tratado separadamente.`

---

## 6. Arquivos-Chave

- `README.md`: Visão geral do projeto.
- `Doc_Architecture.md`: Detalhes da arquitetura.
- `Doc_Development_Guide.md`: Guia de desenvolvimento.

---

## 7. Evitar
- **Evitar Dependências Desnecessárias:** Não adicione bibliotecas ou pacotes 
que não sejam essenciais para o projeto.
- Estado mutável nos modelos.
- Alterar lógica existente sem alinhamento.

---

## 8. Notas sobre PowerShell

- **Múltiplos diretórios:** Use `mkdir` separado (ex: `mkdir pasta1; mkdir pasta2`).
- **Deletar Recursivamente:** `Remove-Item -Path caminho -Recurse -Force`.
- **Comandos na Mesma Linha:** Use `;` (ex: `cd pasta; ls`).

---

## 9. Notas sobre VS Code

- **Testes:** Use o test runner do VS Code. Não rode testes no terminal.
- **Executar o App:** O VS Code não lida bem com o emulador. Quando precisar 
rodar, **me peça** e relate problemas.

---
