import { Pagination } from "@elastic/eui";

export interface PaginationOptions {
  pageSizeOptions?: number[];
  initialPageIndex?: number;
  initialPageSize?: number;
  pageIndex: number;
  pageSize: number;
  totalItemCount?: number;
}

export const paginationBase: PaginationOptions = {
  pageSizeOptions: [10, 20, 50, 150, 200], // ← Thêm 10 ở đây
  pageIndex: 0,
  pageSize: 20,
  totalItemCount: 0,
};

