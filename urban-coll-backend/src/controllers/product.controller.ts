import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    public async addProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productData = req.body;
            const newProduct = await this.productService.createProduct(productData);
            return res.status(201).json(newProduct);
        } catch (error) {
            return res.status(500).json({ message: 'Error adding product', error });
        }
    }

    public async updateProduct(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const productData = req.body;
            const updatedProduct = await this.productService.updateProduct(id, productData);
            return res.status(200).json(updatedProduct);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating product', error });
        }
    }

    public async getProduct(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving product', error });
        }
    }

    public async getAllProducts(req: Request, res: Response): Promise<Response> {
        try {
            const products = await this.productService.getAllProducts();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving products', error });
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.productService.deleteProduct(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting product', error });
        }
    }
}