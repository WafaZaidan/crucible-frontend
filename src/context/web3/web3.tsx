import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Initialization } from 'bnc-onboard/dist/src/interfaces';
import { BigNumber } from 'ethers';
import { Erc20DetailedFactory } from '../../interfaces/Erc20DetailedFactory';
import { Erc20Detailed } from '../../interfaces/Erc20Detailed';
import { TokenInfo, Tokens, tokensReducer } from './tokenReducer';
import { useWeb3React } from '@web3-react/core';

export type OnboardConfig = Partial<Omit<Initialization, 'networkId'>>;

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
  networkIds?: number[];
  onboardConfig?: OnboardConfig;
  spenderAddress?: string;
  tokensToWatch?: TokensToWatch; // Network-keyed collection of token addresses to watch
};

type Web3ContextType = {
  ethBalance?: BigNumber;
  tokens: Tokens;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const Web3Provider = ({
  children,
  tokensToWatch,
  spenderAddress,
}: Web3ContextProps) => {
  const { account, chainId, library } = useWeb3React();
  const [ethBalance, setEthBalance] = useState<BigNumber | undefined>(
    undefined
  );
  const [tokens, tokensDispatch] = useReducer(tokensReducer, {});

  // get ETH balance
  useEffect(() => {
    const fetchEthBalance = async () => {
      if (library && account) {
        setEthBalance(await library.getBalance(account));
      }
    };
    fetchEthBalance();
  }, [library, account]);

  // get other token balances
  useEffect(() => {
    const checkBalanceAndAllowance = async (token: Erc20Detailed) => {
      if (account) {
        const balance = await token.balanceOf(account);
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
      (tokensToWatch && chainId && tokensToWatch[chainId]) || [];

    let tokenContracts: Array<Erc20Detailed> = [];
    if (library && account && networkTokens.length > 0) {
      networkTokens.forEach(async (token) => {
        const signer = await library.getSigner();
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
          account,
          null,
          null
        );
        const filterTokenTransferFrom = tokenContract.filters.Transfer(
          account,
          null,
          null
        );
        const filterTokenTransferTo = tokenContract.filters.Transfer(
          null,
          account,
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
  }, [chainId, library, account]);

  return (
    <Web3Context.Provider
      value={{
        ethBalance,
        tokens,
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
