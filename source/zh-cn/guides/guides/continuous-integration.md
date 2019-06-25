---
title: 持续集成
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学习到什么

- 如何在持续集成模式下运行Cypress
- 如何在众多的持续集成平台里完成Cypress配置
- 如何在Cypress面板里录制测试
- 如何在CI模式下并行运行测试
{% endnote %}

{% video local /img/snippets/running-in-ci.mp4 %}

# 1. CI设置

## 1.1基础

在持续集成模式下运行Cypress，跟你在本地命令行里运行Cypress几乎差不多。一般情况下你只需要做两件事：

  1. **安装Cypress**

  ```shell
  npm install cypress --save-dev
  ```

  2. **运行Cypress**

  ```shell
  cypress run
  ```

取决于你在哪种CI平台下使用，你可能还需要一个配置文件。你需要参考你CI平台提供的文档，以了解在哪儿添加安装和运行命令。参考了解更多{% urlHash "示例" 2-示例 %}。

## 1.2 启动服务

### 1.2.1 挑战

典型情况下，你一般需要在本地起一个Cypress服务来运行它。当你启动完你的服务的时候，它会像一个**长期运行进程**那样运行，永不退出。因为这样，你需要它运行在**后台**。否则你的CI平台将永远不会继续执行下一条指令。

将服务进程后台化，才能让你的CI平台在执行完服务启动后继续执行下一条该执行的指令。

为达到这一点，许多人会使用下面这种方案：

```shell
npm start & cypress run // 千万不要这样
```

这样做的问题在于 - 如果你的服务启动需要一定时间呢？没有任何的监控去保证下一条（`cypress run`）指定该运行的时候你的服务已经启动完毕并已经可用了。比如Cypress开始去访问你某个地址了，而你的服务并没有完全准备好。

### 1.2.2 方案

很幸运，现在已经有了几种解决方案。我们不会向你介绍使用低劣的（比如`sleep 20`）方法，你完全可以选一个更好的。

***`wait-on` module***

使用{% url 'wait-on' https://github.com/jeffbski/wait-on %}模块，你可以阻塞`cypress run`运行直至你的服务启动完毕。

```shell
npm start & wait-on http://localhost:8080
```

```shell
cypress run
```

{% note info %}
大多数的CI平台会自动杀掉后台进程，所以你不必担心Cypress运行完毕后还要去做清理工作。

然而，如果你是在本地运行此脚本的话，你还是要做一点工作的 - 搜集其后台进程PID，在`cypress run`运行完毕后杀掉它。
{% endnote %}

***`start-server-and-test` module***

如果服务启动需要很长的时间，我们建议试试{% url start-server-and-test https://github.com/bahmutov/start-server-and-test %}模块。

```shell
npm install --save-dev start-server-and-test
```

按如下格式定制命令，修改服务器的url地址以及你的Cypress测试指令：

```json
{
  "scripts": {
    "start": "my-server -p 3030",
    "cy:run": "cypress run",
    "test": "start-server-and-test start http://localhost:3030 cy:run"
  }
}
```

在上面的示例中，`cy:run`命令只会在 `http://localhost:3030` 能返回200之后才开始运行。另外，服务也会在测试完成后被自动关闭。

## 1.3 录制用例

Cypress可以录制测试用例，并且在{% url 'Cypress Dashboard' https://on.cypress.io/dashboard %}给出可视化的测试结果。

### 1.3.1 使用录制你可以：

- 看到失败的、将要运行的和成功的用例；
- 获得失败用例的所有追溯信息；
- 跟使用{% url `cy.screenshot()` screenshot %}时一样看到失败用例的截图；
- 观看整个测试用例运行的视频或观察一小段失败时候的场景；
- 使用{% url "parallelized" parallelization %}时还看到哪个机器在运行哪个用例。

### 1.3.2 使用录制前你需要：

1. {% url '设置录制项目' dashboard-service#Setup %}
2. 在使用CI的时候{% url '传`--record`参数给`cypress run`' command-line#cypress-run %}

```shell
cypress run --record --key=abc123
```

{% url '请在Dashboard Service里参考完整指导' dashboard-service %}

## 1.4 测试并行执行

Cypress可以在多台机器上并行运行测试。

您需要参考CI提供商的文档，了解如何设置在CI环境中配置多台计算机。

在CI环境中有多台计算机可用后，您可以传递{% url "`--parallel`" command-line#cypress-run-parallel %}参数以使您的测试并行运行。

```shell
cypress run --record --key=abc123 --parallel
```

{% url '请参考并行相关的完整指导' parallelization %}

# 2. 示例

Cypress支持**所有的**CI提供商。我们提供了一些示例项目和配置来帮助你快速开始。

CI提供商 | 示例项目 | 示例配置
----------- | --------------- | --------------
{% url "AppVeyor" https://appveyor.com %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "appveyor.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/appveyor.yml %}
{% url "Azure DevOps / VSTS CI / TeamFoundation" https://dev.azure.com/ %} | {% url "cypress-example-kitchensink" https://github.com/bahmutov/cypress-example-kitchensink %} | {% url "vsts-ci.yml" https://github.com/bahmutov/cypress-example-kitchensink/blob/master/vsts-ci.yml %}
{% url "BitBucket" https://bitbucket.org/product/features/pipelines %} | {% url "cypress-example-kitchensink" https://bitbucket.org/cypress-io/cypress-example-kitchensink %} | {% url "bitbucket-pipelines.yml" https://bitbucket.org/cypress-io/cypress-example-kitchensink/src/master/bitbucket-pipelines.yml %}
{% url "BuildKite" https://buildkite.com %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url ".buildkite/pipeline.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.buildkite/pipeline.yml %}
{% url "CircleCI" https://circleci.com %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "circle.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/circle.yml %}
{% url "CodeShip Basic" https://codeship.com/features/basic %} (has {% issue 328 "cy.exec() issue" %}) | |
{% url "CodeShip Pro" https://codeship.com/features/pro %} | {% url "cypress-example-docker-codeship" https://github.com/cypress-io/cypress-example-docker-codeship %} |
{% url "Concourse" https://concourse-ci.org/ %} | |
{% url "Docker" https://www.docker.com/ %} | {% url "cypress-docker-images" https://github.com/cypress-io/cypress-docker-images %} |
{% url "GitLab" https://gitlab.com/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url ".gitlab-ci.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.gitlab-ci.yml %}
{% url "Jenkins" https://jenkins.io/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "Jenkinsfile" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/Jenkinsfile %}
{% url "Semaphore" https://semaphoreci.com/ %} | |
{% url "Shippable" https://app.shippable.com/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "shippable.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/shippable.yml %}
{% url "Solano" https://www.solanolabs.com/ %} | |
{% url "TravisCI" https://travis-ci.org/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url ".travis.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.travis.yml %}



## 2.1 Travis

### 2.1.1 示例配置文件 `.travis.yml`

```yaml
language: node_js
node_js:
  - 10
addons:
  apt:
    packages:
      # Ubuntu 16+ does not install this dependency by default, so we need to install it ourselves
      - libgconf-2-4
cache:
  # Caches $HOME/.npm when npm ci is default script command
  # Caches node_modules in all other cases
  npm: true
  directories:
    # we also need to cache folder with Cypress binary
    - ~/.cache
install:
  - npm ci
script:
  - $(npm bin)/cypress run --record
```

npm模块缓存文件在第一次构建之后会节省很多的时间。

## 2.2 CircleCI

### {% badge success New %}2.2.1 CircleCI示例

Cypress CircleCI Orb是在`circle.yml`文件里的部分配置，可以帮助你正确而又轻易地安装、缓存和运行。

完整的文档可以在{% url "`cypress-io/circleci-orb`" https://github.com/cypress-io/circleci-orb %}里找到。

一个典型示例：

```yaml
version: 2.1
orbs:
  # "cypress-io/cypress@1" installs the latest published
  # version "1.x.y" of the orb. We recommend you then use
  # the strict explicit version "cypress-io/cypress@1.x.y"
  # to lock the version and prevent unexpected CI changes
  cypress: cypress-io/cypress@1
workflows:
  build:
    jobs:
      - cypress/run # "run" job comes from "cypress" orb
```

更加复杂的项目，比如需要安装依赖、构建应用和通过在4台CI机器上{% url "并行" parallelization %}运行测试可以是这样：

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1
workflows:
  build:
    jobs:
      - cypress/install:
          build: 'npm run build'  # run a custom app build step
      - cypress/run:
          requires:
            - cypress/install
          record: true        # record results on Cypress Dashboard
          parallel: true      # split all specs across machines
          parallelism: 4      # use 4 CircleCI machines to finish quickly
          group: 'all tests'  # name this group "all tests" on the dashboard
          start: 'npm start'  # start server before running tests
```

对于上述种种，你是使用Cypress在orb里提供的`run`和`install`任务定义。使用orb带来简单化和对CircleCI参数配置的静态检查。

在{% url "我们的orb示例页" https://github.com/cypress-io/circleci-orb/blob/master/docs/examples.md %}和{% url cypress-circleCI-orb示例 https://github.com/cypress-io/cypress-example-circleci-orb %}项目里你可以找到更多示例.

### 2.2.2 `circle.yml`v2配置文件示例

```yaml
version: 2
jobs:
  build:
    docker:
      - image: cypress/base:8
        environment:
          ## this enables colors in the output
          TERM: xterm
    working_directory: ~/app
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
            - v1-deps-{{ .Branch }}
            - v1-deps
      - run:
          name: Install Dependencies
          command: npm ci
      - save_cache:
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
          # cache NPM modules and the folder with the Cypress binary
          paths:
            - ~/.npm
            - ~/.cache
      - run: $(npm bin)/cypress run --record --key <record_key>
```

### 2.2.3 使用`yarn`的`circle.yml` v2配置文件示例

```yaml
version: 2
jobs:
  build:
    docker:
      - image: cypress/base:8
        environment:
          ## this enables colors in the output
          TERM: xterm
    working_directory: ~/app
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
            - v1-deps-{{ .Branch }}
            - v1-deps
      - run:
          name: Install Dependencies
          command: yarn install --frozen-lockfile
      - save_cache:
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
          paths:
            - ~/.cache  ## cache both yarn and Cypress!
      - run: $(yarn bin)/cypress run --record --key <record_key>
```

在{% url "cypress docker示例" https://github.com/cypress-io/cypress-example-docker-circle %}里找完整的带有缓存和已上传工件的CircleCI v2示例。

## 2.3 Docker

我们已经{% url '创建了' https://github.com/cypress-io/cypress-docker-images %}一个官方的{% url 'cypress/base' 'https://hub.docker.com/r/cypress/base/' %}容器，它包含所有的依赖。你只需要添加Cypress，然后，开始吧！而且我们正在{% url 'cypress/browsers' 'https://hub.docker.com/r/cypress/browsers/' %}添加带有预安装浏览器的镜像。一个典型的Dockerfile大概看起来是这样：

```text
FROM cypress/base
RUN npm install
RUN $(npm bin)/cypress run
```

{% note warning %}
挂载一个已经存在`node_modules`的项目目录到`cypress/base`docker镜像里 **是不会工作的**：

```shell
docker run -it -v /app:/app cypress/base:8 bash -c 'cypress run'
Error: the cypress binary is not installed
```

取而代之，你应该为你项目的cypress版本构建一个docker容器。

{% endnote %}

### 2.3.1 Docker镜像和CI示例

参考{% url 'docker示例' docker %}以获取多个CI提供商的更多在维护的镜像和配置。

# 3. 高级设置

## 3.1 依赖

如果你没有使用以上的CI提供商，那么请确保你的系统已经安装如下依赖：

```shell
apt-get install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

## 3.2 缓存

参考{% url "Cypress version 3.0" changelog#3-0-0 %}，Cypress下载它的二进制可执行文件到系统全局缓存里 - Linux的话，是在`~/.cache/Cypress`里。 Cypress通过在所有构建中确保此缓存, 你也就阻止了大型二进制文件下载来缩短了安装时间。

### 3.2.1 我们建议使用者：

- 在运行`npm install`，`yarn`，{% url "`npm ci`" https://docs.npmjs.com/cli/ci %}或类似下面的配置时，缓存下`~/.cache`目录。

- **不要**缓存`node_modules`。这样会绕过使用`npm` or `yarn`的智能缓存包，并且会导致在`npm install`时不会下载Cypress二进制可执行文件的问题。

- 如果你在构建过程中使用`npm install`，考虑{% url "切换至`npm ci`" https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable %}和缓存`~/.npm`目录，以便有一个更快和更稳定的构建。

- 如果你使用`yarn`，缓存下的`~/.cache`将同时包含`yarn`和Cypress缓存。考虑使用`yarn install --frozen-lockfile`作为一个{% url "`npm ci`" https://docs.npmjs.com/cli/ci %}的替代品。

如果你需要自定义二进制可执行文件的位置，使用{% url '`CYPRESS_CACHE_FOLDER`' installing-cypress#Binary-cache %}环境变量。

## 3.3 环境变量

你可以设置繁多的环境变量去自定义Cypress如何运行。

### 3.3.1 配置值

你可以设置任何配置值作为一个环境变量，这可能会覆盖在`cypress.json`里的值。

***典型的修改一般是：***

- `CYPRESS_BASE_URL`
- `CYPRESS_VIDEO_COMPRESSION`
- `CYPRESS_REPORTER`
- `CYPRESS_INSTALL_BINARY`

参考{% url '配置' configuration#Environment-Variables %}以了解更多示例。

***录制秘钥***

如果你正在一个公共项目上{% urlHash '录制用例' 1-3-录制用例 %}，你可能会想保护你的录制秘钥。{% url '了解为什么。' dashboard-service#Identification %}

在命令里写死秘钥值是不科学的：

```shell
cypress run --record --key abc-key-123
```

你可以设置录制秘钥为环境变量`CYPRESS_RECORD_KEY`，Cypress会自动使用这个值。现在录制时，你可以省略`--key`标志了：

```shell
cypress run --record
```

典型的情况下，你一般是在CI提供商里设置这个值。

***CircleCI环境变量***

{% imgTag /img/guides/cypress-record-key-as-environment-variable.png "Record key environment variable" %}

***TravisCI环境变量***

{% imgTag /img/guides/cypress-record-key-as-env-var-travis.png "Travis key environment variable" %}

### 3.3.2 Git信息
Cypress使用{% url 'commit-info' https://github.com/cypress-io/commit-info %}包来获取git信息并关联到运行时（比如分支信息、提交信息、作者等）。

它默认有一个`.git`的目录，并使用Git命令去获取各个信息，比如`git show -s --pretty=%B`来获取提交信息，参考{% url 'src/git-api.js' https://github.com/cypress-io/commit-info/blob/master/src/git-api.js %}。

在一些环境设置中（比如`docker`/`docker-compose`），如果`.git`目录不可访问或没挂载到，，你可以通过以下环境变量来传这些参数值：

- Branch: `COMMIT_INFO_BRANCH`
- Message: `COMMIT_INFO_MESSAGE`
- Author email: `COMMIT_INFO_EMAIL`
- Author: `COMMIT_INFO_AUTHOR`
- SHA: `COMMIT_INFO_SHA`
- Remote: `COMMIT_INFO_REMOTE`

### 3.3.3 自定义环境变量

测试时你可以设置自定义的环境变量，这使你的代码可以引用动态值：

```shell
export "EXTERNAL_API_SERVER=https://corp.acme.co"
```

然后在测试里：

```javascript
cy.request({
  method: 'POST',
  url: Cypress.env('EXTERNAL_API_SERVER') + '/users/1',
  body: {
    foo: 'bar',
    baz: 'quux'
  }
})
```

参考专门的{% url '环境变量指南' environment-variables %}获取更多示例。

## 3.4 模块API

通常来说，使用Node脚本程序化控制和启动你的服务要简单得多。

如果你使用我们的{% url '模块API' module-api %}，那么你可以写一个脚本来重启和关闭服务。作为附加奖赏，你可以更好地利用起运行结果或做其他事。

```js
// scripts/run-cypress-tests.js

const cypress = require('cypress')
const server = require('./lib/my-server')

// start your server
return server.start()
.then(() => {
  // kick off a cypress run
  return cypress.run()
  .then((results) => {
    // stop your server when it's complete
    return server.stop()
  })
})
```

```shell
node scripts/run-cypress-tests.js
```

# 4. 已知问题

## 4.1 Docker

如果你是长期运行docker，你需要设置`ipc`为`host`模式，{% issue 350 'This issue' %}阐述了到底怎么做。

# 5. 其他

- {% url cypress-example-kitchensink https://github.com/cypress-io/cypress-example-kitchensink#ci-status %} 已经设置为运行在多个CI提供商上。
- {% url "博客: Setting up Bitbucket Pipelines with proper caching of npm and Cypress" https://www.cypress.io/blog/2018/08/30/setting-up-bitbucket-pipelines-with-proper-caching-of-npm-and-cypress/ %}
- {% url "博客: Record Test Artifacts from any Docker CI" https://www.cypress.io/blog/2018/08/28/record-test-artifacts-from-any-ci/ %}
