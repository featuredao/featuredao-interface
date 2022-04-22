import { CURRENCY_METADATA } from 'constants/currency'

export default function CurrencySymbol({
  currency,
  style,
}) {
  if (!currency) return null

  const metadata = CURRENCY_METADATA[currency]
  if (!metadata) {
    return null;
  }

  return (
    <span
      style={{
        ...style,
        ...metadata.style,
      }}
    >
      {metadata.symbol}
    </span>
  )
}
