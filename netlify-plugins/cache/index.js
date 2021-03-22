/**
 * This is overriding default Netlify caching behavior.
 * If we want to make any edits to `patches/github-slugger+1.3.0.patch`,
 * we want to invalidate the cache so that the git patch file can be'
 * applied to the github-slugger module.
 */
module.exports = {
  async onPreBuild({ utils }) {
    await utils.cache.restore('node_modules')
  },
  async onPostBuild({ utils }) {
    await utils.cache.save('node_modules', {
      digests: [
        'patches/github-slugger+1.3.0.patch',
        'patches/vue-scrollactive+0.9.3.patch',
        'yarn.lock',
      ],
    })
  },
}
