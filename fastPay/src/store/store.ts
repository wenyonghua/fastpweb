import { reactive, readonly } from 'vue'
import { createAction } from './action'
import { createState } from './state'
import { createPersistStorage } from './localstorge';

export interface IState {
    user: any,
    info: any,
    lang: string
}

const state = createState()
const action = createAction(state)

export const useStore = () => {
 const store = {
    state: createPersistStorage<IState>(state),
    action: readonly(action)
}

 return store
}