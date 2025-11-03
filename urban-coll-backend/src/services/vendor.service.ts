import { VendorRepository } from '../repositories/vendor.repo';

export class VendorService {
    private vendorRepository: VendorRepository;

    constructor() {
        this.vendorRepository = new VendorRepository();
    }

    async createVendor(vendorData: any) {
        return await this.vendorRepository.create(vendorData);
    }

    async updateVendor(vendorId: string, vendorData: any) {
        return await this.vendorRepository.update(vendorId, vendorData);
    }

    async getVendorById(vendorId: string) {
        return await this.vendorRepository.findById(vendorId);
    }

    async getAllVendors() {
        return await this.vendorRepository.findAll();
    }

    async deleteVendor(vendorId: string) {
        return await this.vendorRepository.delete(vendorId);
    }
}