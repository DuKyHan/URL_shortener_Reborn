import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlService } from 'apps/url-shortener/src/url/url.service';
import { Public } from 'apps/url-shortener/src/user/decorators';
import { Response } from 'express';

@Controller()
export class UrlRedirectController {
  constructor(private urlService: UrlService) {}

  @Public()
  @Get(':hash')
  async redirect(@Res() res: Response, @Param('hash') hash: string) {
    const url = await this.urlService.getLongUrl(hash);
    res.redirect(url);
  }
}
