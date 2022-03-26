interface IState {
    user: any,
    info: any,
    lang: string
}

function updateUser(state: IState) {
    return (user: any) => {
        state.user = user
    }
}

function updateMerchantInfo(state: IState) {
    return (info: object) => {
        state.info = info
    }
}

function updateLang(state: IState) {
    return (lang: string) => {
        state.lang = lang
    }
}

/**
* 创建Action
* @param state
*/
export function createAction(state: IState) {
    return {
        updateUser: updateUser(state),
        updateMerchantInfo: updateMerchantInfo(state),
        updateLang: updateLang(state)
    }
}