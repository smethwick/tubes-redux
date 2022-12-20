import type { ConnectionInfo, IrcMessageEvent } from '$lib/Chat/provider+connection';
import Dexie, { type Table } from 'dexie';

export interface Network {
  id?: number;
  name: string;
  provider_id: string;
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
      networks: '++id, name, conn_blueprint, provider_id',
      messages: "++id, origin",
    });
  }
}

export const db = new TubesDatabase();
