import { useState, ReactElement } from 'react';
import TxErrorModal from '../components/modals/tx/txErrorModal';
import TxConfirmedModal from '../components/modals/tx/txConfirmedModal';
import TxPendingSignatureModal from '../components/modals/tx/txPendingSignatureModal';
import TxPendingApprovalModal from '../components/modals/tx/txPendingApprovalModal';
import { useNotify } from '../context/web3';
import { useCrucibles } from '../context/crucibles';
import { useWeb3React } from '@web3-react/core';

export enum EVENT {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  TX_CONFIRMED = 'TX_CONFIRMED',
  TX_MINED = 'TX_MINED',
  TX_ERROR = 'TX_ERROR',
}

export type CallbackArgs =
  | {
      type: EVENT.PENDING_APPROVAL;
      message?: string;
    }
  | {
      type: EVENT.PENDING_SIGNATURE;
      message?: string;
      step: number;
      totalSteps: number;
    }
  | {
      type: EVENT.TX_CONFIRMED;
      message?: string;
      txHash: string;
    }
  | {
      type: EVENT.TX_ERROR;
      message?: string;
      code?: number;
    }
  | {
      type: EVENT.TX_MINED;
      txHash?: string;
    };

export function useContract(
  contractCall: Function,
  successCallback?: Function
) {
  const { account } = useWeb3React();
  const { reloadBalances, reloadCrucibles } = useCrucibles();
  const { monitorTx } = useNotify();
  const [ui, setUI] = useState<ReactElement | null>(null);

  const callback = async (event: CallbackArgs) => {
    switch (event.type) {
      case EVENT.TX_MINED:
        await reloadBalances();
        await reloadCrucibles();
        if (successCallback) {
          successCallback(event.txHash);
        }
        break;
      case EVENT.TX_CONFIRMED:
        setUI(
          <TxConfirmedModal
            message={event.message}
            hash={event.txHash}
            onClose={() => setUI(null)}
          />
        );
        monitorTx(event.txHash, reloadBalances);
        break;
      case EVENT.TX_ERROR:
        setUI(
          <TxErrorModal
            message={event.message}
            code={event.code}
            onClose={() => setUI(null)}
          />
        );
        break;
      case EVENT.PENDING_APPROVAL:
        setUI(<TxPendingApprovalModal message={event.message} />);
        break;
      case EVENT.PENDING_SIGNATURE:
        setUI(
          <TxPendingSignatureModal
            message={event.message}
            step={event.step}
            totalSteps={event.totalSteps}
          />
        );
        break;
    }
  };

  const invokeContract = async <T extends any[]>(...args: T) => {
    if (account) {
      contractCall(...args, callback, monitorTx);
    }
  };

  return {
    invokeContract,
    ui,
  };
}
