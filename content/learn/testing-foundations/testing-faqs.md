# Testing FAQ's

# Do I need to write tests?

Yes.

After all, don't you want to make sure that your application or new feature is working the way it was intended to? How can you be sure that it is if you are not writing tests?

Ultimately, the whole point of writing tests is to give you confidence that your application is working properly. If you want to have this confidence, you need to write tests.

# How many tests do you need?

There is no easy way to answer this question, unfortunately the honest answer is... it depends. Remember testing is not a quantity game. Quality is far more important than quantity when it comes to testing. You want to make sure you are writing the right kinds of tests which will ensure that your application is functioning the way it is intended to. Larger applications will often have more tests than smaller ones since there is typically more things that need to be tested.

Whatever you do, do not worry about having 100% test coverage. Ignore all of the nonsense and blog posts that exist out there that are telling you that you must have 100% test coverage. Remember, developers can be very dogmatic when it comes to testing. You and your team need to write however many tests are necessary so that you are confident things are working properly. That's all.

A good way to know if you have enough tests, is to make sure you have tests that cover the most important user journeys. You should also be writing tests for any bugs you find and fix. Writing a test case for a bug you have squashed will help to make sure that bug never surfaces again.

If you are at least doing these two things, you application should have sufficient test coverage. If there are other areas of your application that are uncertain or make your team nervous, then those are also great areas to write tests for.

In future videos we will show you how to discover which user journeys are most important in your application and then how to write tests for them.

Ultimately, the whole point of writing tests is to give you confidence that your application is working properly. If your current test suite is doing that, then you have sufficient coverage. If not, find out why, and write tests for those areas of your application that you are unsure about.

# There are so many testing frameworks out there, which ones do you choose?

If you are brand new to testing and have never used a testing framework or tool before, then just makes things easy upon yourself and your team and choose whatever is popular. I know that on the surface that may seem like a terrible reason, but honestly you don't know any better if you are just starting out. Starting with the most popular tool means you will find the most documentation, stack overflow questions and answers, blog posts, screencasts etc about it. Don't choose some esoteric tool that someone just open sourced last week. Choose something that lots of people are using and have been using for a while. You want something that is battle tested and reliable.

Remember, most of these tools all do the exact same thing so just start with the most popular one and go from there. If you and your team end up hating it and want to switch, at least you will know why and what to look out for in the next tool you choose.

If you would like to know what we recommend, then checkout Jest or Mocha for writing unit tests and Cypress for everything else. These tools are excellent and are easy to get up and running with quickly. In later videos we will show you how to setup, configure and start writing tests with them.

# What do I do if i don't have enough time to write tests?

If we had a nickel...

This is often used as an excuse as to why a person or team do not write tests. This problem is easily solveable. If testing is important to you and your team, you will make the time that is necessary to write them, it is that simple. While estimating how long a new feature, bug fix, or refactor may take, always make sure to factor in the time it will take to write tests.

Writing tests will no doubt increase the amount of time it takes to implement a new feature, upfront. However, the amount of time you save from debugging later on, not to mention the confidence and peace of mind you will have, is well worth the upfront cost. This is one of those things that has to be experienced first hand in order for you to understand the value.

Next time you or your team need to implement a new feature, write tests for that feature, and monitor the results. Once you see first hand the value that writing tests provides, you will be writing them all the time.

Trust us. We know a thing or two about this.

# What if my legacy code base is written in such a way that it is not testable?

This is a very common problem and issue for a lot of people. When you inherit a legacy code base, especially one that does not have tests, it is not uncommon for the code to be written in such a way as to make it incredibly difficult, if not down right impossible to test.

In order to solve this problem, you will need to incrementally refactor portions of the code base with code that is testable and then write tests for it. If you "Think test first" this will help you write code that is testable, especially if you write failing tests first and then implement the code necessary to make those tests pass.

The key here is to make small incremental changes. Since you do not have tests to ensure that your refactor has not broken anything, it is best to modify the smallest amount of code possible which will hopefully prevent the least amount of bugs.

# What about TDD vs BDD vs ...?

If you are brand new to testing, then it is our advice and recommendation that you do not overly concern yourself or worry about which testing paradigm you need to adopt. Often times beginners feel stuck with [analysis paralysis](https://en.wikipedia.org/wiki/Analysis_paralysis) as they feel they are not doing something right because of something they read, something they heard, etc. Don't get hung up on the jargon, vocabulary, methodologies, etc. Remember developers can be incredibly dogmatic when it comes to testing. The only thing you need to concern yourself with is making sure the tests you write give you confidence that your app is working as expected. The labels are irrelevant.

Always remember:

> It’s not important what you call it, but what it does - [Gojko Adzic](https://web.archive.org/web/20150104002755/http://gojko.net/2011/01/12/the-false-dichotomy-of-tests)
