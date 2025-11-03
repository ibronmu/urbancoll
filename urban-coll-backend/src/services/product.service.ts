import { ProductRepository } from '../repositories/product.repo';
import { Product } from '../models/index';

export class ProductService {
    private productRepo: ProductRepository;

    constructor() {
        this.productRepo = new ProductRepository();
    }

    async createProduct(productData: Product): Promise<Product> {
        return await this.productRepo.create(productData);
    }

    async updateProduct(productId: string, productData: Partial<Product>): Promise<Product | null> {
        return await this.productRepo.update(productId, productData);
    }

    async getProductById(productId: string): Promise<Product | null> {
        return await this.productRepo.findById(productId);
    }

    async getAllProducts(): Promise<Product[]> {
        return await this.productRepo.findAll();
    }

    async deleteProduct(productId: string): Promise<boolean> {
        return await this.productRepo.delete(productId);
    }
}