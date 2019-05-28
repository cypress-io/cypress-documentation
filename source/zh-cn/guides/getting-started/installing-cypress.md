---
title: 安装Cypress

---

{% note info %}
# {% fa fa-graduation-cap %} 你将学到

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
注意Cypress的`npm`包是Cypress的二进制文件warpper. `npm` package的版本决定了二进制文件的下载版本.
截至`3.0`版, 二进制文件会被下载到全局缓存目录从而能够被跨项目使用.
{% endnote %}

{% note success 最佳练习 %}

推荐的是方法是通过`npm`安装Cypress, 因为:


- Cypress和其他依赖一样是分版本的.

- Cypress可在{% url '持续集成' continuous-integration %}环境中运行的更简化.
{% endnote %}

## {% fa fa-terminal %} `yarn add`

通过{% url "`yarn`" https://yarnpkg.com %}安装Cypress:

```shell
cd /your/project/path
```

```shell
yarn add cypress --dev
```

## {% fa fa-download %} 直接下载

如果你没有在你的项目中用Node.js或者`npm`或者你只是想快速的试着玩下Cypress, 你可以{% url "随时通过CDN下载" http://download.cypress.io/desktop %}.

直接下载会拖取可获得的最新版本. 并你的平台会自动被识别并分配对应的版本.

只需手动解压然后双击app. Cypress就可以在不安装任何依赖的情况下运行.

{% video local /img/snippets/installing-global.mp4 %}

## {% fa fa-refresh %} 持续集成

请阅读我们的{% url '持续集成' continuous-integration %} 文档, 以获取在CI里安装Cypress的帮助. 当在Linux中运行时, 你会需要安装一些{% url '系统依赖' continuous-integration#Dependencies %}, 或者你也可以使用我们的{% url 'Docker镜像' docker %}, 这里面包含你需要预置的所有东西.

# 打开Cypress

如果你用了`npm`安装, 则Cypress已经连同它的可执行二进制文件`./node_modules/.bin`一起被安装到你的`./node_modules`目录.

现在你可以通过如下方法从你的项目根源打开Cypress:

**通过完整路径的常用方式**

```shell
./node_modules/.bin/cypress open
```

**或者通过快捷键`npm bin`**

```shell
$(npm bin)/cypress open
```

**或者用`npx`打开**

**note**: 高于v5.2的版本中自带{% url "npx" https://www.npmjs.com/package/npx %}, 或者你也可以单独安装npx.

```shell
npx cypress open
```

**或者用`yarn`打开**

```shell
yarn run cypress open
```

稍等一会儿, Cypress Test Runner就会运行.

## 添加npm脚本

每一次都输入完整路径的执行语句去执行Cypress是完全没有问题的, 只不过有更容易的和清晰的方式是添加Cypress命令到`package.json`文件的`scripts`区域.

```javascript
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

现在你可以像这样从你的项目根源去调用命令了:

```shell
npm run cypress:open
```

...然后Cypress就会为您开启.

# CLI工具

通过`npm`安装Cypress, 您还可以访问许多其他CLI命令.

从版本`0.20.0`开始，Cypress也是一个完全出炉的`node_module`版本, 你可以调用你的Node脚本.

你可以在{% url '这里阅读更多相关的CLI' command-line %}.

# 进阶

## 环境变量

名称 | 描述
------ |  ---------
`CYPRESS_INSTALL_BINARY` | {% urlHash "下载并安装的Cypress二进制文件的目标位置" Install-binary %}
`CYPRESS_DOWNLOAD_MIRROR` | {% urlHash "通过镜像服务器下载Cypress二进制文件"  Mirroring %}
`CYPRESS_CACHE_FOLDER` | {% urlHash "更改Cypress二进制缓存位置" Binary-cache %}
`CYPRESS_RUN_BINARY` | {% urlHash "Cypress二进制在运行时的位置" Run-binary %}
~~CYPRESS_SKIP_BINARY_INSTALL~~ | {% badge danger removed %} 使用`CYPRESS_INSTALL_BINARY=0`作为替代
~~CYPRESS_BINARY_VERSION~~ | {% badge danger removed %} 使用`CYPRESS_INSTALL_BINARY`作为替代

## Install binary
## 安装二进制

通过`CYPRESS_INSTALL_BINARY`环境变量, 你可以控制Cypress的安装方式.  来覆盖已经安装的内容, 你可以在`npm install`后边加上`CYPRESS_INSTALL_BINARY`命令来操作.

**下面的操作也会很有帮助:**

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

在各种情况下, 从自定义位置安装的二进制文件*不会保存在`package.json`文件中*. 每一次重复安装都将使用相同的环境变量去安装相同的二进制文件.

### 跳过安装

你也可以通过设置`CYPRESS_INSTALL_BINARY=0`来强制Cypress跳过二进制程序的安装. 如果你想防止Cypress在`npm install`的时候下载Cypress的二进制文件的话, 这将是有用的.

```shell
CYPRESS_INSTALL_BINARY=0 npm install
```

现在, 一旦安装了npm模块, Cypress就将跳过其安装阶段.

## Binary cache
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
每次cypress运行的时候`CYPRESS_CACHE_FOLDER`都需要存在. 为了确保这个情况, 考虑导出这个环境变量. 例如, 在`.bash_profile` (MacOS, Linux)中, 或使用 `RegEdit` (Windows).
{% endnote %}

## Run binary
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

## Hosting
## 托管

如果你想下载特定的可提供平台的Cypress版本(操作系统), 你可以从CDN得到它. 你可能也想自己托管一个本地的Cypress并为本地提供服务.

下载服务器的地址是`https://download.cypress.io`.

请参阅{% url "https://download.cypress.io/desktop.json" https://download.cypress.io/desktop.json %}查看所有支持的平台.


 方法 | Url                            | 描述
 ------ | ------------------------------ | -------------------------------------------------------------------------
 `GET`  | `/desktop                 `    | Download Cypress at latest version (platform auto-detected)
 `GET`  | `/desktop.json            `    | Returns JSON containing latest available CDN destinations
 `GET`  | `/desktop?platform=p      `    | Download Cypress for a specific platform
 `GET`  | `/desktop/:version`            | Download Cypress with a specified version
 `GET`  | `/desktop/:version?platform=p` | Download Cypress with a specified version and platform

**为Windows平台下载`3.0.0`的示例:**

```
https://download.cypress.io/desktop/3.0.0?platform=win
```

## Mirroring
## 镜像

如果你选择镜像整个Cypress的下载站点, 你可以指定`CYPRESS_DOWNLOAD_MIRROR`以此来把`https://download.cypress.io`的下载服务器替换为你自己的镜像下载点.

示例:

```shell
CYPRESS_DOWNLOAD_MIRROR="https://www.example.com" cypress install
```

Cypress将尝试通过如下格式下载二进制文件: `https://www.example.com/desktop/:version?platform=p`
