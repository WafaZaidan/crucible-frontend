import React, { FC } from 'react';
import { useModal } from '../../store/modals';
import { ModalType } from './types';
import ConnectWalletModal from './ConnectWalletModal';
import WalletInfoModal from './WalletInfoModal';

const ReduxModal: FC = () => {
  const { modalType } = useModal();

  switch (modalType) {
    case ModalType.connectWallet:
      return <ConnectWalletModal />;
    case ModalType.walletInfo:
      return <WalletInfoModal />;
  }

  return null;
};

export default ReduxModal;
