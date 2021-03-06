import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreatePodcastInput extends PickType(
  Podcast,
  ['title', 'category', 'description', 'coverImage'],
  InputType,
) {}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {
  @Field(type => Int, { nullable: true })
  id?: number;
}
