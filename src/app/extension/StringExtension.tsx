export {};

// Khai báo một module ambient để mở rộng String
declare global {
  interface String {
    isNullOrEmpty(): boolean;
  }
}

String.prototype.isNullOrEmpty = function (): boolean {
  return this == null || this.trim() === "" || this.length < 1;
};

/**
 * Kiểm tra một chuỗi có null hoặc rỗng không
 * @param input Chuỗi cần kiểm tra
 */
export function isNullOrEmpty(input?: string): boolean {
  return (
    input === undefined ||
    input === null ||
    input.trim() === "" ||
    input.length < 1
  );
}

/**
 * Kiểm tra giá trị có null hoặc undefined không
 * @param input Giá trị bất kỳ
 */
export function isNullOrUndefined<T>(input?: T): boolean {
  return input === undefined || input === null;
}

/**
 * Kiểm tra mảng có null, undefined hoặc rỗng không
 * @param input Mảng bất kỳ
 */
export function isNullOrUndefinedArray<T>(input?: T[]): boolean {
  return input === undefined || input === null || input.length < 1;
}
