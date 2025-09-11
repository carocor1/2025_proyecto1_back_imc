import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";

export interface IUsuarioRepository {
    findOne(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: CreateUserDto): Promise<User>;
    update(id: number, updateData: UpdateUserDto): Promise<User>;
}