import { LoadingButton, SvgIcon } from 'ui';
import { IconMetamask } from 'assets/icons';
import { useWalletLogin, injectedConnector } from 'features/wallet';
import { useLocalStorage } from 'hooks';
import { ReactNode, useEffect } from 'react';
import { CHAIN_CODE, CHAIN_CODE_STORAGE_KEY } from 'shared/constants';
import { UserModel } from 'shared/models';

interface MetamaskLoginProps {
  onLoading?: (value: boolean) => void;
  onSuccess: (data: Partial<UserModel>) => void;
  label?: ReactNode;
  variant?: 'outlined' | 'contained';
}

const MetamaskLogin: React.FC<MetamaskLoginProps> = ({
  label = 'Metamask',
  onSuccess,
  onLoading,
  variant = 'contained',
}) => {
  const { connectWallet, isConnecting, isSuccess, data } = useWalletLogin();
  const [, setChainCodeStorage] = useLocalStorage(CHAIN_CODE_STORAGE_KEY, null);

  useEffect(() => {
    if (isSuccess && data) {
      setChainCodeStorage(CHAIN_CODE.POLYGON);
      onSuccess(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    onLoading?.call(isConnecting);
  }, [isConnecting]);

  const handleConnect = () => {
    connectWallet(injectedConnector);
  };

  return (
    <LoadingButton
      disableRipple
      size="large"
      variant={variant}
      loading={isConnecting}
      loadingPosition="start"
      startIcon={
        <SvgIcon
          fontSize="medium"
          sx={{
            width: 24,
            height: 24,
          }}
          viewBox="0 0 32 32"
          component={IconMetamask}
        />
      }
      sx={{ height: 48 }}
      onClick={handleConnect}
    >
      {label}
    </LoadingButton>
  );
};

export default MetamaskLogin;
