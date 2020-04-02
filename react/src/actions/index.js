// import { ADD_TOOL } from './actionTypes'

let nextTodoId = 0
export const addTool = tool => ({
  type: 'ADD_TOOL',
  payload: {
    // id: ++nextTodoId,
    tool
  }
})