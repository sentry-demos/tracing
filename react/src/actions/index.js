// import { ADD_TOOL } from './actionTypes'
const ADD_TOOL = 'ADD_TOOL'
const SET_TOOLS = 'SET_TOOLS'

export const addTool = tool => ({
  type: ADD_TOOL,
  payload: {
    tool
  }
})

export const setTools = tools => ({
  type: SET_TOOLS,
  payload: {
    tools
  }
})