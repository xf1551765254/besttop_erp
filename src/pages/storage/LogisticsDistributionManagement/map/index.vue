<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: shuai
 * @Date: 2019-04-09 10:51:59
 * @LastEditTime: 2019-08-07 17:52:45
 -->
<template>
  <div class="m-map" :style="{width:mapWidth,height:mapHeight}">
    <div id="js-container" class="map"></div>
  </div>
</template>

<script>
import remoteLoad from './remoteLoad'
import { setTimeout } from 'timers'
export default {
    name: 'AMap',
    props: {
        // 宽度
        mapWidth: {
            type: String,
            default: '100%'
        },
        // 高度
        mapHeight: {
            type: String,
            default: '100%'
        },
        // 地图显示级别
        zoom: {
            type: Number,
            default: 13
        }
    },
    data () {
        return {
            MapKey: '666843b3e90f2d48a24fc65d5b863c46',
            MapInfo: {},
            dragStatus: false,
            AMapUI: null,
            AMap: null,
            getAmpUIime: null,
            map: null,
            markers: [],
            defaultImgUrl: require('@assets/redchesPieces.png')
        }
    },

    async mounted () {
        // 已载入高德地图API，则直接初始化地图
        console.log(window.AMap, window.AMapUI)

        if (window.AMap && window.AMapUI) {
            this.initMap()
            // 未载入高德地图API，则先载入API再初始化
        } else {
            await remoteLoad(`https://webapi.amap.com/maps?v=1.3&key=${this.MapKey}`).then(async res => {
                this.getAmpUI()
            })
        }
    },
    watch: {

    },
    methods: {
        /**
         * @name: 绘制点
         * @msg:
         * @param {type}
         * @return:
         */
        drawFun (e) {
            console.log(e)
            if (this.markers.length !== 0) {
                for (const item of this.markers) {
                    this.map.remove(item)
                }
            }
            const AMap = this.AMap = window.AMap
            const arr = [...e]
            arr.forEach(element => {
                const endIcon = new AMap.Icon({
                    size: new this.AMap.Size(52, 52),
                    image: this.defaultImgUrl,
                    imageSize: new this.AMap.Size(26, 26),
                    offset: new AMap.Pixel(10, 0)
                })
                console.log([element.longitude, element.latitude])
                const marker = new this.AMap.Marker({
                    map: this.map,
                    position: [element.longitude, element.latitude],
                    animation: 'AMAP_ANIMATION_DROP',
                    icon: endIcon,
                    extData: element.id
                })
                this.markers.push(marker)
                this.map.setFitView()
                this.AMap.event.addListener(marker, 'click', (e) => { // 监听点标记的点击事件
                    const id = e.target.G.extData
                    this.$emit('drag', id)
                })
            })
        },
        async getAmpUI () {
            if (window.AMap.UA) {
                await remoteLoad('https://webapi.amap.com/ui/1.0/main.js')
                await this.initMap()
            } else {
                this.getAmpUIime = setTimeout(() => {
                    this.getAmpUI()
                }, 50)
            }
        },
        initMap () {
            // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            const AMap = this.AMap = window.AMap
            const AMapUI = this.AMapUI = window.AMapUI
            this.getAmpUIime = null
            AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
                const mapConfig = {
                    zoom: this.zoom
                }
                this.map = new AMap.Map('js-container', mapConfig)
                // 创建地图拖拽
                const positionPicker = new PositionPicker({
                    mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map: this.map // 依赖地图对象
                })
                // 启动拖放
                positionPicker.start()
            })
        }
    }
}
</script>
<style scoped>
@import "./index.less";
</style>
