/*
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: laikt
 * @Date: 2019-04-09 12:22:52
 * @LastEditTime: 2019-04-09 12:23:22
 */
export default function remoteLoad (url, hasCallback) {
    return createScript(url)
    /**
   * 创建script
   * @param url
   * @returns {Promise}
   */
    function createScript (url) {
        const scriptElement = document.createElement('script')
        document.body.appendChild(scriptElement)
        const promise = new Promise((resolve, reject) => {
            scriptElement.addEventListener('load', e => {
                removeScript(scriptElement)
                if (!hasCallback) {
                    resolve(e)
                }
            }, false)

            scriptElement.addEventListener('error', e => {
                removeScript(scriptElement)
                reject(e)
            }, false)

            if (hasCallback) {
                window.____callback____ = function () {
                    resolve()
                    window.____callback____ = null
                }
            }
        })

        if (hasCallback) {
            url += '&callback=____callback____'
        }

        scriptElement.src = url

        return promise
    }

    /**
   * 移除script标签
   * @param scriptElement script dom
   */
    function removeScript (scriptElement) {
        document.body.removeChild(scriptElement)
    }
}
