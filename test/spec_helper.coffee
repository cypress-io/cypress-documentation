nock = require("nock")
chai = require("chai")
sinon = require("sinon")
sinonChai = require("sinon-chai")
jest = require('jest')
jestExpect = expect

global.snapshot = (expected) ->
  jestExpect(expected).toMatchSnapshot()

chai.use(sinonChai)

global.nock = nock
global.expect = chai.expect
global.sinon = sinon

beforeEach ->
  nock.disableNetConnect()


afterEach ->
  sinon.restore()
