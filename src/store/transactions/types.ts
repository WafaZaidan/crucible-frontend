import { BigNumber } from 'ethers';

export enum TxnType {
  mint = 'MINT',
  increaseLp = 'INCREASE LP',
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
  type: TxnType;
  status?: TxnStatus;
  description?: string;
  hash?: string;
  chainId?: number;
  account?: string;
}

export type TransactionList = TxnDetails[];

export type TxnState = {
  transactions: TransactionList;
};

export type TransferCrucible = {
  (crucibleId: string, transferTo: string): Promise<void>;
};

export type MintCrucible = {
  (amountLp: BigNumber): Promise<void>;
};

export type IncreaseLP = {
  (amountLp: BigNumber, crucibleAddress: string): Promise<void>;
};

export interface UseTransactions {
  savedTransactions: TransactionList;
  clearSavedTransactions: () => void;
  pendingTransactions: TransactionList;
  completedTransactions: TransactionList;
  transferCrucible: TransferCrucible;
  mintCrucible: MintCrucible;
  increaseLP: IncreaseLP;
}
