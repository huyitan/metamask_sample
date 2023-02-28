import { generateNonce, loginByWallet } from 'features/auth/api';
import { useEffect, useState } from 'react';
import { Connector } from 'features/wallet';
import {
  CHAIN_CODE,
  CHAIN_TYPE,
  SIGN_IN_MESSAGE,
} from 'shared/constants/wallet';
import { UserModel } from 'shared/models';
import { useWalletActivate } from './useWalletActivate';
import { useWalletErrorMessage } from './useWalletErrorMessage';

// type UseWalletLoginOptions = {
//   onSuccess: (data: Partial<UserModel>) => void;
//   onConnecting?: (value: boolean) => void;
// };

export const useWalletLogin = () => {
  const {
    isSuccess: isActivateSuccess,
    isActivating,
    account,
    library,
    activate,
  } = useWalletActivate();

  const { handler: errorMessage } = useWalletErrorMessage();
  const [generateNonceMutate] = generateNonce.useMutation();
  const [loginByCryptoWalletMutate] = loginByWallet.useMutation();

  const [isConnecting, setConnecting] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [data, setData] = useState<Partial<UserModel> | null>(null);

  useEffect(() => {
    if (isActivateSuccess && account && library) {
      loginByCryptoWalletHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActivateSuccess, account, library]);

  const loginByCryptoWalletHandler = async () => {
    try {
      setConnecting(true);

      const { nonce, sessionId } = await generateNonceMutate({
        address: account,
        chainCode: CHAIN_CODE.POLYGON,
        chainType: CHAIN_TYPE.EVM,
      }).unwrap();

      const message = SIGN_IN_MESSAGE(account, nonce);
      const signature = await library.getSigner().signMessage(message);

      const { user } = await loginByCryptoWalletMutate({
        sessionId,
        address: account,
        signature,
        message,
        chainCode: CHAIN_CODE.POLYGON,
        chainType: CHAIN_TYPE.EVM,
      }).unwrap();

      setSuccess(true);
      setData(user);
    } catch (err) {
      errorMessage(err);
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectWallet = (connector: Connector) => {
    activate(connector);
  };

  return {
    isConnecting: isActivating || isConnecting,
    isSuccess,
    data,
    connectWallet: handleConnectWallet,
  };
};
