import { ThemeColors } from './colors'
import { Radii } from './radius'

export const Theme = (themeOption) => ({
  colors: ThemeColors(themeOption),
  radii: Radii,
})
