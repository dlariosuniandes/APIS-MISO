import { RoleEntity } from 'src/role/role.entity';
import { Role } from 'src/shared/enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  _resources: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => RoleEntity, (role) => role.user)
  roles: Role[];

  obtainUser() {
    const userObject = JSON.parse(JSON.stringify(this));
    if (this._resources) {
      userObject.resources = this.resources;
    }
    delete userObject._resources;
    return userObject;
  }

  public set resources(newResources) {
    this._resources = newResources.toString();
  }
  public get resources() {
    return this._resources ? this._resources.split(',') : undefined;
  }
}
