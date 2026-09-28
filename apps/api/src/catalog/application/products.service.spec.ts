import type { Product } from '@catalog/contracts';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, test } from 'vitest';
import { EntityNotFoundError } from '../../common/errors/domain.error.js';
import { ProductFilter, ProductRepository } from '../domain/product.repository.js';
import { ProductsService } from './products.service.js';

const LAPTOP: Product = {
  id: 'lp-01',
  title: 'Ноутбук Vector 14 Pro',
  category: 'laptops',
  price: 129990,
  characteristics: { Вес: '1.24 кг' },
};

class FakeProductRepository extends ProductRepository {
  lastFilter: ProductFilter | null = null;

  constructor(private readonly items: Product[]) {
    super();
  }

  findAll(filter: ProductFilter): Promise<Product[]> {
    this.lastFilter = filter;

    return Promise.resolve(this.items);
  }

  findById(id: string): Promise<Product | null> {
    return Promise.resolve(this.items.find((item) => item.id === id) ?? null);
  }
}

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: FakeProductRepository;

  beforeEach(async () => {
    repository = new FakeProductRepository([LAPTOP]);

    const moduleRef = await Test.createTestingModule({
      providers: [ProductsService, { provide: ProductRepository, useValue: repository }],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  test('список возвращается в конверте с количеством', async () => {
    await expect(service.list({})).resolves.toEqual({ items: [LAPTOP], total: 1 });
  });

  test('фильтр передаётся в репозиторий без изменений', async () => {
    await service.list({ category: 'laptops', search: 'vector' });

    expect(repository.lastFilter).toEqual({ category: 'laptops', search: 'vector' });
  });

  test('товар отдаётся по идентификатору', async () => {
    await expect(service.getById('lp-01')).resolves.toEqual(LAPTOP);
  });

  test('для неизвестного идентификатора бросается доменная ошибка', async () => {
    await expect(service.getById('lp-99')).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});
