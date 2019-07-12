---
title: 为什么选择Cypress?
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- 什么是 Cypress ？你为什么需要使用它
- 我们的目标以及我们的追求
- Cypress 的特性
{% endnote %}

# 简单来说

Cypress是为现代网络打造的下一代前端测试工具。我们解决了开发人员和QA工程师在测试现代应用程序时面临的关键难点问题。

我们很容易的能够做下面的事情:

- {% urlHash '设置测试' 设置测试环境 %}
- {% urlHash '编写测试' 编写测试代码 %}
- {% urlHash '执行测试' 执行测试 %}
- {% urlHash '调试测试' 调试测试 %}

通常大家都会以为Cypress就是Selenium；Cypress从底层和结构上都不同于Selenium。Cypress能够突破很多Selenium上的限制。

这将让你能够编写**更快**、**更简单**和**更可靠**的测试。

# 谁在使用 Cypress?

我们的用户通常是使用现代JavaScript框架构建Web应用程序的开发人员或QA工程师。

Cypress允许你编写所有类型的测试：

- 端到端测试
- 集成测试
- 单元测试

Cypress可以测试任何在浏览器中运行的内容。

# Cypress的生态系统

Cypress包含免费的, {% url "开源的" https://github.com/cypress-io/cypress %}, {% url "可本地安装的" installing-cypress %} Test Runner **和** 能够 {% url '记录你测试' dashboard-service %} 的控制面板服务.

- ***首先:*** Cypress可以让你每天在本地构建应用程序时很轻松的设置和开始编写测试代码。*TDD是最好的*
- ***然后:*** 在建立了一套测试代码和整合了CI来做 {% url "集成测试" continuous-integration %} 后, 我们的 {% url '控制面板服务' dashboard-service %} 可以记录你所执行的测试。 你永远不会想知道：*为什么这会失败？*

# 我们的目标

我们的目标是建立一个蓬勃发展的开源生态系统，提高生产力，让测试成为一种愉悦的享受并能够给开发人员带来快乐。我们对每个测试负责确保测试**都是有效**的。

我们相信我们的文档应该简单易用。这意味者我们的读者不仅能够完全的理解**这是什么**还可以理解**为什么会这样**。

我们希望帮助开发人员更快、更好的构建现代应用程序的测试，而不会出现与测试管理相关的压力和焦虑。

我们知道，为了能让我们成功，我们必须创造和培养一个蓬勃发展的开源生态系统。每行测试代码都是对你**代码库**的投资，这永远都不需要给我们或者相关公司支付费用。测试代码将能够**始终**独立的执行。

我们相信测试需要许多 {% fa fa-heart %} ，我们在这里建立一个工具、服务和社区，每个人都可以学习并从中受益。我们正在解决互联网开发者分享的最难的痛点问题。我们相信这个使命并且希望你能够加入我们，让Cypress成为一个持续发展的生态系统，让每个人都能享受快乐。

# 特性

Cypress就像一个完整的烘烤箱，他还自带电池。 下面是一些其它测试框架无法做到的事情：

- **时间旅行：** Cypress在你运行测试的时候拍摄快照。 只要将鼠标悬停在 {% url '命令日志' test-runner#Command-Log %} 上就能够清楚的了解到每一步发生了什么。
- **可调式能力：** 你再也不需要去猜测测试为什么失败了。 {% url '调试工具' debugging %} 和Chrome的调试工具差不多。 清晰的错误原因和堆栈跟踪让调试能够更加快速。
- **自动等待：** 在你的测试中不再需要添加等待或睡眠函数了。在执行下一条命令或断言前Cypress会 {% url '自动等待' introduction-to-cypress#Cypress-is-Not-Like-jQuery %} 异步将不再是问题.
- **Spies, Stubs, and Clocks:** 验证和 {% url '控制' stubs-spies-and-clocks %} 函数、服务器响应或者计时器的行为。你喜欢的单元测试的功能都掌握在你的手中。
- **网络流量控制：** 非常容易的进行 {% url '控制、保存和边缘测试' network-requests %}，而这并不需要涉及到你的服务。你可以根据需要保留网络流量。
- **一致的结果：** 我们的架构不需要Selenium或者WebDriver。向快速，一致和可靠的无侵入测试看齐。
- **屏幕截图和视频：** 可以查看测试失败时候系统自动截取的图片，或者整个测试的录制视频。

## {% fa fa-cog %} 设置测试环境

没有需要安装或配置的服务器、驱动程序或其它依赖。你可以在60秒内写完一个可以运行通过的测试。

{% video local /img/snippets/installing-cli.mp4 %}

## {% fa fa-code %} 编写测试代码

用Cypress编写的测试容易阅读和理解。我们的API是完全建立在你熟悉的工具之上。

{% video local /img/snippets/writing-tests.mp4 %}

## {% fa fa-play-circle %} 执行测试

Cypress的运行速度与浏览器的渲染速度一样的快。你可以在开发应用程序时实时观察运行的测试。 TDD将会获得胜利 !

{% video local /img/snippets/running-tests.mp4 %}

## {% fa fa-bug %} 调试测试

可读的错误消息能够帮助你快递调试程序。你还可以访问你熟悉和喜爱的所有开发者工具。

{% video local /img/snippets/debugging.mp4 %}
