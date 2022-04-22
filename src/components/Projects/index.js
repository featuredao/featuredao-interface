import _ from 'lodash';
import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
// import Search from 'antd/lib/input/Search'
import Loading from 'components/shared/Loading';
// import { getContractBuildInfo } from 'hooks/ContractLoader';

// import { ProjectCategory } from 'models/project-visibility'
import React, { useContext, useEffect, useState } from 'react';
// useRef, useMemo

// import Grid from 'components/shared/Grid'
import ProjectCard from 'components/shared/ProjectCard';

import { Link } from 'react-router-dom';
// useLocation
// useHistory
import { UserContext } from 'contexts/userContext';


import { layouts } from 'constants/styles/layouts';

export function formatProjectFromBigData(data) {
  const viewData = {
    projId: data.projId.toString(),
    project: data.project,
    judger: data.judger,
    lockTime: data.lockTime.toString(),
    feeRate: data.feeRate.toString(),
    createBlockNumber: data.createBlockNumber.toString(),
    projInfo: data.projInfo,
    judgerInfo: data.judgerInfo,
  }
  return viewData;
}
export default function Projects() {

  const { contracts } = useContext(UserContext)
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  window.projects = projects;

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


  // const [selectedTab, setSelectedTab] = useState(defaultTab)
  
  const isLoading = isLoadingProjects;

  return (
    <div style={{ ...layouts.maxWidth }}>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <h1>
            <Trans>Features on FeatureDao</Trans>
          </h1>

          <Link to="/create">
            <Button>
              {t`Create Feature`}
            </Button>
          </Link>
        </div>

        <div>
          <p style={{ maxWidth: 800, marginBottom: 20 }}>
            <Trans>
              <InfoCircleOutlined /> The FeatureDao is open to anyone,
              and feature configurations can vary widely. There are risks
              associated with interacting with all features on the protocol.
              Features built on the protocol are not endorsed or vetted by
              FeatureDao or Peel. Do your own research and understand the risks
              before committing your funds.
            </Trans>
          </p>
        </div>
      </div>

      <React.Fragment>
        {
          projects && projects.map((p, i) => (
            <ProjectCard key={i} project={p} />
          )
          )}

        {(isLoading) && <Loading />}
      </React.Fragment>
    </div>
  )
}
