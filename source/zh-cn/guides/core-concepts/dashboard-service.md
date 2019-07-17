---
title: 数据面板服务
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到
- 如何设置项目使其能录制测试过程
- 你将在数据面板服务看到哪些被录制下来的信息
- 如何在数据面板服务对组织、项目以及用户进行管理
{% endnote %}

其实，{% url 'Cypress数据面板' https://on.cypress.io/dashboard %}是一个给予你可以对测试过程进行录制的工具 - 特别是当你在{% url 'CI提供商' continuous-integration %}平台进行Cypres测试时，数据面板可以让你对测试过程发生了什么一窥究竟。

# 概览

***数据面板可以让你：***

- 查看失败，通过，挂起和被跳过的测试用例的数量；
- 获取失败的测试的整个堆栈跟踪；
- 查看测试失败时或主动使用{% url `cy.screenshot()` screenshot %}时拍摄的屏幕截图；
- 观看整个测试运行的的视频或在测试失败时的视频片段；
- 了解你的测试用例文件在CI中的运行效率，包括它们是否是在并行运行；
- 检查相关的测试分组；
- 管理谁有权访问你记录的测试数据记录；
- 查看每个组织的使用详情；
- 支付你选择的结算方案。

{% imgTag /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

***检查在测试运行器里运行的测试用例***

此外，我们已将测试集成到Cypress {% url 'Test Runner' test-runner %}中。这意味着你可以在每个项目中的* Runs *选项卡中查看测试。

{% imgTag /img/dashboard/runs-list-in-desktop-gui.png "Runs List" %}

{% note info "仍然有还找不到答案的问题？"%}
{% url "我们已对部分普遍的疑问在FQA里进行了说明。" dashboard-faq %}.
{% endnote %}

## 示例项目

一旦登录到{% url '数据面板服务' https://on.cypress.io/dashboard %}你就可以看到所有的{% urlHash "公共项目" 公有-vs-私有 %}。

**以下是部分我们的公共项目：**

- [{% fa fa-folder-open-o %} cypress-example-recipes](https://dashboard.cypress.io/#/projects/6p53jw)
- [{% fa fa-folder-open-o %} cypress-example-kitchensink](https://dashboard.cypress.io/#/projects/4b7344)
- [{% fa fa-folder-open-o %} cypress-example-todomvc](https://dashboard.cypress.io/#/projects/245obj)
- [{% fa fa-folder-open-o %} cypress-example-piechopper](https://dashboard.cypress.io/#/projects/fuduzp)

# 项目

利用Cypress，你就具备了录制项目用例的能力。

典型情况下，你一般会想在 {% url '持续集成' continuous-integration %}运行测试的时候进行录制，但其实你也可以在本地调试的时候进行。

## 设置

{% note info %}
想要设置项目进行录制，你必须使用{% url "Test Runner" test-runner %}。

在此之前请确保你已经{% url "安装" installing-cypress %}和{% url "打开" installing-cypress#Opening-Cypress %}了Cypress。
{% endnote %}

### 按照下面的指示进行设置：

{% imgTag /img/dashboard/setup-to-record.gif "Setup Project Screen" %}


1. 在{% url "Test Runner" test-runner %}中单击项目的** Runs **选项卡；
2. 单击**设置要录制的项目**；
3. 你需要登录才能录制你的测试，因此你需要登录我们的Dashboard服务；
4. 填写项目名称（这仅用于显示目的，可以在以后更改）；
5. 选择谁拥有该项目。你可以自己拥有它或选择你创建的组织。如果你没有任何组织，请单击**创建组织**。组织就像在GitHub中一样工作。它们使你能够区分开你个人和工作的项目 - {% urlHash '参阅更多关于组织的介绍' 组织 %}；
6. 选择此项目是公共还是私有
   -  **公共项目** 可以被看到的*任何人*录制和运行。通常这些是开源项目；
   -  **私有项目** 限制其仅能被*{% urlHash "你邀请的用户" 成员 %}*访问；
7. 单击** Setup Project **；
8. 现在你应该看到一个视图，解释如何录制你的第一次运行；
9. 在设置项目后，Cypress在你的`cypress.json`中插入了一个唯一的 {% urlHash "projectId" 标识符 %}。如果你正在使用源代码管理，我们建议你检查一下在源码管理中包含`projectId`的`cypress.json`；
10. 在{% url 持续集成' continuous-integration %}平台里，或从本地计算机的终端，在运行{% url '`cypress run`' command-line#cypress-run %}命令时，传{% urlHash "Record Key" 标识符 %}参数：
  - 直接提供录制key：
    ```shell
    cypress run --record --key &lt;record key&gt;
    ```

  - 或在环境变量里配置录制key：
    ```shell
    export CYPRESS_RECORD_KEY=&lt;record key&gt;
    ```
    ```shell
    cypress run --record
  ```

🎉 现在你的测试就在录制了！当测试完成运行后，你将在 {% url "数据面板" https://on.cypress.io/dashboard %} 和{% url "Test Runner" test-runner %}的Runs页签看到(这些录制)：

{% imgTag /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

{% imgTag /img/dashboard/runs-list-in-desktop-gui.png "Runs List" %}


## 标识符

***项目ID***

一旦将项目设置为要录制，我们会为你的项目生成一个唯一的`projectId`并自动插入到你的`cypress.json`配置文件里。

***这个`projectId`是在你`cypress.json`里的，一个6位字符的字符串：***

```json
{
  "projectId": "a7bq2k"
}
```

这可以使我们将你的各个项目按照唯一性区分开来。如果你手动改变了它，**Cypress将对找到你某个指定项目的录制构建无能为力**。

如果你正在使用源码管理，我们建议你对包含`projectId`的`cypress.json`文件进行检查。如果你不想让`projectId`在你的源码中是可见的，你可以在你的CI提供商平台里指定`CYPRESS_PROJECT_ID`环境变量。如何才能够做到这一点取决于你的CI提供商，但可以参考简单地采用下面的方式：

```shell
export CYPRESS_PROJECT_ID={projectId}
```

### 录制秘钥 {% fa fa-key %}

一旦将项目设置为要录制，我们会自动为该项目生成一个*录制秘钥*。

***一个录制秘钥就是类似下面的一个GUID（全局唯一标识符）：***

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

你可以为一个项目创建多个录制秘钥，或在我们的{% url '数据面板' https://on.cypress.io/dashboard %}删除某一部分。你也可以在Test Runner的*Settings*页签里找到你的录制秘钥：

{% imgTag /img/dashboard/record-key-shown-in-desktop-gui-configuration.png "Record Key in Configuration Tab" %}

## 授权

Cypress使用你的`projectId`和*Record Key*，结合起来唯一标识你的项目。

{% imgTag /img/dashboard/project-id-and-record-key-shown-in-dashboard.png "ProjectID and Record Keys in Dashboard" %}

录制秘钥用来确认你的项目是否*允许*录制。只要你的录制秘钥还是 *private*（私有的），就没有其他人可以对你的项目进行录制 - 哪怕他们有`projectId`(也不行)。

即使你的项目是public（公共的），你 *也* 应该对你的录制秘钥保密。如果有人知道了你的录制秘钥和`projectId`，他们就可以对你的项目进行录制 - 这可能会导致你所有的测试结果是混淆不堪的！

其实，你的录制秘钥是用来使能你的某次运行是 *可编辑和可创建* 的，然而，它与那次运行在录制完成后是否是 *可读和可查看的* 无关。

{% note warning  %}
如果你的录制秘钥意外暴露了，你应该删除它，并在{% url '数据面板服务' https://on.cypress.io/dashboard %}里生成一个新的。
{% endnote %}


## 公有 vs 私有

- **公有** 意味着任何人都可以看到项目测试运行的录制。它类似于Github，Travis CI或CircleCI上的公共项目的处理方式。任何知道你`projectId`的人都能看到公共项目的运行录制。

- **私有** 表示只有被邀请到你的{% urlHash '组织' 组织 %}的{% urlHash '用户' 成员 %}可以查看其录制的运行情况。即使有人知道你的`projectId`，除非你邀请他们，否则他们将无法访问你的运行。

### 修改项目访问权

点击你要修改访问权的某个项目，然后点击右上角的**Settings**：

{% imgTag /img/dashboard/project-settings.png "project-settings" %}

你将会看到一个 **Access to Runs**字段。选择你想为这个项目设置的某个适当的权限：

{% imgTag /img/dashboard/access-to-runs.png "access-to-runs" %}

## 转让所有权

### 转让某个项目给其他人或组织

你可以将你拥有的项目转让给其他你所在的{% urlHash "组织" 组织 %}或此项目中的其他成员。项目只能在{% url '数据面板服务' https://on.cypress.io/dashboard %}里进行转让。

1. 选择你想要转让的{% url "组织" https://on.cypress.io/dashboard/organizations %}的项目；
2. 进入该项目然后点击**Settings**；
  {% imgTag /img/dashboard/project-settings.png "project-settings" %}
3. 向下滑动到**Transfer Ownership**并点击它；
4. 选择成员和组织，然后点击**Transfer**：
  {% imgTag /img/dashboard/transfer-ownership-of-project-dialog.png "Transfer Project dialog" %}

### 取消项目转让

开始转让后，你可以在任何时候，通过访问组织的项目并点击**Cancel Transfer**来取消转让：

{% imgTag /img/dashboard/cancel-transfer-of-project.png "Cancel pending transfer of project" %}

### 接受和拒绝项目转让

当一个项目转让给你时，你将收到一个通知邮件。你可以通过访问组织的项目并点击"Accept"或"Reject"来选择接受或拒绝该项目转让：

{% imgTag /img/dashboard/accept-or-reject-transfer-of-project.png "Accept or reject a transferred project" %}

## 删除

你可以删除你拥有的项目。同时这将删除项目所有的录制。删除项目也只能在{% url '数据面板服务' https://on.cypress.io/dashboard %}里进行。

1. 在面板里点进'Runs'；
2. 从左侧边栏里点击你想要的删除的项目；
3. 在本页的右侧点击'Settings'；
4. 在Settings页面的底部，点击"Remove Project"按钮

{% imgTag /img/dashboard/remove-project-dialog.png "Delete project dialog" %}

# 录制的运行

录制的运行从你的测试运行里面抓取结果。

{% note info %}
如果你还没对项目进行录制设定，{% urlHash "参阅这里" 设置 %}。
{% endnote %}

## 什么是录制？

### 运行详情

每一次运行都会包含以下详情：

- 跳过的、正排队的、已通过的和已失败的测试数量；
- 与运行相关联的（如果有）GitHub分支、pull请求、作者、提交sha和提交消息；
- 当前运行的时间轴，每一个测试用例集，以及测试开始和结束的时间；
- 当前运行是在什么持续集成品台里(如果是)以及它的CI id和url；
- 操作系统及其版本；
- 浏览器及其版本；
- Cypress版本。

{% imgTag /img/dashboard/run-details.png "run-details" %}

### {% fa fa-file-code-o fa-fw %} 规格文件

你可以查看不通规格吓的测试用例集的结果。也可以在 **时间轴视图** 和 **条形图视图** 间进行切换。

***时间轴视图***

时间轴视图记录的是测试集之间相对于彼此运行的情况。当你想要知道某些测试在{% url "并行" parallelization %}模式下是如何运行的实际情况时，这尤其有用。

{% imgTag /img/dashboard/specs-timeline-view.jpg "Specs tab with timeline view" %}

***条形图视图***

条形图视图按照测试集执行时间的长短进行绘图的。这种视图可以帮你知道用例执行时间的长短：

{% imgTag /img/dashboard/specs-barchart-view.jpg "Specs tab with bar chart view" %}

***跳转到失败的测试用例***

如果你有任何失败的测试用例，你可以鼠标悬停在图表上，然后点击失败的测试用例的链接，来跳转到它的失败信息和堆栈追溯信息

{% imgTag /img/dashboard/specs-failures-popup.png "Failures popup on spec hover %}

### {% fa fa-code fa-fw %} 标准输出

标准输出包括基于你设置的{% url '报告生成器' reporters %}的每个测试集的详细信息和摘要。默认情况下，它是`spec`报告生成器。

你还会在底部看到摘要，其中会显示截图或测试期间录制上传的视频。

{% imgTag /img/dashboard/standard-output-of-recorded-test-run.png "standard output" %}

***{% fa fa-picture-o fa-fw %} 截屏***

所有在测试期间的截屏都可以在 **Screenshots** 下找到。不管是失败的自动截屏还是手动使用{% url `cy.screenshot()` screenshot %}指令完成的。

***{% fa fa-video-camera fa-fw %} 录屏***

所有在测试期间的录屏都可以在 **Video** 下找到。你也可以下载它们。

{% imgTag /img/dashboard/videos-of-recorded-test-run.png "Video of test runs" %}

### {% fa fa-exclamation-triangle fa-fw %} 失败的那些测试

所有失败的测试集可以在 **Failures** 页签下找到。每一个失败都被列在其测试标题下了。

### 每一个失败会展示：

- **Test title:** 失败的测试的标题；
- **Error:** 错误信息的堆栈追踪；
- **Screenshot:** 任何在测试运行时截的图；
- **Video:** 截止到失败发生时的录屏

{% imgTag /img/dashboard/failures-of-recorded-run.png "failure tab" %}

# 组织

组织是用来分组化项目和对项目权限进行管理的。

{% imgTag /img/dashboard/organizations-listed-in-dashboard.png "Organizations" %}

***使用组织你可以：***

- 创建项目
- 邀请成员
- 转让项目
- 对使用后的项目进行支付

## 创建组织

你可以在{% url "数据面板服务" https://on.cypress.io/dashboard %}里的 **Organizations** 页签下，点击 **{% fa fa-plus %} Add Organization** 来创建组织。

{% imgTag /img/dashboard/add-organization-dialog.png "Add Organization dialog" %}

## 私人组织

默认情况下，Cypres的每个用户都有一个以你命名的个人组织。你无法删除或编辑此默认组织的名称。

## 删除组织

只要组织中没有任何项目，你就可以删除你拥有的组织。你必须先将项目的所有权转移到另一个组织，然后才能删除该组织。

{% imgTag /img/dashboard/remove-organization-dialog.png "Delete Organization" %}

# 成员

## 邀请成员

用户是登录到数据面板服务的任何人。你可以通过{% url '数据面板服务' https://on.cypress.io/dashboard %}邀请用户加入Cypress。受邀成员将看到组织运行的所有项目和测试。

### 邀请成员到组织：

1. 到{% url "组织页" https://on.cypress.io/dashboard/organizations %}选择你要邀请成员加入的组织；
2. 点击 **Users** ，然后 **Invite User**。*注意：你必须具有{% urlHash ""owner"或"admin"的权限" 成员角色 %}才能进行邀请。*
3. 填好被邀请成员的邮件地址，然后选好{% urlHash "角色" 成员角色 %}，之后点击 **Invite User**。 *注意：只有"owners"才能给予其他成员"owner"的权限*。
4. 被邀请成员将会收到一封带有可以接受该邀请的邮件。

{% imgTag /img/dashboard/invite-user-dialog.png "Invite User dialog" %}

## 成员角色

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

## 成员请求

成员可以"请求"访问给定的组织。如果你团队中的开发人员可以访问Cypress和你项目的源代码 - 他们可以请求获得对你组织的访问权限。这意味着你不必事先邀请团队成员，他们可以请求访问权限，你可以选择接受或拒绝他们访问。

{% imgTag /img/dashboard/request-access-to-organization.png "Request access to project" %}

# 开源计划

为了支持Cypress社区，我们为公共项目提供开源（OSS）计划，以便利用我们的数据面板服务和无限制的测试执行。要获得资格，你的项目只需要达成两件事：
 - 你的项目是非商业实体的
 - 你的项目的源代码可在公共场所获得，而且包含{% url "OSI-approved license" https://opensource.org/licenses %}
 
## 为组织请求参加OSS计划

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
