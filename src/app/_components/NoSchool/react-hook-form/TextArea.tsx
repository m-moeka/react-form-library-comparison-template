import { forwardRef } from 'react';

import type { ComponentPropsWithRef, FC } from 'react';

export type TextAreaProps = ComponentPropsWithRef<'textarea'>;

export const TextArea: FC<TextAreaProps> = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  return (
    <textarea
      {...props}
      ref={ref}
      className={
        'mt-4 block w-full rounded border border-gray-border p-4 focus:border-primary-main/70 focus:outline-none focus:ring-1 focus:ring-primary-main/70 disabled:bg-gray-notice/10 disabled:text-gray-notice'
      }
    />
  );
});
