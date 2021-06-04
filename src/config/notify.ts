import Notify, { API as NotifyAPI } from 'bnc-notify';

export function initNotify(
  blocknativeApiKey: string,
  networkId?: number
): NotifyAPI {
  return Notify({
    dappId: blocknativeApiKey,
    networkId: networkId || 1,
  });
}
