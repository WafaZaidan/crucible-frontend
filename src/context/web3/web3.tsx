import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import Onboard from 'bnc-onboard';
import {
  API as OnboardApi,
  Initialization,
  Wallet,
} from 'bnc-onboard/dist/src/interfaces';
import { BigNumber, ethers, providers } from 'ethers';
import { Erc20DetailedFactory } from '../../interfaces/Erc20DetailedFactory';
import { Erc20Detailed } from '../../interfaces/Erc20Detailed';
import { TokenInfo, Tokens, tokensReducer } from './tokenReducer';
import { ChainId } from '@uniswap/sdk';
import numberishToBigNumber from '../../utils/numberishToBigNumber';
import getMultiplier from '../../utils/getMultiplier';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'web3-react/dist/connectors/injected';

export type OnboardConfig = Partial<Omit<Initialization, 'networkId'>>;

type EthGasStationSettings = 'fast' | 'fastest' | 'safeLow' | 'average';
type EtherchainGasSettings = 'safeLow' | 'standard' | 'fast' | 'fastest';

type TokenConfig = {
  address: string;
  name?: string;
  symbol?: string;
  imageUri?: string;
};

type TokensToWatch = {
  [networkId: number]: TokenConfig[];
};

type Web3ContextProps = {
  cacheWalletSelection?: boolean;
  checkNetwork?: boolean;
  children: ReactNode;
  ethGasStationApiKey?: string;
  gasPricePollingInterval?: number; //Seconds between gas price polls. Defaults to 0 - Disabled
  gasPriceSetting?: EthGasStationSettings | EtherchainGasSettings;
  networkIds?: number[];
  onboardConfig?: OnboardConfig;
  spenderAddress?: string;
  tokensToWatch?: TokensToWatch; // Network-keyed collection of token addresses to watch
};

type Web3ContextType = {
  address?: string;
  ethBalance?: BigNumber;
  gasPrice: number;
  isReady: boolean;
  isMobile: boolean;
  isLoading: boolean;
  network?: number;
  onboard?: OnboardApi;
  provider?: providers.Web3Provider;
  wallet?: Wallet;
  tokens: Tokens;
  checkIsReady(): Promise<boolean>;
  refreshGasPrice(): Promise<void>;
  resetOnboard(): void;
  signMessage(message: string): Promise<string>;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const Web3Provider = ({
  children,
  onboardConfig,
  networkIds,
  ethGasStationApiKey,
  gasPricePollingInterval = 0,
  gasPriceSetting = 'fast',
  tokensToWatch,
  spenderAddress,
  cacheWalletSelection = true,
  checkNetwork = (networkIds && networkIds.length > 0) || false,
}: Web3ContextProps) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [provider, setProvider] = useState<providers.Web3Provider | undefined>(
    undefined
  );
  const [network, setNetwork] = useState<ChainId>(1);
  const [ethBalance, setEthBalance] = useState<BigNumber | undefined>(
    undefined
  );
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [onboard, setOnboard] = useState<OnboardApi | undefined>(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokens, tokensDispatch] = useReducer(tokensReducer, {});
  const [gasPrice, setGasPrice] = useState(0);

  // Initialize OnboardJS
  useEffect(() => {
    const initializeOnboard = async () => {
      const checks = [{ checkName: 'accounts' }, { checkName: 'connect' }];
      if (networkIds && checkNetwork) {
        checks.push({ checkName: 'network' });
      }

      try {
        const onboard = Onboard({
          ...onboardConfig,
          networkId: networkIds ? networkIds[0] : 1, //Default to mainnet
          walletCheck: checks,
          subscriptions: {
            address: (address) => {
              setAddress(address);
              checkIsReady();
              onboardConfig?.subscriptions?.address &&
                onboardConfig?.subscriptions?.address(address);
            },
            wallet: (wallet) => {
              if (wallet.provider) {
                wallet.name &&
                  cacheWalletSelection &&
                  localStorage.setItem('onboard.selectedWallet', wallet.name);
                setWallet(wallet);
                setProvider(
                  new ethers.providers.Web3Provider(wallet.provider, 'any')
                );
              } else {
                setWallet(undefined);
              }
              onboardConfig?.subscriptions?.wallet &&
                onboardConfig.subscriptions.wallet(wallet);
            },
            network: (network) => {
              if (!networkIds || networkIds.includes(network)) {
                onboard.config({ networkId: network });
              }
              wallet &&
                wallet.provider &&
                setProvider(
                  new ethers.providers.Web3Provider(wallet.provider, 'any')
                );
              setNetwork(network);
              checkIsReady();
              onboardConfig?.subscriptions?.network &&
                onboardConfig.subscriptions.network(network);
            },
            balance: (balance) => {
              try {
                setEthBalance(
                  numberishToBigNumber(balance).div(getMultiplier())
                );
              } catch (error) {
                setEthBalance(BigNumber.from(0));
              }
              onboardConfig?.subscriptions?.balance &&
                onboardConfig.subscriptions.balance(balance);
            },
          },
        });

        const savedWallet = localStorage.getItem('onboard.selectedWallet');
        if (cacheWalletSelection && savedWallet) {
          onboard.walletSelect(savedWallet).catch(console.error);
        }

        setOnboard(onboard);
      } catch (error) {
        console.log('Error initializing onboard');
        console.log(error);
      }
    };

    initializeOnboard().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hacky solution
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  // Gas Price poller
  useEffect(() => {
    let poller: NodeJS.Timeout;
    if (network === 1 && gasPricePollingInterval > 0) {
      refreshGasPrice().catch(console.error);
      poller = setInterval(refreshGasPrice, gasPricePollingInterval);
    } else {
      setGasPrice(10);
    }
    return () => {
      if (poller) {
        clearInterval(poller);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  // Token balance and allowance listener
  // TODO: Allowance check not needed unless target is specificed
  useEffect(() => {
    const checkBalanceAndAllowance = async (token: Erc20Detailed) => {
      if (address) {
        const balance = await token.balanceOf(address);
        const spenderAllowance = spenderAddress ? balance : BigNumber.from(0);

        tokensDispatch({
          type: 'updateTokenBalanceAllowance',
          payload: {
            id: token.address,
            spenderAllowance,
            balance,
          },
        });
      }
    };

    const networkTokens =
      (tokensToWatch && network && tokensToWatch[network]) || [];

    let tokenContracts: Array<Erc20Detailed> = [];
    if (provider && address && networkTokens.length > 0) {
      networkTokens.forEach(async (token) => {
        const signer = await provider.getSigner();
        const tokenContract = Erc20DetailedFactory.connect(
          token.address,
          signer
        );

        const newTokenInfo: TokenInfo = {
          decimals: 0,
          imageUri: token.imageUri,
          name: token.name,
          symbol: token.symbol,
          spenderAllowance: BigNumber.from(0),
          allowance: tokenContract.allowance,
          approve: tokenContract.approve,
          transfer: tokenContract.transfer,
        };

        if (!token.name) {
          try {
            newTokenInfo.name = await tokenContract.name();
          } catch (error) {
            console.log(
              'There was an error getting the token name. Does this contract implement ERC20Detailed?'
            );
          }
        }
        if (!token.symbol) {
          try {
            newTokenInfo.symbol = await tokenContract.symbol();
          } catch (error) {
            console.error(
              'There was an error getting the token symbol. Does this contract implement ERC20Detailed?'
            );
          }
        }

        try {
          newTokenInfo.decimals = await tokenContract.decimals();
        } catch (error) {
          console.error(
            'There was an error getting the token decimals. Does this contract implement ERC20Detailed?'
          );
        }

        tokensDispatch({
          type: 'addToken',
          payload: { id: token.address, token: newTokenInfo },
        });

        // This filter is intentionally left quite loose.
        const filterTokenApproval = tokenContract.filters.Approval(
          address,
          null,
          null
        );
        const filterTokenTransferFrom = tokenContract.filters.Transfer(
          address,
          null,
          null
        );
        const filterTokenTransferTo = tokenContract.filters.Transfer(
          null,
          address,
          null
        );

        const handler = () => {
          checkBalanceAndAllowance(tokenContract).catch(console.error);
        };
        tokenContract.on(filterTokenApproval, handler);
        tokenContract.on(filterTokenTransferFrom, handler);
        tokenContract.on(filterTokenTransferTo, handler);
        tokenContracts.push(tokenContract);
        handler();
      });
    }
    return () => {
      if (tokenContracts.length > 0) {
        tokenContracts.forEach((tc) => {
          tc.removeAllListeners();
        });
        tokenContracts = [];
        tokensDispatch({ type: 'resetTokens' });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, provider, address]);

  const checkIsReady = async () => {
    const isReady = await onboard?.walletCheck();
    if (!isReady) {
      setEthBalance(undefined);
    }
    setIsReady(!!isReady);
    return !!isReady;
  };

  const signMessage = async (message: string) => {
    if (!provider) return Promise.reject('The provider is not yet initialized');

    const data = ethers.utils.toUtf8Bytes(message);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    const sig = await provider.send('personal_sign', [
      ethers.utils.hexlify(data),
      addr.toLowerCase(),
    ]);
    return sig;
  };

  const resetOnboard = () => {
    localStorage.setItem('onboard.selectedWallet', '');
    setIsReady(false);
    onboard?.walletReset();
  };

  const refreshGasPrice = async () => {
    try {
      let gasPrice;
      if (ethGasStationApiKey) {
        const ethGasStationResponse = await (
          await fetch(
            `https://ethgasstation.info/api/ethgasAPI.json?api-key=${ethGasStationApiKey}`
          )
        ).json();
        gasPrice = ethGasStationResponse[gasPriceSetting] / 10;
      } else {
        const etherchainResponse = await (
          await fetch('https://www.etherchain.org/api/gasPriceOracle')
        ).json();
        gasPrice = Number(etherchainResponse[gasPriceSetting]);
      }

      const newGasPrice = !isNaN(Number(gasPrice)) ? Number(gasPrice) : 65;
      setGasPrice(newGasPrice);
    } catch (error) {
      console.log(error);
      console.log('Using 65 gwei as default');
      setGasPrice(65);
    }
  };

  const onboardState = onboard?.getState();

  return (
    <Web3Context.Provider
      value={{
        address,
        provider,
        network,
        ethBalance,
        wallet,
        onboard,
        isReady,
        isLoading,
        checkIsReady,
        resetOnboard,
        gasPrice,
        refreshGasPrice,
        isMobile: !!onboardState?.mobileDevice,
        tokens,
        signMessage,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useOnboard must be used within a OnboardProvider');
  }
  return context;
};

export { Web3Provider, useWeb3 };
