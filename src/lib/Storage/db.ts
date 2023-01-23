import type { ConnectionInfo } from '$lib/Chat/provider+connection';
import Dexie, { type Table } from 'dexie';
import type { Message } from './messages';

export interface Network {
  id?: number;
  name: string;
  provider_id: string;
  /** Used to generate a new `Connection` when the app starts up */
  conn_blueprint: ConnectionInfo;
}

export class TubesDatabase extends Dexie {
  networks!: Table<Network>;
  messages!: Table<Message>;

  constructor() {
    super('TubesDB');
    this.version(1).stores({
      networks: '++id, name, conn_blueprint, provider_id',
      messages: "++id, origin, target, source, type, timestamp, command",
    });
  }
}

export const db = new TubesDatabase();
