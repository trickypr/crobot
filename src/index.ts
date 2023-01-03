import { initDiscord } from './discordClient'
import { DoorServer } from './doorStatus'

async function main (): Promise<void> {
  const client = await initDiscord()
  const doorServer = new DoorServer()
  doorServer.startServer(client)
}

void main()