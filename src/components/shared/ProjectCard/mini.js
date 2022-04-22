import moment from 'moment';
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { Link } from 'react-router-dom'

import ProjectLogo from '../ProjectLogo';

export default function ProjectCardMini({
  project,
  link = true,
}) {
  window.project = project;
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const cardStyle = {
    display: 'flex',
    position: 'relative',
    alignItems: 'flex-start',
    whiteSpace: 'pre',
    overflow: 'hidden',
    padding: '25px 20px',
  }

  const box = (<div style={cardStyle} className="clickable-border">
    <div style={{ marginRight: 20 }}>
      <ProjectLogo
        uri={project.projInfo[1]}
        name={project.projInfo[0]}
        size={110}
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
          color: colors.text.primary,
          margin: 0,
          overflow: 'hidden',
          wordBreak: 'break-all',
          whiteSpace: 'normal',
        }}
      >
        {project.projInfo[0]}
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
          Judger: {project.judgerInfo[0]}
          <span style={{
            marginLeft: 10,
            color: colors.text.tertiary,
            fontWeight: 500
          }}>
            @{project.judgerInfo[2]}
          </span>
        </div>
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
        <span style={{ marginRight: 10 }}>#{project.projId}</span>
        {
          (0 === project.lockTime || '0' === project.lockTime) ? (<span>No Lock</span>) : (<span>Lock util {moment.unix(project.lockTime).format('YYYY-MM-DD HH:mm:ss')}</span>)
        },
        <span style={{ marginLeft: 10, marginRight: 10 }}>feeRate: {project.feeRate / 10}/‰</span>
      </div>
    </div>
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
      to={`/f/${project.projId}`}
    >
      {box}
    </Link>
  )
}
