---
title: Client Certificates
---

Configure certificate authority (CA) and client certificates to use within tests on a per-URL basis.

<Alert type="info">

<strong class="alert-header">Document Scope</strong>

This document merely offers guidance on how to specify certificate file paths for given test URLs. Details around the content and purpose of such files are not within the scope of Cypress documentation.

</Alert>

## Syntax

**<Icon name="angle-right"></Icon> clientCertificates** **_(Object[])_**

An array of objects defining the certificates. Each object must have the following properties

| Property | Type       | Description                                                                                                              |
| -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `url`    | `String`   | URL to match requests against. Wildcards following [minimatch](https://github.com/isaacs/minimatch) rules are supported. |
| `ca`     | `Array`    | _(Optional)_ Paths to one or more CA files to validate certs against, relative to project root.                          |
| `certs`  | `Object[]` | A PEM format certificate/private key pair or PFX certificate container                                                   |

Each object in the `certs` array can define either a **PEM format certificate/private key pair** or a **PFX certificate container**.

**A PEM format certificate/private key pair can have the following properties:**

| Property     | Type     | Description                                                                           |
| ------------ | -------- | ------------------------------------------------------------------------------------- |
| `cert`       | `String` | Path to the certificate file, relative to project root.                               |
| `key`        | `String` | _(Optional)_ Path to the private key file, relative to project root.                  |
| `passphrase` | `String` | _(Optional)_ Path to a text file containing the passphrase, relative to project root. |

**A PFX certificate container can have the following properties:**

| Property     | Type     | Description                                                                           |
| ------------ | -------- | ------------------------------------------------------------------------------------- |
| `pfx`        | `String` | Path to the certificate container, relative to project root.                          |
| `passphrase` | `String` | _(Optional)_ Path to a text file containing the passphrase, relative to project root. |

## Usage

To configure CA / client certificates within your configuration file (`cypress.json` by default), you can add the `clientCertificates` key to define an array of client certificates as shown below:

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

## History

| Version                                     | Changes                                         |
| ------------------------------------------- | ----------------------------------------------- |
| [8.0.0](/guides/references/changelog#8-0-0) | Added Client Certificates configuration options |
