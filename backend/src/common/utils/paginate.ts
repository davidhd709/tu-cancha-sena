import { Paginated, PaginationDto } from '../dto/pagination.dto';

export function getSkipTake({ page, pageSize }: PaginationDto) {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

export function buildPaginated<T>(
  data: T[],
  total: number,
  { page, pageSize }: PaginationDto
): Paginated<T> {
  return { data, total, page, pageSize };
}
