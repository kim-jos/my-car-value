import { UseGuards, Session, Get, Body, Post, Patch, Delete, Controller, Param, Query, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoami(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        console.log('body', body);
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        console.log('session', session);
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running')
        const user = await this.usersService.findOne(Number(id));
        if (!user) throw new NotFoundException('user not found')
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email)
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(Number(id), body)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        this.usersService.remove(Number(id));
    }
}
