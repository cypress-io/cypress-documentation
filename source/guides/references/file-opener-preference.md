---
title: File Opener Preference
---

When clicking on a file path in an error stack trace or a code frame, Cypress will attempt to open the file in an application.

The first time you click a file path, Cypress will prompt you to select which application you prefer. You can choose to open it on your file system (e.g. Finder on MacOS, File Explore on Windows), in a file editor, or you can specify a path to any application you wish.

Cypress attempts to find available file editors on your system and display those as options. If your preferred editor is not list, you can specify the (full) path to it by selecting "Other." Cypress will make every effort to open the file, but it is not guaranteed to work with every application.

If the editor supports it, the file will open with the cursor placed on the line and column of interest.

After setting your file opener preference, when you click on a file path again, the file will automatically open in your selected application without prompting you to choose.

If you wish to change your selection, you can do so in the **Settings** tab of the Cypress Test Runner.

{% imgTag /img/guides/file-opener-preference-settings-tab.png "screenshot of Test Runner settings tab with file opener preference panel" %}
