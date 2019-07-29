---
title: 成员
---

用户是登录到数据面板服务的任何人。你可以通过{% url '数据面板服务' https://on.cypress.io/dashboard %}邀请用户加入Cypress。

# 邀请成员

受邀成员将看到组织运行的所有项目和测试。

## 邀请成员到组织：

1. 到{% url "组织页" https://on.cypress.io/dashboard/organizations %}选择你要邀请成员加入的组织；
2. 点击 **Users** ，然后 **Invite User**。*注意：你必须具有{% urlHash ""owner"或"admin"的权限" 成员角色 %}才能进行邀请。*
3. 填好被邀请成员的邮件地址，然后选好{% urlHash "角色" 成员角色 %}，之后点击 **Invite User**。 *注意：只有"owners"才能给予其他成员"owner"的权限*。
4. 被邀请成员将会收到一封带有可以接受该邀请的邮件。

{% imgTag /img/dashboard/invite-user-dialog.png "Invite User dialog" %}

# 成员角色

成员可以被指定角色，该指定影响其在{% url '数据面板服务' https://on.cypress.io/dashboard %}里的功能权限。

- **Member：** 可以看到项目，运行和秘钥；
- **Admin：** 可以邀请，编辑和删除成员;
- **Owner：** 可以转让和删除项目，包括删除和编辑组织。

每种角色在数据面板服务里的权限如下：

| 权限                                         |  |  | |
| ---------------------------------------------------|--------|-------|------|
| 查看私人项目的测试记录     | ✅ **Member**    | ✅ **Admin**    | ✅ **Owner** |
| 查看项目的记录键        | ✅ **Member**    | ✅ **Admin**    | ✅ **Owner** |
| 查看结算和使用信息     |        | ✅ **Admin**    | ✅ **Owner** |
| 修改结算信息     |        | ✅ **Admin**    | ✅ **Owner** |
| 查看受邀组织的成员     |        | ✅ **Admin**    | ✅ **Owner** |
| 重新邀请受邀成员     |        | ✅ **Admin**    | ✅ **Owner** |
| 邀请"Member"加入组织     |        | ✅ **Admin**    | ✅ **Owner** |
| 邀请"admin"加入组织     |        | ✅ **Admin**    | ✅ **Owner** |
| 查看成员加入组织的请求     |        | ✅ **Admin**    | ✅ **Owner** |
| 接受成员加入组织的请求     |        | ✅ **Admin**    | ✅ **Owner** |
| 从组织中删除"Member"     |        | ✅ **Admin**    | ✅ **Owner** |
| 从组织中删除"admin"     |        | ✅ **Admin**    | ✅ **Owner** |
| 在组织中编辑"Member"     |        | ✅ **Admin**    | ✅ **Owner** |
| 在组织中编辑"admin"     |        | ✅ **Admin**    | ✅ **Owner** |
| 编辑项目名称     |        | ✅ **Admin**    | ✅ **Owner** |
| 修改项目状态（私人/公共）     |        | ✅ **Admin**    | ✅ **Owner** |
| 添加或删除记录键     |        | ✅ **Admin**    | ✅ **Owner** |
| 邀请"Owner"加入组织     |        |        | ✅ **Owner** |
| 在组织中编辑"Owner"     |        |        | ✅ **Owner** |
| 从组织中删除"Owner"     |        |        | ✅ **Owner** |
| 添加，编辑，删除默认组织中的成员 |        |        | ✅ **Owner** |
| 编辑组织名称     |        |        | ✅ **Owner** |
| 删除组织     |        |        | ✅ **Owner** |
| 将项目转让到另一个组织     |        |        | ✅ **Owner** |
| 删除项目     |        |        | ✅ **Owner** |

# 成员请求

成员可以"请求"访问给定的组织。如果你团队中的开发人员可以访问Cypress和你项目的源代码 - 他们可以请求获得对你组织的访问权限。这意味着你不必事先邀请团队成员，他们可以请求访问权限，你可以选择接受或拒绝他们访问。

{% imgTag /img/dashboard/request-access-to-organization.png "Request access to project" %}