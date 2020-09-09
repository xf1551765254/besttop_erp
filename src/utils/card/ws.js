/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-06 09:06:28
 * @LastEditors: lmt
 * @LastEditTime: 2019-06-06 11:15:33
 */
import is from 'is_js'

// 记录用户回调
let cbk = null
let cbkR = null
// 记录长连接状态
let socketOpen = false
// 记录未发出的消息
const socketMsgQueue = []
// 长连接实体
export let websock = null

/**
 * @description 写卡
 * @param {*} data
 * @param {*} callback
 * @param {string} [type='MSR']
 */

export const onWrite = (data, callback, type = 'MSR') => {
    cbkR = callback
    if (type === 'MSR') {
        websocketsend({
            fun: 'startLoopWrite',
            data: {
                track1: null,
                track2: data,
                track3: null
            }
        })
    }
}
/**
 * @description 开始读卡
 * @param {function} [type=(data)=>void] 回调方法
 * @param {string} [type='MSR'] MSR:磁卡， IC：IC卡，默认磁卡
 */
export const onRead = (callback, type = 'MSR') => {
    cbk = callback
    if (type === 'MSR') {
        websocketsend({
            fun: 'startLoopRead'
        })
    }
}
export const readStop = () => {
    websocketsend({
        fun: 'stopLoopRead'
    })
}

export const initCard = () => {
    websocketsend({
        fun: 'erase'
    })
}

/**
 * @description 处理回调
 * @author Oak
 * @param {*} data
 */
const parseResponse = (res) => {
    if (!res) return
    const { flag, type, data } = res
    switch (type) {
    case 'websockStarted':
        console.log(type, data)
        break
    case 'read':
        try {
            const trackStr = JSON.parse(data)
            if (trackStr.trackStr2 && ['Error', 'Black', '?', '*', '+'].indexOf(trackStr.trackStr2) < 0) {
                cbk(trackStr.trackStr2, null)
            } else {
                cbk(null, '读卡失败！')
            }
        } catch (error) {
            cbk(null, '读卡失败！')
        }
        break
    case 'readStoped':
        cbk = null
        break
    case 'writed':
        if (flag === 1) {
            cbkR({
                flag: 1,
                msg: '写卡成功！'
            }, null)
            cbkR = null
        } else {
            cbkR(null, '写卡失败！')
            cbkR = null
        }
        break
    default:
        break
    }
}

/**
 * @description 初始化weosocket
 */
const initWebSocket = () => {
    if (socketOpen) return
    const wsuri = 'ws://127.0.0.1:8888/websocket'
    websock = new WebSocket(wsuri)
    websock.onmessage = websocketonmessage
    websock.onopen = websocketonopen
    websock.onerror = websocketonerror
    websock.onclose = websocketclose
}

/**
 * @description 连接建立之后执行send方法发送数据
 */
const websocketonopen = () => {
    socketOpen = true
    const socketMsgQueueCache = [...socketMsgQueue]
    socketMsgQueue.length = 0
    socketMsgQueueCache.map(o => {
        websocketsend(o)
    })
}

/**
 * @description 连接建立失败重连
 */
const websocketonerror = (err) => {
    console.log(err)
    socketOpen = false
    initWebSocket()
}

/**
 * @description 数据接收
 * @param {*} e
 */
const websocketonmessage = ({ data }) => {
    try {
        parseResponse(JSON.parse(data))
    } catch (err) {
        console.error(err)
        parseResponse(null)
    }
}

/**
 * @description 数据发送
 * @param {*} Data
 */
const websocketsend = (Data) => {
    if (is.not.object(Data)) {
        console.log('ERROR: 入参不是JSON')
        return
    }
    if (socketOpen) {
        websock.send(JSON.stringify(Data))
    } else {
        socketMsgQueue.push(Data)
        initWebSocket()
    }
}
/**
 * @description 关闭
 * @param {*} e
 */
const websocketclose = (e) => {
    console.log('断开连接', e)
    socketOpen = false
    try {
        cbk(null, '设备断开连接！')
    } catch (error) {}
    cbk = null
}
