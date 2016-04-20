# IMCache

Caching javascript data in browser memory.

## Usage:

#### get(key, options)

get 获取数据

@param {string} key 键

@param {Object} options 附加参数

#### set(key, value, expire, options)

set 添加数据

@param {string} key 键

@param {Object} value 值

@param {number} expire 过期时间(ms)

@param {Object} options 附加参数

#### update(key, value, options)

update 更新数据(不会更新过期时间)

@param {string} key 键

@param {Object} value 值

@param {Object} options 附加参数

#### remove(key)

remove 根据key移除相应数据

@param {string | Function | RegExp} key 键字符串|过滤函数|正则

#### clear()

remove 清除所有数据

#### getSize()

获取cache总大小

