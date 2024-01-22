import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";

import type { ReactNode } from "react";

type MyControllerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
};
type FormItemWrapperProps = {
  className?: string;
  children?: ReactNode;
  label?: ReactNode;
  headerComponent?: ReactNode;
  footerRightComponent?: ReactNode;
};
export type FormItemProps<T extends FieldValues> = {
  className?: string;
  children?: ReactNode;
} & MyControllerProps<T> &
  FormItemWrapperProps;

export const FormItemWrapper = <T extends FieldValues>({
  className,
  children,
  control,
  name,
  label,
  headerComponent,
  footerRightComponent,
}: MyControllerProps<T> & FormItemWrapperProps) => {
  const {
    formState: { errors },
  } = useController({ name, control });
  const error = errors[name];

  return (
    <div className={className}>
      <div>
        <span className={"flex items-center justify-between"}>
          <span className={"flex items-center"}>
            <span>{label}</span>
          </span>
        </span>
        {headerComponent && <div className={"mt-0.5"}>{headerComponent}</div>}
        <div className={"mt-1"}>{children}</div>
      </div>
      <div className={"flex justify-between"}>
        <div>
          {!!error && "message" in error && (
            <p
              role={"alert"}
              aria-label={"" + error.message}
              className={"py-2 px-3.5 text-sm text-error"}
            >
              {`${error.message}`}
            </p>
          )}
        </div>
        {footerRightComponent}
      </div>
    </div>
  );
};
