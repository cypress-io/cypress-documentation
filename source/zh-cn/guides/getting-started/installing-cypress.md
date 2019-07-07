---
title: 安装Cypress
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学习到什么

- 如何通过`npm`来安装Cypress.
- 如何通过直接下载来安装Cypress.
- 如何通过`package.json`来确认版本以及运行Cypress.

{% endnote %}

# 系统必要条件

Cypress是一个被安装在你电脑上的桌面应用. 该桌面应用支持这些操作系统:

- **Mac OS** 10.9+ (Mavericks+), 仅提供64位二进制文件.
- **Linux** Ubuntu 12.04+, Fedora 21, Debian 8的64位二进制文件
- **Windows** 7+, 仅提供32位二进制文件.

# 安装

## {% fa fa-terminal %} `npm install`

通过`npm`来安装Cypress很容易:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

这将把Cypress作为一个dev的本地依赖安装到你的项目中.

{% note info %}
确保你已经运行了{% url "`npm init`" https://docs.npmjs.com/cli/init %}或者存在`node_modules`文件夹或者存在`package.json`文件在你项目的根目录下, 以此来确保cypress被安装到正确的路径下.
{% endnote %}

{% video local /img/snippets/installing-cli.mp4 %}

{% note info %}
注意Cypress的`npm`包里面是含有Cypress的二进制文件。`npm`包的版本决定了二进制文件的下载版本。
从`3.0`版本开始, 二进制文件会被下载到全局缓存目录从而能够被跨项目使用.
{% endnote %}

{% note success 最佳实践 %}

推荐的方式是使用`npm`来安装cypress， 原因是：

- 可以和其它任何依赖项一样控制cypress的版本。
- 它简化了在 {% url '持续集成' continuous-integration %}中运行cypress的过程。
{% endnote %}

## {% fa fa-terminal %} `yarn add`

通过{% url "`yarn`" https://yarnpkg.com %}来安装cypress：

```shell
cd /your/project/path
```

```shell
yarn add cypress --dev
```

## {% fa fa-download %} 直接下载

如果你没有在项目中使用Node或npm，又或者你只是想快速使用cypress, 你可以{% url "直接从我们的CDN下载" http://download.cypress.io/desktop %}。

它将自动识别你的平台，并直接下载最新的可用版本。
只需手动解压并双击打开，无需再安装任何依赖。

{% video local /img/snippets/installing-global.mp4 %}

## {% fa fa-refresh %} 持续集成

请阅读我们的{% url '持续集成' continuous-integration %}文档，来帮助你在CI中安装cypress。在linux中运行时，您需要安装一些{% url '系统依赖' continuous-integration#Dependencies %}，或者你可以使用我们的{% url 'Docker镜像' docker %}，它包含了所有你需要预构建的内容。

# 打开Cypress

如果你使用`npm`来安装, Cypress已经在你的`./node_modules`目录下, 其二进制文件可以从`./node_modules/.bin`中访问.

现在，你可以通过以下任意一种方式从**项目根目录**中打开cypress：

**完整的路径**

```shell
./node_modules/.bin/cypress open
```

**使用`npm bin`**

```shell
$(npm bin)/cypress open
```

**使用`npx`**

**注意**: `npm > v5.2`的版本自带{% url "npx" https://www.npmjs.com/package/npx %}，或者你可以单独安装。

```shell
npx cypress open
```

**使用`yarn`**

```shell
yarn run cypress open
```

稍等一会，Cypress测试执行器会被打开.

## 切换浏览器

Cypress测试执行器会尝试在用户的机器上找到所有兼容的浏览器。你可以在程序的右上角下拉列表选择不同的浏览器。

{% imgTag /img/guides/select-browser.png "Select a different browser" %}

阅读{% url "启动浏览器" launching-browsers %}，了解Cypress是如何在端对端测试中控制一个真实的浏览器。

## 添加 npm scripts

虽然每次写Cypress主程序的完整路径并没有什么问题，但将Cypress的执行命令添加到`package.json`文件的`scripts`字段中会更加简单明了一些。

```javascript
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

现在，你可以在项目根目录下调用这个命令：

```shell
npm run cypress:open
```

然后Cypress就会被打开。

# CLI 工具

通过`npm`安装的Cypress，你还可以获得许多其他的CLI命令。

从`0.20.0`版本开始， Cypress也是一个完成好的`node_module`，你可以在Node scripts中引用。

查看{% url '更多关于CLI信息' command-line %}。

# 高级选项

## 环境变量

变量名 | 描述
------ |  ---------
`CYPRESS_INSTALL_BINARY` | {% urlHash "下载并安装需要的Cypress程序版本" 安装程序 %}
`CYPRESS_DOWNLOAD_MIRROR` | {% urlHash "通过镜像服务器来下载Cypress程序"  镜像 %}
`CYPRESS_CACHE_FOLDER` | {% urlHash "更改Cypress程序的缓存目录" 程序缓存 %}
`CYPRESS_RUN_BINARY` | {% urlHash "运行Cypress程序的位置" 运行程序 %}
~~CYPRESS_SKIP_BINARY_INSTALL~~ | {% badge danger 移除 %} 使用 `CYPRESS_INSTALL_BINARY=0` 代替
~~CYPRESS_BINARY_VERSION~~ | {% badge danger 移除 %} 使用 `CYPRESS_INSTALL_BINARY` 代替

## 安装程序

你可以使用`CYPRESS_INSTALL_BINARY`环境变量来控制Cypress的安装方式。要覆盖已安装的程序，请在`npm install`命令前设置`CYPRESS_INSTALL_BINARY`。

**下面这些应该对你有所帮助：**

- 安装不同于npm包的版本。
    ```shell
CYPRESS_INSTALL_BINARY=2.0.1 npm install cypress@2.0.3
    ```
- 指定外部的地址（绕过公司的防火墙）。
    ```shell
CYPRESS_INSTALL_BINARY=https://company.domain.com/cypress.zip npm install cypress
    ```
- 指定一个本地文件安装，而不是使用网络
    ```shell
CYPRESS_INSTALL_BINARY=/local/path/to/cypress.zip npm install cypress
    ```

在所有的情况下, 从自定义位置安装的程序实际上*并不会保存在你的`package.json`文件中*。所以每次重复安装都需要使用相同的环境变量来安装相同的程序。

### 跳过安装

你也可以通过设置`CYPRESS_INSTALL_BINARY=0`来强制要求Cypress跳过程序的安装。这对于你想在执行`npm install`时避免下载Cypress程序很有用。

```shell
CYPRESS_INSTALL_BINARY=0 npm install
```

现在一旦安装npm module，Cypress就会跳过程序的安装阶段。

## 程序缓存

从`3.0`版本开始，Cypress会将符合的程序下载到系统全局缓存中，以便所有项目都能使用。默认的全局缓存目录是：

- **MacOS**: `~/Library/Caches/Cypress`
- **Linux**: `~/.cache/Cypress`
- **Windows**: `/AppData/Local/Cypress/Cache`

要覆盖默认的缓存目录，请设置环境变量`CYPRESS_CACHE_FOLDER`。

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm install
```

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm run test
```

也可以看文档{% url '持续集成 - 缓存' continuous-integration#Caching %}的部分。

{% note warning %}
每次运行Cypress时，都需要`CYPRESS_CACHE_FOLDER`。 为了确保它存在，可以考虑导出这个环境变量。例如，在`.bash_profile`文件中（MacOS, Linux），或使用`注册表编辑器`（Windows）。
{% endnote %}

## 运行程序

设置环境变量`CYPRESS_RUN_BINARY`会覆盖npm module找到Cypress程序的位置。

`CYPRESS_RUN_BINARY`应当被指向一个已经解压的可执行文件的路径。Cypress的命令`open`，`run`，和 `verify`将启动所提供的文件。

### Mac

```shell
CYPRESS_RUN_BINARY=~/Downloads/Cypress.app/Contents/MacOS/Cypress cypress run
```

### Linux

```shell
CYPRESS_RUN_BINARY=~/Downloads/Cypress/Cypress cypress run
```

### Windows

```shell
CYPRESS_RUN_BINARY=~/Downloads/Cypress/Cypress.exe cypress run
```

{% note warning %}
我们建议**不要导出**环境变量`CYPRESS_RUN_BINARY`到全局，因为它会影响安装在文件系统里的每个Cyresss模块。
{% endnote %}

## 下载地址

如果你想为一个给定的平台（操作系统）下载指定的Cyrpess版本，你可以从我们的CDN获取它。

下载地址：`https://download.cypress.io`

我们目前有以下可用的下载：

* Windows 64位（`?platform=win32&arch=x64`）
* Windows 32位（`?platform=win32&arch=ia32`，从{% url "Cypress 3.3.0" changelog#3-3-0 %}开始可用）
* Linux 64位（`?platform=linux`）
* macOS 64位（`?platform=darwin`）

下面是有效的下载地址

查看所有可用的平台{% url "https://download.cypress.io/desktop.json" https://download.cypress.io/desktop.json %}。

 方法 | 地址                          | 描述
 ------ | ------------------------------ | -------------------------------------------------------------------------
 `GET`  | `/desktop                 `    | 下载最新的版本 (自动检测平台)
 `GET`  | `/desktop.json            `    | 返回包含最新CDN地址的JSON
 `GET`  | `/desktop?platform=p&arch=a  ` | 下载指定平台、架构的cypress
 `GET`  | `/desktop/:version`            | 下载指定版本的cypress
 `GET`  | `/desktop/:version?platform=p&arch=a` | 下载指定版本、平台、架构的cypress

**例如，下载Windows 64位的Cypress `3.0.0`版本：**

```
https://download.cypress.io/desktop/3.0.0?platform=win32&arch=x64
```

## 镜像

如果你选择镜像整个Cypress的下载站点，你可以指定`CYPRESS_DOWNLOAD_MIRROR`将下载服务器网址从`https://download.cypress.io`设置为你自己的镜像地址。

例如：

```shell
CYPRESS_DOWNLOAD_MIRROR="https://www.example.com" cypress install
```

然后，Cypress会尝试请求这个地址进行下载：`https://www.example.com/desktop/:version?platform=p`

## 选择不发送异常数据给Cypress

当抛出关于Cypress的异常时，我们会将异常数据发送到`https://api.cypress.io`。我们仅使用此信息来帮助开发更好的产品。

如果你想让Cypress不发送报错信息，可以通过在系统环境变量设置`CYPRESS_CRASH_REPORTS=0`来实现。

### Linux 或 macOS

不想在Linux或macOS系统中发送报错信息，请在安装Cypress之前在终端运行下面的命令：

```shell
export CYPRESS_CRASH_REPORTS=0
```

为了使这些更改永久存在，你可以将此命令添加到你的shell的`~/.profile`（`~/.zsh_profile`, `~/.bash_profile`等）文件中，以便每次登录时自动运行。

### Windows

不想在Windows系统中发送，请在安装Cypress之前在命令提示符运行下面的命令：

```shell
set CYPRESS_CRASH_REPORTS=0
```

要在Powershell完成：

```shell
$env:CYPRESS_CRASH_REPORTS = "0"
```

要在所有新的shell中使用变量`CYPRESS_CRASH_REPORTS`，请用`setx`：

```shell
setx CYPRESS_CRASH_REPORTS 0
```

## 安装Pre-release版本

在极少数情况下，你可能需要安装pre-release版本的Cypress来验证{% url "`develop`" https://github.com/cypress-io/cypress/commits/develop %}分支的修复情况，虽然该版本并未发布。 

{% note info %}
你可以从{% url "这里" https://github.com/cypress-io/cypress/issues?utf8=%E2%9C%93&q=label%3A%22stage%3A+pending+release%22+ %}预览pre-release版本中解决的所有问题。
{% endnote %}

我们会在{% url "`develop`" https://github.com/cypress-io/cypress/commits/develop %}分支中为每个平台构建每次提交，并针对下游项目进行测试。例如下图中，最后一次提交的 SHA `e5106d9`.

{% imgTag /img/guides/install/last-commit.png "develop分支的最后一次提交" %}

找到与这个提交相匹配的pre-release版本的测试执行器的最简单的方式是查看在{% url "cypress-test-example-repos" https://github.com/cypress-io/cypress-test-example-repos/commits/master %}的测试项目上所做的提交。你将会看到每个构建的平台和架构的单独提交：`darwin` (Mac), `linux`, `win 32位` 和 `win 64位`。构建提交的SHA `e5106d9`在下面这个测试提交的标题栏中：

{% imgTag /img/guides/install/test-commits.png "每个平台的测试提交" %}

这些pre-release版本都是指定的平台。请选择与你的平台相匹配的；就像如果你是Mac，点击这个提交"Testing new darwin x64 ..."。该提交会有一个自定义信息，能看到有Mac系统的打包文件和匹配的npm `cypress`包的临时地址。

{% imgTag /img/guides/install/beta-binary.png "测试版程序信息" %}

为了在Mac中安装pre-release版本，你应该把环境变量`CYPRESS_INSTALL_BINARY`的值设置为所示的`https://cdn.cypress.io/beta/binary/.../cypress.zip`，并运行`npm install https://cdn.cypress.io/beta/npm/3.3.2/.../cypress.tgz`。在终端中是这样的：

```shell
export CYPRESS_INSTALL_BINARY=https://cdn.cypress.io/beta/binary/3.3.2/darwin-x64/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-126014/cypress.zip
```

```shell
npm install https://cdn.cypress.io/beta/npm/3.3.2/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-126013/cypress.tgz
```

如果我的机器是Windows 64位，我会点击“Testing new win32 x64 ..."这个提交来运行下方的命令。

```shell
set CYPRESS_INSTALL_BINARY=https://cdn.cypress.io/beta/binary/3.3.2/win32-x64/appveyor-develop-e5106d95f51eec477b8e66609939979fb87aab56-25451270/cypress.zip
```

```shell
npm install https://cdn.cypress.io/beta/npm/3.3.2/appveyor-develop-e5106d95f51eec477b8e66609939979fb87aab56-25451270/cypress.tgz
```

在Linux CI中，你应该下载的提交是“Testing new linux x64 ...”。

```shell
export CYPRESS_INSTALL_BINARY=https://cdn.cypress.io/beta/binary/3.3.2/linux-x64/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-125973/cypress.zip
```

```shell
npm install https://cdn.cypress.io/beta/npm/3.3.2/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-125992/cypress.tgz
```

### Pre-release版本的地址格式

上面的`CYPRESS_INSTALL_BINARY`地址是临时的——它们在30天后会被清除。网址格式如下：

```text
https://cdn.cypress.io/beta/binary/&lt;version&gt;/&lt;platform&gt;-&lt;arch&gt;/
&lt;ci name&gt;-&lt;branch name&gt;-&lt;full commit SHA&gt;-&lt;CI build number&gt;/cypress.zip
```
