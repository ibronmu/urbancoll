import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const userData = req.body;
            const newUser = await this.authService.register(userData);
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }

    public async getUserProfile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user.id; // Assuming user ID is set in req.user by auth middleware
            const userProfile = await this.authService.getUserProfile(userId);
            return res.status(200).json(userProfile);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}