import 'reset-css'
let innerWidth
let resize = () => {
  innerWidth = $(window).width()
  document.documentElement.style.fontSize = innerWidth / 16 + 'px'
  let width = window.innerWidth || document.body.clientWidth
  width <= 800 ? innerWidth = true : innerWidth = false
}
window.onresize = () => {
  window.location.reload()
}
resize()
module.exports = {
  innerWidth,
}
