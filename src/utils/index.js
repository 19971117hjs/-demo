/**
 * 对象数组的深度拷贝.
 * obj是原数组
 */
export const clone = function (obj) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)
  // eslint-disable-next-line
  let constructor = obj.constructor()
  var newObj = new obj.constructor()  // 保持继承链
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {   // 不遍历其原型链上的属性
      var val = obj[key]
      newObj[key] = typeof val === 'object' ? clone(val) : val
    }
  }
  return newObj
}



/**
 * 常见类型判断
 * @param {any} param 
 */
export const getParamType = function (param) {
  // 先判断是否能用typeof 直接判断
  let types1 = ['number', 'string', 'boolean', 'undefined', 'symbol', 'function']
  let type = typeof param;
  type = types1.indexOf(type);
  if (type !== -1) {
      return types1[type]
  }
  // 剩余的用instanceof判断
  switch (true) {
      case param instanceof Date:
          return 'date'
      case param instanceof Array:
          return 'array'
      case param instanceof Object:
          return 'object'
      case null === param && !param:
          return 'null'    
      default:
          return 'can not judge'
  }
}


/**
 * 组合函数（右边为起点）
 */
export const compose = function (...args) {
  return (result) => {
      return args.reduceRight((result, fn) => {
        return fn(result)
      }, result)
  }
}


