---
title: Client Certificates
---

Configure certificate authority (CA) and client certificates to use within tests on a per-URL basis.

<Alert type="info">

<strong class="alert-header">Document Scope</strong>

This document merely offers guidance on how to specify certificate file paths for given test URLs. Details around the content and purpose of such files are not within the scope of Cypress documentation.

</Alert>

## Structure within JSON config file

To configure CA / client certificates within your cypress.env.json, you should add a section at the top level something like:

```
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
**Notes:**
 * The passhprase value must always point to a text file containing the phrase, not the phrase itself. 
 * URL is a required value for each certificate 'block' within the config
 * For any given URL block, you *must* specify either a PFX file, *or* a PEM format cert/key pair of files, but not both. 
 * As you can see above, wildcards are supported for the url value, but no other values. These wildcards must follow Javascript minimatch (https://github.com/isaacs/minimatch) rules
