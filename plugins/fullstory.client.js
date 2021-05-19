import * as FullStory from '@fullstory/browser'

if (process.env.CONTEXT === 'production') {
    FullStory.init({ orgId: process.env.FULLSTORY_ORG_ID })
}