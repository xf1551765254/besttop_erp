/* eslint-disable no-unexpected-multiline */
<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-06-05 14:24:12
 * @LastEditors: shuai
 * @LastEditTime: 2019-07-31 14:48:00
 -->
<template>
  <div class="m-map">
    <div class="search" v-if="placeSearch">
      <input type="text" placeholder="请输入关键字" v-model="searchKey">
      <button type="button" @click="handleSearch">搜索</button>
      <div id="js-result" v-show="searchKey" class="result"></div>
    </div>
    <div id="js-container" class="map" :style="{height: height + 'px'}">正在加载数据 ...</div>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
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
        routeList: {
            type: Array,
            default: () => []
        },
        centralPoint: {
            type: Array,
            default: () => []
        },
        status: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            SimpleMarker: null,
            MapCityName: '西安',
            searchKey: '',
            placeSearch: null,
            marker: null,
            dragStatus: false,
            AMapUI: null,
            AMap: null,
            map: null,
            markers: [],
            polygon: null,
            sign: {
                signOne: 'https://upload-server.besttop.top/review/group1/M00/00/01/rBDwt10ZacCAdIurAAAEXnnJlCo170.png',
                signTwe: 'https://upload-server.besttop.top/review/group1/M00/00/01/rBDwt10ZacWAJNkSAAAEX0i-GWo989.png',
                signThree: 'https://upload-server.besttop.top/review/group1/M00/00/01/rBDwt10ZacuAVcrjAAAEX30XCYo033.png',
                signFour: 'https://upload-server.besttop.top/review/group1/M00/00/01/rBDwt10ZadCAXZf9AAAEX_ht-10766.png',
                signFive: 'https://upload-server.besttop.top/review/group1/M00/00/01/rBDwt10ZadWAKS5wAAAEXTvIjto320.png',
                signSix: 'https://upload-server.besttop.top/review/group1/M00/00/01/rBDwt10ZaxuAKch7AAAEX_lTWIw278.png'
            },
            pathList: [] // 所有线路
        }
    },
    methods: {
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
            AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
                const mapConfig = {
                    zoom: 16,
                    cityName: this.MapCityName,
                    resizeEnable: true
                }
                this.map = new AMap.Map('js-container', mapConfig)
                // 添加点标记，并使用自己的icon
                this.onMarker(this.map)
                // AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                //     this.map.addControl(new AMap.ToolBar({
                //         position: 'LB'
                //     }))
                //     this.map.addControl(new AMap.Scale())
                // })
                // 创建地图拖拽
                const positionPicker = new PositionPicker({
                    mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map: this.map // 依赖地图对象
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
        onMarker (map) {
            const AMap = this.AMap = window.AMap
            if (this.markers.length !== 0) {
                for (const item of this.markers) {
                    map.remove(item)
                }
            }
            this.ScopeMap(AMap, map)
            this.coordinate.forEach(element => {
                let image = null
                switch (element.status) {
                case null: image = 'https://upload-server.besttop.top/review/group1/M00/00/00/rBDwt10UpHmAPzWaAAAE2E2TvG0364.svg'
                    break
                case this.status.status1: image = this.sign.signOne
                    break
                case this.status.status2: image = this.sign.signTwe
                    break
                case this.status.status3: image = this.sign.signThree
                    break
                case this.status.status4: image = this.sign.signFour
                    break
                case this.status.status5: image = this.sign.signFive
                    break
                case this.status.status6: image = this.sign.signSix
                    break
                }
                const endIcon = new AMap.Icon({
                    size: new this.AMap.Size(52, 52),
                    image: image,
                    imageSize: new this.AMap.Size(26, 26),
                    offset: new AMap.Pixel(10, 0)
                })
                const marker = new this.AMap.Marker({
                    map: map,
                    position: [element.lng, element.lat],
                    animation: 'AMAP_ANIMATION_DROP',
                    icon: endIcon
                })
                this.markers.push(marker)
                // this.AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
                //     this.SimpleMarker = new SimpleMarker({
                //         iconLabel: '2',
                //         // 自定义图标节点(img)的属性
                //         iconStyle: {
                //             src: image,
                //             style: {
                //                 width: '30px',
                //                 height: '30px'
                //             }
                //         },
                //         // 设置基点偏移
                //         offset: new AMap.Pixel(-10, -30),
                //         map: map,
                //         showPositionPoint: true,
                //         // position: [this.lng, this.lat],
                //         zIndex: 200
                //     })
                // })
                // const content = [
                //     '<div><b>基础信息</b>',
                //     '单据号 : ' + element.code + '   状态 : ' + element.statusName,
                //     '姓名 : ' + element.custName + '  电话 : ' + element.custPhone,
                //     '地址 : ' + element.custAddr + '</div></div>'
                // ]
                // // 创建 infoWindow 实例
                // const infoWindow = new AMap.InfoWindow({
                //     content: content.join('<br>') // 传入 dom 对象，或者 html 字符串
                // })
                // this.AMap.event.addListener(marker, 'click', function () { // 监听点标记的点击事件
                //     infoWindow.open(map, marker.getPosition()) // 信息窗体打开
                // })
                // // 绑定右键菜单
                // const contentRight = [
                //     '<div class="context-menu">',
                //     '<ul>',
                //     '<li class="lineAdd" data-flag =' + element.id + '>切换线路</li>',
                //     '</ul>',
                //     '</div>'
                // ]
                // const contextMenu = new AMap.ContextMenu({
                //     isCustom: true,
                //     content: contentRight.join('')
                // })
                // marker.on('rightclick', (e) => {
                //     console.log(e)
                //     contextMenu.open(map, e.lnglat)
                //     setTimeout(() => {
                //         const a = document.getElementsByClassName('lineAdd')[0]
                //         console.log(a)
                //         // 返回当前坐标
                //         console.log(e.target.G.position, '右击坐标')
                //         a.onclick = (e) => {
                //             // 返回用户id
                //             this.$emit('obtain', e.target.dataset.flag)
                //             // console.log(e.target.dataset.flag, '用户id')
                //             contextMenu.close()
                //         }
                //     }, 200)
                // })

                const contentLeft = [
                    '<div class="contentRight">',
                    '<div class="title">',
                    '<span>' + element.statusName + '</span><span>' + element.code + '</span>',
                    '</div>',
                    '<div class="namePone">',
                    '<span>' + element.custName + ' </span><span>' + element.custPhone + '</span>',
                    '</div>',
                    '<div class="address">',
                    '<span>' + element.custAddr + '</span>',
                    '</div>',
                    '<div data-id =' + element.id + ' class="line">' + element.routeName + '',
                    '</div>',
                    '<div class="mask">',
                    '<div class="lineRight">',
                    '<div>请选择切换线路</div>',
                    '<div class="lineArr">',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</div>'
                ]
                const contextLeftMenu = new AMap.ContextMenu({
                    isCustom: true,
                    content: contentLeft.join('')
                })
                const that = this
                this.AMap.event.addListener(marker, 'click', function (e) { // 监听点标记的点击事件
                    contextLeftMenu.open(map, e.lnglat)
                    setTimeout(() => {
                        const line = document.getElementsByClassName('line')[0]
                        const mask = document.getElementsByClassName('mask')[0]
                        const lineArr = document.getElementsByClassName('lineArr')[0]
                        line.onmouseover = function (e) {
                            that.billMessage()
                            mask.style.display = 'block'
                            that.map.setStatus({ scrollWheel: false })
                            console.log(e.target.dataset)
                        }
                        line.onmouseout = function () {
                            mask.style.display = 'none'
                            that.map.setStatus({ scrollWheel: true })
                        }
                        mask.onmouseover = function () {
                            mask.style.display = 'block'
                            that.map.setStatus({ scrollWheel: false })
                        }
                        mask.onmouseout = function () {
                            mask.style.display = 'none'
                            that.map.setStatus({ scrollWheel: true })
                        }
                        lineArr.onclick = function (e) {
                            console.log(e.target.dataset)
                        }
                    }, 200)
                })
            })
        },
        ScopeMap (AMap, map) {
            if (this.polygon) {
                map.remove(this.polygon)
            }
            if (this.routeList.length === 0) {
                return
            }
            this.polygon = new AMap.Polygon({
                path: this.routeList,
                strokeColor: '#FF33FF',
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                fillColor: '#1791fc',
                zIndex: 50
            })

            map.add(this.polygon)
            // 缩放地图到合适的视野级别
            map.setFitView([ this.polygon ])
            map.setCenter(this.centralPoint)
        },
        billMessage () {
            axios({
                path: 'BillDeliverFindStatistics',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    if (data.routes.length > 0) {
                        data.routes.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                    }
                    this.pathList = data.routes
                    const lineArr = document.getElementsByClassName('lineArr')[0]
                    let html = ''
                    for (let i = 0; i < this.pathList.length; i++) {
                        const b = '<div data-flag="' + this.pathList[i].code + '">' + this.pathList[i].name + '(' + this.pathList[i].driverNum + ')</div>'
                        html += b
                    }
                    lineArr.innerHTML = html
                    console.log(this.pathList, '所有线路')
                }
            })
        }
    },
    watch: {
        searchKey () {
            if (this.searchKey === '') {
                this.placeSearch.clear()
            }
        },
        coordinate (val) {
            // console.log(val)
            this.onMarker(this.map)
        }
    },
    async created () {
        // 已载入高德地图API，则直接初始化地图
        if (window.AMap && window.AMapUI) {
            this.initMap()
        // 未载入高德地图API，则先载入API再初始化
        } else {
            await remoteLoad(`https://webapi.amap.com/maps?v=1.3&key=666843b3e90f2d48a24fc65d5b863c46`)
            await remoteLoad('https://webapi.amap.com/ui/1.0/main.js')
            this.initMap()
        }
    }
}
</script>

<style lang="css">

/* 弹窗 */
.contentRight{
		position: relative;
		width: 200px;
		height: 108px;
		background:rgba(255,255,255,1);
		box-shadow:0px 0px 14px 0px rgba(48,49,51,0.2);
		border-radius:4px;
	}
	.title{
		height: 24px;
		box-sizing: border-box;
		font-size: 0;
	}
	.title>span:nth-child(1){
		display: inline-block;
		width:60px;
		height: 100%;
		background:rgba(24,144,255,1);
		color: #FFFFFF;
		font-size: 12px;
		text-align: center;
		line-height: 24px;
		border-radius:4px 0px 4px 0px;
	}
	.title>span:nth-child(2){
		display: inline-block;
		margin-left: 12px;
		width:110px;
		height:17px;
		font-size:12px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(144,147,153,1);
		line-height:17px;
		text-align: center;
		line-height: 24px;
	}
	.namePone{
		height: 22px;
		box-sizing: border-box;
		font-size: 0;
		padding-left: 10px;
	}
	.namePone>span:nth-child(1){
		display: inline-block;
		font-size:12px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(48,49,51,1);
		line-height:22px;
	}
	.namePone>span:nth-child(2){
		display: inline-block;
		font-size:12px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(48,49,51,1);
		line-height:22px;
		margin-left: 20px;
	}
	.address{
		height: 22px;
		box-sizing: border-box;
		font-size: 0;
		padding-left: 10px;
	}
	.address>span:nth-child(1){
		display: inline-block;
		font-size:12px;
		width: 150px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(48,49,51,1);
		overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
		vertical-align: middle;
	}
	.line{
		padding: 10px 20px;
        font-size:12px;
		font-family:PingFangSC-Regular;
        color:rgba(24,144,255,1);
	}
	.line:hover{
		background: #eeeeee;
		border-radius: 0 0 4px 4px;
	}
	.mask{
		width:200px;
		height:212px;
		position: absolute;
		top: 0;
		left: 185px;
        display: none;
	}
	.lineRight{
		width:180px;
		height:212px;
		background:rgba(255,255,255,1);
		box-shadow:0px 0px 14px 0px rgba(48,49,51,0.2);
		border-radius:4px;
		float: right;
	}
	.lineRight>div:nth-child(1){
		height:17px;
		font-size:12px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(144,147,153,1);
		line-height:17px;
		padding: 10px 20px 28px 0;
		background: #EEEEEE;
        padding-left: 10px;
	}
	.lineRight>div:nth-child(2){
		height: 150px;
		overflow: auto;
		padding: 10px 10px;
	}
	.lineArr>div{
		height:17px;
		font-size:12px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(96,98,102,1);
		line-height:17px;
		border-bottom: 1px solid #EEEEEE;
		padding: 5px 0 23px 0;
        z-index: 100;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
	}
	.lineArr>div:hover{
		background: #E6F7FF;
	}

.m-map{ min-width: 500px; min-height: 300px; position: relative; }
.m-map .map{ width: 100%;}
.m-map .search{ position: absolute; top: 10px; left: 10px; width: 285px; z-index: 1; }
.m-map .search input{ width: 180px; border: 1px solid #ccc; line-height: 20px; padding: 5px; outline: none; }
.m-map .search button{ line-height: 26px; background: #fff; border: 1px solid #ccc; width: 50px; text-align: center; }
.m-map .result{ max-height: 300px; overflow: auto; margin-top: 10px; }
.context-menu{
    width: 100px;
    text-align: center;
    overflow: auto;
    background: white;
    border-radius: 5px;
    box-shadow: darkgrey 0px 0px 3px 3px ;
}
.context-menu>ul{
    display:inline-block;
    margin-bottom: 5px;
    padding: 0;
}
.context-menu>ul>li{
    margin-top: 5px;
    list-style: none;
}
</style>
