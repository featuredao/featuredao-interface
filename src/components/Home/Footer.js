import { ThemeContext } from 'contexts/themeContext';
import { useContext } from 'react';

// import { Languages } from 'constants/languages/language-options';

export default function Footer() {
  const { colors } = useContext(ThemeContext).theme

  const footerLinksStyles = {
    display: 'grid',
    rowGap: 10,
    justifyContent: 'center',
    marginBottom: 30,
  }

  const link = (text, link) => (
    <a
      style={{
        color: colors.text.action.primary,
        marginLeft: 10,
        marginRight: 10,
      }}
      href={link}
    >
      {text}
    </a>
  )

  // // Renders language links
  // const languageLink = (lang) => (
  //   <span key={lang} onClick={() => setLanguage(lang)}>
  //     {link(Languages[lang].long)}
  //   </span>
  // )

  // // Sets the new language with localStorage and reloads the page
  // const setLanguage = (newLanguage) => {
  //   localStorage.setItem('lang', newLanguage)
  //   window.location.reload()
  //   window.scrollTo(0, 0) // scroll to top of page after reload
  // }

  return (
    <div
      style={{
        display: 'grid',
        rowGap: 20,
        padding: 30,
        background: 'black',
        textAlign: 'center',
      }}
    >
      {/* <div style={footerLinksStyles}>
        {Object.keys(Languages).map(languageLink)}
      </div> */}
      <div style={{ ...footerLinksStyles, display: 'flex' }}>
        {link('GitHub', 'https://github.com/featuredao/featuredao-interface')}
        {link('Twitter', 'https://twitter.com/featuredao')}
      </div>
    </div>
  )
}
