// import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
// import { Contract } from '@ethersproject/contracts'
// import { Deferrable } from '@ethersproject/properties'
// import { JsonRpcSigner, TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { notification } from 'antd'
// import Notify, { InitOptions, TransactionEvent } from 'bnc-notify';
import Notify from 'bnc-notify';
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext } from 'react'
import * as Sentry from '@sentry/browser'

// Check user has their wallet connected. If not, show select wallet prompt
const checkWalletConnected = (
  onSelectWallet,
  userAddress,
) => {
  if (!userAddress && onSelectWallet) {
    onSelectWallet()
  }
}

// wrapper around BlockNative's Notify.js
// https://docs.blocknative.com/notify
export function useTransactor({
  gasPrice,
}) {
  const {
    signingProvider: provider,
    onSelectWallet,
    userAddress,
  } = useContext(NetworkContext)

  const { isDarkMode } = useContext(ThemeContext)

  return useCallback(
    async (
      contract,
      functionName,
      args,
      options,
    ) => {
      if (!onSelectWallet) return false

      if (!provider) {
        onSelectWallet()
        if (options?.onDone) options.onDone()
        return false
      }

      checkWalletConnected(onSelectWallet, userAddress)

      if (!provider) return false

      const signer = provider.getSigner()

      const network = await provider.getNetwork()

      const notifyOpts = {
        dappId: process.env.REACT_APP_BLOCKNATIVE_API_KEY,
        system: 'ethereum',
        networkId: network.chainId,
        darkMode: isDarkMode,
        transactionHandler: txInformation => {
          console.info('HANDLE TX', txInformation)
          if (options && txInformation.transaction.status === 'confirmed') {
            options.onConfirmed && options.onConfirmed(txInformation, signer)
            options.onDone && options.onDone()
          }
          if (options && txInformation.transaction.status === 'cancelled') {
            options.onCancelled && options.onCancelled(txInformation, signer)
          }
        },
      }
      const notify = Notify(notifyOpts)
      window.notify = notify;
      let etherscanNetwork = ''
      if (network.name && network.chainId > 1) {
        etherscanNetwork = network.name + '.'
      }

      let etherscanTxUrl = 'https://' + etherscanNetwork + 'etherscan.io/tx/'
      if (network.chainId === 100) {
        etherscanTxUrl = 'https://blockscout.com/poa/xdai/tx/'
      }

      const tx =
        options?.value !== undefined
          ? contract[functionName](...args, { value: options.value })
          : contract[functionName](...args)

      const reportArgs = Object.values(contract.interface.functions)
        .find(f => f.name === functionName)
        ?.inputs.reduce(
          (acc, input, i) => ({
            ...acc,
            [input.name]: args[i],
          }),
          {},
        )

      console.info(
        '📈 Calling ' + functionName + '() with args:',
        reportArgs,
        tx,
      )

      try {
        let result

        if (tx instanceof Promise) {
          console.info('AWAITING TX', tx)
          result = await tx
        } else {
          console.info('RUNNING TX', tx)

          if (!tx.gasPrice) tx.gasPrice = gasPrice ?? parseUnits('4.1', 'gwei')

          if (!tx.gasLimit) tx.gasLimit = hexlify(120000)

          result = await signer.sendTransaction(tx)
          result.wait(2);
        }
        window.result = result;
        console.info('RESULT:', result);

        // user done. but not done by chain
        options?.onDone && options.onDone();

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        const isNotifyNetwork =
          [1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0

        if (isNotifyNetwork) {
          const { emitter } = notify.hash(result.hash)
          emitter.on('all', transaction => ({
            onclick: () => window.open(etherscanTxUrl + transaction.hash),
          }))
        }

        console.info('LOCAL TX SENT', result.hash)
        await result.wait(2);
        setTimeout(() => {
          result.wait(2).then((result1) => {
            window.result1 = result1;
            // localhost will have no confirmations;
            if (result1.confirmations) {
              console.log('has confirmations', result1.confirmations);
              options?.onConfirmed && options.onConfirmed(result1, signer);
            }
            else {
              console.log('!confirmations', result1.confirmations);
              options?.onCancelled && options.onCancelled(result1, signer);
            }
          })
          .catch((rej) => {
            console.log('catch', rej);
            options?.onCancelled && options.onCancelled(result, signer);
          })
        }, 100);

        return true
      } catch (e) {
        const message = (e).message

        console.error('Transaction Error:', message)
        Sentry.captureException(e, {
          tags: {
            contract_function: functionName,
          },
        })

        let description

        try {
          let json = message.split('(error=')[1]
          json = json.split(', method=')[0]
          description = JSON.parse(json).message || message
        } catch (_) {
          description = message
        }

        notification.error({
          key: new Date().valueOf().toString(),
          message: 'Transaction failed',
          description,
          duration: 0,
        })

        options?.onCancelled && options.onCancelled(e, signer);
        options?.onDone && options.onDone()

        return false
      }
    },
    [onSelectWallet, provider, isDarkMode, gasPrice, userAddress],
  )
}
