import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { IUsuarioRepository } from "./usuario-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ){

    }
    findOne(id: number): Promise<User | null> {
        const user = this.userRepository.findOneBy({id});
        return user;
    }
    findByEmail(email: string): Promise<User | null> {
        const user = this.userRepository.findOneBy({email});
        return user;
    }
    create(userData: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    update(id: number, updateData: UpdateUserDto): Promise<User> {
        const body = {...updateData};
        this.userRepository.update(id, body);
        return this.findOne(id) as Promise<User>;
    }
    
}