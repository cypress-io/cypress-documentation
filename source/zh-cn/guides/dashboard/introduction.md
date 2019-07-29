---
title: Introduction
---
其实，{% url 'Cypress数据面板' https://on.cypress.io/dashboard %}是一个给予你可以对测试过程进行录制的工具 - 特别是当你在{% url 'CI提供商' continuous-integration %}平台进行Cypres测试时，数据面板可以让你对测试过程发生了什么一窥究竟。

# Features

## Organize projects

From the Dashboard you can:

- Set up a project to record in the Dashboard
- Reset or add more record keys
- Change who can access your Cypress project
- Transfer ownership of projects
- Delete projects

## See test run results

From the Dashboard you can:

- 查看失败，通过，挂起和被跳过的测试用例的数量；
- 获取失败的测试的整个堆栈跟踪；
- 查看测试失败时或主动使用{% url `cy.screenshot()` screenshot %}时拍摄的屏幕截图；
- 观看整个测试运行的的视频或在测试失败时的视频片段；
- 了解你的测试用例文件在CI中的运行效率，包括它们是否是在并行运行；
- 检查相关的测试分组；

{% imgTag /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

## Manage organizations

From the Dashboard you can:

- Create, edit and delete organizations
- 查看每个组织的使用详情；
- 支付你选择的结算方案。

## Manage users

From the Dashboard you can:

- Invite and edit user's roles for organizations
- Accept or reject requests to join your organization.

## Integrate with GitHub

From the Dashboard you can:

- Integrate your Cypress tests with your GitHub workflow via commit {% url 'status checks' github-integration#Status-checks %}
- Integrate Cypress into GitHub via {% url 'pull requests' github-integration#Pull-request-comments %}

## 示例项目

一旦登录到{% url '数据面板服务' https://on.cypress.io/dashboard %}你就可以看到所有的{% url "公共项目" projects %}。

**以下是部分我们的公共项目：**

- [{% fa fa-folder-open-o %} cypress-example-recipes](https://dashboard.cypress.io/#/projects/6p53jw)
- [{% fa fa-folder-open-o %} cypress-example-kitchensink](https://dashboard.cypress.io/#/projects/4b7344)
- [{% fa fa-folder-open-o %} cypress-example-todomvc](https://dashboard.cypress.io/#/projects/245obj)
- [{% fa fa-folder-open-o %} cypress-example-piechopper](https://dashboard.cypress.io/#/projects/fuduzp)
