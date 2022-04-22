import FormattedAddress from 'components/shared/FormattedAddress';
import { LogoutOutlined } from '@ant-design/icons'

import { NetworkContext } from 'contexts/networkContext';
import { useContext } from 'react'
import { Dropdown, Menu } from 'antd'

import EtherscanLink from 'components/shared/EtherscanLink'
import CopyTextButton from 'components/shared/CopyTextButton'
import useMobile from 'hooks/Mobile'

import Balance from './Balance'

export default function Wallet({ userAddress }) {
  const isMobile = useMobile()

  const height = 45

  const { onLogOut } = useContext(NetworkContext);

  const menuItemPadding = '10px 15px';

  const menu = (<Menu>
    <Menu.Item style={{ padding: menuItemPadding }} key={0}>
      <EtherscanLink value={userAddress} type="address" truncated={true} />{' '}
      <CopyTextButton value={userAddress} style={{ zIndex: 1 }} />
    </Menu.Item>
    {!isMobile && (
      <Menu.Item
        onClick={onLogOut}
        style={{
          padding: menuItemPadding,
          display: 'flex',
          justifyContent: 'space-between',
        }}
        key={1}
      >
        Disconnect
        <LogoutOutlined />
      </Menu.Item>
    )}
  </Menu>);

  return (
    <Dropdown
      overlay={menu}
      placement="bottomRight"
      overlayStyle={{ padding: 0 }}
    >
      <div
        style={{
          height,
          borderRadius: 2,
          padding: '4px 19px 7px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#f3f1ec',
          cursor: 'default',
          userSelect: 'all',
        }}
      >
        <FormattedAddress address={userAddress} tooltipDisabled={true} />
        <Balance address={userAddress} />
      </div>
    </Dropdown>
  )
}
