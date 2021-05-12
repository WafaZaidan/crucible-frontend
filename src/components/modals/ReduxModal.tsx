import React, { FC } from 'react';
import { useModal } from '../../store/modals';

const ReduxModal: FC = () => {
  const { component } = useModal();
  return <>{component}</>;
};

export default ReduxModal;
