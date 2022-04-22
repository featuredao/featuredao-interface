import { CopyOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useContext, useState } from 'react'
import { t } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'

// Copies a given text to clipboard when clicked
export default function CopyTextButton({
  value,
  style = {},
}) {
  const { colors } = useContext(ThemeContext).theme
  const [copied, setCopied] = useState(false);
  const copyText = () => {
    navigator.clipboard.writeText(value ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }
  return (
    <Tooltip
      trigger={['hover']}
      title={<span>{copied ? t`Copied!` : t`Copy to clipboard`}</span>}
    >
      <CopyOutlined
        onClick={copyText}
        className="copyIcon"
        style={{
          ...style,
          paddingLeft: 10,
          color: colors.text.primary,
        }}
      />
    </Tooltip>
  )
}
