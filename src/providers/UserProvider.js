import { BigNumber } from '@ethersproject/bignumber';
import { UserContext } from 'contexts/userContext';
import { useContractLoader } from 'hooks/ContractLoader';
import { useGasPriceQuery } from 'hooks/GasPrice';
import { useTransactor } from 'hooks/Transactor';

export default function UserProvider({ children }) {
  const contracts = useContractLoader();
  window.contracts = contracts;

  const { data: gasPrice } = useGasPriceQuery('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  });
  window.transactor = transactor;

  return (
    <UserContext.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
