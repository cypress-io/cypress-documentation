function setMyTimezoneToDate(date) {
  return new Date(Date.parse(date));
}

(function () {
  'use strict'

  var banners = document.querySelectorAll('.top-banners_item') || [];

  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !banners.length
  ) return null;

  var i;

  for (i = banners.length; i--;) {
    var banner = banners[i],
      now = new Date(),
      startDate = setMyTimezoneToDate(banner.dataset.startDate),
      endDate = setMyTimezoneToDate(banner.dataset.endDate);

    if (startDate >= now && now <= endDate) {
      banner.remove()
    }
  }
})()
