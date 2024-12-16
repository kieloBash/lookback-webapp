"use client";
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface IProps {
  control: any;
  name: string;
  label: string;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
}

const FormTextArea = ({
  control,
  name,
  label,
  disabled = false,
  placeholder = "Please Enter...",
  description
}: IProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid gap-2 w-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea
                className="max-h-[14rem] w-full"
                disabled={disabled}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormTextArea;
