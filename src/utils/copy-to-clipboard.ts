/**
 * Write text to the clipboard, falling back to a hidden textarea plus
 * `document.execCommand('copy')` when the async Clipboard API is unavailable
 * (it needs a secure context, so it is missing over plain HTTP).
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
