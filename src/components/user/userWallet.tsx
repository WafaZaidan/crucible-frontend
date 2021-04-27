import { Box } from '@chakra-ui/layout';
import { useWeb3 } from '../../context/web3';
import { truncate } from '../../utils/address';
import { Button, IconButton } from '@chakra-ui/react';
import { TiPower } from 'react-icons/ti';
import { VscLink } from 'react-icons/vsc';

const UserWallet = () => {
  const { address, onboard, isLoading } = useWeb3();

  const handleConnect = async () => {
    await onboard?.walletSelect();
    await onboard?.walletCheck();
  };

  const handleSelect = async () => {
    await onboard?.walletSelect();
  };

  const handleReset = () => {
    localStorage.setItem('onboard.selectedWallet', '');
    onboard?.walletReset();
  };

  const walletButtonProps = {
    borderColor: 'purple.500',
    borderWidth: '2px',
    variant: 'outline',
  };

  if (isLoading) {
    return <Button {...walletButtonProps} isLoading />;
  }

  if (address) {
    return (
      <Box position='relative'>
        <Button {...walletButtonProps} onClick={handleSelect} pr={12}>
          <Box>{truncate(address)}</Box>
        </Button>
        <IconButton
          isRound
          size='lg'
          height='44px'
          variant='ghost'
          position='absolute'
          right={0}
          icon={<TiPower />}
          aria-label='disconnect'
          onClick={handleReset}
          _hover={{
            bg: 'none',
            color: 'cyan.300',
          }}
        />
      </Box>
    );
  }

  return (
    <Button
      {...walletButtonProps}
      rightIcon={<VscLink />}
      onClick={handleConnect}
    >
      Connect Wallet
    </Button>
  );
};

export default UserWallet;
