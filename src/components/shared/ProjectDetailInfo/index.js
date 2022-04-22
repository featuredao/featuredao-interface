import moment from 'moment';
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react';
import { t } from '@lingui/macro';
import { Link } from 'react-router-dom';

import FormattedAddress from 'components/shared/FormattedAddress';
import ProjectLogo from '../ProjectLogo';
import ExternalLink from '../ExternalLink';

export default function ProjectDetailInfo({
  project,
  link = true,
  children,
  judgerChildren,
  projectChildren,
}) {
  window.project = project;
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)
  window.colors = colors;

  const cardStyle = {
    display: 'flex',
    position: 'relative',
    // alignItems: 'center',
    whiteSpace: 'pre',
    overflow: 'hidden',
    padding: '25px 0',
  }

  const box = (<div>
    <div style={cardStyle}>
      <div style={{ marginRight: 20 }}>
        <ProjectLogo
          uri={project.projInfo[1]}
          name={project.projInfo[0]}
          size={120}
        />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          fontWeight: 400,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <h1
            style={{
              color: colors.text.primary,
              margin: 0,
              overflow: 'hidden',
              wordBreak: 'break-all',
              whiteSpace: 'normal',
              fontSize: '2.4rem',
              lineHeight: '2.8rem',
            }}
          >
            {project.projInfo[0]}
          </h1>
          {
            !!(project.projId * 1) && <div style={{
              color: colors.text.tertiary,
            }}>ID: {project.projId}</div>
          }
        </div>
        <div
          style={{
            color: colors.text.primary,
            margin: 0,
            overflow: 'hidden',
            wordBreak: 'break-all',
            whiteSpace: 'break-spaces',
          }}
        >
          {project.projInfo[2]}
          {
            !!project.projInfo[3] && <ExternalLink
            style={{
              color: colors.text.action.primary,
              fontWeight: 500,
              marginLeft: '1em',
              borderBottom:
                '1px solid ' + colors.stroke.action.primary,
            }}
            href={project.projInfo[3]}
          >
            {t`More Info`}
          </ExternalLink>
          }
        </div>
        <div
          style={{
            color: colors.text.tertiary,
            margin: 0,
            overflow: 'hidden',
            wordBreak: 'break-all',
            whiteSpace: 'normal',
          }}
        >
          <span>{t`Can MakeJudgment`}&nbsp;</span>
          {
            (0 === project.lockTime || '0' === project.lockTime) ? (<span>any time, No Lock</span>) : (<span>util {moment.unix(project.lockTime).format('YYYY-MM-DD HH:mm:ss')}</span>)
          }
        </div>
        <div
          style={{
            color: colors.text.tertiary,
            margin: 0,
            overflow: 'hidden',
            wordBreak: 'break-all',
            whiteSpace: 'normal',
          }}
        >
          {t`feeRate`}: {project.feeRate / 10}/‰
        </div>
        {projectChildren}
      </div>
    </div>
    <div style={cardStyle}>
      <div style={{ marginRight: 20 }}>
        <ProjectLogo
          uri={`https://unavatar.io/twitter/${project.judgerInfo[2]}`}
          name={project.judgerInfo[2]}
          size={120}
        />
      </div>
      <div
        style={{
          color: colors.text.primary,
          margin: 0,
          overflow: 'hidden',
          wordBreak: 'break-all',
          whiteSpace: 'normal',
        }}
      >
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <span style={{
            marginRight: '1em',
            color: colors.text.tertiary,
            fontWeight: 500
          }}>
            Judger
          </span>
          {project.judgerInfo[0]}
          <span style={{
            color: colors.text.tertiary,
            fontWeight: 500
          }}>
            {
              !!project.judgerInfo[2] && <ExternalLink
                style={{
                  color: colors.text.action.primary,
                  fontWeight: 500,
                  marginLeft: '1em',
                  marginRight: '1em',
                  borderBottom:
                    '1px solid ' + colors.stroke.action.primary,
                }}
                href={`https://twitter.com/${project.judgerInfo[2]}`}
              >
                @{project.judgerInfo[2]}
              </ExternalLink>
            }
            <FormattedAddress address={project.judger} />
          </span>
        </div>

        <div
          style={{
            // color: colors.text.tertiary,
            fontWeight: 500,
            whiteSpace: 'break-spaces',
          }}
        >
          {project.judgerInfo[1]}
        </div>

        {judgerChildren}
      </div>
    </div>
    { children }
  </div>);

  if (!link || '0' === project?.projId || 0 === project?.projId) {
    return box;
  }

  return (
    <Link
      style={{
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
        margin: 10,
      }}
      key={project?.projId}
      to={`/p/${project.projId}`}
    >
      {box}
    </Link>
  )
}
