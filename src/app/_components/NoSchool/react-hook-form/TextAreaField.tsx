import { FieldValues, useController } from "react-hook-form";
import { TextArea } from "./TextArea";
import { FormItemProps, FormItemWrapper } from "./FormItemWrapper";

type TextAreaFieldProps<T extends FieldValues> = FormItemProps<T> & {
  maxLength?: number;
  rows?: number;
  placeholder?: string;
};

export const TextAreaField = <T extends FieldValues>({
  control,
  name,
  maxLength,
  rows,
  placeholder,
  ...meta
}: TextAreaFieldProps<T>) => {
  const { field } = useController({ name, control });

  return (
    <FormItemWrapper control={control} name={name} {...meta}>
      <TextArea
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        {...field}
      />
    </FormItemWrapper>
  );
};
