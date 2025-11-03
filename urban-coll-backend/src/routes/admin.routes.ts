import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const adminController = new AdminController();

// Route to get all users
router.get('/users', adminController.getAllUsers);

// Route to get a specific user by ID
router.get('/users/:id', adminController.getUserById);

// Route to create a new user
router.post('/users', adminController.createUser);

// Route to update a user
router.put('/users/:id', adminController.updateUser);

// Route to delete a user
router.delete('/users/:id', adminController.deleteUser);

// Route to get all vendors
router.get('/vendors', adminController.getAllVendors);

// Route to get a specific vendor by ID
router.get('/vendors/:id', adminController.getVendorById);

// Route to create a new vendor
router.post('/vendors', adminController.createVendor);

// Route to update a vendor
router.put('/vendors/:id', adminController.updateVendor);

// Route to delete a vendor
router.delete('/vendors/:id', adminController.deleteVendor);

export default router;