import type { ConnectionInfo, IrcMessageEvent } from '$lib/Chat/provider+connection';
import Dexie, { type Table } from 'dexie';

export interface Network {
  id?: number;
  name: string;
  /** Used to generate a new `Connection` when the app starts up */
  conn_blueprint: ConnectionInfo;
}

export interface Message {
  id?: number;
  origin: IrcMessageEvent;
}

export class TubesDatabase extends Dexie {
  networks!: Table<Network>;
  messages!: Table<Message>;

  constructor() {
    super('TubesDB');
    this.version(1).stores({
      networks: '++id, name, conn_blueprint',
      messages: "++id, origin",
    });
  }
}

export const db = new TubesDatabase();
