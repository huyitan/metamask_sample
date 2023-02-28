import { UnsupportedChainIdError } from '@web3-react/core';
import { useState } from 'react';
import { Connector, useWeb3 } from 'features/wallet';
import { walletSwitchToSupportedChain } from '../utils';
import { useWalletErrorMessage } from './useWalletErrorMessage';

export const useWalletActivate = () => {
  const { account, library, activate } = useWeb3();

  const { handler: errorMessage } = useWalletErrorMessage();
  const [isSuccess, setSuccess] = useState(false);
  const [isActivating, setActivating] = useState(false);

  const activateHandler = async (connector: Connector) => {
    if (window?.ethereum) {
      try {
        await activate(connector, null, true);
        setActivating(false);
        setSuccess(true);
      } catch (err) {
        if (err instanceof UnsupportedChainIdError) {
          try {
            await walletSwitchToSupportedChain();
            await activate(connector, null, true);
            setSuccess(true);
          } catch (error) {
            errorMessage(error);
          }
        } else {
          errorMessage(err);
        }

        setActivating(false);
      }
    } else {
      setActivating(false);
      window.open(process.env.NEXT_PUBLIC_METAMASK_DOWNLOAD_LINK, '_blank');
    }
  };

  const handleActivate = (connector: Connector) => {
    setSuccess(false);
    setActivating(true);
    activateHandler(connector);
  };

  return {
    isActivating,
    isSuccess,
    account,
    library,
    activate: handleActivate,
  };
};
