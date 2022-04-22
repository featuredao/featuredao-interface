import { Button } from 'antd';
import { NetworkContext } from 'contexts/networkContext';

import { useContext, useEffect } from 'react';
import { Trans } from '@lingui/macro'

import Wallet from './Wallet';

export default function Account() {
  const { userAddress, signingProvider, onSelectWallet } = useContext(NetworkContext);

  useEffect(() => {
    document.addEventListener('onSelectWallet', onSelectWallet);
    return () => {
      document.removeEventListener('onSelectWallet', onSelectWallet);
    }
  }, [onSelectWallet]);
  if (!signingProvider) {
    return (<Button onClick={onSelectWallet}>
      <Trans>Connect</Trans>
    </Button>)
  }

  if (!userAddress) {
    return null;
  }

  return (<Wallet userAddress={userAddress} />);
}
