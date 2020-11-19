require('../spec_helper')

const api = require('../../cy_scripts/should-deploy')
const git = require('ggit')

/* global sinon */
describe('should-deploy', () => {
  describe('isRightBranch', () => {
    it('allows master branch to deploy to production', function () {
      sinon.stub(git, 'branchName').resolves('master')

      return api.isRightBranch('production').then((allowed) => {
        expect(allowed).to.equal(true)
      })
    })

    it('develop branch is NOT allowed to deploy to production', function () {
      sinon.stub(git, 'branchName').resolves('develop')

      return api.isRightBranch('production').then((allowed) => {
        expect(allowed).to.equal(false)
      })
    })

    it('develop branch is allowed to deploy to staging', function () {
      sinon.stub(git, 'branchName').resolves('develop')

      return api.isRightBranch('staging').then((allowed) => {
        expect(allowed).to.equal(true)
      })
    })

    it('random branch is allowed to deploy to staging', function () {
      sinon.stub(git, 'branchName').resolves('hot-fix-1')

      return api.isRightBranch('staging').then((allowed) => {
        expect(allowed).to.equal(true)
      })
    })
  })
})
