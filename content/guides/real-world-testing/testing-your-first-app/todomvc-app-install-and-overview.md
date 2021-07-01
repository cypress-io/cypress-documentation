# TodoMVC App Install & Overview

The application we will be writing tests for can be found [here](https://github.com/cypress-io/cypress-example-todomvc). This is a simple TodoMVC application built with React. Don't worry if you do not know React. You will be able to easily follow along even if you have never used React before.

## Install

The first thing you should do is fork this repo into your own GitHub account. You can do this by clicking the "fork" button in the upper right hand corner of the repo.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/todomvc-app-install-and-overview/Screen_Shot_2021-06-24_at_10.46.38_AM.png"
alt="cypress example todomvc repo fork button"></DocsImage>

Once the application is forked, you should see it in your own GitHub account. It should look very similar to this, only with your GitHub username.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/todomvc-app-install-and-overview/Screen_Shot_2021-06-24_at_10.54.13_AM.png"
alt="cypress example todomvc forked repo"></DocsImage>

Now that we have forked the repo, we need to clone it down to our local machine. To do this, click on the green "Code button" then copy the address, `https://github.com/...`

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/todomvc-app-install-and-overview/Screen_Shot_2021-06-24_at_10.55.46_AM.png"
alt="clone repo screen"></DocsImage>

Next, you will need to clone the repo to your local machine via git.

```bash
# Your URL will be different and should contain your username
git clone https://github.com/robertguss/cypress-example-todomvc
```

Next, you will need to open the repo in your text editor. We will be using [VS Code](https://code.visualstudio.com/), but feel free to use whatever you like.

You can install the NPM dependencies with

```bash
npm install
```

Then to start the app:

```bash
npm run start
```

You can then open your browser to [`http://127.0.0.1:8888`](http://127.0.0.1:8888/) and you should see the following:

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/todomvc-app-install-and-overview/Screen_Shot_2021-06-24_at_1.08.11_PM.png"
alt="todo mvc app"></DocsImage>

## Overview

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/todomvc-app-install-and-overview/Screen_Shot_2021-06-24_at_1.14.12_PM.png"
alt="todo mvc app with three todos"></DocsImage>

The app is a very simple todo app where you can add todos, complete todos, and filter todo's based upon their active or completed state. Take some time to play around with the app to get a sense for the overall functionality. Once you understand what the app does, begin to ask yourself this question, "what are some of the most important features of this app?"

Remember, testing is a mindset. Before we can begin to write tests for our app, we first need to understand what we need to test and why. In order to find out what to test, we need to think about the core functionality of this application. Begin to break down the features and functionality of this app into individual pieces. You can do this in your mind, or even better on a piece of paper or in your text editor. Once you understand some of the core functionality and features, the "why" should become much clearer.

For example, seeing how this is a todo application, one of the most important features should be the ability to add todos. After all, if a user is not able to add todos then the entire app is useless. Therefore, one of the first things we should test is that a user is able to add todos.

In the next lesson, we will learn how to install Cypress and write our first test that will make sure we can add a todo to the app.
