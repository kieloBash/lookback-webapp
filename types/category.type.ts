import { Category } from "@prisma/client";
import { FullItemType } from "./invoice.type";

export type FullCategoryType = Category & {
  items: FullItemType[];
};
