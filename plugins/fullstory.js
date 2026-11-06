// Adds the Fullstory data capture snippet to every page's <head> in production
// builds (NODE_ENV is 'production') that set FULLSTORY_ORG_ID. A build without
// the org ID, such as a CI build, gets no snippet, so it never loads fs.js for
// an org that doesn't exist. The dev server never gets the snippet.
//
// The snippet is SnippetSrc from @fullstory/snippet@2.1.0, copied verbatim.
// JSON.stringify fills its four $FS_*$ placeholders, as the package's own
// injectSnippetArgs() does. To upgrade, copy the new SnippetSrc instead of
// editing the minified code by hand.

const FULLSTORY_HOST = 'fullstory.com'
const FULLSTORY_SCRIPT = 'edge.fullstory.com/s/fs.js'
const FULLSTORY_NAMESPACE = 'FS'

module.exports = async function fullStory({ context, options }) {
  const isProd = process.env.NODE_ENV === 'production'
  const orgId = process.env.FULLSTORY_ORG_ID
  return {
    name: 'docusaurus-plugin-fullstory',
    injectHtmlTags({ content }) {
      if (!isProd || !orgId) {
        return {}
      }
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
!function(m,n,e,t,l,o,g,y){var u,a,f=function(h){
return!(h in m)||(m.console&&m.console.log&&m.console.log("FullStory namespace conflict. Please use a different namespace."),!1)}(l)
;f&&(g=m[l]=function(){var b=function(b,d,j,r){r=r||2;var i,c=/Async$/;return c.test(b)&&(b=b.replace(c,""),
"function"==typeof Promise)?new Promise((function(i,c){h(b,d,j,i,c,r)})):h(b,d,j,i,i,r)};function h(h,d,j,r,i,c){
return b._api?b._api(h,d,j,r,i,c):(b.q&&b.q.push([h,d,j,r,i,c]),null)}return b.q=[],b}(),y=function(b){function h(h){
"function"==typeof h[4]&&h[4](new Error(b))}var d=g.q;if(d){for(var j=0;j<d.length;j++)h(d[j]);d.length=0,d.push=h}},function(){
var b="script",d=n.createElement(b);d.async=!0,d.crossOrigin="anonymous",d.src="https://"+t+"?org="+o,d.setAttribute("data-fs-namespace",l),
d.onerror=function(){y("Error loading "+t)};var c=n.getElementsByTagName(b)[0]
;c&&c.parentNode?c.parentNode.insertBefore(d,c):n.head.appendChild(d)}(),function(){function b(){}function h(b,h,d){g(b,h,d,1)}function d(b,d,j){
h("setProperties",{type:b,properties:d},j)}function j(b,h){d("user",b,h)}function r(b,h,d){j({uid:b},d),h&&j(h,d)}g.identify=r,g.setUserVars=j,
g.identifyAccount=b,g.clearUserCookie=b,g.setVars=d,g.event=function(b,d,j){h("trackEvent",{name:b,properties:d},j)},g.anonymize=function(){r(!1)
},g.shutdown=function(){h("shutdown")},g.restart=function(){h("restart")},g.log=function(b,d){h("log",{level:b,msg:d})},g.consent=function(b){
h("setIdentity",{consent:!arguments.length||b})}}(),u="fetch",a="XMLHttpRequest",g._w={},g._w[a]=m[a],g._w[u]=m[u],m[u]&&(m[u]=function(){
return g._w[u].apply(this,arguments)}),g("init",{env:{orgId:o,host:e,script:t}}),g._v="2.1.0")
}(window,document,${JSON.stringify(FULLSTORY_HOST)},${JSON.stringify(FULLSTORY_SCRIPT)},${JSON.stringify(FULLSTORY_NAMESPACE)},${JSON.stringify(orgId)});
`,
          },
        ],
      }
    },
  }
}
