import { UserRepository } from '../repositories/user.repo';
import { VendorRepository } from '../repositories/vendor.repo';

export class AdminService {
    private userRepository: UserRepository;
    private vendorRepository: VendorRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.vendorRepository = new VendorRepository();
    }

    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    async getUserById(userId: string) {
        return await this.userRepository.findById(userId);
    }

    async deleteUser(userId: string) {
        return await this.userRepository.delete(userId);
    }

    async getAllVendors() {
        return await this.vendorRepository.findAll();
    }

    async getVendorById(vendorId: string) {
        return await this.vendorRepository.findById(vendorId);
    }

    async deleteVendor(vendorId: string) {
        return await this.vendorRepository.delete(vendorId);
    }
}