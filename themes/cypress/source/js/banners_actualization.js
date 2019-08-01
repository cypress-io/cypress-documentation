(function () {
  'use strict'

  function setMyTimezoneToDate (date) {
    return new Date(Date.parse(date))
  }

  function actualizeMargin (margin) {
    if (document.querySelector('#sidebar')) {
      document.querySelector('#sidebar').style.marginTop = margin.toString() + 'px'
    }

    if (document.querySelector('#article-toc')) {
      document.querySelector('#article-toc').style.marginTop = margin.toString() + 'px'
    }
  }

  function actualizeSidebarPosition () {
    var header = document.querySelector('#header')

    if (!header) return

    actualizeMargin(header.clientHeight)

    window.addEventListener('resize', function () {
      actualizeMargin(header.clientHeight)
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
