import { ActionTypes } from './constants'

export * from './type'
export { default as Component } from './component'
export { default as useUndo } from './hooks'
export {
  ActionTypes
}

export function includeFilter(action: ActionTypes | ActionTypes[]) {
  return Array.isArray(action) ? action : [action]
}

export function excludeFilter(action: ActionTypes | ActionTypes[]): ActionTypes[] {
  const result = Object.keys(ActionTypes)
  const exclude = Array.isArray(action) ? action : [action]

  return result.filter(item => !exclude.includes(item as ActionTypes)) as ActionTypes[]
}