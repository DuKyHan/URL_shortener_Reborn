import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from 'src/url/url.service';
import { Public } from 'src/user/decorators';

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
