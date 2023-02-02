import type { IrcMessageEvent } from '$lib/Chat/provider+connection';
import { db } from './db';
import type { Source } from '$lib/Chat/Providers/common';

export enum MessageTypes {
  PrivMsg,
  Join,
  Part,
  Invalid,
  Quit,
}

export interface Message {
  id?: number;
  network: string;
  command: string;
  type: MessageTypes;

  source?: Source;
  target: string | "Server";
  content?: string;

  timestamp: Date;

  origin: IrcMessageEvent;
}

export async function saveMessage(net: string, e: IrcMessageEvent) {
  const acceptable_commands = [
    'privmsg', 'join', 'part', 'quit', 'notice'
  ]

  if (!acceptable_commands.includes(e.command.toLowerCase())) return

  let m = await turnIntoSomethingUseful(net, e);

  if (!m) m = {
    ...sensible_defaults(net, e),
    target: e.params[0] ?? "Server",
    type: MessageTypes.Invalid,
  }

  await db.messages.add(m);
}

export const sensible_defaults = (net: string, e: IrcMessageEvent) => ({
  timestamp: e.timestamp,
  command: e.command,
  source: e.source,
  network: net,
  origin: e,
})

async function turnIntoSomethingUseful(net: string, e: IrcMessageEvent): Promise<Message | undefined> {
  switch (e.command.toLowerCase()) {
    case 'privmsg':
      if (!e.source || !e.params[0] || !e.params[1]) return
      return {
        ...sensible_defaults(net, e),
        type: MessageTypes.PrivMsg,
        target: e.params[0],
        content: e.params[1],
      }
    case 'join':
      if (!e.source || !e.params[0]) return
      return {
        ...sensible_defaults(net, e),
        type: MessageTypes.Join,
        target: e.params[0],
      }
    case 'part':
      if (!e.source) return
      return {
        ...sensible_defaults(net, e),
        type: MessageTypes.Part,
        content: e.params[e.params.length - 1],
        target: e.params[0],
      }
    case 'quit':
      if (!e.source || !e.params[0]) return
      return {
        ...sensible_defaults(net, e),
        type: MessageTypes.Quit,
        content: e.params[e.params.length - 1],
        target: e.params[0],
      }
  }
}