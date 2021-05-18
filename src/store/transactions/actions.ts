import { TxnDetails, TxnState, TxnStatus, TxnType } from './types';

export const addTransactionToStore = (
  transactions: TxnState,
  action: {
    payload: TxnType;
  }
) => {
  if (transactions[action.payload]?.status !== TxnStatus.Ready) {
    throw Error(`${action.payload} transaction is still pending`);
  }

  transactions[action.payload] = {
    status: TxnStatus.Submitted,
  };
};

export const updateTransaction = (
  transactions: TxnState,
  action: {
    payload: TxnDetails;
  }
) => {
  console.log(action);
};

export const clearTransaction = (
  transactions: TxnState,
  action: {
    payload: TxnType;
  }
) => {
  transactions[action.payload] = {
    status: TxnStatus.Ready,
  };
};
