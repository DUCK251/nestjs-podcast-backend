import { Episode } from './episode.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  Min,
  Max,
  IsNumber,
  IsInt,
  IsOptional,
} from 'class-validator';
import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  RelationId,
  ManyToMany,
} from 'typeorm';
import { CoreEntity } from './core.entity';
import { Review } from './review.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Podcast extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => String)
  @IsString()
  category: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsString()
  coverImage?: string;

  @Column({ default: 0 })
  @Field(type => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.podcasts, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @RelationId((podcast: Podcast) => podcast.creator)
  creatorId: number;

  @OneToMany(() => Episode, episode => episode.podcast)
  @Field(type => [Episode])
  episodes: Episode[];

  @OneToMany(() => Review, review => review.podcast)
  @Field(type => [Review])
  reviews: Review[];

  @Field(type => [User])
  @ManyToMany(() => User, user => user.subscriptions)
  subscribers: User[];

  @Column({
    select: false,
    insert: false,
    readonly: true,
    nullable: true,
  })
  @Field(type => Int, { nullable: true })
  @IsInt()
  totalSubscribers?: number;
}
