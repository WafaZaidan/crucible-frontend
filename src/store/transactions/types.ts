export enum TxnType {
  mint = 'MINT',
  increaseStake = 'INCREASE_STAKE',
  transfer = 'TRANSFER',
  claim = 'CLAIM',
  withdraw = 'WITHDRAW',
}

export enum TxnStatus {
  Ready = 'READY',
  Submitted = 'SUBMITTED',
  Pending = 'PENDING',
  Mined = 'MINED',
  Failed = 'FAILED',
}

export interface TxnDetails {
  status: TxnStatus;
}

export type TxnState = {
  [key in TxnType]?: TxnDetails;
};

export interface UseTransactions {
  transactions: TxnState;
  addTransactionToStore: (txnType: TxnType) => void;
  updateTransaction: (txnType: TxnDetails) => void;
  clearTransaction: (txnType: TxnType) => void;
}
