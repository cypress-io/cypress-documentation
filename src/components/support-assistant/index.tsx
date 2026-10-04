import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { IconGeneralSparkleDoubleSmall } from '@cypress-design/react-icon'

// Messages exchanged with the www.cypress.io/ask/embed frame. Keep in sync with
// src/components/CypressGPT/utilities/embedMessages.ts in cypress-io/cypress.io.
const MESSAGES = {
  ready: 'cypressgpt:ready',
  page: 'cypressgpt:page',
  focus: 'cypressgpt:focus',
  close: 'cypressgpt:close',
}

const OPEN_STORAGE_KEY = 'supportAssistant.isOpen'
// How long the embed has to announce itself before the panel offers cypress.io instead. A frame the
// browser refuses (a host outside its frame-ancestors, a content blocker) never loads and never says so.
const LOAD_TIMEOUT_MS = 8000
const BUTTON_ID = 'support-assistant-button'
const PANEL_ID = 'support-assistant'

type SupportAssistantState = { isOpen: boolean; toggle: () => void }

const SupportAssistantContext = createContext<SupportAssistantState | null>(
  null
)

const readOpen = () => {
  try {
    return window.localStorage.getItem(OPEN_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const writeOpen = (isOpen: boolean) => {
  try {
    window.localStorage.setItem(OPEN_STORAGE_KEY, String(isOpen))
  } catch {
    // Storage is unavailable (private mode, blocked site data); the panel still works for this page.
  }
}

export function SupportAssistantProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { siteConfig } = useDocusaurusContext()
  const embedOrigin = siteConfig.customFields?.supportAssistantOrigin as string
  const { pathname } = useLocation()
  const pageUrl = `${siteConfig.url}${pathname}`

  const [isOpen, setIsOpen] = useState(false)
  const [frameSrc, setFrameSrc] = useState<string | null>(null)
  const [hasFailed, setHasFailed] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const isReady = useRef(false)
  // Set when the reader opens the panel, never when it reopens on page load. Focus moves once the
  // panel is visible (an element under `hidden` can't take focus) and the embed is listening.
  const pendingFocus = useRef(false)
  const isOpenRef = useRef(isOpen)
  const pageUrlRef = useRef(pageUrl)
  isOpenRef.current = isOpen
  pageUrlRef.current = pageUrl

  const post = useCallback(
    (data: object) =>
      frameRef.current?.contentWindow?.postMessage(data, embedOrigin),
    [embedOrigin]
  )

  const focusFrame = useCallback(() => {
    frameRef.current?.focus()
    post({ type: MESSAGES.focus })
  }, [post])

  const setOpen = useCallback(
    (open: boolean, { moveFocus = true } = {}) => {
      setIsOpen(open)
      writeOpen(open)
      if (open) {
        pendingFocus.current = moveFocus
        setFrameSrc(
          (src) =>
            src ??
            `${embedOrigin}/ask/embed?page=${encodeURIComponent(
              pageUrlRef.current
            )}`
        )
      } else {
        pendingFocus.current = false
        document.getElementById(BUTTON_ID)?.focus()
      }
    },
    [embedOrigin]
  )

  const toggle = useCallback(() => setOpen(!isOpenRef.current), [setOpen])

  const focusIfPending = useCallback(() => {
    if (!pendingFocus.current || !isReady.current || !isOpenRef.current) return
    pendingFocus.current = false
    focusFrame()
  }, [focusFrame])

  useEffect(() => {
    if (isOpen) focusIfPending()
  }, [isOpen, focusIfPending])

  useEffect(() => {
    if (readOpen()) setOpen(true, { moveFocus: false })
  }, [setOpen])

  useEffect(() => {
    if (isReady.current) post({ type: MESSAGES.page, url: pageUrl })
  }, [pageUrl, post])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== embedOrigin ||
        event.source !== frameRef.current?.contentWindow
      ) {
        return
      }
      if (event.data?.type === MESSAGES.ready) {
        isReady.current = true
        setHasFailed(false)
        post({ type: MESSAGES.page, url: pageUrlRef.current })
        focusIfPending()
      }
      if (event.data?.type === MESSAGES.close) setOpen(false)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [embedOrigin, focusIfPending, post, setOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeydown = (event: KeyboardEvent) => {
      // Only Escape aimed at the assistant closes it, so closing search, an image zoom, or any
      // other overlay leaves the panel open. Escape inside the frame arrives as `close` instead.
      const target = document.activeElement
      const isOnAssistant =
        target?.id === BUTTON_ID ||
        document.getElementById(PANEL_ID)?.contains(target)
      if (event.key !== 'Escape' || event.defaultPrevented || !isOnAssistant) {
        return
      }
      setOpen(false)
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [isOpen, setOpen])

  useEffect(() => {
    if (!frameSrc) return
    const timer = window.setTimeout(() => {
      if (!isReady.current) setHasFailed(true)
    }, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [frameSrc])

  return (
    <SupportAssistantContext.Provider value={{ isOpen, toggle }}>
      {children}
      {frameSrc && (
        <div
          id={PANEL_ID}
          role="dialog"
          aria-modal="false"
          aria-label="Support Assistant"
          hidden={!isOpen}
          data-cy="support-assistant"
          className="fixed bottom-[72px] left-[8px] right-[8px] z-[200] h-[70vh] max-h-[calc(100vh-152px)] overflow-hidden rounded-lg bg-white shadow-xl sm:left-auto sm:right-[16px] sm:h-[480px] sm:w-[520px] lg:h-[640px]"
        >
          <iframe
            ref={frameRef}
            src={frameSrc}
            title="Cypress Support Assistant"
            referrerPolicy="origin"
            data-cy="support-assistant-frame"
            className="block h-full w-full border-0"
          />
          {hasFailed && (
            <div
              data-cy="support-assistant-fallback"
              className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] bg-white p-[24px] text-center text-gray-700"
            >
              <p className="m-0">
                The Support Assistant couldn't load on this page.
              </p>
              <a
                href={`${embedOrigin}/ask?utm_source=docs.cypress.io&utm_medium=support-assistant&utm_content=embed-fallback`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-500"
              >
                Open the Support Assistant on cypress.io
              </a>
            </div>
          )}
        </div>
      )}
    </SupportAssistantContext.Provider>
  )
}

export function SupportAssistantButton() {
  const assistant = useContext(SupportAssistantContext)
  if (!assistant) return null

  return (
    <button
      id={BUTTON_ID}
      type="button"
      aria-expanded={assistant.isOpen}
      aria-controls={PANEL_ID}
      data-cy="support-assistant-button"
      onClick={assistant.toggle}
      className="mr-[8px] flex h-[42px] w-[42px] cursor-pointer items-center justify-center gap-[8px] rounded-lg border-0 bg-gray-50 p-0 font-medium sm:h-[38px] sm:w-[38px] lg:h-auto lg:w-auto lg:rounded-full lg:px-[12px] lg:py-[8px] text-indigo-500 transition-colors hover:bg-indigo-50 dark:bg-gray-900 dark:text-indigo-300 dark:hover:bg-gray-800"
    >
      <IconGeneralSparkleDoubleSmall
        strokeColor="indigo-500"
        fillColor="indigo-100"
      />
      <span className="sr-only lg:not-sr-only">Ask AI</span>
    </button>
  )
}
