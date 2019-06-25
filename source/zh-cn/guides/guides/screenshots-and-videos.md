---
title: 截图和视频
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学习到什么

- Cypress如何自动捕捉测试失败的截图
- 如何手工捕捉自己的截图
- Cypress如何录制完整运行的视频
- 一些如何处理截图和视频构件的选项
{% endnote %}

# 截图

Cypress自带截屏功能，无论您是在使用`cypress open`的交互模式下运行，还是在使用`cypress run`的运行模式下运行(可能是在CI中)。

要手动截屏，你可以使用{% url `cy.screenshot()` screenshot %}命令。

而且，在交互模式之外的运行过程中发生失败时，Cypress将自动捕捉屏幕截图。

可以通过{% url 'Cypress.Screenshot.defaults()' screenshot-api %}将`screenshotOnRunFailure`设置为`false`来关闭此行为。

截图存储在{% url `screenshotsFolder` configuration#Screenshots %}中，默认设置为`cypress/screenshots`。

在`cypress run`之前，Cypress将清空任何现有的截图。如果您不想在运行前清空您的截图文件夹，您可以设置{% url `trashAssetsBeforeRuns` configuration#Screenshots %}为`false`。

# 视频

Cypress还可以在运行时录制视频。

{% note warning %}
Video recording is currently only supported when running Cypress from the Electron browser. {% issue 1767 "See this issue" %} for more information.
{% endnote %}

可以通过将{% url `video` configuration#Videos %}设置为`false`来关闭录制视频功能。

视频存储在{% url `videosFolder` configuration#Videos %}中，默认设置为`cypress/videos`。

当`cypress run`完成后，Cypress将自动压缩视频以节省文件大小。默认情况下，会压缩成`32 CRF`，但是这是可配置的{% url `videoCompression` configuration#Videos %}属性。

当使用`--record`来执行测试的时候，视频在每一个spec文件运行后都会被处理，压缩并且上传到{% url 'Dashboard Service' dashboard-service %}，不管成功与否。为了将这种行为改变为仅在测试失败的情况下才处理视频，请将{% url `videoUploadOnPasses` configuration#Videos %}配置项设置为`false`。

在`cypress run`之前，Cypress清空现有的视频。如果您不想在运行前清空您的视频文件夹，您可以将{% url `trashAssetsBeforeRuns` configuration#Videos %}设置为`false`。

# 现在该做什么呢？

那么您正在测试运行中捕捉截图和录制视频，现在该做什么呢？

## 和您的团队一起分享

您现在可以利用的是{% url 'Cypress仪表盘服务' dashboard-service %}：我们的伙伴企业服务，它为您存储构件，并允许您从任何web浏览器查看它们，还可以与您的团队分享它们。


## 视觉回归测试/截图差异

另一种可能性是视觉回归测试：对比过去与现在的运行截图以确保没有任何改动。Cypress现在还没有内置这个功能，但是我们已经注意到了。如果您对这个功能的更新感兴趣，可以{% issue 495 '关注这个问题' %}，如果您想影响生成的功能，请留下您的评论，如果您想亲自处理它，请发起pull request！

# 更多参考

- {% url 'After Screenshot API' after-screenshot-api %}
- {% url 'Cypress.Screenshot' screenshot-api %}
- {% url 'Dashboard Service' dashboard-service %}
- {% url `cy.screenshot()` screenshot %}
- {% url 'Visual Testing' visual-testing %}
