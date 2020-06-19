---
title: Users
---

Użytkownik to każdy, kto loguje się do usługi Dashboard.

# Zaproś użytkowników

Możesz zaprosić użytkowników do Cypress z {% url 'Dashboard Service' https://on.cypress.io/dashboard %}. Zaproszeni użytkownicy zobaczą wszystkie projekty i testy uruchomione dla organizacji.

## Zaproś użytkownika do organizacji:

1. Przejdź do {% url "Strona organizacji" https://on.cypress.io/dashboard/organizations %} aby wybrać organizację, do której chcesz zaprosić użytkownika.
2. Kliknij **Użytkownicy**, następnie **Zaproś użytkownika**. *Uwaga: musisz mieć {% urlHash "uprawnienia 'owner' lub 'admin'" User-roles %} aby zaprosić uzytkowników.*
3. Wpisz ich adres e-mail i wybierz ich {% urlHash "role" User-roles %} następnie kliknij **Zaproś użytkownika** *Uwaga: tylko właściciele mogą dać innym użytkonikom uprawnienia 'właściciela'.*
4. Użytkownik otrzyma wiadomość e-mail z zaproszeniem z linkiem do przyjęcia zaproszenia.

{% imgTag /img/dashboard/invite-user-dialog.png "Invite User dialog" %}

# Role użytkowników

Użytkownikom można przypisywać role, które wpływają na ich dostęp do niektórych funkcji {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

- **Członek:** Widzi projekty, przebiegi i klucze.
- **Admin:** Może również zapraszać, edytować i usuwać użytkowników.
- **Właściciel:** Może także przenosić lub usuwać projekty. Może usuwać i edytować organizację.

Uprawnienia dla każdej roli użytkownika dla Dashboard Service.

| Uprawnienia                                        |  |  | |
| ---------------------------------------------------|--------|-------|------|
| Zobacz nagrania testowe prywatnych projektów            | ✅ **Członek**    | ✅ **Admin**    | ✅ **Właściciel** |
| Zobacz klucze rekordów projektów                        | ✅ **Członek**    | ✅ **Admin**    | ✅ **Właściciel** |
| Zobacz informacje rozliczeniowe i dotyczące użytkowania                 |        | ✅ **Admin**    | ✅ **Właściciel** |
| Edytuj informacje rozliczeniowe                           |        | ✅ **Admin**    | ✅ **Właściciel** |
| Zobacz użytkowników zaproszonych do organizacji                  |        | ✅ **Admin**    | ✅ **Właściciel** |
| Wyślij zaproszenie ponownie do zaproszonego użytkownika                  |        | ✅ **Admin**    | ✅ **Właściciel** |
| Zaproś 'członka' do organizacji                    |        | ✅ **Admin**    | ✅ **Właściciel** |
| Zaproś 'admina' do organizacji                     |        | ✅ **Admin**    | ✅ **Właściciel** |
| Zobacz prośby użytkowników o dołączenie do organizacji            |        | ✅ **Admin**    | ✅ **Właściciel** |
| Akceptuj prośby użytkowników o dołączenie do organizacji          |        | ✅ **Admin**    | ✅ **Właściciel** |
| Usuń 'członka' z organizacji                 |        | ✅ **Admin**    | ✅ **Właściciel** |
| Usuń 'admin' z organizacji                    |        | ✅ **Admin**    | ✅ **Właściciel** |
| Edytuj 'członka' w organizacji                      |        | ✅ **Admin**    | ✅ **Właściciel** |
| Edytuj 'admina' w organizacji                       |        | ✅ **Admin**    | ✅ **Właściciel** |
| Edytuj nazwę projektu                                  |        | ✅ **Admin**    | ✅ **Właściciel** |
| Edytuj status projektu (prywatny/publiczny}               |        | ✅ **Admin**    | ✅ **Właściciel** |
| Dodaj lub usuń klucze nagrania                          |        | ✅ **Admin**    | ✅ **Właściciel** |
| Zaproś 'właściciela' do organizacji                     |        |        | ✅ **Właściciel** |
| Edytuj 'właściciela' w organizacji                       |        |        | ✅ **Właściciel** |
| Usuń 'właściciela' z organizacji                   |        |        | ✅ **Właściciel** |
| Dodaj, edytuj, usuń użytkownika w osobistej organizacji    |        |        | ✅ **Właściciel** |
| Edytuj nazwę organizacji                             |        |        | ✅ **Właściciel** |
| Usuń organizację                                |        |        | ✅ **Właściciel** |
| Przenieś projekt do innej organizacji           |        |        | ✅ **Właściciel** |
| Usuń projekt                                     |        |        | ✅ **Właściciel** |

# Żądania użytkownika

Użytkownicy mogą "requestować" o dostęp do danej organizacji. Jeśli programista w twoim zespole ma dostęp do Cypress i kodu źródłowego twojego projektu - może poprosić o przyznanie dostępu do twojej organizacji. Oznacza to, że zamiast zapraszać członków zespołu, z góry mogą poprosić o dostęp, a ty możesz zaakceptować lub odmówić im dostępu.

{% imgTag /img/dashboard/request-access-to-organization.png "Request access to project" %}
