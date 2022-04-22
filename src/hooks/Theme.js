import { useEffect, useState } from 'react'

import { Theme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/theme-option'

const flattenNestedObject = (
  nestedObj,
  prefix,
) =>
  Object.keys(nestedObj).reduce((acc, key) => {
    const name = prefix ? prefix + '-' + key : key
    return {
      ...acc,
      ...(typeof nestedObj[key] === 'string'
        ? { [name]: nestedObj[key] }
        : flattenNestedObject(nestedObj[key], name)),
    }
  }, {})

export function useTheme(
  storageKey = 'featuredao_theme',
) {
  const initialThemeOption =
    (localStorage.getItem(storageKey)) || ThemeOption.light

  const [currentThemeOption, setCurrentThemeOption] =
    useState(initialThemeOption)

  const [isDarkMode, setIsDarkMode] = useState(
    initialThemeOption === ThemeOption.dark,
  )

  const setRootVarsForThemeOption = (themeOption) => {
    Object.entries(flattenNestedObject(Theme(themeOption).colors)).forEach(
      ([key, value]) =>
        document.documentElement.style.setProperty('--' + key, value),
    )

    Object.entries(Theme(themeOption).radii).forEach(([key, value]) => {
      if (!value) return
      document.documentElement.style.setProperty(
        '--radius-' + key,
        value.toString(),
      )
    })
  }

  useEffect(
    () => setRootVarsForThemeOption(initialThemeOption),
    [initialThemeOption],
  )

  useEffect(
    () => setIsDarkMode(currentThemeOption === ThemeOption.dark),
    [currentThemeOption],
  )

  return {
    themeOption: currentThemeOption,
    theme: Theme(currentThemeOption),
    isDarkMode: isDarkMode,
    forThemeOption: map => map[currentThemeOption],
    setThemeOption: (themeOption) => {
      setRootVarsForThemeOption(themeOption)
      setCurrentThemeOption(themeOption)
      localStorage.setItem(storageKey, themeOption)
    },
  }
}
