export enum TxnType {
  mint = 'MINT',
  increaseStake = 'INCREASE_STAKE',
  transfer = 'TRANSFER',
  claim = 'CLAIM',
  withdraw = 'WITHDRAW',
}

export enum TxnStatus {
  Ready = 'READY',
  Initiated = 'INITIATED',
  PendingApproval = 'PENDING_APPROVAL',
  PendingOnChain = 'PENDING_ON_CHAIN',
  Mined = 'MINED',
  Failed = 'FAILED',
}

export interface TxnDetails {
  type?: TxnType;
  status?: TxnStatus;
  description?: string;
  hash?: string;
}

export type TransactionList = TxnDetails[];

export type CurrentTransactions = { [key in TxnType]: TxnDetails };

export type TxnState = {
  current: CurrentTransactions;
  saved: TransactionList;
};

export type TransferCrucible = {
  (crucibleId: string, transferTo: string): Promise<any>;
};

export interface UseTransactions {
  transactions: TxnState;
  clearSavedTransactions: () => void;
  pendingTransactions: TransactionList;
  completedTransactions: TransactionList;
  transferCrucible: TransferCrucible;
}
