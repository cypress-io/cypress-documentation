---
title: ¿Por qué Cypress?
---

{% note info %}
# {% fa fa-graduation-cap %} Aprenderás

- Qué es Cypress y por qué deberías usarlo
- Nuestra misión y en que creemos
- Principales recursos de Cypress

{% endnote %}

# Breve definición

Cypress es una herramienta de testeo front end de última generación creada para la web moderna. Abordamos las principales dificultades que desarrolladores e ingenieros de control de calidad enfrentan al testear aplicaciones modernas.

Permitimos:

- {% urlHash 'Configurar tests' Configurar-tests %}
- {% urlHash 'Escribir tests' Escribir-tests %}
- {% urlHash 'Ejecutar tests' Ejecutar-tests %}
- {% urlHash 'Depurar tests' Depurar-tests %}

Cypress es normalmente comparado con Selenium; aunque Cypress es diferente en sus fundamentos y arquitectura. Cypress no está limitado por las mismas restricciones que Selenium.

Esto permite que puedas **escribir tests más rápidos**, **más fáciles** y **más confiables**.

# ¿Quién usa Cypress?

Nuestros usuarios son en general desarrolladores e ingenieros de control de calidad que crean aplicaciones web usando modernos frameworks de JavaScript.

Cypress permite que puedas escribir todo tipo de tests:

- Tests punta a punta (end-to-end)
- Tests de Integración
- Tests unitarios

Cypress puede testear cualquier cosa que sea ejecutada en un navegador.

# Ecosistema de Cypress

Cypress es gratis, de {% url "código abierto" https://github.com/cypress-io/cypress %} y de {% url "Instalación local" installing-cypress %}, y consiste de un ejecutor de tests (Test Runner) **y de un** Servicio de panel de control para {% url 'grabar tus tests' dashboard-introduction%}.

- ***Primero:*** Cypress te ayuda a configurar y empezar a escribir tests mientras creas tu aplicación localmente. *¡TDD es lo mejor!*
- ***Después:*** Después de crear una suite de tests y de {% url "integrar Cypress" continuous-integration %} con tu proveedor de Integración Continua, nuestro {% url 'Servicio de panel de control' dashboard-introduction%} puede grabar tus ejecuciones de tests. Nunca te tendrás que preguntar: *¿Por qué falló?*

# Nuestra misión

Nuestra misión es construir un ecosistema de código abierto que mejore la productividad, que haga del testeo una experiencia disfrutable y que le genere felicidad al desarrollador. Nos hacemos responsables de defender un proceso de testeo que **realmente funciona**.

Creemos que nuestra documentación debe ser simple y accesible. Eso significa que nuestros lectores comprendan no solo el **qué** sino también el **porqué**.

Queremos ayudar a los desarrolladores a crear una nueva generación de aplicaciones modernas de manera más rápida, mejor y sin las preocupaciones o ansiedades asociadas a la gestión de tests.

Sabemos que para lograrlo necesitamos habilitar, nutrir y promover un ecosistema que se base en el código abierto. Cada línea de código de un test es una inversión en **tu código fuente**, nunca será asociado a nosotros como un servicio pago o empresa. Los tests van a ser *siempre* capaces de ejecutarse y trabajar de manera independiente.

Creemos que el testeo necesita de mucho {% fa fa-heart %} y estamos aquí para crear una herramienta, un servicio y una comunidad para que todos puedan aprender y verse beneficiados. Estamos resolviendo los puntos más sufridos que todos los desarrolladores que trabajan en la web comparten. Creemos en esta misión y esperamos que te unas a nosotros para hacer de Cypress un ecosistema duradero que haga a todos felices.

# Recursos

Cypress viene ya listo, con pilas incluidas. Esta es una lista de cosas que Cypress puede hacer y ningún otro Framework de testeo puede:

- **Viajes en el tiempo:** Cypress toma capturas de pantalla mientras ejecutas tus tests. Posa tu mouse sobre los comandos en el {% url 'Log de Comando' test-runner#Command-Log %} para ver exactamente que pasa en cada paso.
- **Depuración:** Deja de adivinar porqué falla tu test. {% url 'Depura directamente' debugging %} desde herramientas conocidas como Developer Tools. Nuestros errores legibles y rastreos de pila hace que depurar sea extremadamente rápido.
- **Espera automática:** Nunca agregues "wait" o "sleep" a tus tests. Cypress {% url 'espera automáticamente' introduction-to-cypress#Cypress-is-Not-Like-jQuery %} por comandos y aserciones antes de seguir. Nunca más sufrirás el infierno asincrónico.
- **Spy, Stub y Clock:** Verifica y {% url 'controla el comportamiento' stubs-spies-and-clocks %} de funciones, respuestas del servidor o temporizadores. La misma funcionalidad que adoras de los tests de unidad ahora está a tu alcance.
- **Control del tráfico de red:** {% url 'Controla, bloquea, y testea casos límites' network-requests %} fácilmente sin involucrar al servidor. Puedes manejar el tráfico de red como quieras.
- **Resultados consistentes:** Nuestra arquitectura no usa Selenium o WebDriver. Tests rápidos, consistentes y confiables.
- **Capturas de pantalla y videos:** Puedes ver capturas de pantalla tomadas automáticamente en casos de falla, o videos de tu suite de tests completa cuando es ejecutada desde la CLI.

## {% fa fa-cog %} Configurar tests

Sin servidores, Drivers o dependencias que instalar o configurar. Puedes escribir tu primer test válido en 60 segundos.

{% video local /img/snippets/installing-cli.mp4 %}

## {% fa fa-code %} Escribir tests

Los tests escritos en Cypress son fáciles de leer y comprender. Nuestra API está lista para ser usada con las herramientas que ya conoces.

{% video local /img/snippets/writing-tests.mp4 %}

## {% fa fa-play-circle %} Ejecutar tests

Cypress corre tan rápido como tu navegador renderiza contenido. Puedes ver tests siendo ejecutados en tiempo real mientras desarrollas tus aplicaciones. TDD FTW!

{% video local /img/snippets/running-tests.mp4 %}

## {% fa fa-bug %} Depurar tests

Mensajes de error claros te ayudan a depurar rápidamente. También tienes acceso a todas las herramientas de desarrollo que ya conoces y amas.

{% video local /img/snippets/debugging.mp4 %}
