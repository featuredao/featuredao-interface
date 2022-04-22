import { Row, Col, Button, Tooltip } from 'antd';
// import { InfoCircleOutlined } from '@ant-design/icons';

import _ from 'lodash';
import { Link } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from 'contexts/themeContext';
import { Trans } from '@lingui/macro';

import Grid from 'components/shared/Grid';
import { UserContext } from 'contexts/userContext';
import Loading from 'components/shared/Loading';

import ProjectCardMini from 'components/shared/ProjectCard/mini';
import { formatProjectFromBigData } from 'components/Projects/index';


import useMobile from 'hooks/Mobile';

function Features() {
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const { contracts } = useContext(UserContext)

  useEffect(() => {
    if (contracts?.FeatureProjectInfo?.getAllProjects) {
      contracts.FeatureProjectInfo.getAllProjects().then((res) => {
        const arr = [];
        _.map(res, (data) => {
          arr.push(formatProjectFromBigData(data));
        });
        setIsLoadingProjects(false);
        setProjects(_.reverse(arr));
      }).catch((err) => {
        console.log('err', err);
        setProjects([]);
      });
    }
  }, [
    contracts?.FeatureProjectInfo,
    contracts?.FeatureProjectInfo?.getAllProjects
  ]);

  return <React.Fragment>
    <Grid gutter={10}>
      {
        projects && _.slice(projects, 0, 10).map((p, i) => (
          <ProjectCardMini key={i} project={p} />
        ))
      }
    </Grid>


    {(isLoadingProjects) && <Loading />}
  </React.Fragment>
}


export default function TrendingSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const isMobile = useMobile()

  const trendingProjectsStyle = {
    // Light theme uses a slightly lighter background than background-l1
    backgroundColor: isDarkMode ? colors.background.l1 : '#e7e3dc80',
    margin: '150px 0',
    paddingTop: !isMobile ? 40 : 80,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 0,
  }

  const headingStyles = {
    fontWeight: 600,
    marginBottom: 15,
    fontSize: 22,
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }

  return (
    <section style={trendingProjectsStyle}>
      <Row style={{ maxWidth: 1200, margin: 'auto' }}>
        <Col xs={24} lg={24}>
          <div style={{ paddingBottom: 20 }}>
            <h3 style={headingStyles}>
              <Trans>
                <span style={{ marginRight: 12 }}>Daoing features</span>
              </Trans>
            </h3>
            <Features />

            <Button type="default" style={{ marginBottom: 40, marginTop: 15 }}>
              <Link to="/features">
                <Trans>More daoing features</Trans>
              </Link>
            </Button>
          </div>
        </Col>
      </Row>
    </section>
  )
}
