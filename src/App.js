import './App.css';
import Router from './Router'
import Navbar from './components/Navbar'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import { t, Trans } from '@lingui/macro';

const showTextInfoed = !(localStorage.getItem('showTextInfoed') || '');
function App() {
  const [showTextInfo, setShowTextInfo] = useState(!!showTextInfoed);
  return (
    <Layout
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'transparent',
      }}
    >
      <Navbar />
      <Content style={{}}>
        <Router />
      </Content>
      <Modal
        visible={showTextInfo}
        okText={t`Sure, No show again.`}
        cancelText={t`Sure`}
        title={t`Kovan Testnet network Only`}
        onOk={() => {
          localStorage.setItem('showTextInfoed', true);
          setShowTextInfo(false);
        }}
        onCancel={() => setShowTextInfo(false)}
      >
        <div><Trans>Welcome to FeatureDao!</Trans></div>
        <div><Trans>Now we just test FeatureDao in kovan network only.</Trans></div>
        <div><Trans>If you want to try it, please change you network into kovan test network.</Trans></div>
        <div><Trans>You can get test ETH at <a href="https://gitter.im/kovan-testnet/faucet" rel="noreferrer" target="_blank">this</a> or <a href="https://faucets.chain.link/" rel="noreferrer" target="_blank">this</a>.</Trans></div>
        <div><Trans>Feel free to contact us at featuredao at gmail.com or @featuredao for bug or usage.</Trans></div>
        <div><Trans>Thanks for using. </Trans></div>
        
      </Modal>
    </Layout>
  );
}

export default App;
