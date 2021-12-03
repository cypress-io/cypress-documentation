const { execSync } = require('child_process')
const chalk = require('chalk')
const sanityClient = require('@sanity/client')

const log = (...args) => {
  const NOW = new Date()

  // eslint-disable-next-line no-console
  console.log(`${chalk.yellow(`[${NOW.toISOString()}]`)}: `, ...args)
}

if (!process.env.SANITY_PROJECT_ID) {
  throw new Error('Missing $SANITY_PROJECT_ID')
}

if (!process.env.SANITY_AUTH_TOKEN) {
  throw new Error('Missing $SANITY_AUTH_TOKEN')
}

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

// Query for any scheduled publish events that should occur
const query = `* [_type == "schedule.metadata" && !(_id in path("drafts.**")) && datetime <= now()]`

const publish = async (metadata, client) => {
  const dataset = client.config().dataset
  const id = metadata.documentId
  const rev = metadata.rev

  // Fetch the draft revision we should publish from the History API
  const uri = `/data/history/${dataset}/documents/drafts.${id}?revision=${rev}`
  const revision = await client
    .request({ uri })
    .then((response) => response.documents.length && response.documents[0])

  if (!revision) {
    // Here we have a situation where the scheduled revision does not exist
    // This can happen if the document was deleted via Studio or API without
    // unscheduling it first.
    // eslint-disable-next-line no-console
    console.error('Could not find document revision to publish', metadata)

    return
  }

  // Publish it
  return (
    client
      .transaction()
      // Publishing a document is simply writing it to the dataset without a
      // `drafts.` prefix. The `documentId` field on the metadata already does
      // not include this prefix, but the revision we fetched probably does, so
      // we overwrite it here.
      .createOrReplace(Object.assign({}, revision, { _id: id }))
      // Then we delete any current draft.
      .delete(`drafts.${id}`)
      // And finally we delete the schedule medadata, since we're done with it.
      .delete(metadata._id)
      .commit()
  )
}

const main = async () => {
  const response = client.fetch(query)

  if (!response.length) {
    log('Did not find any scheduled content to publish. This is not an error.')

    return
  }

  log(`Found content to publish. Count: ${response.length}`)

  await Promise.all(response.map((metadata) => publish(metadata, client)))

  log(
    'Published scheduled content. Triggering Netlify build to deploy site with updated banner...'
  )

  execSync(`curl -X post -d '{}' ${process.env.NETLIFY_BUILD_HOOK_MASTER}`)

  log('Vercel build hook invoked.')
}

main()
