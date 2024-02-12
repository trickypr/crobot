import { Client, type GuildMember, IntentsBitField } from 'discord.js'
import { config } from 'dotenv'
import registerCommands from './command-registry'

export async function initDiscord(): Promise<Client<true>> {
  return await new Promise((resolve, reject) => {
    config({ path: '.env' })

    const client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
      ],
    })
    client.maintainers = new Set<GuildMember>()

    void registerCommands(client)

    client.on('ready', () => {
      console.log(
        `Logged into discord as ${client.user?.tag ?? 'USER IS NULL'}!`,
      )

      const maintainerIds = process.env.MAINTAINERS?.split(',') ?? []
      const serverId = process.env.CSSA_SERVER
      if (serverId === undefined) {
        reject(new Error('CSSA_SERVER in .env is undefined'))
      } else {
        client.guilds
          .fetch(serverId)
          .then((server) => {
            for (const maintainerId of maintainerIds) {
              server.members
                .fetch(maintainerId)
                .then((maintainer) => {
                  client.maintainers.add(maintainer)
                })
                .catch(console.error)
            }
          })
          .catch(console.error)
      }

      resolve(client)
    })

    client.login(process.env.DISCORD_TOKEN).catch(reject)
  })
}
