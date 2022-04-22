import { TokensContext } from 'contexts/tokensContext';
import { useTokens } from 'hooks/tokens';

export default function UserProvider({ children }) {
  const {
    tokens,
    getTokens,
    TokenInfo,
    NormalTokens,
  } = useTokens();

  return (
    <TokensContext.Provider
      value={{
        tokens,
        getTokens,
        TokenInfo,
        NormalTokens,
      }}
    >
      {children}
    </TokensContext.Provider>
  )
}
