
export enum ActionTypes {
  UNDO = "UNDO",
  REDO = "REDO",
  JUMP = "JUMP",
  JUMP_TO_PAST = "JUMP_TO_PAST",
  JUMP_TO_FUTURE = "JUMP_TO_FUTURE",
  CLEAR_HISTORY = "CLEAR_HISTORY"
}

export const CAN_NOT_DEALING = "__CAN_NOT_DEALING__"

export const DEFAULT_CONFIGURATION = {
  limit: false,
  debug: false,
  filter() {
    return true 
  }
}