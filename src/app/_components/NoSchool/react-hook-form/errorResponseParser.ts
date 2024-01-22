import axios from "axios";

/**
 * バリデーションエラー時のレスポンスの型と、それに対する処理をまとめる
 */
export type ErrorDetail = {
  [key in string]: string[];
};

export type ErrorResponse = Readonly<{
  response: {
    data: {
      message: string;
      errors?: ErrorDetail;
    };
    status: number;
  };
}>;

export type CustomValidationError = {
  response: {
    data: {
      custom_message: string;
    };
  };
};

export const isErrorResponse = (arg: any): arg is ErrorResponse => {
  return (
    arg !== null &&
    !!arg.response &&
    !!arg.response.data &&
    arg.response.status === 422
  );
};

// API側でCustomValidationExceptionとしてスローしているエラー
export const isCustomValidationError = (
  arg: unknown,
): arg is CustomValidationError => {
  return true;
};

export const getErrorMessage = (
  error: Error,
  defaultErrorMessage: string = "エラーが発生しました",
) => {
  if (!axios.isAxiosError(error)) {
    return defaultErrorMessage;
  }

  // カスタムバリデーションエラー
  if (isCustomValidationError(error)) {
    return error.response.data.custom_message as string;
  }

  return defaultErrorMessage;
};
