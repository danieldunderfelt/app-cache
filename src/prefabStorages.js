import { PromisifyStorage } from './PromisifyStorage'
import { Storage } from './Storage'

let win = window || {}

export const LocalStorage = 'localStorage' in win ? Storage(PromisifyStorage( win.localStorage )) : false
export const SessionStorage = 'sessionStorage' in win ? Storage(PromisifyStorage( win.SessionStorage )) : false