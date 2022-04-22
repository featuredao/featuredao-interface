import EthPrice from './EthPrice'

import { useEthBalanceQuery } from 'hooks/EthBalance'
// import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'

import CurrencySymbol from 'components/shared/CurrencySymbol'

export default function Balance({
  address,
  showEthPrice,
}) {
  const { data: balance } = useEthBalanceQuery(address)

  return (
    <div
      style={{
        verticalAlign: 'middle',
        lineHeight: 1,
      }}
    >
      <CurrencySymbol currency="ETH" />
      {formatWad(balance, { precision: 4 }) ?? '--'}
      {showEthPrice && (
        <div>
          <EthPrice />
        </div>
      )}
    </div>
  )
}
