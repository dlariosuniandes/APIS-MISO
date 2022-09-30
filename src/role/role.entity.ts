import { Role } from 'src/shared/enums/role.enum';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: Role;

  @ManyToOne(() => UserEntity, (user) => user.roles)
  user: UserEntity;
}
