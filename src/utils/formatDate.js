import { BigNumber } from '@ethersproject/bignumber';
import { t } from '@lingui/macro'

import { Tooltip } from 'antd'

import moment from 'moment'

export const formatDate = (dateMillis, format) =>
  moment(BigNumber.from(dateMillis).toNumber()).format(format)

export function formatHistoricalDate(dateMillis) {
  return (
    <Tooltip title={`${formatDate(dateMillis)} UTC`}>
      {t`${moment(BigNumber.from(dateMillis).toNumber()).fromNow(true)} ago`}
    </Tooltip>
  )
}

/**
 * Convert a date to Epoch time in seconds.
 * @param date
 * @returns Epoch time in seconds
 */
export const toDateSeconds = (date) => {
  return Math.floor(date.valueOf() / 1000)
}
