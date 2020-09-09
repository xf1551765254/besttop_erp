<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: Reat
 * @Date: 2019-04-09 10:51:59
 * @LastEditTime: 2019-08-26 09:19:35
 -->
<template>
  <div class="m-map" :style="{width:mapWidth,height:mapHeight}">
    <div class="search" v-if="placeSearch">
      <a-input-search placeholder="请输入关键字" v-model="searchKey" @keyup.enter="handleSearch" @search="handleSearch">
        <a-button type="primary" slot="enterButton">搜索</a-button>
      </a-input-search>
      <div id="js-result" v-show="isResult" class="result"></div>
    </div>
    <a-button class="openRight" type="primary" @click="showDrawer">路径详情</a-button>
    <a-button class="clearRight" type="primary" @click="clearFun">清除路径</a-button>
    <a-button v-if="confirmCancel" class="confirmArea" type="primary" @click="confirmAreaFun">确定区域</a-button>
    <a-button v-if="!confirmCancel" class="confirmArea" type="primary" @click="cancelAreaFun">取消区域</a-button>
    <!-- <a-button class="confirmArea" type="primary" @click="clearFun">清除区域</a-button> -->
    <!-- <a-button v-if="flagEdit" class="editRight" type="primary" @click="startEndEdit(-1)">开始编辑</a-button>
    <a-button v-if="!flagEdit" class="editRight" type="primary" @click="startEndEdit(1)">结束编辑</a-button> -->
    <a-drawer
      title="路径详情"
      placement="right"
      :closable="false"
      @close="onClose"
      width="400px"
      :visible="visible"
    >
      <a-table
        rowKey="pointNum"
        :columns="columns"
        :pagination="false"
        :dataSource="routeInfoList"
        bordered>
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.pointNum)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </a-drawer>
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>
</template>
<style scoped>
    .m-map{
        min-width: 500px;
        min-height: 100px;
        position: relative;
    }
    .map{
        width: 100%;
        height: 100%;
    }
    .search{
        position: absolute;
        top: 10px;
        left: 10px;
        width: 264px;
        z-index: 1;
    }
    .openRight{
        position: absolute;
        top: 60px;
        right: 10px;
        width: 100px;
        z-index: 1;
    }
    .clearRight{
        position: absolute;
        top: 100px;
        right: 10px;
        width: 100px;
        z-index: 1;
    }
    .confirmArea{
        position: absolute;
        top: 140px;
        right: 10px;
        width: 100px;
        z-index: 1;
    }
    .editRight{
       position: absolute;
        top: 140px;
        right: 10px;
        width: 100px;
        z-index: 1;
    }
</style>
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
            default: '300px'
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
            geographicCoordinateSystemArr: [],
            polygon: null, // 绘制区域
            dotMark: null, // 点
            visible: false,
            map: null,
            dotMarkArr: [],
            pointNum: 1,
            routeInfoList: [],
            columns: [ // 采购订单详情表头
                { title: '序号', dataIndex: 'pointNum', width: 60, align: 'center' },
                { title: '地址', dataIndex: 'addressName', width: 200, align: 'center' },
                { title: '操作', key: 'operation', width: 60, scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoSelectedRowKeys: [], // 商品详情选中项
            flagEdit: true,
            confirmCancel: true
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
        cancelAreaFun () {
            if (this.geographicCoordinateSystemArr.length <= 2) {
                return this.$message.warning('请添加坐标')
            }
            const AMap = this.AMap = window.AMap
            this.confirmCancel = true
            if (this.polygon) {
                this.map.remove(this.polygon)
                this.polygon = new AMap.Polyline({
                    map: this.map,
                    path: this.geographicCoordinateSystemArr, // 设置多边形边界路径
                    isOutline: true,
                    borderWeight: 1,
                    strokeColor: '#FF33FF',
                    strokeWeight: 2,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                    // extData: info,      // 标识
                    zIndex: 10
                })
                this.map.add(this.polygon)
                this.$emit('drag', this.routeInfoList)
            }
        },
        confirmAreaFun () {
            if (this.geographicCoordinateSystemArr.length <= 2) {
                return this.$message.warning('请添加坐标!')
            }
            const AMap = this.AMap = window.AMap
            this.confirmCancel = false
            if (this.polygon) {
                this.map.remove(this.polygon)
                console.log(this.geographicCoordinateSystemArr)
                this.polygon = new AMap.Polygon({
                    map: this.map,
                    path: this.geographicCoordinateSystemArr, // 设置多边形边界路径
                    isOutline: true,
                    borderWeight: 1,
                    strokeColor: '#FF33FF',
                    strokeWeight: 2,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                    // extData: info,      // 标识
                    zIndex: 10
                })
                this.map.add(this.polygon)
                this.$emit('drag', this.routeInfoList)
            }
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
        // startEndEdit (e) {
        //     this.flagEdit = false
        //     const AMap = this.AMap = window.AMap
        //     AMap.plugin(['AMap.PolyEditor'], () => {
        //         const polyEditor = new AMap.PolyEditor(this.map, this.polygon)
        //         if (e < 0) {
        //             polyEditor.open()
        //         } else {
        //             console.log(polyEditor, '123456789')
        //             polyEditor.close()
        //         }
        //     })

        // polyEditor.on('addnode', function (event) {
        //     // log.info('触发事件：addnode')
        // })

        // polyEditor.on('adjust', function (event) {
        //     // log.info('触发事件：adjust')
        // })

        // polyEditor.on('removenode', function (event) {
        //     // log.info('触发事件：removenode')
        // })

        // polyEditor.on('end', function (event) {
        //     // event.target 即为编辑后的多边形对象
        //     console.log(event.target, '编辑之后的坐标')
        // })
        // },
        editFun (editArr) {
            console.log(editArr, '编辑')
            this.confirmCancel = false
            this.routeInfoList = editArr.routeInfoList
            this.pointNum = this.routeInfoList.length + 1
            this.getAmpUIime = setTimeout(() => {
                const AMap = this.AMap = window.AMap
                const position = [ editArr.longitude, editArr.latitude ] // 简写

                const arr = []
                // 重新绘制点标记和区域
                for (const item of editArr.routeInfoList) {
                    arr.push([item.longitude, item.latitude])
                    this.dotMark = new AMap.Marker({
                        map: this.map,
                        position: new AMap.LngLat(item.longitude, item.latitude),
                        icon: new AMap.Icon({
                            size: new AMap.Size(52, 52), // 图标大小
                            imageSize: new AMap.Size(26, 26)
                        })
                    })
                    this.dotMarkArr.push(this.dotMark)
                }
                this.geographicCoordinateSystemArr = arr

                this.polygon = new AMap.Polygon({
                    map: this.map,
                    path: arr, // 设置多边形边界路径
                    isOutline: true,
                    borderWeight: 1,
                    strokeColor: '#FF33FF',
                    strokeWeight: 2,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    fillColor: '#1791fc',
                    // extData: info,      // 标识
                    zIndex: 10
                })
                this.map.add(this.polygon)
                this.map.setFitView([ this.polygon ])
                this.map.setCenter(position) // 设置地图中心点
                this.$emit('drag', this.routeInfoList)
            }, 400)
        },
        /**
         * @name: 删除点
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (pointNum) {
            this.confirmCancel = true
            const routeInfoList = [...this.routeInfoList]
            this.routeInfoList = routeInfoList.filter(item => item.pointNum !== pointNum)
            console.log(this.routeInfoList, '删除后的数组')
            this.pointNum = 1
            this.routeInfoList.forEach(i => {
                i.pointNum = this.pointNum
                this.pointNum++
            })
            this.redrawFun(this.routeInfoList)
        },
        // 地图重绘
        redrawFun (routeInfoList) {
            const AMap = this.AMap = window.AMap
            const arr = []
            // 删除地图所有点标记和区域
            for (const item of this.dotMarkArr) {
                this.map.remove(item)
            }
            this.geographicCoordinateSystemArr.length = 0
            this.map.remove(this.polygon)
            // 重新绘制点标记和区域
            for (const item of routeInfoList) {
                arr.push([item.longitude, item.latitude])
                this.dotMark = new AMap.Marker({
                    map: this.map,
                    position: new AMap.LngLat(item.longitude, item.latitude),
                    icon: new AMap.Icon({
                        size: new AMap.Size(52, 52), // 图标大小
                        imageSize: new AMap.Size(26, 26)
                    })
                })
                this.dotMarkArr.push(this.dotMark)
            }
            this.geographicCoordinateSystemArr = arr

            this.polygon = new AMap.Polyline({
                map: this.map,
                path: arr, // 设置多边形边界路径
                isOutline: true,
                borderWeight: 1,
                strokeColor: '#FF33FF',
                strokeWeight: 2,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                fillColor: '#1791fc',
                // extData: info,      // 标识
                zIndex: 10
            })
            this.map.add(this.polygon)
            this.$emit('drag', this.routeInfoList)
        },
        /**
         * @name: 多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        onError (data) {
            // 定位出错
            this.$logger.error(data)
        },
        // 搜索
        handleSearch () {
            if (this.searchKey) {
                this.placeSearch.search(this.searchKey)
                this.isResult = true
            }
        },
        handleList (SelectChangeEvent) {
            console.log(SelectChangeEvent)
        },
        initMap (e) {
            // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            const AMap = this.AMap = window.AMap
            const AMapUI = this.AMapUI = window.AMapUI
            this.getAmpUIime = null
            AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
                const mapConfig = {
                    // zoom: this.zoom
                    // cityName: this.MapCityName
                }
                this.map = new AMap.Map('js-container', mapConfig)
                AMap.service('AMap.PlaceSearch', () => {
                    this.placeSearch = new AMap.PlaceSearch({
                        pageSize: 5,
                        pageIndex: 1,
                        citylimit: true,
                        city: this.MapCityName,
                        map: this.map,
                        panel: 'js-result',
                        listElementClick: this.handleList
                    })
                    this.placeSearch.on('selectChanged', (e) => {
                        console.log('执行123456798', e)
                        const lng = e.selected.data.location.lng
                        const lat = e.selected.data.location.lat
                        const lnglatXY = [lng, lat]// 地图上所标点的坐标
                        this.drawFun(lnglatXY, lng, lat)
                        this.isResult = false
                    })
                })

                // 启用工具条
                AMap.plugin(['AMap.ToolBar'], () => {
                    this.map.addControl(new AMap.ToolBar({
                        position: 'RB'
                    }))
                })
                // 创建地图拖拽
                const positionPicker = new PositionPicker({
                    mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map: this.map // 依赖地图对象
                })
                // 启动拖放
                positionPicker.start()
                // 地图点击事件
                this.map.on('click', e => {
                    if (!this.confirmCancel) {
                        return this.$message.warning('当前线路为闭合状态不可添加！')
                    }
                    this.isResult = false
                    console.log(e.lnglat.getLng())
                    console.log(e.lnglat.getLat())
                    const lng = e.lnglat.getLng()
                    const lat = e.lnglat.getLat()
                    const lnglatXY = [lng, lat]// 地图上所标点的坐标
                    this.drawFun(lnglatXY, lng, lat)
                })
            })
        },
        // 绘制点和多边形
        drawFun (lnglatXY, lng, lat) {
            const AMap = this.AMap = window.AMap
            const AMapUI = this.AMapUI = window.AMapUI
            let address = null
            // 手动绘制多边形
            if (this.polygon) {
                this.map.remove(this.polygon)
            }
            if (this.geographicCoordinateSystemArr.length >= 16) {
                this.$message.warning('添加位置已达到上限，不可继续添加!')
            } else {
                // AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
                //     this.dotMark1 = new SimpleMarker({
                //         // 设置节点属性
                //         iconLabel: {
                //             // 普通文本
                //             innerHTML: '起',
                //             // 设置样式
                //             style: {
                //                 color: '#fff',
                //                 fontSize: '120%',
                //                 marginTop: '2px'
                //             }
                //         },
                //         // 自定义图标地址
                //         iconStyle: {
                //             src: '//webapi.amap.com/theme/v1.3/markers/b/mark_r.png',
                //             style: {
                //                 width: '25px',
                //                 height: '30px'
                //             }
                //         },

                //         // 设置基点偏移
                //         offset: new AMap.Pixel(-12, -30),

                //         map: this.map,

                //         showPositionPoint: true,
                //         position: new AMap.LngLat(lng, lat),
                //         zIndex: 100
                //     })
                // })

                // 添加点标记
                this.dotMark = new AMap.Marker({
                    map: this.map,
                    position: new AMap.LngLat(lng, lat),
                    icon: new AMap.Icon({
                        size: new AMap.Size(52, 52), // 图标大小
                        imageSize: new AMap.Size(26, 26)
                    })
                })
                this.dotMarkArr.push(this.dotMark)
                this.map.add(this.dotMark)
                this.geographicCoordinateSystemArr.push(lnglatXY)
                // 获取点击时的详细地址
                AMap.service('AMap.Geocoder', () => {
                    const geocoder = new AMap.Geocoder({
                    })
                    geocoder.getAddress(lnglatXY, (status, result) => {
                        if (status === 'complete' && result.info === 'OK') {
                            // 获得了有效的地址信息:
                            // 拼接信息
                            address = result.regeocode.formattedAddress
                            console.log(address)
                            const ipnew = {
                                pointNum: this.pointNum, // 点数
                                longitude: lng, // 经度
                                latitude: lat, // 维度
                                addressName: address // 地址
                            }
                            this.pointNum++
                            this.routeInfoList.push(ipnew)
                            this.$emit('drag', this.routeInfoList)
                        }
                    })
                })
            }
            this.polygon = new AMap.Polyline({
                map: this.map,
                path: this.geographicCoordinateSystemArr, // 设置多边形边界路径
                isOutline: true,
                borderWeight: 1,
                strokeColor: '#FF33FF',
                strokeWeight: 2,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                fillColor: '#1791fc',
                // extData: info,      // 标识
                zIndex: 10
            })
            this.map.add(this.polygon)
        },
        deactivated () {
            this.getAmpUIime = null
        },
        showDrawer () {
            this.visible = true
        },
        onClose () {
            this.visible = false
        },
        clearFun () {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否清除当前路径信息?',
                onOk () {
                    if (that.polygon) {
                        for (const item of that.dotMarkArr) {
                            that.map.remove(item)
                        }
                        that.confirmCancel = true
                        that.pointNum = 1
                        that.routeInfoList = []
                        that.geographicCoordinateSystemArr.length = 0
                        that.map.remove(that.polygon)
                        that.$emit('drag', that.routeInfoList)
                    }
                },
                onCancel () {}
            })
        }
    }
}
</script>
