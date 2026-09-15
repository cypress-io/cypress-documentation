# Evergreen Quota Policy

Quota is per PR and per continuous application of the opt-in label.

Quota starts when the label is applied, continues across runs while the label
remains, and stops when the PR becomes ready, the label is removed, or exhausted
state is reached. New commits do not reset quota by themselves.

On exhaustion:

1. Stop work immediately.
2. Request removal of the opt-in label.
3. Request addition of the exhausted label.
4. Leave one terse comment.
5. Record future-useful memory.

Hard-cap errors from the AI engine are terminal for the current quota window.
