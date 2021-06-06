import React, { FC } from 'react';
import { useModal } from '../../store/modals';
import { ModalType } from './types';
import ConnectWalletModal from './ConnectWalletModal';
import WalletInfoModal from './WalletInfoModal';
import UnstakeAndClaimModal from './unstakeAndClaimModal';
import TxConfirmedFlashbotsModal from './tx/txConfirmedFlashbotsModal';
import TxPendingFlashbotsModal from './tx/txPendingFlashbotsModal';

const ModalRoot: FC = () => {
  const { modalType, modalProps } = useModal();

  switch (modalType) {
    case ModalType.connectWallet:
      return <ConnectWalletModal />;
    case ModalType.walletInfo:
      return <WalletInfoModal />;
    case ModalType.claimRewards:
      return <UnstakeAndClaimModal {...modalProps} />;
    case ModalType.flashbotsConfirmed:
      return <TxConfirmedFlashbotsModal {...modalProps} />;
    case ModalType.flashbotsPending:
      return <TxPendingFlashbotsModal {...modalProps} />;
  }

  return null;
};

export default ModalRoot;
