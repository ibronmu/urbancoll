import { UserRepository } from '../repositories/user.repo';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { User } from '../models/index';
import { Request, Response } from 'express';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(userData: User): Promise<User> {
        const hashedPassword = await hash(userData.password, 10);
        userData.password = hashedPassword;
        return this.userRepository.create(userData);
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findByEmail(email);
        if (user && await compare(password, user.password)) {
            const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return token;
        }
        return null;
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}