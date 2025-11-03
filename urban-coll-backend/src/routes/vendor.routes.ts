import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';

const router = Router();
const vendorController = new VendorController();

// Route to add a new vendor
router.post('/', vendorController.addVendor);

// Route to update vendor information
router.put('/:id', vendorController.updateVendor);

// Route to get vendor information
router.get('/:id', vendorController.getVendor);

// Route to get all vendors
router.get('/', vendorController.getAllVendors);

// Route to delete a vendor
router.delete('/:id', vendorController.deleteVendor);

export default router;