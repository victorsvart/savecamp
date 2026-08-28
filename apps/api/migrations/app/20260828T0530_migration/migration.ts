#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8dd3da8c39331e4b721af44c8995ec91a0bbcb06e0a82c2aa640b57ba4dff1cb/contract';
import endContract from '../../snapshots/8dd3da8c39331e4b721af44c8995ec91a0bbcb06e0a82c2aa640b57ba4dff1cb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'camp_members',
        columns: [
          col('campId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('memberId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'camps',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('creatorId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('gameId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'game_camp_saves',
        columns: [
          col('campId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('data', 'json', {
            notNull: true,
            default: lit('{}'),
            codecRef: { codecId: 'pg/json@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'games',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('logoURL', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'camp_members',
        constraint: 'camp_members_campId_memberId_key',
        columns: ['campId', 'memberId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'camps',
        constraint: 'camps_gameId_creatorId_key',
        columns: ['gameId', 'creatorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'camp_members',
        index: 'camp_members_campId_idx_1810cca2',
        columns: ['campId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'camp_members',
        index: 'camp_members_memberId_idx_76b3c263',
        columns: ['memberId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'camps',
        index: 'camps_creatorId_idx_3a77d800',
        columns: ['creatorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'camps',
        index: 'camps_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'game_camp_saves',
        index: 'game_camp_saves_campId_idx_1810cca2',
        columns: ['campId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'camp_members',
        foreignKey: {
          name: 'camp_members_campId_fkey',
          columns: ['campId'],
          references: { schema: 'public', table: 'camps', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'camp_members',
        foreignKey: {
          name: 'camp_members_memberId_fkey',
          columns: ['memberId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'camps',
        foreignKey: {
          name: 'camps_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'games', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'camps',
        foreignKey: {
          name: 'camps_creatorId_fkey',
          columns: ['creatorId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'game_camp_saves',
        foreignKey: {
          name: 'game_camp_saves_campId_fkey',
          columns: ['campId'],
          references: { schema: 'public', table: 'camps', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
