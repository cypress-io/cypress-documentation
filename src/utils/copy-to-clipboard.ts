/**
 * Write text the caller already has to the clipboard, falling back to a hidden
 * textarea plus `document.execCommand('copy')` when the async Clipboard API is
 * unavailable (it needs a secure context, so it is missing over plain HTTP).
 *
 * Only call this in the same tick as the click that asked for it — see
 * `copyPendingText` for text that has to be fetched first.
 *
 * Resolves to whether the copy succeeded; callers decide what to show.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Clipboard API is unavailable in insecure contexts
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  try {
    textarea.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 * Copy text that still has to be fetched.
 *
 * The obvious shape — `await fetch(…)` and then write the result — loses the
 * click's transient user activation while the request is in flight. Safari
 * rejects the write outright at that point, and `document.execCommand('copy')`
 * (the insecure-context fallback above) is a no-op outside a gesture, so the
 * reader sees a failure on every attempt.
 *
 * Handing the *pending* text to `ClipboardItem` keeps the write inside the
 * gesture instead: the call happens synchronously and the browser resolves the
 * promise on its own. Pass an already-started promise and call this without
 * awaiting anything first, or the activation is gone before it runs.
 *
 * Browsers with no promise-aware `ClipboardItem` fall back to awaiting the
 * text and writing it, which is what they do today.
 */
export async function copyPendingText(
  pending: Promise<string>
): Promise<boolean> {
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          // Browsers only accept a short list of types here, so the markdown
          // is rewrapped as `text/plain` rather than passing the response's
          // own `text/markdown` blob through.
          'text/plain': pending.then(
            (text) => new Blob([text], { type: 'text/plain' })
          ),
        }),
      ])
      return true
    } catch {
      // Falls through: either the write was refused or the fetch failed. The
      // fallback below re-awaits the same promise and reports either way.
    }
  }

  return copyToClipboard(await pending)
}
