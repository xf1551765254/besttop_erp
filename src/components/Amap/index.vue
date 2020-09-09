<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: laikt
 * @Date: 2019-04-09 10:51:59
 * @LastEditTime: 2019-08-26 10:13:37
 -->
<template>
  <div class="m-map" :style="{width:mapWidth,height:mapHeight}">
    <div class="search" v-if="placeSearch">
      <input type="text" placeholder="请输入关键字" v-model="searchKey" @keyup.enter="handleSearch">
      <button type="button" @click="handleSearch">搜索</button>
      <div id="js-result" v-show="isResult" class="result"></div>
    </div>
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>
</template>
<script>
import remoteLoad from './remoteLoad'
import { setTimeout } from 'timers'
export default {
    name: 'AMap',
    props: {
        // 经度
        lng: {
            type: String,
            default: ''
        },
        // 纬度
        lat: {
            type: String,
            default: ''
        },
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
            // 搜索
            searchKey: '',
            placeSearch: null,
            dragStatus: false,
            AMapUI: null,
            AMap: null,
            isResult: false,
            getAmpUIime: null,
            isSearch: false
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
                // console.log(res)
                // console.log(window.AMap.UA)
                this.getAmpUI()
            })
        }
    },
    watch: {
        searchKey () {
            if (this.searchKey === '') {
                this.placeSearch.clear()
            }
        }
    },
    methods: {
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
        // 定位成功返回 位置和坐标
        onComplete (data) {
            // data是具体的定位信息
            this.MapInfo = data
            const position = {
                position: this.MapInfo.position,
                address: this.MapInfo.formattedAddress,
                adcode: this.MapInfo.addressComponent.adcode,
                addressComponent: {
                    province: this.MapInfo.addressComponent.province,
                    city: this.MapInfo.addressComponent.city,
                    district: this.MapInfo.addressComponent.district
                }
            }
            // this.$emit('drag', position)
        },
        // 定位失败
        onError (data) {
            // 定位出错
            this.$logger.error(data)
        },
        // 搜索
        handleSearch () {
            if (this.searchKey) {
                this.placeSearch.search(this.searchKey)
                this.isResult = true
                this.isSearch = true
            }
        },
        handleList (SelectChangeEvent) {
            console.log(SelectChangeEvent)
        },
        initMap () {
            // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            const AMap = this.AMap = window.AMap
            const AMapUI = this.AMapUI = window.AMapUI
            const lat = Number(this.$props.lat)
            const lng = Number(this.$props.lng)
            this.getAmpUIime = null
            AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
                const mapConfig = {
                    zoom: this.zoom
                    // cityName: this.MapCityName
                }
                if (lat && lng) {
                    mapConfig.center = [lng, lat]
                }
                const map = new AMap.Map('js-container', mapConfig)

                if (!lat && !lng) {
                    map.plugin('AMap.Geolocation', () => {
                        var geolocation = new AMap.Geolocation({
                            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
                            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                            showButton: true, // 显示定位按钮，默认：true
                            buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
                            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
                            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
                            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
                            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        })

                        geolocation.getCurrentPosition()
                        AMap.event.addListener(geolocation, 'complete', this.onComplete)
                        AMap.event.addListener(geolocation, 'error', this.onError)
                    })
                }

                AMap.service('AMap.PlaceSearch', () => {
                    this.placeSearch = new AMap.PlaceSearch({
                        pageSize: 5,
                        pageIndex: 1,
                        citylimit: true,
                        city: this.MapCityName,
                        map: map,
                        panel: 'js-result',
                        listElementClick: this.handleList
                    })
                })

                // 启用工具条
                AMap.plugin(['AMap.ToolBar'], function () {
                    map.addControl(new AMap.ToolBar({
                        position: 'RB'
                    }))
                })
                // 创建地图拖拽
                const positionPicker = new PositionPicker({
                    mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map: map // 依赖地图对象
                })
                // 拖拽完成发送自定义 drag 事件
                positionPicker.on('success', positionResult => {
                    // 过滤掉初始化地图后的第一次默认拖放
                    if (!this.dragStatus) {
                        this.dragStatus = true
                    } else {
                        const position = {
                            position: positionResult.position,
                            address: positionResult.address,
                            adcode: positionResult.regeocode.addressComponent.adcode,
                            addressComponent: {
                                province: positionResult.regeocode.addressComponent.province,
                                city: positionResult.regeocode.addressComponent.city,
                                district: positionResult.regeocode.addressComponent.district
                            }
                        }
                        console.log('获取地址')
                        this.$emit('drag', position)
                        if (!this.isSearch) {
                            this.isResult = false
                        }
                        this.isSearch = false
                    }
                })
                // 启动拖放
                positionPicker.start()
            })
        },
        deactivated () {
            this.getAmpUIime = null
        }
    }
}
</script>
<style scoped>
@import "./index.less"
</style>
