---
title: 组织
---

组织是用来分组化项目和对项目权限进行管理的。

{% imgTag /img/dashboard/organizations-listed-in-dashboard.png "Organizations" %}

# Features

- 创建项目
- 邀请成员
- 转让项目
- 对使用后的项目进行支付

# Managing Organizations

## 创建组织

你可以在{% url "数据面板服务" https://on.cypress.io/dashboard %}里的 **Organizations** 页签下，点击 **{% fa fa-plus %} Add Organization** 来创建组织。

{% imgTag /img/dashboard/add-organization-dialog.png "Add Organization dialog" %}

## 私人组织

默认情况下，Cypres的每个用户都有一个以你命名的个人组织。你无法删除或编辑此默认组织的名称。

## 删除组织

只要组织中没有任何项目，你就可以删除你拥有的组织。你必须先将项目的所有权转移到另一个组织，然后才能删除该组织。

{% imgTag /img/dashboard/remove-organization-dialog.png "Delete Organization" %}

# Billing & Usage

## 开源计划

为了支持Cypress社区，我们为公共项目提供开源（OSS）计划，以便利用我们的数据面板服务和无限制的测试执行。要获得资格，你的项目只需要达成两件事：

 - 你的项目是非商业实体的
 - 你的项目的源代码可在公共场所获得，而且包含{% url "OSI-approved license" https://opensource.org/licenses %}

### 为组织请求参加OSS计划


按照如下步骤来为你的项目申请参加OSS计划：

1. {% url "登录" https://on.cypress.io/dashboard %}到Cypress数据面板，或先{% url "创建一个账户" https://on.cypress.io/dashboard %}如果你是新用户的话；
  {% imgTag /img/dashboard/oss-plan-1-login.png "Login or Create Account" "no-border" %}
2. 到{% url "组织页" https://on.cypress.io/dashboard/organizations %}选择一个你想关联的OSS计划。如果你没有组织，你可以通过点击 **+ Add Organization** 按钮来创建一个；
> **注意：** 私人组织不能添加到OSS计划里。
  {% imgTag /img/dashboard/oss-plan-2-select-org.png "Select or add organization" "no-border" %}
3. 到**Billing & Usage** 页面，然后在页面底部点击**Apply for an open source plan**链接；
  {% imgTag /img/dashboard/oss-plan-3-billing.png "Click Apply for an open source plan" "no-border" %}
4. 填好OSS计划的表单后进行提交；
  {% imgTag /img/dashboard/oss-plan-4-apply.png "OSS plan request form" "no-border" %}
5. 你将收到一个确认申请的邮件。Cypress团队将审查你的请求，如果通过，OSS订阅计划将会应用到你的组织上。

如果对于OSS计划有任何疑问，请随时联系 [我们](mailto:hello@cypress.io)。
