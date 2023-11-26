import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "users"} )
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: false })
  status: boolean;
}
