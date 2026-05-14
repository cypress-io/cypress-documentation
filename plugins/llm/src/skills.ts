import fs from 'fs'
import path from 'path'

/**
 * Writes a `/.well-known/agent-skills/index.json` file that lists all the available Cypress AI skills.
 * For now this will just be manually updated as new skills aren't being added very quickly, but eventually
 * we may want to automatically scan `cypress-io/ai-toolkit/skills` for new skills.
 * @param distRoot
 */
export function writeSkillsIndex(distRoot: string) {
  const skills = [
    {
      name: 'cypress-author',
      type: 'skill-md',
      description:
        'Improves how AI tools create, update, and fix Cypress tests.',
      url: 'https://github.com/cypress-io/ai-toolkit/tree/main/skills/cypress-author',
    },
    {
      name: 'cypress-explain',
      type: 'skill-md',
      description:
        'Explains Cypress tests and provides feedback on their quality.',
      url: 'https://github.com/cypress-io/ai-toolkit/tree/main/skills/cypress-explain',
    },
  ]

  const skillsIndex = {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: skills,
  }

  const dir = path.join(distRoot, '.well-known', 'agent-skills')

  fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(
    path.join(dir, 'index.json'),
    JSON.stringify(skillsIndex, null, 2),
    'utf8'
  )
}
