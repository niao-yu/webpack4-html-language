import en from '@/assets/lang/en.js'
import zh from '@/assets/lang/zh.js'

const languageAll = { en, zh }

let localLanguage = 'en'
let localObj = languageAll[localLanguage], reg = /\]\[|\]\.|\[|\]/g
let languageDom = {}
let _$t = path => {
  let arr = path.replace(reg, '.').split('.')
  let result = localObj
  arr.forEach(v => {
    if (v === '') return
    result = result[v]
  })
  return result
}
// 获取文字
export const $t = _$t
// 全局的语言版本
export const local = {
  get: '',
  set: lang => {
    if (lang !== 'en' && lang !== 'zh') throw new error(`该语言版本不支持：${lang}`)
    localLanguage = lang
  },
}

// 设置单个dom的语言
export const setLang = ({ dom, path, cb, reset = false }) => {
  // reset 重新获取dom
  if (reset || !languageDom[dom]) {
    languageDom[dom] = $(dom)
  }
  if (cb) {
    cb(_$t(path))
  } else {
    languageDom[dom].html(_$t(path))
  }
}
