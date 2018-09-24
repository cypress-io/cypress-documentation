(function () {
  'use strict'

  var sidebar = document.getElementById('sidebar')

  if (!sidebar) return

  sidebar.addEventListener('click', function (e) {
    if (e.target && e.target.dataset.toggle === 'collapse') {
      var collapseTargetClass = e.target.dataset.target
      var collapseTargets = document.getElementsByClassName(collapseTargetClass)
      collapseTargets.forEach(function (el) {
        el.className = 'open'
      })
    }
  })
})()
