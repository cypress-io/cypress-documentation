(function () {
  'use strict'

  var sidebar = document.getElementById('sidebar')
  var expandSidebar = document.getElementById('expand-sidebar')
  var collapseSidebar = document.getElementById('collapse-sidebar')

  function collapseSection (element, header) {
    if (!element) return

    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight

    // temporarily disable all css transitions
    var elementTransition = element.style.transition

    element.style.transition = ''

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function () {
      element.style.height = sectionHeight + 'px'
      element.style.transition = elementTransition

      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function () {
        element.style.height = 0 + 'px'
        // mark the section as "currently collapsed"
        header.classList.add('is-collapsed')
      })
    })
  }

  function expandSection (element, header) {
    if (!element) return

    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight

    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + 'px'

    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function () {
      // remove this event listener so it only gets triggered once
      element.removeEventListener('transitionend', expandSection)

      // remove "height" from the element's inline styles, so it can return to its initial value
      element.style.height = null
    })

    // mark the section as "currently not collapsed"
    header.classList.remove('is-collapsed')
  }

  if (sidebar) {
    // listen for click on sidebar titles
    sidebar.addEventListener('click', function (e) {
      if (e.target && e.target.dataset.toggle === 'collapse' || e.target.nodeName === 'STRONG') {
        var sidebarTitle

        if (e.target.nodeName === 'STRONG') {
          sidebarTitle = e.target.parentElement
        } else {
          sidebarTitle = e.target
        }

        var isCollapsed = sidebarTitle.classList.contains('is-collapsed')
        var collapsibleSection = sidebarTitle.getElementsByClassName('sidebar-links')[0]

        // toggle the collapse class on each menu section
        if (isCollapsed) {
          expandSection(collapsibleSection, sidebarTitle)
        } else {
          collapseSection(collapsibleSection, sidebarTitle)
        }
      }
    })
  }

  // listen for click on expand all
  if (expandSidebar) {
    expandSidebar.addEventListener('click', function (e) {
      e.preventDefault()

      var collapsibleSections = sidebar.getElementsByClassName('sidebar-links')

      for (var i = 0; i < collapsibleSections.length; i++) {
        var sidebarTitle = collapsibleSections[i].parentElement

        // if we're currently on a page within the section, don't collapse it
        if (sidebarTitle.classList.contains('is-collapsed')) {
          expandSection(collapsibleSections[i], sidebarTitle)
        }
      }
    })
  }

  if (collapseSidebar) {
    // listen for click on collapse all
    collapseSidebar.addEventListener('click', function (e) {
      e.preventDefault()

      var collapsibleSections = sidebar.getElementsByClassName('sidebar-links')

      for (var i = 0; i < collapsibleSections.length; i++) {
        var sidebarTitle = collapsibleSections[i].parentElement

        // if we're currently on a page within the section, don't collapse it
        // if we're already collapsed, don't collapse it
        if (!sidebarTitle.classList.contains('is-collapsed')) {
          collapseSection(collapsibleSections[i], sidebarTitle)
        }
      }
    })
  }

})()
