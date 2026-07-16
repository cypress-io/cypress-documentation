/**
 * Local copy of Docusaurus' `useTOCHighlight` hook with a fix for the
 * "last section is never highlighted" bug.
 *
 * @see https://github.com/cypress-io/cypress-documentation/issues/6074
 *
 * The upstream `getActiveAnchor` uses a heuristic: it highlights the heading
 * currently sitting in the top half of the viewport. That works while
 * scrolling through the page, but breaks for a short final section (e.g. a
 * 3-item "See also" list) that sits at the very bottom of the page. Clicking
 * such a heading scrolls the page as far as it can go, yet the *previous*
 * heading ("History") ends up in the viewport top half and stays highlighted,
 * because the page cannot scroll far enough to lift the final heading up. This
 * adds an `isPageBottom()` guard so that once the page is scrolled to the very
 * bottom, the last heading is highlighted as expected.
 *
 * Based on the MIT-licensed upstream implementation:
 * https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-common/src/hooks/useTOCHighlight.ts
 */
import { useEffect, useRef } from 'react'
import { useThemeConfig } from '@docusaurus/theme-common'
import type { TOCHighlightConfig } from '@docusaurus/theme-common/internal'

/**
 * If the anchor has no height and is just a "marker" in the DOM, we'll use the
 * parent (normally the link text) rect boundaries instead.
 */
function getVisibleBoundingClientRect(element: HTMLElement): DOMRect {
  const rect = element.getBoundingClientRect()
  const hasNoHeight = rect.top === rect.bottom
  if (hasNoHeight) {
    return getVisibleBoundingClientRect(element.parentNode as HTMLElement)
  }
  return rect
}

/**
 * Considering we divide viewport into 2 zones of each 50vh, this returns true
 * if an element is in the first zone (i.e., appears in viewport, near the top).
 */
function isInViewportTopHalf(boundingRect: DOMRect) {
  return boundingRect.top > 0 && boundingRect.bottom < window.innerHeight / 2
}

/**
 * Returns true when a scrollable page is scrolled as far down as it can go. In
 * that state the final section is fully in view but a heading near the bottom
 * can never be lifted into the viewport top half, so the top-half heuristic
 * would keep highlighting an earlier heading. Guarded on the page actually
 * being scrollable so short, non-scrollable pages keep the default behaviour.
 */
function isPageBottom(): boolean {
  const { scrollHeight } = document.documentElement
  const isScrollable = scrollHeight - window.innerHeight > 1
  const scrollBottom = Math.ceil(window.scrollY + window.innerHeight)
  return isScrollable && scrollBottom >= scrollHeight - 2
}

function getAnchors({
  minHeadingLevel,
  maxHeadingLevel,
}: {
  minHeadingLevel: number
  maxHeadingLevel: number
}): HTMLElement[] {
  const selectors = []
  for (let i = minHeadingLevel; i <= maxHeadingLevel; i += 1) {
    selectors.push(`h${i}.anchor`)
  }
  return Array.from(document.querySelectorAll(selectors.join()))
}

function getActiveAnchor(
  anchors: HTMLElement[],
  { anchorTopOffset }: { anchorTopOffset: number }
): Element | null {
  // Once the page is scrolled to the very bottom, the final section is as far
  // up as it will ever get. Highlight the last heading directly, otherwise a
  // short trailing section (e.g. "See also") never becomes active because an
  // earlier heading is still sitting in the viewport top half.
  // @see https://github.com/cypress-io/cypress-documentation/issues/6074
  if (isPageBottom()) {
    return anchors[anchors.length - 1] ?? null
  }

  // The "nextVisibleAnchor" is the first anchor that appears under the viewport
  // top boundary. It does not mean this anchor is visible yet, but if the user
  // continues scrolling down, it will be the first to become visible.
  const nextVisibleAnchor = anchors.find((anchor) => {
    const boundingRect = getVisibleBoundingClientRect(anchor)
    return boundingRect.top >= anchorTopOffset
  })

  if (nextVisibleAnchor) {
    const boundingRect = getVisibleBoundingClientRect(nextVisibleAnchor)
    // If anchor is in the top half of the viewport, it is the "active" one.
    if (isInViewportTopHalf(boundingRect)) {
      return nextVisibleAnchor
    }
    // If anchor is in the bottom half of the viewport, or under the viewport,
    // we consider the active anchor to be the previous one, because the main
    // text on screen mostly belongs to the previous anchor. Returns null for
    // the first anchor, see
    // https://github.com/facebook/docusaurus/issues/5318
    return anchors[anchors.indexOf(nextVisibleAnchor) - 1] ?? null
  }
  // No anchor under viewport top (i.e. we are at the bottom of the page),
  // highlight the last anchor found.
  return anchors[anchors.length - 1] ?? null
}

function getLinkAnchorValue(link: HTMLAnchorElement): string {
  return decodeURIComponent(link.href.substring(link.href.indexOf('#') + 1))
}

function getLinks(linkClassName: string) {
  return Array.from(
    document.getElementsByClassName(linkClassName)
  ) as HTMLAnchorElement[]
}

function getNavbarHeight(): number {
  // Not ideal to obtain the actual height this way.
  return document.querySelector('.navbar')!.clientHeight
}

function useAnchorTopOffsetRef() {
  const anchorTopOffsetRef = useRef<number>(0)
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig()

  useEffect(() => {
    anchorTopOffsetRef.current = hideOnScroll ? 0 : getNavbarHeight()
  }, [hideOnScroll])

  return anchorTopOffsetRef
}

/**
 * Side-effect that applies the active class name to the TOC heading that the
 * user is currently viewing. Disabled when `config` is undefined.
 */
export function useTOCHighlight(config: TOCHighlightConfig | undefined): void {
  const lastActiveLinkRef = useRef<HTMLAnchorElement | undefined>(undefined)

  const anchorTopOffsetRef = useAnchorTopOffsetRef()

  useEffect(() => {
    if (!config) {
      // No-op, highlighting is disabled.
      return () => {}
    }

    const {
      linkClassName,
      linkActiveClassName,
      minHeadingLevel,
      maxHeadingLevel,
    } = config

    function updateLinkActiveClass(link: HTMLAnchorElement, active: boolean) {
      if (active) {
        if (lastActiveLinkRef.current && lastActiveLinkRef.current !== link) {
          lastActiveLinkRef.current.classList.remove(linkActiveClassName)
        }
        link.classList.add(linkActiveClassName)
        lastActiveLinkRef.current = link
      } else {
        link.classList.remove(linkActiveClassName)
      }
    }

    function updateActiveLink() {
      const links = getLinks(linkClassName)
      const anchors = getAnchors({ minHeadingLevel, maxHeadingLevel })
      const activeAnchor = getActiveAnchor(anchors, {
        anchorTopOffset: anchorTopOffsetRef.current,
      })
      const activeLink = links.find(
        (link) => activeAnchor && activeAnchor.id === getLinkAnchorValue(link)
      )

      links.forEach((link) => {
        updateLinkActiveClass(link, link === activeLink)
      })
    }

    document.addEventListener('scroll', updateActiveLink)
    document.addEventListener('resize', updateActiveLink)

    updateActiveLink()

    return () => {
      document.removeEventListener('scroll', updateActiveLink)
      document.removeEventListener('resize', updateActiveLink)
    }
  }, [config, anchorTopOffsetRef])
}
