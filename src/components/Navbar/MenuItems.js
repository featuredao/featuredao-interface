import { Space } from 'antd'
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
  return (
    <a
      className="nav-menu-item hover-opacity"
      href={route}
      onClick={onClick}
      {...(external
        ? {
            target: '_blank',
            rel: 'noreferrer',
          }
        : {})}
      style={navMenuItemStyles}
    >
      {text}
    </a>
  )
}

export function TopLeftNavItems({
  onClickMenuItems,
}) {
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
    </Space>
  )
}
