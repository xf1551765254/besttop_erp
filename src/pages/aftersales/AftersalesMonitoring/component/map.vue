/* eslint-disable no-unexpected-multiline */
<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-05 14:24:12
 * @LastEditors: lin
 * @LastEditTime: 2019-08-23 16:34:55
 -->
<template>
  <div class="m-map">
    <div v-if="height!=='0'">
      <div class="search" v-if="placeSearch">
        <input type="text" placeholder="请输入关键字" v-model="searchKey">
        <button type="button" @click="handleSearch">搜索</button>
        <div id="js-result" v-show="searchKey" class="result"></div>
      </div>
      <div class="marCard" :style="{top:(height-60)+'px'}">
        <img src="https://upload-server.besttop.top/review/group1/M00/00/00/rBDwt10UpHmAPzWaAAAE2E2TvG0364.svg" alt="" height="25" width="25"> 顾客地址
      </div>
    </div>
    <div id="js-container" class="map" :style="{height: height + 'px'}">正在加载数据 ...</div>
  </div>
</template>

<script>
import remoteLoad from '@pages/storage/LogisticsDistributionManagement/magData/remoteLoad'
export default {
    props: {
        lat: {
            type: String,
            default: () => String
        },
        lng: {
            type: String,
            default: () => String
        },
        height: {
            type: String,
            default: () => String
        },
        coordinate: {
            type: Array,
            default: () => []
        },
        isRequest: {
            type: Boolean,
            default: () => false
        }
    },
    data () {
        return {
            MapCityName: '西安',
            searchKey: '',
            placeSearch: null,
            marker: null,
            dragStatus: false,
            AMapUI: null,
            AMap: null,
            removeMarArr: [],
            map: null,
            infoWindow: ''
        }
    },
    methods: {
        async getAmp () {
            if (window.AMap.UA) {
                await remoteLoad('https://webapi.amap.com/ui/1.0/main.js')
                await this.initMap()
            }
        },
        // 搜索
        handleSearch () {
            if (this.searchKey) {
                this.placeSearch.search(this.searchKey)
            }
        },
        closeInfoWindow (map) {
            map.clearInfoWindow()
        },
        markerSelect () {},
        // 实例化地图
        initMap () {
        // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            const AMapUI = this.AMapUI = window.AMapUI
            const AMap = this.AMap = window.AMap
            const lat = Number(this.$props.lat)
            const lng = Number(this.$props.lng)
            AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
                const mapConfig = {
                    zoom: 11,
                    // cityName: this.MapCityName,
                    resizeEnable: true
                }
                // 添加点标记，并使用自己的icon
                const map = this.map = new AMap.Map('js-container', mapConfig)
                this.onMarker(this.coordinate)
                // 定位
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
                // 启用 工具条
                // AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                //     map.addControl(new AMap.ToolBar({
                //         position: 'RB'
                //     }))
                //     map.addControl(new AMap.Scale({
                //         position: 'RB'
                //     }))
                // })
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
                        this.$emit('drag', positionResult)
                    }
                })
                // 启动拖放
                positionPicker.start()
                // 路况
                const trafficLayer = new AMap.TileLayer.Traffic({
                    zIndex: 33
                })
                trafficLayer.setMap(this.map)
            })
        },
        onMarker (coordinateData) {
            const self = this
            const AMap = this.AMap = window.AMap
            if (self.map) {
                self.map.remove(this.removeMarArr)
            }
            if (self.infoWindow) {
                self.infoWindow.close()
            }
            const markers = []
            coordinateData.forEach(element => {
                if (element.longitude && element.latitude) {
                    const marker = new AMap.Marker({
                        map: this.map,
                        position: [element.longitude, element.latitude],
                        animation: 'AMAP_ANIMATION_DROP',
                        icon: new AMap.Icon({
                        // 图标尺寸
                            size: new AMap.Size(52, 52),
                            // 图标的取图地址
                            image: 'https://upload-server.besttop.top/review/group1/M00/00/00/rBDwt10UpHmAPzWaAAAE2E2TvG0364.svg',
                            //  // 图标所用图片大小
                            imageSize: new AMap.Size(26, 26)
                        }),
                        offset: new AMap.Pixel(-13, -30)
                    })
                    marker.content = `<div><span>姓名：${element.name}</span><span style="margin-left:20px">电话：${element.telephone}</span>
                                     <span style="margin-left:5px;color:#1296db">${element.logisticsStatusName}</span></div>
                                     <div>地址：${element.address}</div>`
                    const content = `<div><span>姓名：${element.name}</span><span style="margin-left:20px">电话：${element.telephone}</span>
                                     <span style="margin-left:5px;color:#1296db">${element.logisticsStatusName ? element.logisticsStatusName : ''}</span></div>
                                     <div>地址：${element.address}</div>`
                    markers.push(marker)

                    const infoWindow = new AMap.InfoWindow({
                        offset: new this.AMap.Pixel(-5, -20),
                        content: content// 传入 dom 对象，或者 html 字符串
                    })
                    this.AMap.event.addListener(marker, 'click', function () { // 监听点标记的点击事件
                        infoWindow.open(self.map, marker.getPosition())
                        self.infoWindow = infoWindow
                    })
                }
            })
            self.removeMarArr = [...markers]
        }
    },
    async created () {
        // 已载入高德地图API，则直接初始化地图
        if (window.AMap && window.AMapUI) {
            this.initMap()

        // 未载入高德地图API，则先载入API再初始化
        } else {
            await remoteLoad(`https://webapi.amap.com/maps?v=1.3&key=0688f2d62bbf55b2da5d64e7a926c81d`).then(async res => {
                this.getAmp()
            })
        }
    },
    watch: {
        searchKey () {
            if (this.searchKey === '') {
                this.placeSearch.clear()
            }
        },
        isRequest (val) {
            console.log(val)
            if (val) {
            }
        }
    }
}
</script>

<style lang="css">
.m-map {
    min-width: 500px; min-height: 300px; position: relative;
}
.m-map .map {
    width: 100%;
}
.m-map .search {
    position: absolute; top: 10px; left: 10px; width: 285px; z-index: 1;
}
.m-map .search input {
    width: 180px; border: 1px solid #ccc; line-height: 20px; padding: 5px; outline: none;
}
.m-map .search button{
    line-height: 26px; background: #fff; border: 1px solid #ccc; width: 50px; text-align: center;
}
.m-map .result{
    max-height: 143px; overflow: auto; margin-top: 10px;
}
.m-map .marCard {
    position: absolute; left: 5px; width: 120px; z-index: 1;
    background-color: #fff;
    box-shadow:0px 0 6px rgba(114, 124, 245, .5);
    padding:5px;
    border-radius:1px;
}
.m-map .amap-logo,.m-map .amap-copyright {
    z-index: 1;
}
</style>
