export function hydrateVisitMountExample(code: string) {
  const regex = /-{(.*)}-/gs
  const matches = [...(code.matchAll(regex) || [])][0] || []

  if (matches.length != 2) {
    throw Error(
      'No valid token to replace in visit-mount-example code block: ' + code
    )
  }

  const fullMatch = matches[0]
  const token = matches[1]

  const [visit, mount] = token.split('::')

  if (!visit || !mount) {
    throw Error('Token format invalid in visit-mount-example: ' + token)
  }

  const visitCode = code.replace(fullMatch, visit)
  const mountCode = code.replace(fullMatch, mount)

  return {
    visitCode,
    mountCode,
  }
}
