---
title: Who Are You Testing For?
---

There are two kinds of users to consider when testing components: end-users and
developers.

A good component test covers the concerns of each of these types of users. This
guide covers examples of common problems differentiating these users and a
recommendation regarding your test audience!

### Developer Concerns

Developers care about the API of the component. They want to make sure that if
they exercise it in a particular way, with specific props, it'll behave the way
they expect it. A test written for a developer provides coverage over the
component's usage and signature.

Component testing written with developers in mind heavily covers props, events,
and children.

### End-User Concerns

Users think the way a non-technical product owner might.

They access and interact with the site in various ways, i.e., via a browser or
assistive devices such as screen readers.

Is the component supposed to tell you what's in your cart? Should you be able to
enter a text value into a numerical `Stepper` component like it was an input? Is
that `Stepper` component supposed to increment or decrement when you click the
correct buttons?

People are often more comfortable putting on their end-user hat when writing
end-to-end tests because they cannot access any application internals. We
encourage you to carry over that kind of thinking when writing your component
tests.

By doing so, you'll gain the same kind of coverage and benefits as you would in
an end-to-end test without the penalties of speed, setup, and complexity.

### Your Test Has an Audience

People often assign labels like "integration testing" or "unit testing" when
testing components to try and describe differences in detail and concern that a
test may have.

<!-- Meh: For example, should I test to make sure that calling `setProps` twice triggers a particular component's lifecycle event? (Answer: Not unless you have a very good reason. That's an implementation detail.) -->

It may be easier, instead, to think about the audience of the test, their goals,
and their motivations.

Always remember, a test exists to prove (to someone) that code works "as
expected." Different user types will have different expectations.
