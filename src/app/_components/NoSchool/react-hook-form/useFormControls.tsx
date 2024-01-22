import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm as useOriginalHook } from "react-hook-form";

import { usePreventDirtyFormReload } from "./usePreventDirtyFormReload";
import { isErrorResponse as isValidationError } from "./errorResponseParser";
import type { z } from "zod";
import axios from "axios";

type FormProps<TFieldValues extends FieldValues> = {
  schema: z.ZodSchema<TFieldValues>;
  defaultValues: UseFormProps<TFieldValues>["defaultValues"];
  preventReload?: boolean;
};
type FormReturn<TFieldValues extends FieldValues> =
  UseFormReturn<TFieldValues> & {
    serverErrorMessage: string;
  };

/**
 * @param schema
 * @param defaultValues
 * @param preventReload
 */
export function useFormControls<TFieldValues extends FieldValues>({
  schema,
  defaultValues,
  preventReload = false,
}: FormProps<TFieldValues>): FormReturn<TFieldValues> {
  const [errorMessage, setErrorMessage] = useState("");
  const { isEnabled, enablePreventReload, disablePreventReload } =
    usePreventDirtyFormReload();

  const methods = useOriginalHook<TFieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onServerError = useCallback(
    (error: Error) => {
      const defaultErrorMessage =
        "エラーが発生しました。時間を空けて再度お試しください。";

      if (!axios.isAxiosError(error)) {
        setErrorMessage(defaultErrorMessage);
        return;
      }
      // バリデーションエラーの場合は、対応するフォーム要素にエラー内容をセット
      if (isValidationError(error)) {
        // 省略
        return;
      }

      // 以下割愛

      setErrorMessage(defaultErrorMessage);
    },
    [methods],
  );

  // preventReload=trueで且つ、フォーム入力中の場合にブラウザバックや画面リロードを防ぐ
  if (preventReload && !isEnabled && methods.formState.isDirty) {
    enablePreventReload();
  }
  if (preventReload && isEnabled && !methods.formState.isDirty) {
    disablePreventReload();
  }

  return {
    ...methods,
    handleSubmit: useCallback(
      (onSubmit) =>
        methods.handleSubmit(async (data, e) => {
          if (preventReload) {
            methods.reset(undefined, { keepValues: true }); // 離脱防止処理を解除
          }

          // @ts-ignore
          await onSubmit(data, e).catch(onServerError);
        }),
      [methods, preventReload],
    ),
    serverErrorMessage: errorMessage,
  };
}
