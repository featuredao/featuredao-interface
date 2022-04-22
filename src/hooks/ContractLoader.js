import { Contract } from '@ethersproject/contracts';
// import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext';
import { ContractName } from 'models/contracts';
import { useContext, useEffect, useState } from 'react';

import { readProvider } from 'constants/readProvider';
import { readNetwork } from 'constants/networks';

export function useContractLoader() {
  const [contracts, setContracts] = useState();

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = Object.values(ContractName).reduce(
          (accumulator, ContractName) => ({
            ...accumulator,
            [ContractName]: loadContract(
              ContractName,
              signerOrProvider,
            ),
          }),
          {},
        )

        setContracts(newContracts)
      } catch (e) {
        console.error('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [signingProvider, setContracts])

  return contracts
}
export const getContractBuildInfo = () => {
  const network = readNetwork.name
  const buildInfo = require(`build/info.${network}`);
  return buildInfo;
}

export const loadContract = (
  contractName,
  signerOrProvider,
  address,
) => {
  const buildInfo = getContractBuildInfo();
  let contractAddress = address || buildInfo[contractName].address;
  // console.log('contractName', contractName, 'contractAddress', contractAddress);
  if (contractAddress) {
    return new Contract(contractAddress, buildInfo[contractName].abi, signerOrProvider);
  }
  return null;
}
