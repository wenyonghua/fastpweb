import { reactive } from 'vue'

export interface IState {
  user: any,
  info: any,
  lang: string
}

export const State: IState = {
    user: {},
    info: {},
    lang: 'en'
}

export function createState() {
 return reactive(State)
}