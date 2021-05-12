import React, { FC } from 'react';
import { useModal } from '../../store/modals';
import { ModalType } from './types';
import ConnectWallet from './ConnectWallet';

const ReduxModal: FC = () => {
  const { modalType } = useModal();

  switch (modalType) {
    case ModalType.connectWallet:
      return <ConnectWallet />;
  }

  return null;
};

export default ReduxModal;
