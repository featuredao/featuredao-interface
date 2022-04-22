import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd';
import React, { useContext } from 'react';
import _ from 'lodash';
// import { Link } from 'react-router-dom'
import ExternalLink from 'components/shared/ExternalLink';

import Footer from './Footer'

import { ThemeContext } from 'contexts/themeContext'
import Create from './Create';
// import { ThemeOption } from 'constants/theme/theme-option';

import TrendingSection from './TrendingSection';

const BigHeader = ({ text }) => (
  <h1
    style={{
      fontSize: '2.4rem',
      fontWeight: 600,
      lineHeight: 1.2,
      margin: 0,
    }}
  >
    {text}
  </h1>
)

// const FourthCol = ({
//   header,
//   children,
// }) => (
//   <div>
//     <SmallHeader text={header} />
//     <p style={{ marginBottom: 0, marginTop: 5 }}>{children}</p>
//   </div>
// )

function scrollToCreate() {
  document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Home() {
  const { theme } = useContext(ThemeContext)
  const colors = theme.colors
  const totalMaxWidth = 1080

  const section = {
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 40,
    marginBottom: 40,
  };

  const wrapper = {
    maxWidth: totalMaxWidth,
    margin: '0 auto',
  }

  return (
    <div>
      <section style={section}>
        <div style={wrapper}>
          <Row gutter={30} align="middle">
            <Col
              xs={24}
              md={24}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: 60,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  rowGap: 30,
                }}
              >
                <BigHeader text={t`Feature Dao`} />
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  <Trans>
                    Dao our feature. Make the feature, and follow the feature.
                    Light enough for you God predicts, powerful enough for a
                    global network of anons.
                  </Trans>
                  <br />
                  <br />
                  <Trans>
                    Powered by public smart contracts on{' '}
                    <ExternalLink
                      style={{
                        color: colors.text.primary,
                        fontWeight: 500,
                        borderBottom:
                          '1px solid ' + colors.stroke.action.primary,
                      }}
                      href="https://ethereum.org/en/what-is-ethereum/"
                    >
                      Ethereum
                    </ExternalLink>
                    .
                  </Trans>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'row',
                    rowGap: 8,
                    fontWeight: 600,
                  }}
                >
                  <p style={{ color: colors.text.brand.primary, opacity: 1 }}>
                    <Trans>Built for:</Trans>
                  </p>
                  {[
                    t`Anyone want to Fortune-telling`,
                    t`Anyone want to follow someone's Fortune-telling`,
                    t`Token price trend `,
                    t`Match victory prediction`,
                  ].map((data, i) => (
                    <Space
                      style={{ fontStyle: 'italic', paddingLeft: 8 }}
                      key={i}
                      size="middle"
                    >
                      <span>⚡️</span>
                      {data}
                    </Space>
                  ))}
                </div>

                <div className="hide-mobile">
                  <div style={{ display: 'inline-block' }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={scrollToCreate}
                    >
                      <Trans>Design your feature</Trans>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section>
        <TrendingSection />
      </section>

      {window.innerWidth > 600 && (
        <section
          id="create"
          style={{
            ...section,
            marginTop: 0,
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          <Create />
        </section>
      )}

      <div
        style={{
          background: 'black',
          padding: 40,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 20, marginBottom: 20 }}>📈⚡️</div>
        <h3 style={{ color: 'white', margin: 0 }}>
          <Trans>
            Big ups to the Ethereum community and
            <ExternalLink
              style={{
                marginLeft: 10,
                marginRight: 10,
                fontWeight: 500,
                borderBottom: '1px solid ' + colors.stroke.action.primary,
              }}
              href="https://juicebox.money/"
            >
              Juicebox
            </ExternalLink>
            for crafting the infrastructure and economy to make Feature possible.
          </Trans>
        </h3>
      </div>
      <Footer />
    </div>
  );
}
