import { Body, Controller, HttpException, HttpStatus, Post, Req, Session, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginDTO, UserDTO } from "src/user/user.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { RoleService } from "src/role/role.service";
import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "./roles.guard";
import { Roles } from "./roles.decorator";

@Controller('auth')
export class AuthController{
    constructor(
        private authservice: AuthService,
        private roleservice: RoleService
    ){}

    // @Roles('Hr')
    // @UseGuards(RolesGuard)
    // @UseGuards(AuthGuard)
    @Post('signup')
    @UseInterceptors(FileInterceptor('myfile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 600000 },
            storage: diskStorage({
                destination: './upload',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UsePipes(new ValidationPipe)
    async addUser(@Body() userinfo: UserDTO, @UploadedFile() myfile: Express.Multer.File): Promise<UserDTO> {
        const role = await this.roleservice.getRoleById(userinfo.role);
        // console.log(role);
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(userinfo.password, salt);
        userinfo.password = hashedpassword;
        userinfo.filename = myfile.filename;
        return this.authservice.signup(userinfo);
    }

    @Post('signin')
    @UsePipes(new ValidationPipe)
    async signin(@Body() logindata: loginDTO, @Session() session) {

        const result = await this.authservice.signin(logindata);
        if (result) {
            session.username = logindata.username;
            console.log(session.username);
            return result;
        }
        else {
            throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post('/signout')
    signout(@Req() req) {
        if (req.session.destroy()) {
            return true;
        }
        else {
            throw new UnauthorizedException("invalid actions");
        }

    }
}