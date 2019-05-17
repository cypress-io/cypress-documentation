const nock = require('nock')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const jestExpect = expect

global.snapshot = (expected) => jestExpect(expected).toMatchSnapshot()

chai.use(sinonChai)

global.nock = nock
global.expect = chai.expect
global.sinon = sinon

beforeEach(() => nock.disableNetConnect())

afterEach(() => sinon.restore())
