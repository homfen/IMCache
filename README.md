# IMCache

Caching javascript data in browser memory.

If one cache is removed, then all caches which depended on it will be removed as well.

You can also remove caches by sending a key from server to client using WebSocket.


## Usage:


#### get(key)

get 获取数据

    @param {string} key 键


#### set(key, value, options)

set 添加数据

    @param {string} key 键
    @param {Object} value 值
    @param {Object} options 附加参数
    @param {number} options.expire 过期时间(ms)
    @param {Array} options.relatedCacheKeys依赖
    @param {string} options.ws WebSocket地址


#### update(key, value)

update 更新数据(不会更新过期时间)

    @param {string} key 键
    @param {Object} value 值


#### remove(key)

remove 根据key移除相应数据

    @param {string | RegExp} key 键字符串|正则


#### clear()

clear 清除所有数据


#### getSize()

getSize 获取cache总大小

