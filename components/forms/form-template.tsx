"use client";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface IProps {
  children: React.ReactNode;
  form: any;
  FormSchema: any;
  handleSubmit: (data: any) => void;
  submit_label?: string;
  disabled?: boolean;
  hasCancel?: boolean;
  hasSubmit?: boolean;
  handleClose?: () => void;
  buttonClassName?: string
}

export function FormTemplate({
  children,
  form,
  FormSchema,
  handleSubmit,
  submit_label = "Submit",
  disabled = false,
  hasCancel = false,
  hasSubmit = true,
  handleClose,
  buttonClassName = ""
}: IProps) {
  function onSubmit(data: z.infer<typeof FormSchema>) {
    handleSubmit(data);
  }

  const BUTTON_CLASSNAME = clsx("w-full", buttonClassName)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {children}
        <div className="flex justify-center items-center gap-2">
          {hasCancel && (
            <Button
              variant={"outline"}
              type="button"
              onClick={handleClose}
              className="w-full"
            >
              Cancel
            </Button>
          )}
          {hasSubmit &&
            <Button
              type="submit"
              className={BUTTON_CLASSNAME}
              disabled={disabled || !form.formState.isDirty}
            >
              {submit_label}{" "}
              {disabled && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
            </Button>
          }
        </div>
      </form>
    </Form>
  );
}
