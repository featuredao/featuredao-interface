import { Space, Modal } from 'antd';
import { t, Trans } from '@lingui/macro';
import { useContext, useState } from 'react';
// import { Link } from 'react-router-dom';
import { UserContext } from 'contexts/userContext';
import FormattedAddress from 'components/shared/FormattedAddress';

// Dropdown, Menu
// import { DownOutlined, UpOutlined } from '@ant-design/icons'

export const navMenuItemStyles = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
  color: 'var(--text-primary)',
}
export const topLeftNavStyles = {
  flex: 1,
}

export function NavMenuItem({
  text,
  route,
  onClick,
}) {
  const external = route?.startsWith('http')
  const props = {
    className: 'nav-menu-item hover-opacity',
    onClick: onClick,
    style: navMenuItemStyles,
  };
  if (route) {
    props.href = route;
  }

  if (external) {
    props.target = '_blank';
    props.rel = 'noreferrer'
  }
  return (<a {...props}>
    {text}
  </a>);
}

export function TopLeftNavItems({
  onClickMenuItems,
}) {
  const [showContractInfo, setShowContractInfo] =  useState(false);
  const { contracts } = useContext(UserContext);
  window.contracts1 = contracts;
  return (
    <Space
      size={'large'}
      className="top-left-nav"
      style={{ ...topLeftNavStyles }}
      direction={'horizontal'}
    >
      <NavMenuItem text="Home" onClick={onClickMenuItems} route={`/${process.env.PUBLIC_URL}#/`.replace(/\/+/, '/')} />
      <NavMenuItem
        text="Features"
        onClick={onClickMenuItems}
        route={`/${process.env.PUBLIC_URL}#/features`.replace(/\/+/, '/')}
      />
      <NavMenuItem
        text="Contracts"
        onClick={(e) => {
          setShowContractInfo(true);
          onClickMenuItems(e);
        }}
      />
      <Modal
        visible={showContractInfo}
        cancelText={null}
        title={t`Contracts Info`}
        onOk={() => {
          setShowContractInfo(false);
        }}
        onCancel={() => setShowContractInfo(false)}
      >
        <div><Trans>factory</Trans>: <FormattedAddress address={contracts?.FeatureFactory?.address} /></div>
        <div><Trans>router</Trans>: <FormattedAddress address={contracts?.FeatureRouter?.address} /></div>
        <div><Trans>info</Trans>: <FormattedAddress address={contracts?.FeatureProjectInfo?.address} /></div>
        <br />
        <br />
        <div><Trans>project</Trans>: created by factory, inside factory.</div>
      </Modal>
    </Space>
  )
}
