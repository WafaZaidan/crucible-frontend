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
  status?: TxnStatus;
  description?: string;
  hash?: string;
}

export type TxnState = {
  [key in TxnType]: TxnDetails;
};

export type TransferCrucible = {
  (crucibleId: string, transferTo: string): Promise<any>;
};

export type TransactionList = {
  type: TxnType;
  status?: TxnStatus;
  description?: string;
  hash?: string;
}[];

export interface UseTransactions {
  transactions: TxnState;
  pendingTransactions: TransactionList;
  completedTransactions: TransactionList;
  transferCrucible: TransferCrucible;
}
