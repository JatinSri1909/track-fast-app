
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: {
    field?: string;
    message?: string;
  }[];
}

export interface ApiError extends Error {
  response?: {
    data: ApiErrorResponse;
    status: number;
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    if (apiError.response?.data) {
      if (apiError.response.data.details?.length) {
        return apiError.response.data.details
          .map(detail => detail.message)
          .join(", ");
      }
      return apiError.response.data.message;
    }
    return apiError.message;
  }
  return "An unexpected error occurred";
} 