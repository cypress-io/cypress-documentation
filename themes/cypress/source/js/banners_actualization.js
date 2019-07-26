function setMyTimezoneToDate (date) {
  return new Date(Date.parse(date))
}

function actualizePadding (padding) {
  document.querySelector('#sidebar').style.paddingTop = padding.toString() + 'px'
  document.querySelector('#article-toc-inner').style.paddingTop = padding.toString() + 'px'
}

function actualizeSidebarPosition () {
  var header = document.querySelector('#header')

  if (!header) return

  actualizePadding(header.clientHeight)

  window.addEventListener('resize', function () {
    actualizePadding(header.clientHeight)
  })
}

(function () {
  'use strict'

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
