import { 
  ADD_TOOL,
  RESET_CART,
  SET_TOOLS 
} from './types'

export const addTool = tool => ({
  type: ADD_TOOL,
  payload: {
    tool
  }
})
export const resetCart = () => ({
  type: RESET_CART,
  payload: {}
})
export const setTools = tools => ({
  type: SET_TOOLS,
  payload: {
    tools
  }
})