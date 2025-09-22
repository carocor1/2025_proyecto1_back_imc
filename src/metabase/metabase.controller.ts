import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, RequestWithUser } from '../middleware/auth.middleware';
import { MetabaseService } from './metabase.service';

@Controller('metabase')
export class MetabaseController {
  constructor(private readonly metabaseService: MetabaseService) {}

  @UseGuards(AuthGuard)
  @Get()
  getSignedUrl(@Req() req: RequestWithUser): { signedUrl: string } {
    return this.metabaseService.generateSignedUrl(req.user.id);
  }
}
