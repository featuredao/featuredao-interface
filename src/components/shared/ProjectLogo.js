import { ThemeContext } from 'contexts/themeContext';
import { useContext } from 'react';
import { Image } from 'antd';

export default function ProjectLogo({
  uri,
  name,
  size,
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)
  const _size = size ?? 80

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        height: _size,
        width: _size,
        borderRadius: radii.xl,
        background: uri ? undefined : colors.background.l1,
      }}
    >
      {uri ? (
        <Image
          style={{
            maxHeight: '100%',
            minWidth: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src={uri}
          alt={name + ' logo'}
        />
      ) : (
        <div
          style={{
            fontSize: '2.5rem',
          }}
        >
          📈
        </div>
      )}
    </div>
  )
}
