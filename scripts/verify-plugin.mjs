import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

const readJson = async (path) => JSON.parse(await readFile(join(root, path), 'utf8'))

const codexMarketplace = await readJson('.agents/plugins/marketplace.json')
const claudeMarketplace = await readJson('.claude-plugin/marketplace.json')
const codexPlugin = await readJson('plugins/luthn-cloud/.codex-plugin/plugin.json')
const claudePlugin = await readJson('plugins/luthn-cloud/.claude-plugin/plugin.json')
const mcp = await readJson('plugins/luthn-cloud/.mcp.json')

assert.equal(codexMarketplace.name, 'luthn')
assert.equal(codexMarketplace.plugins.length, 1)
assert.equal(codexMarketplace.plugins[0].name, 'luthn-cloud')
assert.equal(codexMarketplace.plugins[0].source.path, './plugins/luthn-cloud')
assert.equal(codexMarketplace.plugins[0].policy.installation, 'AVAILABLE')
assert.equal(codexMarketplace.plugins[0].policy.authentication, 'ON_INSTALL')

assert.equal(claudeMarketplace.name, 'luthn')
assert.equal(claudeMarketplace.plugins.length, 1)
assert.equal(claudeMarketplace.plugins[0].source, './plugins/luthn-cloud')

assert.equal(codexPlugin.name, 'luthn-cloud')
assert.equal(claudePlugin.name, 'luthn-cloud')
assert.equal(codexPlugin.version, '0.1.0')
assert.equal(claudePlugin.version, '0.1.0')
assert.equal(mcp.mcpServers['luthn-cloud'].url, 'https://app.luthn.com/mcp')

const files = []
const walk = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await walk(path)
    else files.push(path)
  }
}
await walk(root)

const forbidden = [
  /sb_(?:secret|service)_/i,
  /service[_-]?role/i,
  /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/,
  /api[_-]?key\s*[:=]\s*["'][^"']+/i,
  /\/Users\//,
  /northflank\.app/i,
  /supabase\.co\/auth\/v1/i,
]

for (const file of files) {
  const body = await readFile(file, 'utf8')
  for (const pattern of forbidden) {
    assert.doesNotMatch(body, pattern, `${relative(root, file)} contains forbidden distribution material`)
  }
}

console.log('Luthn Cloud public plugin distribution is valid.')
