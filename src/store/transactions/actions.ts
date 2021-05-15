import { AddTxnActionPayload, TxnState } from './types';

export const addTransactionToQueue = (
  transactions: TxnState,
  action: {
    payload: AddTxnActionPayload;
  }
) => {
  const { hash, approval, summary, claim, from, chainId } = action.payload;
  console.log('we in the txn state action add to qwueue', transactions, action);
  if (transactions[chainId]?.[hash]) {
    throw Error('Attempted to add existing transaction.');
  }
  const txs = transactions[chainId] ?? {};
  txs[hash] = { hash, approval, summary, claim, from, addedTime: Date.now() };
  transactions[chainId] = txs;
};
