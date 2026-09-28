/**
 * Ошибки доменного слоя не знают про HTTP — в статус их переводит глобальный фильтр.
 */
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(
    readonly entity: string,
    readonly id: string,
  ) {
    super(`${entity} с идентификатором «${id}» не найден`);
  }
}
