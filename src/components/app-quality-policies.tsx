import React from 'react'
import Link from '@docusaurus/Link'
import CodeBlock from '@theme/CodeBlock'

const policyExample = JSON.stringify(
  {
    policies: [
      {
        name: 'release-gate',
        comment: 'PR merge requirements for critical flows',
        validations: [
          {
            metric: 'accessibility.score',
            minScore: 90,
            comment: 'Overall accessibility score',
          },
          {
            metric: 'uiCoverage.score',
            minScore: 80,
            viewMatch: '^(Login|Checkout)',
            comment: 'Named flows must stay well covered',
          },
          {
            metric: 'accessibility.failedElements',
            maxCount: 0,
            viewMatch: 'Checkout',
            comment: 'No known a11y failures on checkout views',
          },
        ],
      },
    ],
  },
  null,
  2
)

export type AppQualityPoliciesProps = {
  resultsApiPolicyResultsHref: string
  profilesHref: string
}

export function AppQualityPolicies({
  resultsApiPolicyResultsHref,
  profilesHref,
}: AppQualityPoliciesProps) {
  return (
    <>
      <p>
        Policies are optional rules you define in <strong>App Quality</strong>{' '}
        configuration so Cypress Cloud can evaluate <strong>Accessibility</strong> and{' '}
        <strong>UI Coverage</strong> outcomes against explicit thresholds after each run.
        They give you a single, versioned definition of "what good looks like"
        for a project (or for a single <Link to={profilesHref}>profile</Link> within), separate from how
        you might further interpret raw report data in your own scripts.
      </p>

      <h4>Purpose</h4>
      <ul>
        <li>
          <strong>Declarative thresholds</strong>: Encode minimum accessibility scores,
          minimum UI Coverage scores, or caps on failing accessibility elements / untested
          UI elements without maintaining parallel logic in CI.
        </li>
        <li>
          <strong>Cross-product checks</strong>: One named policy can include multiple
          validations across Accessibility and UI Coverage; the policy passes only when{' '}
          <strong>every</strong> validation in that policy passes.
        </li>
        <li>
          <strong>Stable CI integration</strong>: Pair policies with the{' '}
          <Link to={resultsApiPolicyResultsHref}>Results API</Link>{' '}
          <code>getPolicyResults</code> helper (see the Results API page for your product)
          to fail or gate merges from evaluated outcomes and deep links on each validation.
        </li>
      </ul>
      <p>
        Policies <strong>do not</strong> change how tests run or how reports are
        generated; they only define how Cloud <strong>evaluates</strong> results for gating
        and automation.
      </p>

      <h4>Where policies live</h4>
      <p>
        Add a top-level <code>policies</code> array to your App Quality JSON, or define{' '}
        <code>policies</code> inside a profile&apos;s <code>config</code> object so
        different{' '}
        <Link to="/app/references/command-line#cypress-run-tag-lt-tag-gt">run tags</Link>{' '}
        can use different thresholds.
      </p>
      <p>
        Each policy must have a <strong>unique</strong> <code>name</code>. Optional{' '}
        <code>comment</code> fields are supported on policies and on individual
        validations, consistent with the rest of App Quality configuration.
      </p>

      <h4>Structure</h4>
      <p>Each entry in <code>policies</code> is an object with:</p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>name</code>
            </td>
            <td>Yes</td>
            <td>Unique identifier for the policy; echoed in policy results.</td>
          </tr>
          <tr>
            <td>
              <code>validations</code>
            </td>
            <td>Yes</td>
            <td>Non-empty array of validation objects (see below).</td>
          </tr>
          <tr>
            <td>
              <code>comment</code>
            </td>
            <td>No</td>
            <td>Human-readable context for the policy.</td>
          </tr>
        </tbody>
      </table>

      <p>
        Each validation object sets a <code>metric</code> and thresholds. Optional{' '}
        <code>viewMatch</code> is a <strong>regular expression</strong> matched against the{' '}
        <strong>view name</strong> (not the URL). When <code>viewMatch</code> is omitted,
        the validation applies to <strong>run-level</strong> aggregates.
      </p>

      <p>Supported metrics:</p>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Fields</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>accessibility.score</code>
            </td>
            <td>
              <code>minScore</code> (0–100), optional <code>viewMatch</code>
            </td>
            <td>
              Fails when the score is <strong>below</strong> <code>minScore</code>. With{' '}
              <code>viewMatch</code>, <strong>each</strong> matched view must meet{' '}
              <code>minScore</code>; if no views match the pattern, the validation is
              treated as passing (with no views to evaluate).
            </td>
          </tr>
          <tr>
            <td>
              <code>uiCoverage.score</code>
            </td>
            <td>
              <code>minScore</code> (0–100), optional <code>viewMatch</code>
            </td>
            <td>Same as above.</td>
          </tr>
          <tr>
            <td>
              <code>accessibility.failedElements</code>
            </td>
            <td>
              <code>maxCount</code> (non-negative integer), optional <code>viewMatch</code>
            </td>
            <td>
              Fails when the count of failing accessibility elements is{' '}
              <strong>greater than</strong> <code>maxCount</code> at run scope, or per
              matched view when <code>viewMatch</code> is set.
            </td>
          </tr>
          <tr>
            <td>
              <code>uiCoverage.untestedElements</code>
            </td>
            <td>
              <code>maxCount</code> (non-negative integer), optional <code>viewMatch</code>
            </td>
            <td>
              Fails when the count of untested elements is <strong>greater than</strong>{' '}
              <code>maxCount</code> at run scope, or per matched view when{' '}
              <code>viewMatch</code> is set.
            </td>
          </tr>
        </tbody>
      </table>

      <h4>Example</h4>
      <CodeBlock language="json" title="App Quality policies">
        {policyExample}
      </CodeBlock>

      <p>
        If a product is not part of a run (for example, UI Coverage disabled for that
        run), validations for that product are skipped and do not cause the policy to
        fail.
      </p>
    </>
  )
}
