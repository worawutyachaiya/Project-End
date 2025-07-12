// lib/error-handler.ts
export class APIError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return { error: error.message, statusCode: error.statusCode };
  }
  
  console.error('Unexpected error:', error);
  return { error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด', statusCode: 500 };
}