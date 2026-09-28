import { Module } from '@nestjs/common';
import { ProductsService } from './application/products.service.js';
import { ProductsController } from './api/products.controller.js';
import { ProductRepository } from './domain/product.repository.js';
import { InMemoryProductRepository } from './infrastructure/in-memory-product.repository.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, { provide: ProductRepository, useClass: InMemoryProductRepository }],
})
export class CatalogModule {}
