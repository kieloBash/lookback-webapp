import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FETCH_INTERVAL = 60000 * 10;

export const FORMAT = "yyyy-MM-dd";

export const APP_NAME = "LookBack";

export const formatPricingNumber = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const generateRandomSKU = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random alphanumeric string
  const timestampPart = Date.now().toString().slice(-4); // Last 4 digits of the current timestamp
  return `SKU-${randomPart}-${timestampPart}`; // Combine for a unique SKU
};

export const generateRandomINV = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random alphanumeric string
  const timestampPart = Date.now().toString().slice(-4); // Last 4 digits of the current timestamp
  return `INV-${randomPart}-${timestampPart}`; // Combine for a unique SKU
};

export async function handlePostAxios({
  values,
  route,
  handleSuccess,
}: {
  values: any;
  route: string;
  handleSuccess: () => void;
}) {
  toast({
    title: "Please wait!",
    description:
      "Please wait while we process your request! This may take long...",
  });
  await axios
    .post(route, values)
    .then((res) => {
      toast({
        title: "Success!",
        description: res.data,
      });
      handleSuccess();
    })
    .catch((error) => {
      console.log(error);
      toast({
        title: "An error occured!",
        variant: "destructive",
        description: error.request.response,
      });
    });
}
