import { ThemeContext } from 'contexts/themeContext'
import { useTheme } from 'hooks/Theme'

export default function ThemeProvider({ children }) {
  const Theme = useTheme()

  return (
    <ThemeContext.Provider value={Theme}>{children}</ThemeContext.Provider>
  )
}
