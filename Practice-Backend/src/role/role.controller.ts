import { Controller, Post, Get, Param, Body, UseGuards } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDTO } from "./role.dto";
import { Roles } from "src/auth/roles.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    // @Roles('Admin')
    // @UseGuards(RolesGuard)
    // @UseGuards(AuthGuard)
    @Post('/addrole')
    async createRole(@Body() createRoleDto: CreateRoleDTO) {
        return await this.roleService.createRole(createRoleDto);
    }

    @Roles('Admin', 'Hr')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Get('/showrole')
    async getAllRoles() {
        return await this.roleService.getRoles();
    }

    @Roles('Admin')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Get(':id')
    async getRoleById(@Param('id') id: number) {
        return await this.roleService.getRoleById(id);
    }
}
