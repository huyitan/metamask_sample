import { useSnackbar } from 'ui';
import { useIntl } from 'react-intl';

export const useWalletErrorMessage = () => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const handler = (error: { code: number; message: string }) => {
    // eslint-disable-next-line prefer-destructuring
    let message = error.message;

    switch (error.code) {
      case 4001:
        message = null;
        break;
      case 4902:
        message = intl.formatMessage({
          defaultMessage:
            'Currently this page only supported in Polygon Chain, please switch your network to continue.',
        });
        break;

      default:
        break;
    }

    if (message) {
      enqueueSnackbar(message, {
        variant: 'error',
      });
    }
  };

  return {
    handler,
  };
};
