export enum THUNK_PREFIX {
  'GET_OWNED_CRUCIBLED' = 'crucibles/getOwnedCrucibles',
  'TRANSFER_CRUCIBLE' = 'transactions/transferCrucible',
  'MINT_CRUCIBLE' = 'transactions/mintCrucible',
  'INCREASE_LP' = 'transactions/increaseLP',
  'UNSUBSCRIBE_LP' = 'transactions/unsubscribeLP',
}

export enum SLICE_NAME {
  'CRUCIBLES' = 'crucibles',
  'TRANSACTIONS' = 'transactions',
}
