import { ActionTypes } from './constants'

export * from './type'
export { default as Component } from './component'
export { default as useUndo } from './hooks'
export {
  ActionTypes
}

export function includeFilter(action: keyof typeof ActionTypes | keyof typeof ActionTypes[]) {
  return Array.isArray(action) ? action : [action]
}

export function excludeFilter(action: keyof typeof ActionTypes | keyof typeof ActionTypes[]) {
  const result = Object.keys(ActionTypes)
  const exclude = Array.isArray(action) ? action : [action]

  return result.filter(item => !exclude.includes(item as keyof typeof ActionTypes))
}