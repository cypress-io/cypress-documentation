---
title: 项目
---

利用Cypress，你就具备了录制项目用例的能力。

典型情况下，你一般会想在 {% url '持续集成' continuous-integration %}运行测试的时候进行录制，但其实你也可以在本地调试的时候进行。

# 设置

{% note info %}
想要设置项目进行录制，你必须使用{% url "Test Runner" test-runner %}。

在此之前请确保你已经{% url "安装" installing-cypress %}和{% url "打开" installing-cypress#Opening-Cypress %}了Cypress。
{% endnote %}

## 按照下面的指示进行设置：

{% imgTag /img/dashboard/setup-to-record.gif "Setup Project Screen" %}

1. 在{% url "Test Runner" test-runner %}中单击项目的** Runs **选项卡；
2. 单击**设置要录制的项目**；
3. 你需要登录才能录制你的测试，因此你需要登录我们的Dashboard服务；
4. 填写项目名称（这仅用于显示目的，可以在以后更改）；
5. 选择谁拥有该项目。你可以自己拥有它或选择你创建的组织。如果你没有任何组织，请单击**创建组织**。组织就像在GitHub中一样工作。它们使你能够区分开你个人和工作的项目 - {% url '参阅更多关于组织的介绍' organizations %}；
6. 选择此项目是公共还是私有
   -  **公共项目** 可以被看到的*任何人*录制和运行。通常这些是开源项目；
   -  **私有项目** 限制其仅能被*{% url "你邀请的用户" users %}*访问；
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

# 标识符

Cypress uses your {% urlHash "`projectId`" 项目ID %} and {% urlHash "Record Key" 录制秘钥 %} together to uniquely identify projects.

## 项目ID

一旦将项目设置为要录制，我们会为你的项目生成一个唯一的`projectId`并自动插入到你的`cypress.json`配置文件里。

### 这个`projectId`是在你`cypress.json`里的，一个6位字符的字符串：

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

## 录制秘钥 {% fa fa-key %}

Cypress使用你的`projectId`和*Record Key*，结合起来唯一标识你的项目。

{% imgTag /img/dashboard/project-id-and-record-key-shown-in-dashboard.png "ProjectID and Record Keys in Dashboard" %}

录制秘钥用来确认你的项目是否*允许*录制。只要你的录制秘钥还是 *private*（私有的），就没有其他人可以对你的项目进行录制 - 哪怕他们有`projectId`(也不行)。

即使你的项目是public（公共的），你 *也* 应该对你的录制秘钥保密。如果有人知道了你的录制秘钥和`projectId`，他们就可以对你的项目进行录制 - 这可能会导致你所有的测试结果是混淆不堪的！

其实，你的录制秘钥是用来使能你的某次运行是 *可编辑和可创建* 的，然而，它与那次运行在录制完成后是否是 *可读和可查看的* 无关。

{% note warning  %}
如果你的录制秘钥意外暴露了，你应该删除它，并在{% url '数据面板服务' https://on.cypress.io/dashboard %}里生成一个新的。
{% endnote %}

一旦将项目设置为要录制，我们会自动为该项目生成一个*录制秘钥*。

### 一个录制秘钥就是类似下面的一个GUID（全局唯一标识符）:

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

你可以为一个项目创建多个录制秘钥，或在我们的{% url '数据面板' https://on.cypress.io/dashboard %}删除某一部分。你也可以在Test Runner的*Settings*页签里找到你的录制秘钥：

{% imgTag /img/dashboard/record-key-shown-in-desktop-gui-configuration.png "Record Key in Configuration Tab" %}

# Record keys

See {% urlHash "Record key" 录制秘钥 %} for a full description of how the record keys are used.

## Create new record key

1. Go to your organization's projects page.
2. Select the project you want to change access to.
  {% imgTag /img/dashboard/select-cypress-project.jpg "Select a project" %}
3. Go to the project's **Settings** page.
  {% imgTag /img/dashboard/visit-project-settings.jpg "Visit project settings" %}
4. Here you will see a **Record Keys** section
  {% imgTag /img/dashboard/record-keys-in-project-settings-dashboard.jpg "Record keys in Dashboard" %}
5. Click **Create New Key**. A new key will be automatically generated for your project.

## Delete record key

1. Go to your organization's projects page.
2. Select the project you want to change access to.
  {% imgTag /img/dashboard/select-cypress-project.jpg "Select a project" %}
3. Go to the project's **Settings** page.
  {% imgTag /img/dashboard/visit-project-settings.jpg "Visit project settings" %}
4. Here you will see a **Record Keys** section
  {% imgTag /img/dashboard/record-keys-in-project-settings-dashboard.jpg "Record keys in Dashboard" %}
5. Click **Delete** beside the record key you want to delete.

# Parallelization settings

## Run completion delay

You can edit the number of seconds that a run will wait for new groups to join before transitioning to 'completed'. See our {% url "parallelization guide" parallelization#Run-completion-delay %} to learn more.

{% imgTag /img/dashboard/run-completion-delay.jpg "Run completion delay settings" %}

# GitHub Integration

You can integrate your project with GitHub and edit its settings from within the project settings page. 

{% imgTag /img/dashboard/visit-project-settings.jpg "Visit project settings" %}

See our {% url "GitHub Integration guide" github-integration %} to learn more.

# Access to Runs

# 公有 vs 私有

- **公有** 意味着任何人都可以看到项目测试运行的录制。它类似于GitHub，Travis CI或CircleCI上的公共项目的处理方式。任何知道你`projectId`的人都能看到公共项目的运行录制。

- **私有** 表示只有被邀请到你的{% url '组织' users %}的{% url '用户' organizations %}可以查看其录制的运行情况。即使有人知道你的`projectId`，除非你邀请他们，否则他们将无法访问你的运行。

## 修改项目访问权

1. Go to your organization's projects page.
2. Select the project you want to change access to.
  {% imgTag /img/dashboard/select-cypress-project.jpg "Select a project" %}
3. Go to the project's settings page.
  {% imgTag /img/dashboard/visit-project-settings.jpg "Visit project settings" %}
4. Here you will see a section displaying **Access to Runs**. Choose the appropriate access you'd like to assign for the project here.
  {% imgTag /img/dashboard/access-to-runs.jpg "access-to-runs" %}

# 转让所有权

## 转让某个项目给其他人或组织

你可以将你拥有的项目转让给其他你所在的{% url "组织" organizations %}或此项目中的其他成员。项目只能在{% url '数据面板服务' https://on.cypress.io/dashboard %}里进行转让。

1. Go to your organization's projects page.
2. Select the project you wish to transfer.
  {% imgTag /img/dashboard/select-cypress-project.jpg "Select a project" %}
3. Go to the project's settings page.
  {% imgTag /img/dashboard/visit-project-settings.jpg "Visit project settings" %}
4. Scroll down to the **Transfer Ownership** section and click **Transfer Ownership**.
  {% imgTag /img/dashboard/transfer-ownership-button.jpg "Transfer ownership button" %}
5. Select the user or organization, then click **Transfer**.
  {% imgTag /img/dashboard/transfer-ownership-of-project-dialog.png "Transfer Project dialog" %}

## 取消项目转让

开始转让后，你可以在任何时候，通过访问组织的项目并点击**Cancel Transfer**来取消转让：

{% imgTag /img/dashboard/cancel-transfer-of-project.png "Cancel pending transfer of project" %}

## 接受和拒绝项目转让

当一个项目转让给你时，你将收到一个通知邮件。你可以通过访问组织的项目并点击"Accept"或"Reject"来选择接受或拒绝该项目转让：

{% imgTag /img/dashboard/accept-or-reject-transfer-of-project.png "Accept or reject a transferred project" %}

# 删除

你可以删除你拥有的项目。同时这将删除项目所有的录制。删除项目也只能在{% url '数据面板服务' https://on.cypress.io/dashboard %}里进行。

1. Go to your organization's projects page.
2. Select the project you want to remove.
  {% imgTag /img/dashboard/select-cypress-project.jpg "Select a project" %}
3. 在本页的右侧点击'Settings'；
  {% imgTag /img/dashboard/visit-project-settings.jpg "Visit project settings" %}
4. 在Settings页面的底部，点击"Remove Project"按钮
  {% imgTag /img/dashboard/remove-project-dialog.png "Delete project dialog" %}
5. Confirm that you want to delete the project by clicking **Yes, Remove Project**.
