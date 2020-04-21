---
title: 简介
---
其实，{% url 'Cypress数据面板' https://on.cypress.io/dashboard %}是一个给予你可以对测试过程进行录制的工具 - 特别是当你在{% url 'CI提供商' continuous-integration %}平台进行Cypres测试时，数据面板可以让你对测试过程发生了什么一窥究竟。

# 功能

## 组织项目

使用数据面板你可以:

- 在数据面板中创建一个要录制的项目
- 重置或添加多个录制key
- 修改你Cypress项目的可访问人员
- 转移项目的所有权
- 删除项目

## 查看测试结果

使用数据面板你可以:

- 查看失败，通过，挂起和被跳过的测试用例的数量；
- 获取失败的测试的整个堆栈跟踪；
- 查看测试失败时或主动使用{% url `cy.screenshot()` screenshot %}时拍摄的屏幕截图；
- 观看整个测试运行的的视频或在测试失败时的视频片段；
- 了解你的测试用例文件在CI中的运行效率，包括它们是否是在并行运行；
- 检查相关的测试分组；

{% imgTag /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

## 管理组织

使用数据面板你可以:

- 创建，编辑和删除组织
- 查看每个组织的使用详情；
- 支付你选择的结算方案。

## 管理用户

使用数据面板你可以:

- 邀请并编辑组织中的用户角色
- 接受或拒绝加入组织的申请

## 与GitHub集成

使用数据面板你可以:

- 通过对 commit 的 {% url '状态检查' github-integration#Status-checks %} 将你的Cypress测试与GitHub工作流集成
- 通过 {% url '合并请求' github-integration#Pull-request-comments %} 将Cypress集成到GitHub

## 示例项目

一旦登录到{% url '数据面板服务' https://on.cypress.io/dashboard %}你就可以看到所有的{% url "公共项目" projects %}。

**以下是部分我们的公共项目：**

- [{% fa fa-folder-open-o %} cypress-example-recipes](https://dashboard.cypress.io/#/projects/6p53jw)
- [{% fa fa-folder-open-o %} cypress-example-kitchensink](https://dashboard.cypress.io/#/projects/4b7344)
- [{% fa fa-folder-open-o %} cypress-example-todomvc](https://dashboard.cypress.io/#/projects/245obj)
- [{% fa fa-folder-open-o %} cypress-example-piechopper](https://dashboard.cypress.io/#/projects/fuduzp)
