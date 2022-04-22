import { Space } from 'antd'
import { Header } from 'antd/lib/layout/layout'

import Account from './Account'
// import MobileCollapse from './Mobile/MobileCollapse'
import { TopLeftNavItems } from './MenuItems'
// import NavLanguageSelector from './NavLanguageSelector'
// import ThemePicker from './ThemePicker'
import { topNavStyles, topRightNavStyles } from './navStyles'

export default function Navbar() {
  return <Header className="top-nav" style={{ ...topNavStyles }}>
    <TopLeftNavItems />

    <Space size="middle" style={{ ...topRightNavStyles }}>
      <Account />
    </Space>
  </Header>
}
