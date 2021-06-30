---
title: Client Certificates
---

Configure certificate authority (CA) and client certificates to use within tests on a per-URL basis.

<Alert type="info">

<strong class="alert-header">Document Scope</strong>

This document merely offers guidance on how to specify certificate file paths for given test URLs. Details around the content and purpose of such files are not within the scope of Cypress documentation.

</Alert>

## Structure within JSON config file

To configure CA / client certificates within your [cypress.env.json](/guides/guides/environment-variables#Option-2-cypress-env-json), you should add a section at the top level something like:

```json
  "clientCertificates": [
    {
      "url": "https://a.host.com",
      "ca": [
          "certs/ca.pem"
      ],
      "certs": [
        {
          "cert": "certs/cert.pem",
          "key": "certs/private.key",
          "passphrase": "certs/pem-passphrase.txt"
        }
      ]
    },
    {
      "url": "https://b.host.com/a_base_route/**",
      "ca": [],
      "certs": [
        {
          "pfx": "/home/tester/certs/cert.pfx",
          "passphrase": "/home/tester/certs/pfx-passphrase.txt"
        }
      ]
    },
    {
      "url": "https://a.host.*.com/",
      "ca": [],
      "certs": [
        {
          "pfx": "certs/cert.pfx",
          "passphrase": "certs/pfx-passphrase.txt"
        }
      ]
    }
  ]
}
```
## `clientCertificates` schema

* The `clientCertificates` value is an **Array** of objects. Each object must have a `url` and `certs` property, and may have an optional `ca` property.
  * `url` is a **String** used to match requests. Wildcards following [minimatch](https://github.com/isaacs/minimatch) rules are supported.
  * `ca` is an optional **Array** of paths to one or more CA files to validate certs against, relative to project root.
  * `certs` is an **Array** of objects.
* Each object in the `certs` array can contain either
  * a PEM format certificate/private key pair:
    *  `cert` is a **String** path to the certificate file, relative to project root.
    *  `key` is a **String** path to the private key file, relative to project root.
    *  `passphrase` is an optional **String** path to a text file containing the passphrase, relative to project root.
  * a PFX certificate container:
    *  `pfx` is a **String** path to the certificate container, relative to project root.
    *  `passphrase` is an optional **String** path to a text file containing the passphrase, relative to project root.
