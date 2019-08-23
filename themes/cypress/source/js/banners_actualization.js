(function () {
  'use strict'

  function setMyTimezoneToDate (date) {
    return new Date(Date.parse(date))
  }

  function actualizeSidebarsMarginTop (margin) {
    if (document.querySelector('#sidebar')) {
      document.querySelector('#sidebar').style.marginTop = (margin - 60).toString() + 'px'
    }

    if (document.querySelector('#article-toc')) {
      document.querySelector('#article-toc').style.marginTop = (margin - 60).toString() + 'px'
    }
  }

  function actualizeScrollbar (headerHeight) {
    if (typeof window.location.hash === 'undefined') return null

    return setTimeout(function () {
      window.scrollTo(0, window.pageYOffset - headerHeight + 50)
    }, 0)
  }

  // vanilla throttle
  function throttle (fn, wait) {
    var time = Date.now()

    return function () {
      if ((time + wait - Date.now()) < 0) {
        fn()
        time = Date.now()
      }
    }
  }

  function mobileDeviceUXUpgrade () {
    var banners = document.querySelector('.top-banners_item')

    if (typeof banners === 'undefined' || !banners) return null

    var offset = document.querySelector('#container').scrollTop || window.pageYOffset
    var headerHeight = document.querySelector('#header').clientHeight
    var bannersHeight = banners.clientHeight
    var allMainHeaders = document.querySelectorAll('.main-header')
    var i

    // for all main headers
    for (i = allMainHeaders.length; i--;) {
      // header style
      var style = allMainHeaders[i].style

      // if need to hide
      if ((window.mobilecheck() || window.innerWidth <= 768) && offset > (bannersHeight / 1.5)) {
        style.transform = 'translate3d(0px, -' + bannersHeight + 'px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)' +
          ' rotateZ(0deg) skew(0deg, 0deg)'

        // for 21:9 phones or something like iPhone X, XR, etc. in landscape
        if (window.innerWidth > 768) {
          actualizeSidebarsMarginTop(headerHeight - bannersHeight)
        }
      } else { // if need to show
        style.transform = 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' +
          ' skew(0deg, 0deg)'

        // for 21:9 phones or something like iPhone X, XR, etc. in landscape
        if (window.innerWidth > 768) {
          actualizeSidebarsMarginTop(headerHeight)
        }
      }
    }
  }

  function actualizeSidebarPosition () {
    var header = document.querySelector('#header')

    if (!header) return

    // sidebar margins fix
    actualizeSidebarsMarginTop(header.clientHeight)
    window.addEventListener('resize', function () {
      actualizeSidebarsMarginTop(header.clientHeight)
      // hide banners on scroll
      mobileDeviceUXUpgrade()
    })
    // anchor scroll-position fix
    actualizeScrollbar(header.clientHeight)
    window.addEventListener('popstate', function () {
      actualizeScrollbar(header.clientHeight)
    })
    // hide banners on scroll
    mobileDeviceUXUpgrade() // on init
    // listener for normal mobile phones
    document.querySelector('#container').addEventListener('scroll', function () {
      throttle(mobileDeviceUXUpgrade(), 200)
    })
    // for 21:9 phones or something like iPhone X, XR, etc. in landscape
    if (window.mobilecheck()) {
      window.addEventListener('scroll', function () {
        throttle(mobileDeviceUXUpgrade(), 200)
      })
    }
  }

  var banners = document.querySelectorAll('.top-banners_item') || []
  var i

  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !banners.length
  ) return null

  for (i = banners.length; i--;) {
    var banner = banners[i]
    var now = new Date()
    var startDate = setMyTimezoneToDate(banner.dataset.startDate)
    var endDate = setMyTimezoneToDate(banner.dataset.endDate)

    if (startDate < now && now < endDate) {
      banner.classList.add('visible')
    } else {
      banner.remove()
    }
  }

  if (!banners.length) return null

  actualizeSidebarPosition()
})()
