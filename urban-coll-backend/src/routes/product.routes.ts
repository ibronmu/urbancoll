import { Router } from 'express';
import ProductController from '../controllers/product.controller';

const router = Router();
const productController = new ProductController();

// Route to get all products
router.get('/', productController.getAllProducts);

// Route to get a single product by ID
router.get('/:id', productController.getProductById);

// Route to create a new product
router.post('/', productController.createProduct);

// Route to update an existing product
router.put('/:id', productController.updateProduct);

// Route to delete a product
router.delete('/:id', productController.deleteProduct);

export default router;