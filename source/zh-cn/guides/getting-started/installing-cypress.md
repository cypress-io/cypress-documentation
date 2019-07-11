---
title: 安装Cypress
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- 如何通过`npm`来安装Cypress.
- 如何通过直接下载来安装Cypress.
- 如何通过`package.json`来确认版本以及运行Cypress.

{% endnote %}

# 系统必要条件

Cypress是一个被安装在你电脑上的桌面应用. 该桌面应用支持这些操作系统:

- **Mac OS** 10.9+ (Mavericks+), 仅提供64位二进制文件
- **Linux** Ubuntu 12.04+, Fedora 21, Debian 8的64位二进制文件
- **Windows** 7+

# 安装

## {% fa fa-terminal %} `npm install`

通过`npm`来安装Cypress非常简单:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

将Cypress作为你项目的一个dev本地依赖安装到本地.

{% note info %}
确保你已经运行了{% url "`npm init`" https://docs.npmjs.com/cli/init %}或者存在`node_modules`文件夹或者存在`package.json`文件在你项目的根目录下, 以此来确保cypress被安装到正确的路径下.
{% endnote %}

{% video local /img/snippets/installing-cli.mp4 %}

{% note info %}
注意Cypress的`npm`包里面是含有Cypress的二进制文件。`npm`包的版本决定了二进制文件的下载版本。
从`3.0`版本开始, 二进制文件会被下载到全局缓存目录从而能够被跨项目使用.
{% endnote %}

{% note success 最佳实践 %}

推荐的方式是使用`npm`来安装Cypress， 原因是：

- 可以和其它任何依赖项一样控制Cypress的版本。
- 它简化了在 {% url '持续集成' continuous-integration %}中运行Cypress的过程。
{% endnote %}

## {% fa fa-terminal %} `yarn add`

通过{% url "`yarn`" https://yarnpkg.com %}来安装Cypress：

```shell
cd /your/project/path
```

```shell
yarn add cypress --dev
```

## {% fa fa-download %} 直接下载

如果你没有在项目中使用Node或`npm`，又或者你只是想快速使用Cypress, 你可以{% url "直接从我们的CDN下载" http://download.cypress.io/desktop %}。

它将自动识别你的平台，并直接下载最新的可用版本。

只需手动解压然后双击app。 Cypress就可以在不安装任何依赖的情况下运行.

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

**note**: npm高于v5.2的版本中自带{% url "npx" https://www.npmjs.com/package/npx %}, 或者你也可以单独安装npx.

```shell
npx cypress open
```

**使用`yarn`**

```shell
yarn run cypress open
```

稍等一会，Cypress测试执行器会运行。

## 切换浏览器

Cypress测试执行器会尝试在用户的机器上找到所有兼容的浏览器。你可以在程序的右上角下拉列表选择不同的浏览器。

{% imgTag /img/guides/select-browser.png "Select a different browser" %}

阅读{% url "启动浏览器" launching-browsers %}，了解Cypress是如何在端对端测试中控制一个真实的浏览器。

## 添加npm脚本

每一次都输入完整路径的执行语句去执行Cypress是完全没有问题的, 只不过有更容易的和清晰的方式是添加Cypress命令到`package.json`文件的`scripts`区域.

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

...然后Cypress就会为你开启.

# CLI工具

通过`npm`安装Cypress, 你还可以访问许多其他CLI命令.

从`0.20.0`版本开始，Cypress也是一个完整的`node_module`，你可以在Node脚本中调用。

你可以在{% url '这里阅读更多CLI相关的内容' command-line %}。

# 进阶

## 环境变量

名称 | 描述
------ |  ---------
`CYPRESS_INSTALL_BINARY` | {% urlHash "下载并安装的Cypress二进制文件的目标位置" 通过二进制文件来安装 %}
`CYPRESS_DOWNLOAD_MIRROR` | {% urlHash "通过镜像服务器下载Cypress二进制文件"  镜像 %}
`CYPRESS_CACHE_FOLDER` | {% urlHash "更改Cypress二进制缓存位置" 二进制缓存 %}
`CYPRESS_RUN_BINARY` | {% urlHash "Cypress二进制在运行时的位置" 运行二进制文件 %}
~~CYPRESS_SKIP_BINARY_INSTALL~~ | {% badge danger removed %} 使用`CYPRESS_INSTALL_BINARY=0`作为替代
~~CYPRESS_BINARY_VERSION~~ | {% badge danger removed %} 使用`CYPRESS_INSTALL_BINARY`作为替代

## 通过二进制文件来安装

通过`CYPRESS_INSTALL_BINARY`环境变量, 你可以控制Cypress的安装方式。来覆盖已经安装的内容, 你可以在`npm install`后边加上`CYPRESS_INSTALL_BINARY`命令来操作.

**下面的操作对你会很有帮助：**

- 安装与默认npm包不同的版本.
    ```shell
CYPRESS_INSTALL_BINARY=2.0.1 npm install cypress@2.0.3
    ```
- 指定外部URL（绕过公司防火墙）.
    ```shell
CYPRESS_INSTALL_BINARY=https://company.domain.com/cypress.zip npm install cypress
    ```
- 指定一个本地安装的文件来代替网络安装.
    ```shell
CYPRESS_INSTALL_BINARY=/local/path/to/cypress.zip npm install cypress
    ```

在所有情况下, 从自定义位置安装的二进制文件*不会保存在`package.json`文件中*。每一次重复安装都将使用相同的环境变量去安装相同的二进制文件。

### 跳过安装

你也可以通过设置`CYPRESS_INSTALL_BINARY=0`来强制Cypress跳过二进制程序的安装。这对于你想在执行`npm install`时避免下载Cypress程序很有用。

```shell
CYPRESS_INSTALL_BINARY=0 npm install
```

现在, 一旦安装了npm模块, Cypress就将跳过其安装阶段.

## 二进制缓存

从`3.0`版本开始, Cypress下载对应的Cypress二进制文件到全局系统缓存中, 以便二进制文件能够在多个项目件共享. 默认情况下, 全局缓存文件夹是:

- **MacOS**: `~/Library/Caches/Cypress`
- **Linux**: `~/.cache/Cypress`
- **Windows**: `/AppData/Local/Cypress/Cache`

要覆盖默认缓存文件夹, 请设置环境变量`CYPRESS_CACHE_FOLDER`.

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm install
```

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm run test
```

你也可以参阅文档中的{% url '持续集成 - 缓存' continuous-integration#Caching %}部分.

{% note warning %}
每次Cypress运行的时候`CYPRESS_CACHE_FOLDER`都需要存在. 为了确保它存在，可以考虑导出这个环境变量。例如, 在`.bash_profile` (MacOS, Linux)中, 或使用 `RegEdit` (Windows)。
{% endnote %}

## 运行二进制文件

设置环境变量`CYPRESS_RUN_BINARY`来覆盖npm模块找到的Cypress二进制文件的所在位置.

`CYPRESS_RUN_BINARY`应该是一个已经解压的可执行二进制文件的路径. Cypress命令`open`, `run`, 和`verify`将执行被提供的二进制文件.

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
我们推荐 **不要导出** `CYPRESS_RUN_BINARY`环境变量, 因为它会影响所有安装在你系统上的cypres模块.
{% endnote %}

## 下载地址

如果你想下载特定平台的Cypress版本(操作系统), 你可以从CDN得到它.

下载服务器的地址是：`https://download.cypress.io`。

目前你可以从以下地址下载：

* Windows 64位（`?platform=win32&arch=x64`）
* Windows 32位（`?platform=win32&arch=ia32`，从{% url "Cypress 3.3.0" changelog#3-3-0 %}开始可用）
* Linux 64位（`?platform=linux`）
* macOS 64位（`?platform=darwin`）

这里是可用的下载地址：

查看所有可用的平台{% url "https://download.cypress.io/desktop.json" https://download.cypress.io/desktop.json %}。

 方法 | URL                            | 描述
 ------ | ------------------------------ | -------------------------------------------------------------------------
 `GET`  | `/desktop                 `    | 下载最近的Cypress版本(平台自动检测)
 `GET`  | `/desktop.json            `    | 返回最新有效的包含CDN地址的JSON文件
 `GET`  | `/desktop?platform=p&arch=a   `| 下载特定平台的Cypress或压缩包
 `GET`  | `/desktop/:version`            | 下载特定版本的Cypress
 `GET`  | `/desktop/:version?platform=p&arch=a` | 下载Cypress的特定平台和版本或压缩包

**例如，下载Windows 64位的Cypress `3.0.0`版本：**

```
https://download.cypress.io/desktop/3.0.0?platform=win32&arch=x64
```
## 镜像

如果你选择通过Cypress的镜像站点来下载, 那么你可以指定`CYPRESS_DOWNLOAD_MIRROR`将下载服务器网址从`https://download.cypress.io`设置为你自己的镜像地址。

示例:
```shell
CYPRESS_DOWNLOAD_MIRROR="https://www.example.com" cypress install
```

Cypress将尝试通过如下格式下载二进制文件: `https://www.example.com/desktop/:version?platform=p`

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
