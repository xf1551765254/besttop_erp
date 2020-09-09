<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: laikt
 * @Date: 2019-04-12 17:13:19
 * @LastEditTime: 2019-04-15 15:50:19
 -->
<template>
  <div>
    <canvas v-for="page in pages" crossOrigin="anonymous" :id="'the-canvas'+page" :key="page"></canvas>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
import { mapGetters } from 'vuex'
const Base64 = require('js-base64').Base64
export default {
    data () {
        return {
            title: '',
            pdfDoc: null,
            loadding: false,
            pages: 0,
            watermark: true
        }
    },
    computed: {
        ...mapGetters(['name'])
    },
    methods: {
        renderPage (num) {
            const _this = this
            this.pdfDoc.getPage(num).then(function (page) {
                const canvas = document.getElementById('the-canvas' + num)
                const ctx = canvas.getContext('2d')
                // ctx.cearRect(0, 0, 160, 100) // 绘制之前画布清除

                const dpr = window.devicePixelRatio || 1
                const bsr = ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1
                const ratio = dpr / bsr
                var viewport = page.getViewport(screen.availWidth / page.getViewport(1).width)
                canvas.width = viewport.width * ratio
                canvas.height = viewport.height * ratio
                canvas.style.width = viewport.width + 'px'
                canvas.style.height = viewport.height + 'px'
                //* * 水印开始*/
                console.log(_this.watermark)

                if (_this.watermark) {
                    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
                    ctx.font = '130px 黑体'
                    ctx.rotate(-20 * Math.PI / 180)
                    ctx.textAlign = 'center'// 文本水平对齐方式
                    ctx.textBaseline = 'middle'// 文本垂直方向，基线位置
                    ctx.fillStyle = 'rgba(100,100,100,0.2)'

                    var ftop = canvas.height / 4
                    var fleft = canvas.width / 8
                    ctx.fillText(`${_this.name}内部文件，禁止下载`, fleft, ftop)// 文本元素在画布居中方式
                    ctx.rotate(20 * Math.PI / 180) // 坐标系还原
                    ctx.globalCompositeOperation = 'destination-over'
                }
                //* * 水印结束*/
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                }
                page.render(renderContext)
                if (_this.pages > num) {
                    _this.renderPage(num + 1)
                }
            })
        },
        loadFile (url) {
            const _this = this
            PDFJS.getDocument(url).then(function (pdf) {
                _this.pdfDoc = pdf
                _this.pages = _this.pdfDoc.numPages
                _this.$nextTick(() => {
                    _this.renderPage(1)
                })
            })
        }
    },
    mounted () {
        const url = Base64.decode(this.$route.query.url)
        this.watermark = Base64.decode(this.$route.query.watermark)

        console.log(url, this.watermark)

        this.loadFile(url)
    }
}
</script>

<style scoped>
canvas {
  display: block;
  border-bottom: 1px solid black;
}
</style>
