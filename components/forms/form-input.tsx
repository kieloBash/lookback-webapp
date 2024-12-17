"use client";

import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "file" | "number" | "email" | "password" | "date" | "time";
  disabled?: boolean;
  required?: boolean;
  className?: string;
  visible?: boolean;
}

export const FormInput = ({
  control,
  name,
  label,
  placeholder = "Enter...",
  type = "text",
  description,
  disabled = false,
  required = false,
  visible = true,
  className,
}: IProps) => {
  const [hidden, setHidden] = useState(!visible);
  const CLASS_NAME = clsx(className, type === "password" ? "pr-8" : "");

  useEffect(() => {
    setHidden(visible);
  }, [visible]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex gap-2 justify-center items-center w-full relative">
              <Input
                required={required}
                disabled={disabled}
                className={CLASS_NAME}
                placeholder={placeholder}
                type={
                  type === "password" ? (hidden ? "password" : "text") : type
                }
                {...field}
                value={type === "number" ? field.value ?? "" : field.value}
                onChange={(e) =>
                  field.onChange(
                    type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                  )
                }
              />
              {type === "password" && (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="absolute right-0 z-10"
                  type="button"
                  onClick={() => setHidden((prev) => !prev)}
                >
                  {hidden ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
