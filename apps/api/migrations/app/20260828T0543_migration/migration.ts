#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3763d505c15157b773c12b18340d93eca732599ced1128c8ba37d267c970d412/contract';
import endContract from '../../snapshots/3763d505c15157b773c12b18340d93eca732599ced1128c8ba37d267c970d412/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8dd3da8c39331e4b721af44c8995ec91a0bbcb06e0a82c2aa640b57ba4dff1cb/contract';
import startContract from '../../snapshots/8dd3da8c39331e4b721af44c8995ec91a0bbcb06e0a82c2aa640b57ba4dff1cb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'games',
        column: col('slug', 'text', {
          notNull: true,
          default: lit('change-me'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'games',
        constraint: 'games_slug_key',
        columns: ['slug'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
