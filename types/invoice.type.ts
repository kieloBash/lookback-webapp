import {
  Category,
  Item,
  Transaction,
  TransactionItem,
  User,
  UserRole,
} from "@prisma/client";

export type FullItemType = Item & {
  category: Category;
};

export type FullTransactionItem = TransactionItem & {
  item: FullItemType;
};

export type FullInvoiceType = Transaction & {
  user: User;
  items: FullTransactionItem[];
};
