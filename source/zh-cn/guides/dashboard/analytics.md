---
title: 分析工具
---
Cypress数据面板提供了一个数据分析工具，工具提供了诸如运行数，运行持续时间以及测试套件大小随时间变化的可视化展示能力

{% imgTag /img/dashboard/analytics/dashboard-analytics-overview.png "Dashboard Analytics Screenshot" %}

{% note info %}
数据面板分析工具目前还在Beta测试
{% endnote %}

要启用数据面板分析工具，先打开**Organization Settings**然后启用**Cypress Labs**下面的"Project Analytics"设置。

{% imgTag /img/dashboard/analytics/dashboard-analytics-cypress-labs-project-analytics.png "Organization Settings Project Analytics Screenshot" %}

# 使用方法

## 运行数

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time.png "Dashboard Analytics Runs Over Time Screenshot" %}

这份报告显示了Cypress数据面板中你的组织录制的测试运行数，数据按照运行的最终状态做了细分，每个运行结果都代表了该项目中一个`cypress run --record`调用，不管是通过CI或本地机器。

### 过滤器

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-filters.png "Dashboard Analytics Runs Over Time Filters Screenshot" %}

运行结果可以按以下方式过滤：

- 分支
- 时间范围
- 时间间隔(每小时，每天，每周，每月，每季度)

### 运行结果

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-graph.png "Dashboard Analytics Runs Over Time Graph Screenshot" %}

时间内总运行数图表通过所选的各个过滤条件展示了通过，失败，运行中，超时和错误的测试数据

结果可以被下载保存为逗号分隔的CSV文件用于后续分析。
在过滤器右侧的下载图标中可以进行此操作。

### 关键性能指标

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-kpi.png "Dashboard Analytics Runs Over Time KPI Screenshot" %}

总运行数，每日平均数，通过运行数和失败运行数都可以通过所选的各个过滤条件统计出来。

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-table.png "Dashboard Analytics Runs Over Time Table Screenshot" %}

一个通过时间范围过滤条件，按日期分组统计的包含通过，失败，运行中，超时和错误数列的表格

# 性能

## 运行时间

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration.png "Dashboard Analytics Run Duration Screenshot" %}
这个报告展示了项目中一个Cypress测试运行的平均时间，包含了并行测试对总运行时间的影响。注意这里我们只包含了通过测试的运行数据 — 失败或者错误的运行结果会影响平均运行时间使之偏离正常的时间区间。

### 过滤器

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-filters.png "Dashboard Analytics Run Duration Filters Screenshot" %}

运行结果可以按以下方式过滤：

- 分支
- 运行组
- 时间范围
- 时间间隔(每小时，每天，每周，每月，每季度)

### 运行结果

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-graph.png "Dashboard Analytics Run Duration Graph Screenshot" %}

时间内平均运行时间图表通过所选的各个过滤条件展示了通过，失败，运行中，超时和错误的测试数据

结果可以被下载保存为逗号分隔的CSV文件用于后续分析。
在过滤器右侧的下载图标中可以进行此操作。

### 关键性能指标

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-kpi.png "Dashboard Analytics Run Duration KPI Screenshot" %}

平均并行度，平均运行时间和并行节省时间都可以通过所选的各个过滤条件统计出来。

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-table.png "Dashboard Analytics Run Duration Table Screenshot" %}

一个通过时间范围过滤条件，按日期分组统计的包含平均运行时，连续性和并行节省时间列的表格

# 处理

## 测试套件大小

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size.png "Dashboard Analytics Test Suite Size Screenshot" %}

这份报告显示了你的测试套件大小是如何随着时间一直变大的。它统计了给定时间内每天每个测试运行的平均测试用例数。它不包含错误的或者超时的测试，因为它们不能准确的反映出你的测试套件的大小。

### 过滤器

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-filters.png "Dashboard Analytics Test Suite Size Filters Screenshot" %}

运行结果可以按以下方式过滤：

- 分支
- 运行组
- 时间范围

### 运行结果

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-graph.png "Dashboard Analytics Test Suite Size Graph Screenshot" %}

时间内通过所选的各个过滤条件展示了平均测试套件大小。

结果可以被下载保存为逗号分隔的CSV文件用于后续分析。
在过滤器右侧的下载图标中可以进行此操作。

### 关键性能指标

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-kpi.png "Dashboard Analytics Test Suite Size KPI Screenshot" %}

通过所选的各个过滤条件统计出独立的测试和spec文件的数量。

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-table.png "Dashboard Analytics Test Suite Size Table Screenshot" %}

一个通过时间范围过滤条件，按日期分组统计的包含独立测试和spec文件的表格
