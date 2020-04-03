import { 
  ADD_TOOL,
  SET_TOOLS 
} from './types'

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