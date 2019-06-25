---
title: 并行化
---

{% note info %}
# {% fa fa-graduation-cap %}  你将会学习到什么

- 如何并行化测试运行
- 如何分组测试运行
- 分组测试运行的策略
- 测试负载平衡是如何工作的
- 仪表盘上有哪些有效的测试结论

{% endnote %}

# 综述

如果您的项目有大量的测试，那么在一台机器上串行地运行测试可能需要很长时间。在持续集成(CI)中运行测试时，在许多虚拟机上并行运行测试可以节省团队时间和金钱。

从{% url "3.1.0" changelog#3-1-0 %}版本开始，Cypress可以在多台机器上并行运行记录测试。虽然并行测试在技术上也可以在一台机器上运行，但我们不推荐，因为这台机器需要大量的资源才能有效地运行您的测试。

这个指南假设您已经在持续集成中运行和{% url "记录" dashboard-service#Setup %}了项目。如果还您没有配置您的项目，请查看我们的{% url "持续集成指南" continuous-integration %}。

{% imgTag /img/guides/parallelization/parallelization-diagram.png "Parallelization Diagram" "no-border" %}

# 分割您的测试集

Cypress的并行化策略是基于文件的，所以为了使用并行化，您的测试需要分割成不同的文件。

Cypress会根据我们的{% urlHash '平衡策略' 平衡策略 %}将每一个spec文件分配给一台可用的机器。由于这个平衡策略，在并行化时不能保证spec文件的运行顺序。

# 开启并行化

1. 参考您的CI提供者的文档，了解如何设置多个机器在CI环境运行。

2. 一旦您的CI环境有多个机器是可用的，您就可以传递{% url "`--parallel`" command-line#cypress-run-parallel %}键给{% url "`cypress run`" command-line#cypress-run %}，使您记录的测试平行化。

  ```shell
  cypress run --record --key=abc123 --parallel
  ```

    {% note info %}
   并行运行测试需要传递{% url "`--record`标志" command-line#cypress-run %}。这确保Cypress能够正确地收集并行化将来运行所需的数据。这也为您提供了在{% url "仪表盘服务" dashboard-service %}中查看并行测试结果的全部好处。如果您还没有设置要记录的项目，请查看我们的{% url "设置指南" dashboard-service#Setup %}。
    {% endnote %}

# CI并行交互

在并行化模式下，Cypress{% url "仪表盘服务" dashboard-service %}与您的CI机器交互，通过下面的过程，跨可用CI机器的spec{% urlHash '负载平衡' 平衡策略 %}来协调测试运行的并行化：

1. CI机器与Cypres仪表盘服务联系，以指示在项目中运行哪些spec文件。
2. 机器通过与Cypress联系，选择接收要运行的spec文件。
3. 收到CI机器的请求后，Cypress计算出测试每个spec文件的估计时间。
4. 根据这些估算，Cypress将spec文件一个一个地分配（{% urlHash '负载平衡' 平衡策略 %}）每台可用的机器，以最小化总体测试运行时间。
5. 当每台CI机器运行完分配给它的spec文件后，更多的spec文件被分配给它。这个过程会重复，直到所有spec文件都完成为止。
6. 在完成所有spec文件之后，Cypress会{% urlHash '等待一段可配置的时间' 运行完成延迟 %}，然后才认为测试运行已经全部完成。这样做是为了更好地支持{% urlHash '运行分组' 分组测试运行 %}。

简而言之：每个测试运行器向仪表盘服务发送一个spec文件列表，服务每次向每个测试运行器返回一个spec文件让它去运行。

## 并行化过程

{% imgTag /img/guides/parallelization/parallelization-overview.png "Parallelization Overview" "no-border" %}

# 平衡策略

Cypress将自动在您的CI供应商中平衡可用机器的spec文件。Cypress根据之前运行收集的数据计算要运行哪个spec文件。这确保您的spec文件运行得尽可能快，不需要手动配置。

随着越来越多的测试被记录到Cypress仪表盘上，Cypress可以更好地预测给定的spec文件运行所需的时间。为了防止不相关的数据影响持续时间预测，Cypress不使用与spec文件相关的旧历史运行数据。

## Spec历史持续时间分析

{% imgTag /img/guides/parallelization/load-balancing.png "Spec duration forecasting" "no-border" %}

通过对测试运行的每个spec文件的持续时间进行估计，Cypress可以按spec运行持续时间的降序将spec文件分发给可用的CI资源。通过这种方式，最耗时的spec首先启动，从而将整个测试运行持续时间最小化。

{% note info %}
对于测试了spec文件的每个浏览器，将分别进行持续时间估计。这是很有帮助的，因为性能特征因浏览器而异，因此每个浏览器测试spec文件的估计持续时间不同是完全可以接受的。
{% endnote %}

# 示例

下面的示例来自我们{% url "Kitchen Sink Example" https://github.com/cypress-io/cypress-example-kitchensink %}项目的运行。您可以在{% url "Cypress仪表盘" https://dashboard.cypress.io/#/projects/4b7344/runs/2929/specs %}上看到运行的结果。

## 没有并行化

在本例中，一台机器运行一个名为`1x- electronic`的任务，该任务定义在项目的{%url "circle.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/circle.yml %}文件中。在这个任务中，Cypress按字母顺序依次运行所有19个spec文件。完成所有的测试需要**1:51**。

```text
1x-electron, Machine #1
--------------------------
-- actions.spec.js (14s)
-- aliasing.spec.js (1s)
-- assertions.spec.js (1s)
-- connectors.spec.js (2s)
-- cookies.spec.js (2s)
-- cypress_api.spec.js (3s)
-- files.spec.js (2s)
-- local_storage.spec.js (1s)
-- location.spec.js (1s)
-- misc.spec.js (4s)
-- navigation.spec.js (3s)
-- network_requests.spec.js (3s)
-- querying.spec.js (1s)
-- spies_stubs_clocks.spec.js (1s)
-- traversal.spec.js (4s)
-- utilities.spec.js (3s)
-- viewport.spec.js (3s)
-- waiting.spec.js (5s)
-- window.spec.js (1s)
```

{% note info %}
请注意，当将spec的运行时间(**0:55**)相加时，它们加起来小于运行完成所需的总时间(**1:51**)。每个spec的运行都有额外的时间：启动浏览器、编码并将视频上传到仪表板、请求运行下一个spec。
{% endnote %}

## 并行化

当我们使用并行化运行相同的测试时，Cypress根据spec之前的运行历史使用{% urlHash "平衡策略" 平衡策略 %}来指定要运行的spec。在与上面相同的CI运行期间，我们再次运行*所有*测试，但这次是在两台机器上并行化。该任务名为`2x-electron`在项目的{%url "circle.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/circle.yml %}文件中，并在**59秒**内完成。

```text
2x-electron, Machine #1, 9 specs          2x-electron, Machine #2, 10 specs
--------------------------------          -----------------------------------
-- actions.spec.js (14s)                  -- waiting.spec.js (6s)
-- traversal.spec.js (4s)                 -- navigation.spec.js (3s)
-- misc.spec.js (4s)                      -- utilities.spec.js (3s)
-- cypress_api.spec.js (4s)               -- viewport.spec.js (4s)
-- cookies.spec.js (3s)                   -- network_requests.spec.js (3s)
-- files.spec.js (3s)                     -- connectors.spec.js (2s)
-- location.spec.js (2s)                  -- assertions.spec.js (1s)
-- querying.spec.js (2s)                  -- aliasing.spec.js (1s)
-- location.spec.js (1s)                  -- spies_stubs_clocks.spec.js (1s)
                                          -- window.spec.js (1s)
```

当查看仪表盘上的{% urlHash "机器视图" 机器视图 %}时，运行时间和使用的机器之间的差异非常明显。注意，在两台机器上并行化的运行如何根据持续时间自动运行所有spec，而没有并行化的运行则不会。

{% imgTag /img/guides/parallelization/1-vs-2-machines.png "Without parallelization vs parallelizing across 2 machines" %}

在两台机器上并行化我们的测试节省了将近50%的总运行时间，并且我们可以通过添加更多的机器来进一步减少构建时间。

# 分组测试运行

通过传递{% url "`--group <name>`标记" command-line#cypress-run-group-lt-name-gt %}，多个{% url "`cypress run`" command-line#cypress-run %}调用可以标记并关联到一个**单**运行，其中`name`是一个任意参考标签。组名在关联的测试运行中必须是唯一的。

{% note info %}
为了将多个运行分组到单个运行中，CI机器需要共享一个公共的CI构建ID环境变量。通常，这些CI机器将并行运行，或者在相同的构建工作流或管道中运行，但是**不是必须使用Cypress并行化来对运行进行分组**。运行分组可以独立于Cypress并行化来使用。
{% endnote %}

{% imgTag /img/guides/parallelization/machines-view-grouping-expanded.png "Machines view grouping expanded" "no-border" %}

## 通过浏览器分组

您可以在不同的浏览器上测试您的应用程序，并在仪表盘中的单个运行下查看结果。下面，我们简单地将我们的组命名成与正在测试的浏览器相同的名称：

- 第一个组叫做`Windows/Chrome 69`。

  ```shell
  cypress run --record --group Windows/Chrome-69 --browser chrome
  ```

- 第二个组叫做`Mac/Chrome 70`。

  ```shell
  cypress run --record --group Mac/Chrome-70 --browser chrome
  ```

- 第三个组叫做`Linux/Electron`。 *Electron是Cypress运行中使用的默认浏览器*。

  ```shell
  cypress run --record --group Linux/Electron
  ```

{% imgTag /img/guides/parallelization/browser.png "browser" "no-border" %}

## 分组以标签并行化

我们也有能力将Cypress与我们的分组并行化。为了演示，让我们运行一个组用2台Chrome机器进行测试，一个组用4台Electron机器进行测试，再运行一个组，用1台Electron机器进行测试：

```shell
cypress run --record --group 1x-electron
```

```shell
cypress run --record --group 2x-chrome --browser chrome --parallel
```

```shell
cypress run --record --group 4x-electron --parallel
```

这里使用的`1x`， `2x`， `4x`的前缀只是一种被采用的约定，用于表示每次运行的并行度级别，并且*不是必须的或必要的*。

{% note info %}
每个`cypress run`调用专用的机器数量取决于项目的CI配置。
{% endnote %}

以这种方式标记这些组有助于我们之后在Cypress仪表盘中查看测试运行情况，如下所示：

{% imgTag /img/guides/parallelization/timeline-collapsed.png "Timeline view with grouping and parallelization" %}

## 按照spec上下文分组

假设您有一个应用程序，其中有一个*面向客户的入口*、*一个面向访客的入口*和*一个面向管理的入口*。您可以在同一运行中组织和测试应用程序的这三个部分：

- 一个组叫做`package/admin`：

```shell
cypress run --record --group package/admin --spec 'cypress/integration/packages/admin/**/*'
```

- 另一个组叫做`package/customer`：

```shell
cypress run --record --group package/customer --spec 'cypress/integration/packages/customer/**/*'
```

- 最后一组叫做`package/guest`：

```shell
cypress run --record --group package/guest --spec 'cypress/integration/packages/guest/**/*'
```

{% imgTag /img/guides/parallelization/monorepo.png "monorepo" "no-border" %}

这种模式对于monorepo中的项目特别有用。monorepo的每个部分都可以分配自己的组，更大的部分可以并行以加快测试速度。


# 链接CI机器以进行并行化或分组

CI构建ID用于将多个CI机器关联到一个测试运行。此标识符基于每个CI构建所特有的环境变量，并根据CI提供商的不同而变化。Cypress对大多数常用的CI供应商都提供开箱即用的支持，因此通常不需要通过{% url "`--ci-build-id`标记" command-line#cypress-run-ci-build-id-lt-id-gt %}直接设置CI构建ID。

{% imgTag /img/guides/parallelization/ci-build-id.png "CI Machines linked by ci-build-id" "no-border" %}

## CI根据供应商构建ID环境变量

Cypress目前使用以下CI环境变量来确定测试运行的CI构建ID：

| Provider  | Environment Variable  |
|--|--|
| AppVeyor  | `APPVEYOR_BUILD_NUMBER`  |
| Bamboo  | `BAMBOO_BUILD_NUMBER`  |
| Circle  |  `CIRCLE_WORKFLOW_ID`, `CIRCLE_BUILD_NUMBER` |
| Codeship  | `CI_BUILD_NUMBER`  |
| Codeship Basic  | `CI_BUILD_NUMBER`  |
| Codeship Pro  | `CI_BUILD_ID`  |
| Drone  | `DRONE_BUILD_NUMBER`  |
| Gitlab  | `CI_PIPELINE_ID`, `CI_JOB_ID`, `CI_BUILD_ID`  |
| Jenkins  | `BUILD_NUMBER`  |
| Travis  | `TRAVIS_BUILD_ID`  |

您可以传递不同的值将代理链接到相同的运行。例如，如果您正在使用Jenkins，并且认为环境变量`BUILD_TAG`比环境变量`BUILD_NUMBER`更唯一，那么可以通过CLI {% url "`--ci-build-id`标记" command-line#cypress-run-ci-build-id-lt-id-gt %}传递`BUILD_TAG`值。

```shell
cypress run --record --parallel --ci-build-id $BUILD_TAG
```

# 运行完成延迟

在并行化模式下或分组运行时，Cypress将等待指定的时间才能完成测试运行，以防还有其他相关行为。这是为了补偿可以在队列中备份CI机器的各种情况。

这个等待期称为**运行完成延迟**，从最后一个已知的CI机器完成后开始，如下图所示：

{% imgTag /img/guides/parallelization/run-completion-delay.png "Test run completion delay" "no-border" %}

这个**延迟默认为60秒**，但是可以在{% url "仪表盘" dashboard-service %}项目设置页面中配置：

{% imgTag /img/guides/parallelization/project-run-delay-setting.png "Dashboard project run completion delay setting" %}

# 在仪表盘中可视化并行和分组

您可以在运行的**Specs**选项卡中看到在{% url "仪表盘服务" dashboard-service %}中运行的每个spec文件的结果。Specs在**时间轴**、**条形图**和**机器**视图中显示。

## 时间轴视图

时间轴视图在您的spec文件相对运行时绘制它们的图表。当您想要可视化您的测试如何在所有可用的机器上按时间顺序运行时，这尤其有用。

{% imgTag /img/guides/parallelization/timeline-view-small.png "Timeline view with parallelization" %}

## 条形图视图

条形图视图可视化了您的spec文件之间的**持续时间**。

{% imgTag /img/guides/parallelization/bar-chart-view.png "Bar Chart view with parallelization" %}

## 机器视图

机器视图根据执行spec文件的机器来绘制它们的图表。这个视图让评估每台机器对整个测试运行的贡献变得很容易。

{% imgTag /img/guides/parallelization/machines-view.png "Machines view with parallelization" %}

# 另请参阅

- {% url "博客：自动化测试并行化让您的端到端测试运行速度加快10倍" https://www.cypress.io/blog/2018/09/05/run-end-to-end-tests-on-ci-faster/ %}
- {% url "博客：以您想要的方式运行和分组测试" https://glebbahmutov.com/blog/run-and-group-tests/ %}
- {% url "在Kitchen Sink Example中的CI配置" https://github.com/cypress-io/cypress-example-kitchensink#ci-status %}
- 幻灯片{% url "Cypress测试并行化和分组" https://slides.com/bahmutov/cy-parallelization %}和{% url "网络研讨会视频" https://www.youtube.com/watch?v=FfqD1ExUGlw %}
