"use client";
import { useCallback, useState } from "react";
import { useFormControls } from "./useFormControls";
import { z } from "zod";
import { Button, Modal, ModalRoot } from "@mui/material";
import { TextAreaField } from "./TextAreaField";

const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle };
};

export const SampleForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isSubmitting },
    control,
    serverErrorMessage,
  } = useFormControls({
    schema: z.object({
      message: z
        .string()
        .min(150, { message: "150文字以上必須です" })
        .max(2000, { message: "内容は2000文字以内で入力してください" }),
    }),
    defaultValues: {
      message: "",
    },
  });

  const { open: openCompleteModal, isOpen, close } = useDisclosure();
  const closeCompleteModal = () => {
    close();
    location.reload();
  };

  const post = async () => {
    console.log("hoge");
  };

  const onSubmit = handleSubmit(async ({ message }) => {
    await post();
  });

  return (
    <form action={"javascript:void(0)"} onSubmit={onSubmit}>
      <Modal open={isOpen} onClose={closeCompleteModal}>
        <ModalRoot>completed.</ModalRoot>
      </Modal>
      <div className={"mt-2"}>
        <TextAreaField
          label={
            <div className={"flex flex-col"}>
              <p>メッセージ</p>
              <p className={"text-sm font-normal"}>
                最低<span className={"font-bold"}>150文字</span>以上
              </p>
            </div>
          }
          rows={9}
          control={control}
          name={"message"}
        />
      </div>
      <div className={"mt-2"}>
        {/*  isLoading={isSubmitting} isDisabled={!isValid || isSubmitting} */}
        <Button
          color={"primary"}
          variant={"contained"}
          disabled={!isValid || isSubmitting}
        >
          送信する
        </Button>
        {!!serverErrorMessage && (
          <div className={"mt-2"}>
            <span className={"text-red-500 font-bold"}>
              {serverErrorMessage}
            </span>
          </div>
        )}
      </div>
    </form>
  );
};
