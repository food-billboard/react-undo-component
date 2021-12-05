import { ActionTypes } from './constants'

export type StateType<S> = {
  past: S[] 
  present: S 
  future: S[] 
}

export interface ComponentProps<S=any> {

  // 限制保存的记录数量
  limit?: number | false 

  // 自定义筛选需要保存的状态
  filter?: (action: ActionTypes, currentState: StateType<S>, previousHistory: StateType<S>) => boolean 

  // 是否打印状态  
  debug?: boolean 

}