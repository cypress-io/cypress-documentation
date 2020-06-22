---
title: Why Cypress?
---

{% note info %}
# {% fa fa-graduation-cap %} Czego się tutaj dowiesz

- Co to jest Cypress i dlaczego warto go używać
- Nasza misja i to, w co wierzymy
- Najważniejsze funkcje Cypress
{% endnote %}

<!-- textlint-disable -->
{% video youtube LcGHiFnBh3Y %}
<!-- textlint-enable -->

# W skrócie

Cypress to narzędzie testujące nowej generacji przeznaczone dla nowoczesnej sieci. Zajmujemy się kluczowymi problemami, z jakimi borykają się programiści i inżynierowie kontroli jakości podczas testowania nowoczesnych aplikacji.

Umożliwiamy:

- {% urlHash 'Skonfigurowanie testów' Setting-up-tests %}
- {% urlHash 'Pisanie testów' Writing-tests %}
- {% urlHash 'Uruchamianie testów' Running-tests %}
- {% urlHash 'Debugowanie testów' Debugging-tests %}

Cypress jest najczęściej porównywany do Selenium; jednak Cypress różni się zasadniczo i architektonicznie. Cypress nie podlega takim samym ograniczeniom jak Selenium.

Umożliwia to **szybsze pisanie**, **łatwiejsze** oraz **bardziej wiarygodne** testy.

# Kto korzysta z Cypress?

Nasi użytkownicy to zazwyczaj programiści lub inżynierowie QA budujący aplikacje internetowe przy użyciu nowoczesnych platform JavaScript.

Cypress umożliwia pisanie wszystkich rodzajów testów:

- Kompleksowe testy
- Testy integracyjne
- Testy jednostkowe

Cypress może przetestować wszystko, co działa w przeglądarce.

# Ekosystem Cypress

Cypress składa się z wolnego, {% url "open source-owego" https://github.com/cypress-io/cypress %}, {% url "instalowanego lokalnie" installing-cypress %} Test Runnera **oraz** usługi Dashboard Service dla {% url 'nagrywania twoich testów' dashboard-introduction%}.

- ***Najpierw:*** Cypress pomaga skonfigurować i rozpocząć pisanie testów każdego dnia podczas tworzenia aplikacji lokalnie. *TDD w najlepszym wydaniu!*
- ***Później:*** Po zbudowaniu zestawu testów i {% url "integracji Cypress" continuous-integration %} z twoim dostawcą CI, nasz  {% url 'Dashboard Service' dashboard-introduction%} może nagrywać twoje testy. Nigdy nie będziesz musiał się zastanawiać: *Dlaczego to się nie udało, nie przeszło?*

# Nasza misja

Naszą misją jest zbudowanie dobrze prosperującego ekosystemu open source, który poprawia wydajność, sprawia, że testowanie jest przyjemnym doświadczeniem i zapewnia szczęście programistom. Jesteśmy odpowiedzialni za wspieranie procesu testowania, **który faktycznie działa**.

Uważamy, że nasza dokumentacja powinna być dostępna. Oznacza to umożliwienie naszym czytelnikom pełnego zrozumienia nie tylko **co**, ale również **dlaczego**.

Chcemy pomagać programistom w tworzeniu nowej generacji nowoczesnych aplikacji szybciej, lepiej, bez stresu i obaw związanych z zarządzaniem testami.

Wiemy, że aby odnieść sukces, musimy dostarczyć, pielęgnować i wspierać ekosystem, który kwitnie na otwartym oprogramowaniu. Każda linia kodu testowego jest inwestycją w **twoją bazę kodów**, nigdy nie będzie powiązana z nami jako płatna usługa lub firma. Testy będą mogły działać i pracować niezależnie, *zawsze*.

Uważamy, że testowanie wymaga wiele {% fa fa-heart %} a my jesteśmy tutaj, aby zbudować narzędzie, usługę i społeczność, z której każdy może się uczyć i korzystać. Rozwiązujemy najtrudniejsze punkty sprawiające ból dzielone przez każdego programistę pracującego webowo. Wierzymy w tę misję i mamy nadzieję, że dołączysz do nas, aby uczynić Cypress trwałym ekosystemem, który uszczęśliwia wszystkich.

# Cechy

Cypress jest w pełni gotowy, w tym naładowany. Oto lista rzeczy, które może zrobić, których nie może zapewnić żadna inna platforma testowa:

- **Podróż w czasie:** Cypress wykonuje migawki podczas uruchamiania testów. Najedź kursorem na polecenia w {% url 'Command Log' test-runner#Command-Log %} aby zobaczyć dokładnie, co się stało na każdym kroku.
- **Debuggowalność:** Przestań zgadywać, dlaczego Twoje testy zawodzą. {% url 'Debugowanie bezpośrednio' debugging %} ze znanych narzędzi, takich jak narzędzia dla programistów. Nasze czytelne błędy i ślady stosu sprawiają, że debugowanie jest szybkie jak błyskawica.
- **Automatyczne oczekiwanie:** Nigdy nie dodawaj waits czy sleeps do swoich testów. Cypress {% url 'automatycznie czeka' introduction-to-cypress#Cypress-is-Not-Like-jQuery %} dla poleceń i asercji przed przejściem dalej. Nigdy więcej asynchronicznego piekła.
- **Spies, Stubs, i Clocks:** Zweryfikuj i {% url 'kontroluj zachowanie' stubs-spies-and-clocks %} funkcji, odpowiedzi serwera lub liczników czasu. Ta sama funkcjonalność, którą kochasz w testowaniu jednostkowym, jest na wyciągnięcie ręki.
- **Kontrola ruchu sieciowego:** Z łatwością {% url 'kontroluj, stubuj, i testuj przypadki edge cases' network-requests %} bez udziału twojego serwera. Możesz ograniczyć ruch sieciowy, jak chcesz.
- **Spójne wyniki:** Nasza architektura nie korzysta z Selenium ani WebDriver. Przywitaj się z szybkimi, spójnymi i niezawodnymi testami bez niespodzianek.
- **Screenshoty i wideo:** Przeglądaj zrzuty ekranu zrobione automatycznie w przypadku awarii lub wideo z całego zestawu testów po uruchomieniu z CLI.
- **Testowanie w różnych przeglądarkach:** Przeprowadź testy w przeglądarkach Firefox i Chrome (w tym Edge i Electron) lokalnie i {% url "optymalnie w pipeline Ciągłej Integracji" cross-browser-testing %}.

## {% fa fa-cog %} Konfigurowanie testów

Nie ma żadnych serwerów, sterowników ani żadnych innych zależności do zainstalowania lub skonfigurowania. Możesz napisać swój pierwszy pozytywny test w 60 sekund.

{% video local /img/snippets/installing-cli.mp4 %}

## {% fa fa-code %} Pisanie testów

Testy napisane w Cypress mają być łatwe do odczytania i zrozumienia. Nasze API jest w pełni gotowe, oprócz narzędzi, które już znasz.

{% video local /img/snippets/writing-tests.mp4 %}

## {% fa fa-play-circle %} Uruchamianie testów

Cypress działa tak szybko, jak przeglądarka może renderować zawartość. Podczas oglądania aplikacji możesz oglądać testy przeprowadzane w czasie rzeczywistym. TDD FTW!

{% video local /img/snippets/running-tests.mp4 %}

## {% fa fa-bug %} Debuggowanie testów

Czytelne komunikaty o błędach pomagają szybko debugować. Masz również dostęp do wszystkich narzędzi programistycznych, które znasz i lubisz.

{% video local /img/snippets/debugging.mp4 %}
