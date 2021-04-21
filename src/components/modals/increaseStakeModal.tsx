import {
  Button,
  Link,
  NumberInput,
  NumberInputField,
  Text,
  InputRightElement,
} from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useState } from 'react';
import { useWeb3 } from '../../context/web3';
import { useContract } from '../../hooks/useContract';
import { Crucible, useCrucibles } from '../../context/crucibles/crucibles';
import { increaseStake } from '../../contracts/increaseStake';
import { config } from '../../config/variables';

type IncreaseStakeParams = Parameters<
  (signer: any, crucibleAddress: string, rawAmount: string) => void
>;

type Props = {
  crucible: Crucible;
  onClose: () => void;
};

const IncreaseStakeModal: React.FC<Props> = ({ onClose, crucible }) => {
  const { provider } = useWeb3();
  const [amount, setAmount] = useState('0');

  const { invokeContract, ui } = useContract(increaseStake, () => onClose());
  const { tokenBalances } = useCrucibles();

  const handleIncreaseSubscription = () => {
    const signer = provider?.getSigner();
    invokeContract<IncreaseStakeParams>(signer, crucible.id, amount);
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Increase LP subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <Text mb={4}>
              Increase your subscription in the Aludel Rewards program by
              depositing Uniswap Liquidity Pool tokens. You can get LP tokens by
              depositing ETH and MIST to the trading pair{' '}
              <Link color='blue.400' isExternal href={config.uniswapPoolUrl}>
                here.
              </Link>
            </Text>
            <NumberInput
              value={amount}
              onChange={(val) => setAmount(val)}
              max={Number(tokenBalances?.cleanLp)}
              clampValueOnBlur={false}
              size='lg'
            >
              <NumberInputField />
              <InputRightElement width='4.5rem' zIndex={0}>
                <Button
                  mr={2}
                  h='2rem'
                  variant='ghost'
                  onClick={() => setAmount(tokenBalances?.cleanLp || '0')}
                >
                  Max
                </Button>
              </InputRightElement>
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button
              isFullWidth
              onClick={handleIncreaseSubscription}
              disabled={
                !amount ||
                amount === '0' ||
                Number(amount) > Number(tokenBalances?.cleanLp)
              }
            >
              Increase subscription
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {ui}
    </>
  );
};

export default IncreaseStakeModal;
