import { useContext, useCallback, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { NetworkContext } from 'contexts/networkContext'

import { initOnboard } from 'utils/onboard'

import { ThemeContext } from 'contexts/themeContext'

// import { readNetwork, NETWORKS } from 'constants/networks';
import { NETWORKS } from 'constants/networks';

const KEY_SELECTED_WALLET = 'selectedWallet';


const NetworkProvider = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const [signingProvider, setSigningProvider] = useState();
  const [network, setNetwork] = useState();
  const [account, setAccount] = useState();
  const [onboard, setOnboard] = useState();

  const resetWallet = useCallback(() => {
    onboard?.walletReset();
    setSigningProvider(undefined);
    window.localStorage.setItem(KEY_SELECTED_WALLET, '');
  }, [onboard]);

  const selectWallet = async () => {
    resetWallet();

    // Open select wallet modal.
    const selectedWallet = await onboard?.walletSelect();

    // User quit modal.
    if (!selectedWallet) {
      return
    }

    // Wait for wallet selection initialization
    await onboard?.walletCheck()
  }

  const logOut = async () => {
    console.log('logOut');
    resetWallet();
  }

  // Initialize Network
  useEffect(() => {
    if (onboard) {
      return;
    }

    const selectWallet = async (newWallet) => {
      if (newWallet.provider) {
        // Reset the account when a new wallet is connected, as it will be resolved by the provider.
        setAccount(undefined)
        window.localStorage.setItem(KEY_SELECTED_WALLET, newWallet.name || '')
        setSigningProvider(new Web3Provider(newWallet.provider))
      } else {
        resetWallet()
      }
    }
    const config = {
      address: setAccount,
      wallet: selectWallet,
    }
    setOnboard(initOnboard(config, isDarkMode))
  }, [isDarkMode, onboard, resetWallet])

  // On darkmode changed
  useEffect(() => {
    if (onboard) {
      onboard.config({ darkMode: isDarkMode })
    }
  }, [isDarkMode, onboard])

  // Refresh Network
  useEffect(() => {
    async function getNetwork() {
      await signingProvider?.ready

      const network = signingProvider?.network?.chainId
        ? NETWORKS[signingProvider.network.chainId]
        : undefined

      setNetwork(network?.name)
    }
    getNetwork()
  }, [signingProvider])

  // Reconnect Wallet
  useEffect(() => {
    const previouslySelectedWallet =
      window.localStorage.getItem(KEY_SELECTED_WALLET)
    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])


  const value = {
    // todo: do not detect.
    // signingProvider: signingProvider && network === readNetwork.name && account ? signingProvider : undefined,
    signingProvider: signingProvider,
    signerNetwork: network,
    userAddress: account,
    onNeedProvider: () => new Promise(),
    onSelectWallet: selectWallet,
    onLogOut: logOut,
  };

  return (<NetworkContext.Provider value={value}>
    { children }
  </NetworkContext.Provider>);
}

export default NetworkProvider;
