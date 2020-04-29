export const formatDate = function (timeStamp) {
  if (timeStamp) {
    let date = new Date(timeStamp)
    let dateString = ''
    let yyyy = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = formatTen(MM)
    let dd = date.getDate()
    dd = formatTen(dd)
    let HH = date.getHours()
    HH = formatTen(HH)
    let mm = date.getMinutes()
    mm = formatTen(mm)
    let ss = date.getSeconds()
    ss = formatTen(ss)
    dateString = yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss
    return dateString
  } else {
    return '- -'
  }

  
  function formatTen (num) {
    if (num < 10) {
      num = '0' + num
    }
    return num
  }
}

export const formatType= function (num) {
  if (num === 1) {
     return '收入'
  }else{
    return '支出'
  }
}


/**
 * currencyFormat: 价钱格式转换方法
 * @param value{String|Number} 价格数据
 * @param symbol{String} 货币标志
 * @returns {string}
 */
export function currencyFormat (value, symbol = '￥') {
  value = parseFloat(value)
  if(value > 0){
    return symbol + value.toFixed(2)
  }else if (value < 0) {
    return  '-' + symbol + Math.abs(value.toFixed(2))
  }else {
    return '￥0.00'
  }
}