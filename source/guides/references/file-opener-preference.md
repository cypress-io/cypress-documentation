---
title: Settings
---

Some global and project specific settings are available to view and edit within the Test Runner's **Settings** tab. By clicking on each panel, you can see an expanded view of the current settings and in some cases edit the setting directly. 

{% imgTag /img/guides/test-runner-desktop-settings-tab.jpg "Test Runner settings tab" %}

# Configuration

The **Configuration** panel displays resolved {% url "configuration" configuration %} for the current project. Each set value is highlighted to show where the value has been set via the following ways: 

- Default value
- The {% url "configuration file" configuration %}
- The {% url "Cypress environment file" environment-variables#Option-2-cypress-env-json %}
- System {% url "environment variables" environment-variables#Option-3-CYPRESS %}
- {% url "Command Line arguments" command-line %}
- {% url "Plugin file" configuration-api %}

{% imgTag /img/guides/configuration/see-resolved-configuration.jpg "See resolved configuration" %}

# Project ID

The project ID of the current project is displayed in the **Project ID** panel. To learn more about the project ID and it's use, read {% url "this guide" projects#Project-ID %}.

{% imgTag /img/guides/test-runner-settings-projectID-panel.jpg "ProjectID of current project in Desktop" %}

# Record Key

When logged in to the Test Runner and after {% url "setting up the current project to record" projects#Set-up-a-project-to-record %}, the record key of the project will display as well as instructions on how to record the project to the Dashboard.

You can read more about the record key, including what exposing the record key means, in {% url "this guide" projects#Record-key %}. To create a new record key or delete an existing one, you can find insturctions in {% url "this guide" projects#Record-keys %}.

{% imgTag /img/dashboard/record-key-shown-in-desktop-gui-configuration.jpg "Record Key in Configuration Tab" %}

# Node.js Version

The Node version printed in the Node.js Version panel is used in Cypress to:

- Build files in the {% url "`integrationFolder`" configuration#Folders-Files %}.
- Build files in the {% url "`supportFolder`" configuration#Folders-Files %}.
- Execute code in the {% url "`pluginsFile`" configuration#Folders-Files %}.

Cypress comes automatically bundled with a set Node version by default.

You may want to use a different Node version if the code executing from the plugins file requires features present in a different Node version from the Node version bundled with Cypress. You can use the Node version detected on your system by setting the {% url "`nodeVersion`" configuration#Node-version %} configuration to `system`.

{% imgTag /img/guides/test-runner-settings-nodejs-version.jpg "Node version in Settings in Test Runner" %}

# Proxy Settings

Any {% url "proxy configuration" proxy-configuration %} detected by Cypress via environment variables are displayed in the **Proxy Settings** panel. These settings take effect globally, across all projects.

- **Proxy Server:** Cypress will route requests to these domains through the configured proxy server.
- **Proxy Bypass List:**  Cypress will not route requests to these domains through the configured proxy server.

To learn more about how to set up proxy configuration read {% url "this guide" proxy-configuration %}.

{% imgTag /img/guides/test-runner-settings-proxy-configuration.jpg "Proxy Settings in Test Runner" %}

# File Opener Preference

When clicking on a file path from the {% url "Test Runner" test-runner %} in an {% url "error stack trace or a code frame" errors %}, Cypress will attempt to open the file on your system.

The first time you click a file path, Cypress will prompt you to select which location you prefer to open the file. You can choose to open it on your file system (e.g. Finder on MacOS, File Explore on Windows), in a file editor located on your system, or you can specify a path to any application you wish.

{% note warning %}
Cypress attempts to find available file editors on your system and display those as options. If your preferred editor is not list, you can specify the (full) path to it by selecting **Other**. Cypress will make every effort to open the file, *but it is not guaranteed to work with every application*.
{% endnote %}

If the editor supports inline highlighting of the file, the file will open with the cursor located on the line and column of interest.

After setting your file opener preference any files will automatically open in your selected application without prompting you to choose. If you want to change your selection, you can do so in the **Settings** tab of the Cypress Test Runner by clicking under **File Opener Preference**.

{% imgTag /img/guides/file-opener-preference-settings-tab.png "screenshot of Test Runner settings tab with file opener preference panel" %}
