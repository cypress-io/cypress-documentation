# Evergreen Labels

Default labels:

| Label | Owner | Meaning |
| --- | --- | --- |
| `evergreen` | Human | Persistent opt-in for greenkeeping work. |
| `evergreen-ready` | Deterministic controller | Configured gates pass for the current PR head. |
| `evergreen_active` | Deterministic controller | Lease label: an Evergreen run is currently working this PR. |
| `evergreen-blocked` | Orchestrator | A blocker exists, but future work may still be useful. |
| `evergreen-human-needed` | Orchestrator | A human decision, credential, review, or protected edit is needed. |
| `evergreen-exhausted` | Orchestrator | Per-PR quota is exhausted. |

Update labels only when underlying state changes.
