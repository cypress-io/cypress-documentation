1. **Error name**: This is the type of the error (e.g. AssertionError, CypressError)
2. **Error message**: This generally tells you what went wrong. It can vary in length. Some are short like in the example, while some are long, and may tell you exactly how to fix the error. Some also contain a **Learn more** link that will take you to relevant Cypress documentation.
3. **Learn more:** Some error messages contain a Learn more link that will take you to relevant Cypress documentation.
4. **View stack trace**: Clicking this toggles the visibility of the stack trace. Stack traces vary in length. Clicking on a blue file path will open the file in your [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference).
5. **Code frame file**: This is usually the top line of the stack trace and it shows the file, line number, and column number that is highlighted in the code frame below. Clicking on this link will open the file in your  [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference) and highlight the line and column in editors that support it.
6. **Code frame**: This shows a snippet of code where the failure occurred, with the relevant line and column highlighted.
7. **Print to console button**: Click this to print the full error to your DevTools console. This will usually allow you to click on lines in the stack trace and open files in your DevTools.

{% imgTag /img/guides/command-failure-error.png "example command failure error" %}
