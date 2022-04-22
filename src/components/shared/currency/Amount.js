import { Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import { formatWad, parseWad } from 'utils/formatNumber';
import { betweenZeroAndOne } from 'utils/bigNumbers';
import { parseFixed, formatFixed } from "@ethersproject/bignumber";

import CurrencySymbol from '../CurrencySymbol';

/**
 * Render a given amount formatted as USD. Displays ETH amount in a tooltip on hover.
 */
export default function Amount({
  amount,
  precision,
  padEnd,
  decimals,
  currency="",
}) {
  // Account for being passed a string amount or a BigNumber amount
  const isBetweenZeroAndOne =
    (BigNumber.isBigNumber(amount) && betweenZeroAndOne(amount)) ||
    betweenZeroAndOne(parseWad(amount))

  const precisionAdjusted = isBetweenZeroAndOne ? 2 : precision

  const amountStr18 = parseFixed(formatFixed(amount, decimals), 18);

  const formattedAmount = formatWad(amountStr18, {
    precision: precisionAdjusted ?? 0,
    padEnd: padEnd ?? false,
  });

  if (!amount) return null

  return (
    <Tooltip
      title={
        <span>
          <CurrencySymbol currency={currency} />
          {formattedAmount} {currency}
        </span>
      }
    >
      <CurrencySymbol currency={currency} />
      {formattedAmount}
    </Tooltip>
  )
}
