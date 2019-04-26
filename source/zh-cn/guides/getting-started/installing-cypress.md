---
title: Installing Cypress安装Cypress

---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn
# {% fa fa-graduation-cap %} 你将学到

- How to install Cypress via `npm`.
- 如何通过`npm`来安装Cypress.
- How to install Cypress via direct download.
- 如何通过直接下载来安装Cypress.
- How to version and run Cypress via `package.json`
- 如何通过`package.json`来确认版本以及运行Cypress.

{% endnote %}

# System requirements
# 系统必要条件

Cypress is a desktop application that is installed on your computer. The desktop application supports these operating systems:
Cypress是一个被安装在你电脑上的桌面应用. 该桌面应用支持这些操作系统:

- **Mac OS** 10.9+ (Mavericks+), only 64bit binaries are provided for macOS.
- **Mac OS** 10.9+ (Mavericks+), 仅提供64位二进制文件.
- **Linux** Ubuntu 12.04+, Fedora 21, Debian 8, 64-bit binaries
- **Linux** Ubuntu 12.04+, Fedora 21, Debian 8的64位二进制文件
- **Windows** 7+, only 32bit binaries are provided for Windows.
- **Windows** 7+, 仅提供32位二进制文件.

# Installing
# 安装

## {% fa fa-terminal %} `npm install`

Installing Cypress via `npm` is easy:
通过`npm`来安装Cypress很容易:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

This will install Cypress locally as a dev dependency for your project.
这将把Cypress作为一个dev的本地依赖安装到你的项目中.

{% note info %}
Make sure that you have already run {% url "`npm init`" https://docs.npmjs.com/cli/init %} or have a `node_modules` folder or `package.json` file in the root of your project to ensure cypress is installed in the correct directory.
确保你已经运行了{% url "`npm init`" https://docs.npmjs.com/cli/init %}或者存在`node_modules`文件夹或者存在`package.json`文件在你项目的根目录下, 以此来确保cypress被安装到正确的路径下.
{% endnote %}

{% video local /img/snippets/installing-cli.mp4 %}

{% note info %}
Notice that the Cypress `npm` package is a wrapper around the Cypress binary. The version of the `npm` package determines the version of the binary downloaded.
注意Cypress的`npm`包是Cypress的二进制文件warpper. `npm` package的版本决定了二进制文件的下载版本.
As of version `3.0`, the binary is downloaded to a global cache directory to be used across projects.
截至`3.0`版, 二进制文件会被下载到全局缓存目录从而能够被跨项目使用.
{% endnote %}

{% note success Best Practice %}
最佳练习


The recommended approach is to install Cypress with `npm` because :
推荐的是方法是通过`npm`安装Cypress, 因为:


- Cypress is versioned like any other dependency.
- Cypress是和其他依赖一样通过版本区分的.
- It simplifies running Cypress in {% url 'Continuous Integration' continuous-integration %}.
- Cypress可在{% url '持续集成' continuous-integration %}环境中运行的更简化.
{% endnote %}

## {% fa fa-terminal %} `yarn add`

Installing Cypress via {% url "`yarn`" https://yarnpkg.com %}:
通过{% url "`yarn`" https://yarnpkg.com %}安装Cypress:

```shell
cd /your/project/path
```

```shell
yarn add cypress --dev
```

## {% fa fa-download %} Direct download
## {% fa fa-download %} 直接下载

If you're not using Node.js or `npm` in your project or you just want to try Cypress out quickly, you can always {% url "download Cypress directly from our CDN" http://download.cypress.io/desktop %}.
如果你没有在你的项目中用Node.js或者`npm`或者你只是想快速的试着玩下Cypress, 你将总是能够{% url "直接通过CDN下载" http://download.cypress.io/desktop %}.

The direct download will always grab the latest available version. Your platform will be detected automatically.
直接下载将总是把最新的有效版本下下来. 并你的平台会自动被识别并分配对应的版本.

Just manually unzip and double click. Cypress will run without needing to install any dependencies.
只需手动解压然后双击app. Cypress就可以在不安装任何依赖的情况下运行.

{% video local /img/snippets/installing-global.mp4 %}

## {% fa fa-refresh %} Continuous integration
## {% fa fa-refresh %} 持续集成

Please read our {% url 'Continuous Integration' continuous-integration %} docs for help installing Cypress in CI. When running in linux you'll need to install some {% url 'system dependencies' continuous-integration#Dependencies %} or you can just use our {% url 'Docker images' docker %} which have everything you need prebuilt.
请阅读我们的{% url '持续集成' continuous-integration %} 文档从而在CI里面安装Cypress. 当在Linux中运行时你讲需要安装一些{% url '系统依赖' continuous-integration#Dependencies %}或者你也可以用我们的包含所有你需要的预置依赖的{% url 'Docker镜像' docker %}.

# Opening Cypress
# 打开Cypress

If you used `npm` to install, Cypress has now been installed to your `./node_modules` directory, with its binary executable accessible from `./node_modules/.bin`.
如果你用了`npm`安装, 则Cypress已经连同它的可执行二进制文件`./node_modules/.bin`一起被安装到你的`./node_modules`目录.

Now you can open Cypress from your **project root** one of the following ways:
现在你可以通过如下方法从你的项目根源打开Cypress:

**The long way with the full path**
**通过完整路径的常用方式**

```shell
./node_modules/.bin/cypress open
```

**Or with the shortcut using `npm bin`**
**或者通过快捷键`npm bin`**

```shell
$(npm bin)/cypress open
```

**Or by using `npx`**
**或者用`npx`打开**

**note**: {% url "npx" https://www.npmjs.com/package/npx %} is included with `npm > v5.2` or can be installed separately.
**note**: {% url "npx" https://www.npmjs.com/package/npx %}是包含在大于v5.2的`npm >`版本中的, 或者你也能够被另外安装它.

```shell
npx cypress open
```

**Or by using `yarn`**
**或者用`yarn`打开**

```shell
yarn run cypress open
```

稍等一会儿, Cypress Test Runner就会运行.

## Adding npm scripts
## 添加npm脚本

While there's nothing wrong with writing out the full path to the Cypress executable each time, it's much easier and clearer to add Cypress commands to the `scripts` field in your `package.json` file.
每一次都输入完整路径的执行语句去执行Cypress是完全没有问题的, 只不过有更容易的和清晰的方式是添加Cypress命令到`package.json`文件的`scripts`区域.

```javascript
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

Now you can invoke the command from your project root like so:
现在你可以像这样从你的项目根源去调用命令了:

```shell
npm run cypress:open
```

...and Cypress will open right up for you.
...然后Cypress就会为您开启.

# CLI tools
# CLI工具

By installing Cypress through `npm` you also get access to many other CLI commands.
通过`npm`安装Cypress, 您还可以访问许多其他CLI命令.

As of version `0.20.0` Cypress is also a fully baked `node_module` you can require in your Node scripts.
从版本`0.20.0`开始，Cypress也是一个完全出炉的`node_module`版本, 你可以调用你的Node脚本.

You can {% url 'read more about the CLI here' command-line %}.
你可以在{% url '这里阅读更多相关的CLI' command-line %}.

# Advanced
# 进阶

## Environment variables
## 环境变量

Name名称 | Description描述
------ |  ---------
`CYPRESS_INSTALL_BINARY` | {% urlHash "Destination of Cypress binary that's downloaded and installed" Install-binary %}
`CYPRESS_DOWNLOAD_MIRROR` | {% urlHash "Downloads the Cypress binary though a mirror server"  Mirroring %}
`CYPRESS_CACHE_FOLDER` | {% urlHash "Changes the Cypress binary cache location" Binary-cache %}
`CYPRESS_RUN_BINARY` | {% urlHash "Location of Cypress binary at run-time" Run-binary %}
~~CYPRESS_SKIP_BINARY_INSTALL~~ | {% badge danger removed %} use `CYPRESS_INSTALL_BINARY=0` instead
~~CYPRESS_BINARY_VERSION~~ | {% badge danger removed %} use `CYPRESS_INSTALL_BINARY` instead

## Install binary
## 安装二进制文件

Using the `CYPRESS_INSTALL_BINARY` environment variable, you can control how Cypress is installed.  To override what is installed, you set `CYPRESS_INSTALL_BINARY` alongside the `npm install` command.
用`CYPRESS_INSTALL_BINARY`环境变量, 你可以控制Cypress的安装方式.  To override what is installed, you set `CYPRESS_INSTALL_BINARY` alongside the `npm install` command.

**This is helpful if you want to:**
**下面的操作也会很有帮助:**

- Install a version different than the default npm package.
- 安装与默认npm包不同的版本.
    ```shell
CYPRESS_INSTALL_BINARY=2.0.1 npm install cypress@2.0.3
    ```
- Specify an external URL (to bypass a corporate firewall).
- 指定外部URL（绕过公司防火墙）.
    ```shell
CYPRESS_INSTALL_BINARY=https://company.domain.com/cypress.zip npm install cypress
    ```
- Specify a file to install locally instead of using the internet.
- 指定一个本地安装的文件来代替网络安装.
    ```shell
CYPRESS_INSTALL_BINARY=/local/path/to/cypress.zip npm install cypress
    ```

In all cases, the fact that the binary was installed from a custom location *is not saved in your `package.json` file*. Every repeated installation needs to use the same environment variable to install the same binary.
在各种情况下, 从自定义位置安装的二进制文件*不会保存在`package.json`文件中*. 每一次重复安装都将使用相同的环境变量去安装相同的二进制文件.

### Skipping installation
### 跳过安装

You can also force Cypress to skip the installation of the binary application by setting `CYPRESS_INSTALL_BINARY=0`. This could be useful if you want to prevent Cypress from downloading the Cypress binary at the time of `npm install`.
你也可以通过设置`CYPRESS_INSTALL_BINARY=0`来强制Cypress跳过二进制程序的安装. 如果你想防止Cypress在`npm install`的时候下载Cypress的二进制文件的话, 这将是有用的.

```shell
CYPRESS_INSTALL_BINARY=0 npm install
```

Now Cypress will skip its install phase once the npm module is installed.
现在, 一旦安装了npm模块, Cypress就将跳过其安装阶段.

## Binary cache
## 二进制缓存

As of version `3.0`, Cypress downloads the matching Cypress binary to the global system cache, so that the binary can be shared between projects. By default, global cache folders are:
从`3.0`版本开始, Cypress下载对应的Cypress二进制文件到全局系统缓存中, 以便二进制文件能够在多个项目件共享. 默认情况下, 全局缓存文件夹是:

- **MacOS**: `~/Library/Caches/Cypress`
- **Linux**: `~/.cache/Cypress`
- **Windows**: `/AppData/Local/Cypress/Cache`

To override the default cache folder, set the environment variable `CYPRESS_CACHE_FOLDER`.
要覆盖默认缓存文件夹, 请设置环境变量`CYPRESS_CACHE_FOLDER`.

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm install
```

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm run test
```

See also {% url 'Continuous Integration - Caching' continuous-integration#Caching %} section in the documentation.
你也可以参阅文档中的{% url '持续集成 - 缓存' continuous-integration#Caching %}部分.

{% note warning %}
`CYPRESS_CACHE_FOLDER` will need to exist every time cypress is launched. To ensure this, consider exporting this environment variable. For example, in a `.bash_profile` (MacOS, Linux), or using `RegEdit` (Windows).
每次cypress运行的时候`CYPRESS_CACHE_FOLDER`都需要存在. 为了确保这个情况, 考虑导出这个环境变量. 例如, 在`.bash_profile` (MacOS, Linux)中, 或使用 `RegEdit` (Windows).
{% endnote %}

## Run binary
## 运行二进制文件

Setting the environment variable `CYPRESS_RUN_BINARY` overrides where the npm module finds the Cypress binary.
设置环境变量`CYPRESS_RUN_BINARY`来覆盖npm模块找到的Cypress二进制文件的所在位置.

`CYPRESS_RUN_BINARY` should be a path to an already unzipped binary executable. The Cypress commands `open`, `run`, and `verify` will then launch the provided binary.
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
We recommend **not exporting** the `CYPRESS_RUN_BINARY` environment variable, since it will affect every cypress module installed on your file system.
我们推荐 **不要导出** `CYPRESS_RUN_BINARY`环境变量, 因为它会影响所有安装在你系统上的cypres模块.
{% endnote %}

## Hosting
## 托管

If you want to download a specific Cypress version for a given platform (Operating System), you can get it from our CDN. You may also want to host Cypress yourself and serve it from a local network.
如果你想下载特定的可提供平台的Cypress版本(操作系统), 你可以从CDN得到它. 你可能也想自己托管一个本地的Cypress并为本地提供服务.

The download server url is `https://download.cypress.io`.
下载服务器的地址是`https://download.cypress.io`.

请参阅{% url "https://download.cypress.io/desktop.json" https://download.cypress.io/desktop.json %}查看所有支持的平台.


 Method | Url                            | Description
 ------ | ------------------------------ | -------------------------------------------------------------------------
 `GET`  | `/desktop                 `    | Download Cypress at latest version (platform auto-detected)
 `GET`  | `/desktop.json            `    | Returns JSON containing latest available CDN destinations
 `GET`  | `/desktop?platform=p      `    | Download Cypress for a specific platform
 `GET`  | `/desktop/:version`            | Download Cypress with a specified version
 `GET`  | `/desktop/:version?platform=p` | Download Cypress with a specified version and platform

**Example of downloading Cypress `3.0.0` for Windows platform:**
**为Windows平台下载`3.0.0`的示例:**

```
https://download.cypress.io/desktop/3.0.0?platform=win
```

## Mirroring
## 镜像

If you choose to mirror the entire Cypress download site, you can specify `CYPRESS_DOWNLOAD_MIRROR` to set the download server url from `https://download.cypress.io` to your own mirror.
如果你选择镜像整个Cypress的下载站点, 你可以指定`CYPRESS_DOWNLOAD_MIRROR`以此来把`https://download.cypress.io`的下载服务器替换为你自己的镜像下载点.

For example:
示例:

```shell
CYPRESS_DOWNLOAD_MIRROR="https://www.example.com" cypress install
```

Cypress will then attempt to download a binary with this format: `https://www.example.com/desktop/:version?platform=p`
Cypress将尝试通过如下格式下载二进制文件: `https://www.example.com/desktop/:version?platform=p`
