// import { BigNumber } from '@ethersproject/bignumber'
import { createSlice } from '@reduxjs/toolkit'
// import * as constants from '@ethersproject/constants'

export const defaultProjectState = {
  // Increment this version by 1 when making breaking changes.
  // When users return to the site and their local version is less than
  // this number, their state will be reset.
  version: 1,
  projId: 0,
  detail: {
    logoUri: '',
    description: '',
    token: undefined,
    moreInfo: '',
  },
  judger: {
    judgerName: '',
    judgerDescription: '',
    judgerTwitter: '',
  },
  lock: {
    hasLockTime: false,
    lockTime: 0,
  },
  fee: {
    feeRate: 3,
  },
}

export const editingProjectSlice = createSlice({
  name: 'editingProject',
  initialState: defaultProjectState,
  reducers: {
    setState: (state, action) =>
      action.payload,
    resetState: () => defaultProjectState,
    setProjectId: (state, action) => {
      state.projId = action.payload
    },
    setDetail: (state, action) => {
      state.detail = action.payload
    },
    setJudger: (state, action) => {
      state.judger = action.payload
    },
    setLock: (state, action) => {
      state.lock = action.payload;
    },
    setFee: (state, action) => {
      state.fee = action.payload
    },
  },
})

export const editingProjectActions = editingProjectSlice.actions

export default editingProjectSlice.reducer
