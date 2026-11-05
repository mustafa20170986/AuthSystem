import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupDto } from 'dto/credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}
  @Post('SignUp')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async Signup(@Body() dto: SignupDto) {
    return this.authservice.SignUp(dto);
  }
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async Sigin(@Request() req, @Body() dto: SignupDto) {
    return this.authservice.Signin(req.user);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role('admin')
  @Get('admin')
  getadmin() {
    return this.getadmin();
  }
}
