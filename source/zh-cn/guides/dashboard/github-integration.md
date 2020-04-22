---
title: GitHub集成
---

{% url "Cypress数据面板" https://on.cypress.io/dashboard %} 可以通过对commit的 {% urlHash '状态检查' Status-checks %} 和 {% urlHash '合并请求注解' Pull-request-comments %} 将Cypress测试和GitHub进行集成。使用GitHub集成之前需要先在数据面板中对项目进行{% url "录制设置" projects %} 。

{% imgTag /img/dashboard/github-integration/pull-request-cypress-integration-comments-github-checks.jpg "Cypress GitHub App PR" %}

{% note info %}
GitHub企业版的 On-premise 平台目前未被支持。如果你对GitHub企业版的 On-premise 平台集成感兴趣，请在我们的 {% url "数据面板产品版块" https://portal.productboard.com/cypress-io/1-cypress-dashboard %} 提交意向
{% endnote %}

{% note warning %}
GitHub集成依赖于你的CI环境可靠地提供commit SHA数据(通常是通过一个环境变量)。 这个对大部分用户来讲不是问题，但是如果你在配置CI时遇到GitHub集成问题，请确保你已按照{% url "这些指南" continuous-integration#Git-information %}将git信息准确地发送。 如果在这之后还是有问题请[联系我们](mailto:hello@cypress.io).
{% endnote %}

# 安装Cypress GitHub应用

在开始启用Cypress项目的GitHub集成之前，你必须先安装Cypress GitHub应用。你可以通过{% url "Cypress数据面板" https://on.cypress.io/dashboard %}的组织设置或者项目设置页面安装GitHub应用

## 通过组织集成设置安装

1. 打开数据面板{% url "Organizations页面" https://dashboard.cypress.io/organizations %}或打开组织切换菜单
2. 选择你要和GitHub账户或GitHub组织集成的组织
  {% imgTag /img/dashboard/select-cypress-organization.png "Select an organization" width-600 %}
3. 在侧边导航中打开所选组织的 **Integrations** 页面
  {% imgTag /img/dashboard/github-integration/install-github-integration-with-cypress-from-org-settings.png "Install Cypress GitHub App from Integrations" %}
4. 点击 **Install the Cypress GitHub App** 按钮。

## 通过项目设置安装

1. 在组织切换菜单中选择你的组织
  {% imgTag /img/dashboard/select-cypress-organization.png "Select an organization" width-600 %}
2. 选择你要与GitHub仓库集成的项目。
  {% imgTag /img/dashboard/select-cypress-project.png "Select a project" %}
3. 打开项目设置界面
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}
4. 滚动到 **GitHub Integration** 这节
5. 点击 **Install the Cypress GitHub App** 按钮.
  {% imgTag /img/dashboard/github-integration/install-github-cypress-app-project-settings.png "Install GitHub Cypress App" %}

## Cypress GitHub应用安装流程

一旦你通过{% urlHash "Cypress组织设置" Install-via-organization-integration-settings %} 或者 {% urlHash "项目设置" Install-via-project-settings %}开始GitHub应用安装，你会被重定向到GitHub.com完成后续安装：

1. 选择所需的GitHub组织或账号来集成你的Cypress组织.
{% imgTag /img/dashboard/github-integration/select-gh-org.jpg "Select a GitHub organization"  %}

2. 选择关联 **All repositories** 或者自定义GitHub仓库来完成GitHub应用安装

  {% imgTag /img/dashboard/github-integration/select-all-gh-repos.jpg "Select All GitHub repositories" %}

  {% note info %}
  如果你选择**All repositories**，那么所有当前或者 *将来的* 仓库都会被包含在当前安装中。
  {% endnote %}

  {% imgTag /img/dashboard/github-integration/select-gh-repos.jpg "Select specific GitHub repositories" %}

3. 点击 **Install** 按钮完成安装。

# 为项目开启GitHub

在为组织安装好Cypress GitHub应用后，你就可以对*任何*Cypress项目启用GitHub集成了。

1. 打开项目设置页面
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}

2. 滚动GitHub集成这一节
    {% note info %}
    在组织的集成页面，通过点击所需项目的 **Configure** 链接，你可以快速地到达项目的GitHub集成设置：
    {% endnote %}

    {% imgTag /img/dashboard/github-integration/org-settings-with-no-enabled-projects.png "Org GitHub Integration settings" "no-border" %}

3. 选择一个GitHub仓库与项目关联

  {% imgTag /img/dashboard/github-integration/project-settings-repo-selection.png "Associate GitHub repo with Cypress project" "no-border" %}

一旦GitHub仓库与Cypress项目关联，GitHub集成会立即生效：
{% imgTag /img/dashboard/github-integration/project-settings-selected-repo.png "GitHub integration enabled for Cypress project" "no-border" %}

在你的组织的**Integrations**页面，你可以查看所有开启GitHub集成的Cypress项目：
{% imgTag /img/dashboard/github-integration/org-settings-with-projects.png "Integrations page" "no-border" %}

# 状态检查

在项目的GitHub集成设置中，如果开启了状态检查，Cypress数据面板会显示与GitHub commit关联的Cypress测试状态。在所有的Cypress测试通过之前，{% url "状态检查" https://help.github.com/en/articles/about-status-checks %} 会帮你阻止commit合并或者合并请求进入代码库中。

Cypress GitHub应用显示的commit状态有以下两种样式：

- **按 {% url "run group" parallelization#Grouping-test-runs %}显示对应检查结果**
    {% imgTag /img/dashboard/github-integration/status-checks-per-group-failed.png "Status checks per group" "no-border" %}

- **按spec文件显示对应检查结果**
    {% imgTag /img/dashboard/github-integration/status-checks-per-spec.png "Status checks per spec" "no-border" %}

每个状态检查都会显示测试失败或通过的数字， 关联的 **Details** 链接可以带你到Cypress数据面板页面中的test run页面，这样有助于帮你通过错误信息，堆栈追踪，截屏和视频录像更深入地挖掘问题：
{% imgTag /img/dashboard/dashboard-fail-tab.png "Cypress Dashboard failure tab" %}

## 禁用状态检查

GitHub状态检查是可选的，并且可以在项目的GitHub集成设置中禁用：
{% imgTag /img/dashboard/github-integration/status-check-settings.png "Status checks settings" %}

# 合并请求注解

Cypress GitHub应用可以通过以下注解在合并请求中提供明细的测试信息：

- **运行数据，例如测试通过，失败，跳过，超限**
- **运行上下文明细：**
  - 关联的Cypress项目
  - 最终的运行结果(通过，失败等等)
  - 链接到GitHub commit的Commit SHA
  - 运行开始和结束的时间，以及时间跨度
  - 操作系统版本和浏览器版本
- **运行失败：**
  - 显示前10个失败，通过链接查看更多
  - 每个失败的测试都会链接到Cypress数据面板中关联的失败信息
  - 每个失败的测试都会在适当的上下文中提供截屏缩略图

一个Cypress合并请求注解的例子如下：

{% imgTag /img/dashboard/github-integration/pr-comment-fail.jpg "Cypress GitHub App PR comment" %}

## 禁用合并请求注解

合并请求注解和失败的截屏缩略图是可选的，如果在项目的GitHub集成设置中不需要的话是可以被禁用的：
{% imgTag /img/dashboard/github-integration/pr-comments-settings.png "Status checks settings" %}

# 卸载Cypress GitHub应用

通过以下步骤你可以从GitHub中卸载Cypress GitHub应用：

1. 打开GitHub组织的**Settings**界面
2. 点击**Installed GitHub Apps**
3. 点击Cypress应用旁的**Configure**
4. 点击"Uninstall Cypress"下面的**Uninstall**

# 想反馈？

如果你有任何关于改善Cypress GitHub集成的想法或建议，请通过官方的 {% url "Dashboard Product Board" https://portal.productboard.com/cypress-io/1-cypress-dashboard/c/9-github-status-checks-and-pull-request-comments %}联系我们

# 参阅文档

- {% url "Cypress GitHub Action + Examples" https://github.com/cypress-io/github-action %}
- {% url "Example project that uses both Cypress GitHub Action and Cypress GitHub Integration" https://github.com/cypress-io/gh-action-and-gh-integration %}
