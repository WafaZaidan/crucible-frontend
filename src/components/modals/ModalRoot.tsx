import React, { FC } from 'react';
import { useModal } from '../../store/modals';
import { ModalType } from './types';
import ConnectWalletModal from './ConnectWalletModal';
import WalletInfoModal from './WalletInfoModal';
import UnstakeAndClaimModal from './unstakeAndClaimModal';

const ModalRoot: FC = () => {
  const { modalType, modalProps } = useModal();

  switch (modalType) {
    case ModalType.connectWallet:
      return <ConnectWalletModal />;
    case ModalType.walletInfo:
      return <WalletInfoModal />;
    case ModalType.claimRewards:
      return <UnstakeAndClaimModal {...modalProps} />;
  }

  return null;
};

export default ModalRoot;
