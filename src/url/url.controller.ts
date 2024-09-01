import { Body, Controller, Post } from '@nestjs/common';
import { ReqContext, RequestContext } from 'src/common/request-context';
import { ShortenUrlInputDto } from 'src/url/dto/shorten-url.input.dto';
import { UrlService } from 'src/url/url.service';

@Controller('url')
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(
    @ReqContext() context: RequestContext,
    @Body() dto: ShortenUrlInputDto,
  ) {
    return this.urlService.shortenUrl(context.user, dto);
  }
}
