import { Request, Response } from 'express';
import { VendorService } from '../services/vendor.service';

export class VendorController {
    private vendorService: VendorService;

    constructor() {
        this.vendorService = new VendorService();
    }

    public async addVendor(req: Request, res: Response): Promise<Response> {
        try {
            const vendorData = req.body;
            const newVendor = await this.vendorService.createVendor(vendorData);
            return res.status(201).json(newVendor);
        } catch (error) {
            return res.status(500).json({ message: 'Error adding vendor', error });
        }
    }

    public async updateVendor(req: Request, res: Response): Promise<Response> {
        try {
            const vendorId = req.params.id;
            const vendorData = req.body;
            const updatedVendor = await this.vendorService.updateVendor(vendorId, vendorData);
            return res.status(200).json(updatedVendor);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating vendor', error });
        }
    }

    public async getVendor(req: Request, res: Response): Promise<Response> {
        try {
            const vendorId = req.params.id;
            const vendor = await this.vendorService.getVendorById(vendorId);
            return res.status(200).json(vendor);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving vendor', error });
        }
    }

    public async getAllVendors(req: Request, res: Response): Promise<Response> {
        try {
            const vendors = await this.vendorService.getAllVendors();
            return res.status(200).json(vendors);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving vendors', error });
        }
    }
}