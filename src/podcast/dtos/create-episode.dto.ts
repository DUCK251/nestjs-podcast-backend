import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { Episode } from '../entities/episode.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreateEpisodeInput extends PickType(
  Episode,
  ['title', 'category', 'audioURL'],
  InputType,
) {
  @Field(type => Int)
  @IsInt()
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {
  @Field(type => Int, { nullable: true })
  id?: number;
}
