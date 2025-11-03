import { Request, Response } from 'express';
import AdminService from '../services/admin.service';

class AdminController {
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await AdminService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving users', error });
        }
    }

    async getAllVendors(req: Request, res: Response) {
        try {
            const vendors = await AdminService.getAllVendors();
            res.status(200).json(vendors);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving vendors', error });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            await AdminService.deleteUser(userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }

    async deleteVendor(req: Request, res: Response) {
        const { vendorId } = req.params;
        try {
            await AdminService.deleteVendor(vendorId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting vendor', error });
        }
    }
}

export default new AdminController();