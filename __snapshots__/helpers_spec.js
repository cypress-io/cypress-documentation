exports['lib/helpers cheerio wraps document in html tag 1'] = '<html><head></head><body><p>foo</p></body></html>'

exports['lib/helpers cheerio does not wrap fragment in html tag 1'] = '<p>foo</p>'

exports['lib/helpers addPageAnchors is noop if no headings found 1'] = '<p>foo</p>'

exports['lib/helpers addPageAnchors does not wrap with <html> 1'] = '<h1 id="bar" class="article-heading">foo<a class="article-anchor" href="#bar" aria-hidden="true"></a></h1>'

exports['lib/helpers addPageAnchors does not wrap fragment in html tag 1'] = '<p>foo</p>'
