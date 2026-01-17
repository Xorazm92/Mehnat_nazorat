import {
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

const timestampTransformer = {
  to: (value?: number) => value ?? Date.now(),
  from: (value?: string | number | null) =>
    value === null || value === undefined
      ? value
      : typeof value === 'string'
        ? Number(value)
        : value,
};

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'created_at',
    type: 'bigint',
    transformer: timestampTransformer,
  })
  created_at: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
    transformer: timestampTransformer,
  })
  updated_at: number;

  @BeforeInsert()
  setCreationTimestamps() {
    const now = Date.now();
    this.created_at = now;
    this.updated_at = now;
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = Date.now();
  }
}
