---
title: Release Stages
---

Cypress follows Semantic Versioning
([see summary here](https://semver.org/#summary)) so that it is clear how you
may be affected when upgrading to a newer version of Cypress. If there is a
minor version increment, `11.0.0` → `11.1.0` for example, you should not
experience disruption in your usage of Cypress. If there is a major version
increment, `11.1.0 → 12.0.0` for example, you may need to make changes to
continue using Cypress. For most scenarios this is a valid way to consider how
disruptive upgrading to the next version of Cypress may be. In some cases,
however, a feature of Cypress may be in a stage of development in which it does
not adhere to these rules.

In order to help our users be aware of when this might be the case, we have
consolidated definitions of the different release stages: General Availability,
Beta, Alpha, and Experimental. We also describe our approach to making and
communicating changes in each stage.

## General Availability (GA)

Features that have reached General Availability are features that we have deemed
to be feature complete and free of issues in the majority of use cases.

**Strategies for releasing and communicating changes to GA features**

- Modifications
  - Modifications can be introduced during any release cycle and increment
    semver
- Breaking Changes
  - Breaking changes will only be introduced during major releases in which
    semver is bumped by a major version
  - In some cases early access to these changes are possible through public
    packages
- Removals
  - Removals will only be introduced during major releases in which semver is
    bumped by a major version
  - In the majority of cases, removals will be proceeded by a period in which
    the feature is ‘deprecated’
  - Migration steps will be provided to minimize pain points in these situations

## Beta

Beta features consist of features that we are looking to gather user feedback on
by providing them as default functionality before an official release. Beta
features may not be feature complete, but they should be close enough where
changes are few and far between.

**Strategies for releasing and communicating changes to Beta features**

- Modifications
  - Modifications can be introduced during any release cycle and may or may not
    increment semver.
  - Affected users will be pointed to documentation if there blockers are
    perceived to be possible.
- Breaking Changes
  - Breaking changes can be introduced during any release cycle and do not bump
    semver by a major version
  - Breaking changes require in-app messaging to help users unblock themselves
    as needed
- Removals
  - Removal of any new functionality related to the feature can happen during
    any release cycle and will increment semver. These do not need to coincide
    with a major release that is bumping semver by a major version.
  - Removals at this stage will be rare and a migration strategy along with
    reasoning for the removal will be documented.

## Alpha

Alpha features consist of features that we are looking to gather user feedback
on by providing them as default functionality before an official release. Alpha
features may not be feature complete and changes are possible during this stage.

**Strategies for releasing and communicating changes to Alpha features**

- Modifications
  - Modifications can be introduced during any release cycle and may or may not
    increment semver.
  - Affected users will be pointed to documentation if there blockers are
    perceived to be possible.
- Breaking Changes
  - Breaking changes can be introduced during any release cycle and do not bump
    semver by a major version
- Removals
  - Removal of any new functionality related to the feature can happen during
    any release cycle and does not bump semver by a major version.

## Experimental

Experimental features consist of features that we are looking to gather user
feedback on before we commit fully to the initial implementation or the feature
entirely. These type of features require you to opt-in to via a configuration
value before the feature is activated. These types of features may be unstable
and contain issues. You should expect to see frequent changes and improvements
during the feature’s experimental lifetime. The current experimental features
can be found [here](guides/references/experiments).

**Strategies for releasing and communicating changes to experimental features**

- Modifications
  - Modifications can be introduced during any release cycle and may or may not
    increment semver.
- Breaking Changes
  - Breaking changes can be introduced during any release cycle and do not bump
    semver by a major version.
- Removals
  - Removal of any new functionality related to the feature or the feature in
    its entirety can happen during any release cycle and will not be accompanied
    by a major semver version change.
