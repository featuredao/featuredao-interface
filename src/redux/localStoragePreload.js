import { defaultProjectState } from './slices/editingProject'

import { REDUX_STATE_LOCALSTORAGE_KEY } from './store'

export default function getLocalStoragePreloadedState() {
  try {
    const stateString = localStorage.getItem(REDUX_STATE_LOCALSTORAGE_KEY)
    if (!stateString) {
      return undefined
    }

    const parsedState = JSON.parse(stateString)

    // If the localStorage `version` is the same, we can proceed and
    // hydrate our preloaded state with it.
    // If not, we should effectively discard it.
    if (
      parsedState?.reduxState?.editingProject?.version ===
      defaultProjectState.version
    ) {
      return parsedState.reduxState
    } else {
      localStorage.removeItem(stateString)
    }
  } catch (e) {
    return undefined
  }
}
