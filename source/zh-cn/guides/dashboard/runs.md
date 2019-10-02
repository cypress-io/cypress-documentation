---
title: 录制的运行
---

录制的运行从你的测试运行里面抓取结果。

{% note info %}
如果你还没对项目进行录制设定，{% url "参阅这里" projects %}。
{% endnote %}

# 运行详情

每一次运行都会包含以下详情：

- 跳过的、正排队的、已通过的和已失败的测试数量；
- 与运行相关联的（如果有）GitHub分支、pull请求、作者、提交sha和提交消息；
- 当前运行的时间轴，每一个测试用例集，以及测试开始和结束的时间；
- 当前运行是在什么持续集成品台里(如果是)以及它的CI id和url；
- 操作系统及其版本；
- 浏览器及其版本；
- Cypress版本。

{% imgTag /img/dashboard/run-details.png "run-details" %}

# {% fa fa-file-code-o fa-fw %} 规格文件

你可以查看不通规格吓的测试用例集的结果。也可以在 **时间轴视图** 和 **条形图视图** 间进行切换。

## 时间轴视图

时间轴视图记录的是测试集之间相对于彼此运行的情况。当你想要知道某些测试在{% url "并行" parallelization %}模式下是如何运行的实际情况时，这尤其有用。

{% imgTag /img/dashboard/specs-timeline-view.jpg "Specs tab with timeline view" %}

## 条形图视图

条形图视图按照测试集执行时间的长短进行绘图的。这种视图可以帮你知道用例执行时间的长短：

{% imgTag /img/dashboard/specs-barchart-view.jpg "Specs tab with bar chart view" %}

## 跳转到失败的测试用例

如果你有任何失败的测试用例，你可以鼠标悬停在图表上，然后点击失败的测试用例的链接，来跳转到它的失败信息和堆栈追溯信息

{% imgTag /img/dashboard/specs-failures-popup.png "Failures popup on spec hover %}

# {% fa fa-code fa-fw %} 标准输出

标准输出包括基于你设置的{% url '报告生成器' reporters %}的每个测试集的详细信息和摘要。默认情况下，它是`spec`报告生成器。

你还会在底部看到摘要，其中会显示截图或测试期间录制上传的视频。

{% imgTag /img/dashboard/standard-output-of-recorded-test-run.png "standard output" %}

## {% fa fa-picture-o fa-fw %} 截屏

所有在测试期间的截屏都可以在 **Screenshots** 下找到。不管是失败的自动截屏还是手动使用{% url `cy.screenshot()` screenshot %}指令完成的。

## {% fa fa-video-camera fa-fw %} 录屏

所有在测试期间的录屏都可以在 **Video** 下找到。你也可以下载它们。

{% imgTag /img/dashboard/videos-of-recorded-test-run.png "Video of test runs" %}

# {% fa fa-exclamation-triangle fa-fw %} 失败的那些测试

所有失败的测试集可以在 **Failures** 页签下找到。每一个失败都被列在其测试标题下了。

## 每一个失败会展示：

- **Test title:** 失败的测试的标题；
- **Error:** 错误信息的堆栈追踪；
- **Screenshot:** 任何在测试运行时截的图；
- **Video:** 截止到失败发生时的录屏

{% imgTag /img/dashboard/failures-of-recorded-run.png "failure tab" %}
