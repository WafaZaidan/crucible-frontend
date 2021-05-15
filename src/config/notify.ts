import Notify, { API as NotifyAPI } from 'bnc-notify';

export function initNotify(dappId: string, networkId?: number): NotifyAPI {
  return Notify({
    dappId,
    networkId: networkId || 1,
  });
}
