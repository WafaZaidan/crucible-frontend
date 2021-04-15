import { Box } from '@chakra-ui/layout';
import { useWeb3 } from '../../context/web3';
import { truncate } from '../../utils/address';
import { FaPowerOff } from 'react-icons/fa';
import { ImPowerCord } from 'react-icons/im';
import { Button, Spinner } from '@chakra-ui/react';

const UserWallet = () => {
  const { address, onboard, resetOnboard, isLoading } = useWeb3();
  return (
    <Button
      width='193px'
      onClick={() => onboard?.walletSelect()}
      rightIcon={
        isLoading ? undefined : address ? (
          <FaPowerOff onClick={() => resetOnboard()} />
        ) : (
          <ImPowerCord />
        )
      }
    >
      {isLoading ? (
        <Spinner />
      ) : address ? (
        <Box mr={2}>{truncate(address)}</Box>
      ) : (
        'Connect'
      )}
    </Button>
  );
};

export default UserWallet;
