import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Podcast } from '../entities/podcast.entity';

@ObjectType()
export class GetAllPodcastsOutput extends PaginationOutput {
  @Field(type => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}

@InputType()
export class GetAllPodcastsInput extends PaginationInput {
  @Field(type => String, { nullable: true })
  category?: string;
}
