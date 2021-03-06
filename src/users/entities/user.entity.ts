import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 1,
  EDITOR = 2,
  USER = 3,
}

export enum UserStatus {
  DISABLE = 0,
  PENDING = 1,
  ACTIVE = 2,
}

@Entity()
export class User {
  @ObjectIdColumn()
  @Transform((id: ObjectID) => id.toHexString(), { toPlainOnly: true })
  id: ObjectID;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password should contain at least one digit, one lowercase, one uppercase and one special character',
    },
  )
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: string;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: string;

  @BeforeInsert()
  beforeInsertActions() {
    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;

    // Set default value if value is null
    if (!this.role) {
      this.role = UserRole.USER;
    }
    if (!this.status) {
      this.status = UserStatus.ACTIVE;
    }
  }
}
