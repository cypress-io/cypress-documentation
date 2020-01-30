---
title: Por quê o Cypress?
---

{% note info %}
# {% fa fa-graduation-cap %} O que você aprenderá

- O que é Cypress e por que você deve usá-lo
- Nossa missão e em que acreditamos
- Principais recursos do Cypress

{% endnote %}

# Breve definição

Cypress é uma ferramenta de teste de última geração para front end criada para a web moderna. Abordamos os principais pontos problemáticos que os desenvolvedores e engenheiros de QA enfrentam ao testar aplicações modernas.

Nós simplificamos:

- {% urlHash 'Configurando os testes' Configurando-testes %}
- {% urlHash 'Escrevendo testes' Escrevendo-testes %}
- {% urlHash 'Executando testes' Executando-testes %}
- {% urlHash 'Debugando Testes' Debugando-testes %}

Cypress é mais frequentemente comparado com o Selenium; no entanto, Cypress é fundamentalmente e arquiteturalmente diferente. Cypress não é limitado pelas mesmas restrições que o Selenium.

Isso permite que você  **escreva testes mais rápidos**, **mais fáceis** e **mais confiáveis**.

# Quem usa o Cypress?

Nossos usuários geralmente são desenvolvedores ou engenheiros de QA que criam aplicações web usando frameworks modernos de JavaScript.

O Cypress permite que você escreva todos os tipos de teste:

- Testes de ponta a ponta (E2E)
- Testes de Integração
- Testes Unitários

Cypress pode testar qualquer coisa que seja executada em um navegador.

# Ecossitema do Cypress

O Cypress consiste em um gratuito, {% url "open source" https://github.com/cypress-io/cypress %}, {% url "instalação local" installing-cypress %} Test Runner **e** Serviço de Dashboard para {% url 'gravar seus testes' dashboard-introduction%}.

- ***Primeiramente:*** O Cypress facilita a configuração e o início da gravação de testes diários enquanto você constroi a estrutura do seu aplicativo *TDD no seu melhor!*
- ***Posteriormente:*** Após construir sua suíte de testes {% url "integrando o Cypress" continuous-integration %} com seu Provedor de CI , nosso {% url 'Serviço de Dashboard' dashboard-introduction%} pode registrar suas execuções de teste. Você nunca terá que se perguntar: *Por que isso falhou?*

# Nossa missão

Nossa missão é construir um ecossistema open source que aprimore a produtividade, torne o teste uma experiência agradável e gere a felicidade do desenvolvedor.
Nós nos responsabilizamos por defender um processo de teste que **realmente funciona**.

Acreditamos que nossa documentação deve ser simples e acessível. Isso significa permitir que nossos leitores compreendam completamente e não apenas o **porque** e o **como** também.

Queremos ajudar os desenvolvedores a criar uma nova geração de aplicações modernas de maneira mais rápida, melhor e sem o estresse e a ansiedade que associamos ao gerenciamento de testes.

Sabemos que, para sermos bem-sucedidos, precisamos habilitar, nutrir e promover um ecossistema que cresça como open source. Cada linha de teste é um investimento no seu **código fonte**, nunca será associados a nós como um serviço pago ou empresa. Os testes serão capazes de executar e trabalhar independentemente *sempre*.

Acreditamos que o teste precisa de muito {% fa fa-heart %} e estamos aqui para criar uma ferramenta, um serviço e uma comunidade na qual todos possam aprender e se beneficiar. Estamos resolvendo os pontos mais difícies compartilhados por todos os desenvolvedores que trabalham na web. Acreditamos nessa missão e esperamos que você se junte a nós para tornar o Cypress um ecossistema duradouro que faça todos felizes.

# Recursos

Cypress comes fully baked, batteries included. Here is a list of things it can do that no other testing framework can:

- **Time Travel:** Cypress takes snapshots as your tests run. Hover over commands in the {% url 'Command Log' test-runner#Command-Log %} to see exactly what happened at each step.
- **Debuggability:** Stop guessing why your tests are failing. {% url 'Debug directly' debugging %} from familiar tools like Developer Tools. Our readable errors and stack traces make debugging lightning fast.
- **Automatic Waiting:** Never add waits or sleeps to your tests. Cypress {% url 'automatically waits' introduction-to-cypress#Cypress-is-Not-Like-jQuery %} for commands and assertions before moving on. No more async hell.
- **Spies, Stubs, and Clocks:** Verify and {% url 'control the behavior' stubs-spies-and-clocks %} of functions, server responses, or timers. The same functionality you love from unit testing is right at your fingertips.
- **Network Traffic Control:** Easily {% url 'control, stub, and test edge cases' network-requests %} without involving your server. You can stub network traffic however you like.
- **Resultados Consistentes:** Our architecture doesn’t use Selenium or WebDriver. Say hello to fast, consistent and reliable tests that are flake-free.
- **Screenshots e Vídeos:** View screenshots taken automatically on failure, or videos of your entire test suite when run from the CLI.

## {% fa fa-cog %} Configurando testes

Não há servidores, drivers ou nenhuma outra dependências para instalar ou configurar. Você pode escrever seu primeiro teste aprovado em 60 segundos.

{% video local /img/snippets/installing-cli.mp4 %}

## {% fa fa-code %} Escrevendo testes

Tests written in Cypress are easy to read and understand. Our API comes fully baked, on top of tools you are familiar with already.

{% video local /img/snippets/writing-tests.mp4 %}

## {% fa fa-play-circle %} Executando testes

Cypress runs as fast as your browser can render content. You can watch tests run in real time as you develop your applications. TDD FTW!

{% video local /img/snippets/running-tests.mp4 %}

## {% fa fa-bug %} Debugando testes

Mensagens de erro legíveis ajudam você a debugar rapidamente. Você também tem acesso a todas as ferramentas de desenvolvedor que conhece e ama.

{% video local /img/snippets/debugging.mp4 %}
