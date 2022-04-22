import { createContext } from 'react'

import { Theme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/theme-option'

const defaultThemeOption = ThemeOption.dark


export const ThemeContext = createContext({
  themeOption: defaultThemeOption,
  theme: Theme(defaultThemeOption),
  setThemeOption: (themeOption) => { },
  isDarkMode: defaultThemeOption === ThemeOption.dark,
})
