export type BudgetMode = "balanced" | "saving" | "career" | "family";

export type AccountKey =
  | "living"
  | "career"
  | "investment"
  | "learning"
  | "health"
  | "family"
  | "social"
  | "giving"
  | "future";

export interface UserSettings {
  monthlyIncomeCents: number;
  currentSavingsCents: number;
  budgetMode: BudgetMode;
  updatedAt: string;
}

export interface TransactionRecord {
  id: string;
  amountCents: number;
  accountKey: AccountKey;
  note: string;
  date: string;
  createdAt: string;
}

export interface StorageState {
  version: 1;
  settings?: UserSettings;
  transactions: TransactionRecord[];
}
