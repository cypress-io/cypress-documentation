(function () {
  'use strict'

  function setMyTimezoneToDate (date) {
    return new Date(Date.parse(date))
  }

  function actualizeSidebarsMarginTop (margin) {
    if (document.querySelector('#sidebar')) {
      document.querySelector('#sidebar').style.marginTop = margin.toString() + 'px'
    }

    if (document.querySelector('#article-toc')) {
      document.querySelector('#article-toc').style.marginTop = margin.toString() + 'px'
    }
  }

  function actualizeScrollbar (headerHeight) {
    if (typeof window.location.hash === 'undefined') return

    return setTimeout(function () {
      window.scrollTo(0, window.pageYOffset - headerHeight + 50)
    }, 0)
  }

  function actualizeSidebarPosition () {
    var header = document.querySelector('#header')

    if (!header) return

    // sidebar margins fix
    actualizeSidebarsMarginTop(header.clientHeight)
    window.addEventListener('resize', function () {
      actualizeSidebarsMarginTop(header.clientHeight)
    })
    // anchor scroll-position fix
    actualizeScrollbar(header.clientHeight)
    window.addEventListener('popstate', function () {
      actualizeScrollbar(header.clientHeight)
    })
  }

  var banners = document.querySelectorAll('.top-banners_item') || []
  var i

  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !banners.length
  ) return

  for (i = banners.length; i--;) {
    var banner = banners[i]
    var now = new Date()
    var startDate = setMyTimezoneToDate(banner.dataset.startDate)
    var endDate = setMyTimezoneToDate(banner.dataset.endDate)

    if (startDate >= now && now <= endDate) {
      banner.remove()
    }
  }

  actualizeSidebarPosition()
})()
