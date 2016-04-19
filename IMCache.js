/**
 * @file IMCache
 * @author homfen(homfen@outlook.com)
 * @version 0.0.1
 */
'use strict'

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root.IMCache = factory();
    }
})(this,
    function () {
        var _cache = {};
        var _size = 0;

        /**
         * get 获取数据
         *
         * @param {string} key 键
         * @param {Object} options 附加参数
         * @return {Object} 保存的对象
         */
        function get(key, options) {
            var hashKey = getKey(key, options);
            var data = _cache[hashKey];
            if (data) {
                var now = (new Date()).getTime();
                var expire = data.expire + data.timestamp;
                if (now < expire) {
                    return data.value;
                }
                remove(hashKey);
            }
            return null;
        }

        /**
         * set 添加数据
         *
         * @param {string} key 键
         * @param {Object} value 值
         * @param {number} expire 过期时间(ms)
         * @param {Object} options 附加参数
         */
        function set(key, value, expire, options) {
            var hashKey = getKey(key, options);
            _cache[hashKey] = initData(key, value, expire, options);
            setSize();
        }

        /**
         * update 更新数据(不会更新过期时间)
         *
         * @param {string} key 键
         * @param {Object} value 值
         * @param {Object} options 附加参数
         */
        function update(key, value, options) {
            var hashKey = getKey(key, options);
            var data = _cache[hashKey];
            if (data) {
                updateData(data, value);
                setSize();
            }
        }

        /**
         * remove 根据key移除相应数据
         *
         * @param {string} key 键
         */
        function remove(key) {
            delete _cache[key];
            setSize();
        }

        /**
         * remove 清除所有数据
         */
        function clear() {
            _cache = {};
            _size = 0;
        }

        /**
         * 初始化数据，添加过期时间等
         *
         * @param {string} key 键
         * @param {Object} value 值
         * @param {number} expire 过期时间(ms)
         * @param {Object} options 附加参数
         * @return {Object} 修饰过的数据
         */
        function initData(key, value, expire, options) {
            return {
                key: key,
                value: value,
                timestamp: (new Date()).getTime(),
                expire: expire || 0,
                options: options,
                changed: false
            };
        }

        /**
         * 更新数据
         *
         * @param {Object} data 原数据
         * @param {Object} value 新的值
         */
        function updateData(data, value) {
            data.value = value;
            data.changed = true;
        }

        /**
         * 获取cache总大小
         *
         * @return {number} 总大小
         */
        function getSize() {
            return _size;
        }

        /**
         * 设置cache总大小
         */
        function setSize() {
            var size = calculateSize(_cache);
            _size = size;
        }

        /**
         * 计算对象大小
         *
         * @param {Object} obj 对象
         * @return {string} 大小
         */
        function calculateSize(obj) {
            function sizeOf(obj) {
                var bytes = 0;
                if (obj !== null && obj !== undefined) {
                    switch (typeof obj) {
                        case 'number':
                            bytes += 8;
                            break;
                        case 'string':
                            bytes += obj.length * 2;
                            break;
                        case 'boolean':
                            bytes += 4;
                            break;
                        default:
                            var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                            if (objClass === 'Object' || objClass === 'Array') {
                                for (var key in obj) {
                                    if (!obj.hasOwnProperty(key)) {
                                        continue;
                                    }
                                    bytes += sizeOf(key);
                                    bytes += sizeOf(obj[key]);
                                }
                            }
                            else {
                                bytes += obj.toString().length * 2;
                            }
                            break;
                    }
                }
                return bytes;
            }

            function formatByteSize(bytes) {
                if (bytes < 1024) {
                    return bytes + ' b';
                }
                else if (bytes < 1048576) {
                    return (bytes / 1024).toFixed(3) + ' KB';
                }
                else if (bytes < 1073741824) {
                    return (bytes / 1048576).toFixed(3) + ' MB';
                }
                return (bytes / 1073741824).toFixed(3) + ' GB';
            }

            return formatByteSize(sizeOf(obj));
        }

        /**
         * 计算字符串hash值
         *
         * @param {string} str 字符串
         * @return {number} 32bit数字
         */
        function getHash(str) {
            var hash = 0;
            if (str.length === 0) {
                return hash;
            }
            for (var i = 0, len = str.length; i < len; i++) {
                var chr   = str.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash;
        }

        /**
         * 获取key
         *
         * @param {string} key 键
         * @param {Object} options 附加参数
         * @return {string} 计算过的key
         */
        function getKey(key, options) {
            return 'Key' + getHash(key + (options ? JSON.stringify(options) : ''));
        }

        return {
            get: get,
            set: set,
            update: update,
            remove: remove,
            clear: clear,
            getSize: getSize
        };
    }
);
