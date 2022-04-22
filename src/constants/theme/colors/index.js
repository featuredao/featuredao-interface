import { backgroundColors } from './background'
import { iconColors } from './icon'
import { strokeColors } from './stroke'
import { textColors } from './text'
import { boxShadow } from './boxShadow'

export const ThemeColors = (themeOption) => ({
  background: backgroundColors[themeOption],
  text: textColors[themeOption],
  icon: iconColors[themeOption],
  stroke: strokeColors[themeOption],
  boxShadow: boxShadow[themeOption],
})
