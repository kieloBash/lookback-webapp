import { z } from "zod";

export const ItemSchema = z.object({
  sku: z.string().min(1, { message: "Please provide a sku!" }),
  name: z.string().min(1, { message: "Please provide a name!" }),
  description: z.optional(z.string()),

  category: z.string().min(1, { message: "Please provide a category!" }),
  categoryLabel: z.optional(z.string()),

  quantity: z.number().min(1, { message: "Minimum is 1" }),
  reorderLevel: z.number().min(0, { message: "Minimum is 0" }),
  price: z.number().min(1, { message: "Minimum is 1" }),
});

export const ItemInvoiceSchema = z.object({
  itemId: z.string().min(1, { message: "Please provide a item id!" }),
  sku: z.string().min(1, { message: "Please provide a sku!" }),
  name: z.string().min(1, { message: "Please provide a name!" }),
  category: z.string().min(1, { message: "Please provide a category!" }),
  quantity: z.number().min(1, { message: "Minimum is 1" }),
  price: z.number().min(1, { message: "Minimum is 1" }),
});

export const TransactionSchema = z.object({
  items: z.array(ItemSchema),
  currentItem: z.optional(ItemSchema),
  date: z.string().min(1, { message: "Please provide a date!" }),
});

export const RestockInventorySchema = z.object({
  item: ItemSchema,
  date: z.string().min(1, { message: "Please provide a date!" }),
});

export const InvoiceSchema = z.object({
  items: z.array(ItemInvoiceSchema),
  seller: z.string(),
  date: z.string().min(1, { message: "Please provide a date!" }),
});
