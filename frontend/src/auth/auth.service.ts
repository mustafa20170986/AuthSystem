import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from 'dto/credentials.dto';
import { Model } from 'mongoose';
import { User } from 'schema/crednetials.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly JwtService: JwtService,
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async SignUp(dto: SignupDto) {
    //find if a user with same email exist
    const User = await this.UserModel.findOne({ email: dto.email });
    if (User) {
      throw new Error('user with this email already exist');
    }
    // hash the password
    const hashpassword = await bcrypt.hash(dto.password, 10);

    //cretae user
    const createuser = await this.UserModel.create({
      ...dto,
      //store the hashed password
      password: hashpassword,
    });
    //generate payload
    const payload = {
      sub: createuser.id,
      email: createuser.email,
    };
    //sign payload
    return {
      access_token: this.JwtService.sign(payload),
      user: {
        email: createuser.email,
        role: createuser.role,
      },
    };
  }

  //option  for signin

  async ValidateUser(email: string, password: string) {
    const user = await this.UserModel.findOne({ email: email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // return user without password
    const { password: userPassword, ...result } = user.toObject();
    return result;
  }
  //login user
  async Signin(user: any) {
    const payload = { sub: user._id, email: user.email, role: user.role };

    console.log(user);

    return {
      message: 'signin success',
      access_token: this.JwtService.sign(payload),
      user: {
        email: user.email,
        role: user.role,
        sub: user._id,
      },
    };
  }

  //admin route
  async admin(user: 'admin') {
    return { message: ' welcome admin' };
  }
}
