import { Box } from '@chakra-ui/layout';
import { useWeb3 } from '../../context/web3';
import { truncate } from '../../utils/address';
import { Button } from '@chakra-ui/react';

const UserWallet = () => {
  const { address, onboard, isLoading } = useWeb3();

  const handleConnect = async () => {
    await onboard?.walletSelect();
    await onboard?.walletCheck();
  };

  const handleSelect = async () => {
    await onboard?.walletSelect();
  };

  if (isLoading) {
    return <Button isLoading />;
  }

  if (address) {
    return (
      <Button onClick={handleSelect}>
        <Box mr={2}>{truncate(address)}</Box>
      </Button>
    );
  }

  return <Button onClick={handleConnect}>Connect</Button>;
};

export default UserWallet;
