/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-15 15:54:42
 */
import { message } from 'ant-design-vue/es'
// import defaultSettings from '../defaultSettings';

let lessNodesAppended

const colorList = [
    { key: '薄暮', color: '#F5222D' },
    { key: '嫣红', color: '#e54d42' },
    { key: '火山', color: '#FA541C' },
    { key: '桔橙', color: '#f37b1d' },
    { key: '日暮', color: '#FAAD14' },
    { key: '明黄', color: '#fbbd08' },
    { key: '橄榄', color: '#8dc63f' },
    { key: '森绿', color: '#39b54a' },
    { key: '极绿', color: '#52C41A' },
    { key: '天青', color: '#1cbbb4' },
    { key: '明青', color: '#13C2C2' },
    { key: '拂蓝', color: '#1890FF' },
    { key: '海蓝', color: '#0081ff' },
    { key: '极蓝', color: '#2F54EB' },
    { key: '姹紫', color: '#6739b6' },
    { key: '酱紫', color: '#722ED1' },
    { key: '木槿', color: '#9c26b0' },
    { key: '桃粉', color: '#e03997' },
    { key: '棕褐', color: '#a5673f' }
]

const updateTheme = primaryColor => {
    // Determine if the component is remounted
    if (!primaryColor) {
        return
    }
    const hideMessage = message.loading('正在编译主题！', 0)
    function buildIt () {
        if (!window.less) {
            return
        }
        setTimeout(() => {
            window.less
                .modifyVars({
                    '@primary-color': primaryColor
                })
                .then(() => {
                    hideMessage()
                })
                .catch(() => {
                    message.error('Failed to update theme')
                    hideMessage()
                })
        }, 200)
    }
    if (!lessNodesAppended) {
        const lessStyleNode = document.createElement('link')
        const lessConfigNode = document.createElement('script')
        const lessScriptNode = document.createElement('script')
        lessStyleNode.setAttribute('rel', 'stylesheet/less')
        lessStyleNode.setAttribute('href', '/color.less')
        lessConfigNode.innerHTML = `
            window.less = {
                async: true,
                env: 'production',
                javascriptEnabled: true
            };
        `
        lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js'
        lessScriptNode.async = true
        lessScriptNode.onload = () => {
            buildIt()
            lessScriptNode.onload = null
        }
        document.body.appendChild(lessStyleNode)
        document.body.appendChild(lessConfigNode)
        document.body.appendChild(lessScriptNode)
        lessNodesAppended = true
    } else {
        buildIt()
    }
}

const updateColorWeak = colorWeak => {
    // document.body.className = colorWeak ? 'colorWeak' : '';
    colorWeak ? document.body.classList.add('colorWeak') : document.body.classList.remove('colorWeak')
}

export { updateTheme, colorList, updateColorWeak }
