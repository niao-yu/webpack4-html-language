import index from '@/index.html'
let arr = index.split('<content/>')
if (arr.length <= 1) throw new errow('index.html文件中未获取内容标签 <content/>')
let up_arr = arr[0].split('${title}')

module.exports = {
  up: ({ title = undefined }) => {
    let string
    if (!title || (up_arr.length === 1)) string = up_arr[0]
    else string = up_arr[0] + title + up_arr[1]
    return string
  },
  down: () => {
    let string = arr[1]
    return string
  },
}