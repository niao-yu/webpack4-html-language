import './index.scss'
import changeNav from '@/components/topBar/index'
import { setLang } from '@/utils/i18n'
const dom = {
  text_box_new: $('#index .home .text-box_new'),
  home_span: $('#index .home > div > span'),
  about_div: $('#index .about > div'),
  services_content: $('#index .services .services-content'),
  impact_content: $('#index .impact .impact-content'),
}
dom.home_span.on('click', () => {
  changeNav('about')
})
let _setLang = () => {
  setLang({
    path: 'home.newText',
    cb: (data) => {
      let div = ''
      data.forEach(v => {
        div += `<div>${v}</div>`
      })
      dom.text_box_new.html(div)
    },
  })
  setLang({
    path: 'about.title',
    dom: '.about > div > h2',
  })
  setLang({
    path: 'about.headline',
    dom: '.about > div > h3',
  })
  setLang({
    path: 'about.htmlText',
    cb: data => {
      let p = ''
      data.forEach(v => {
        p += `<p>${v}</p>`
      })
      dom.about_div.append(p)
    },
  })
  setLang({
    path: 'services.title',
    dom: '.services > div > h2',
  })
  setLang({
    path: 'services.content',
    cb: data => {
      let _dom = ''
      data.forEach(v => {
        _dom += `
          <div>
            <div></div>
            <h3>${v.smallTitle}</h3>
            <p>${v.text}</p>
          </div>
        `
      })
      dom.services_content.html(_dom)
    },
  })
  setLang({
    path: 'impact.title',
    dom: '.impact > div > h2',
  })
  setLang({
    path: 'impact.content',
    cb: data => {
      let _dom = ''
      data.forEach(v => {
        _dom += `
          <div>
            <div></div>
            <h3>${v.smallTitle}</h3>
            <p>${v.text}</p>
          </div>
        `
      })
      dom.impact_content.html(_dom)
    },
  })
  setLang({
    path: 'contact.text',
    dom: '.contact > p',
  })
  setLang({
    path: 'contact.copyright_left',
    dom: '.contact .copyright .con .left',
  })
  setLang({
    path: 'contact.copyright_right',
    dom: '.contact .copyright .con .right',
  })
}
_setLang()