<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: haile
 * @Date: 2019-04-03 16:38:07
 * @LastEditTime: 2019-05-23 15:25:49
 -->
<template>
  <div class="box">
    <div class="full-width tags-header" :style="{backgroundColor:colorType==='Color' ? color : '#888888'}">
      <div class="tags-title">
        <div class="title">{{ `${config.user}` }}</div>
        <div class="store">{{ `${item.storeName}-${item.label}` }}</div>
      </div>
    </div>
    <div class="full-width bar-code-box">
      <VueBarcode :value="item.regionCode" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
    </div>
    <div class="img-box"><img :src="img"></div>
    <div class="full-width tags-input">
      <a-row type="flex" justify="space-around">
        <a-col>□ 左挂</a-col>
        <a-col>□ 中挂</a-col>
        <a-col>□ 右挂</a-col>
      </a-row>
    </div>
    <div class="full-width tags-input">
      <a-row type="flex" justify="center">
        <a-col :span="8"><div style="width:100%">姓名/工号</div></a-col>
        <a-col :span="12"><div style="width:100%;border-bottom:2px solid #000;height:25px;"></div></a-col>
      </a-row>
    </div>
    <div class="full-width tags-input">
      <a-row type="flex" justify="center">
        <a-col :span="8"><div style="width:100%">汇总/条码</div></a-col>
        <a-col :span="12"><div style="width:100%;border-bottom:2px solid #000;height:25px;"></div></a-col>
      </a-row>
    </div>
    <div class="full-width tags-input">
      <a-row type="flex" justify="center">
        <a-col :span="8"><div style="width:100%">复  核  员</div></a-col>
        <a-col :span="12"><div style="width:100%;border-bottom:2px solid #000;height:25px;"></div></a-col>
      </a-row>
    </div>
    <div class="full-width tags-footer" :style="{backgroundColor:colorType==='Color'?color:'#888888'}">准确、客观、专业</div>
  </div>
</template>
<style lang="less"  >
    .box{
        page-break-before: always;
        page-break-inside: avoid;
        margin: 10px 10px;
        width: 178px;
        height:324px;
        .full-width{
            width: 178px;
            text-align:center;
            white-space:nowrap;
            text-overflow:ellipsis;
        }
        .img-box{
            img{
                max-width: 178px;
                height: auto;
                // margin: 10px 0;
            }
        }
        .bar-code-box{
            height: 150px;
            padding-top: 60px;
        }
        .tags-header{
            margin: 0 10px;
            height: 60px;
            position: absolute;
            left: 0;
            right: 0;
            content: ' ';
            width: 178px;
            border-radius: 0 0 50% 50%;
            -webkit-print-color-adjust: exact;
        }
        .tags-title{
            width: 178px;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 10px;
            z-index: 9999;
            color: #fff;
            .title{
                margin-top: 10px;
                font-size: 18px;
                font-weight: bold;
                color: #fff;
            }
            .store{
                margin-top: 5px;
                font-size: 12px;
            }
        }
        .tags-input{
            height: 25px;
            line-height: 25px;
            font-size: 14px;
        }
        .tags-footer{
            height: 40px;
            -webkit-print-color-adjust: exact;
            color: #fff;
            line-height: 40px;
            font-size: 16px;
            margin-top: 10px;
        }
    }
    .full-width{
        width: 100%;
        text-align:center;
        white-space:nowrap;
        text-overflow:ellipsis;
    }
</style>
<script>
import VueBarcode from '@chenfengyuan/vue-barcode'
import config from '@config/defaultSettings'
export default {
    name: 'Tags',
    components: {
        VueBarcode
    },
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        colorType: {
            type: String,
            default: 'Color'
        },
        typeType: {
            type: String,
            default: '前场'
        }
    },
    data: function () {
        return {
            config,
            img,
            barCodeOptions: {
                format: 'CODE128',
                displayValue: true,
                height: 50,
                fontSize: 20,
                background: '#ffffff',
                lineColor: '#000000'
            },
            color: '#e54d42'
        }
    },
    methods: {

    },
    watch: {
        typeType (val) {
            this.color = val
        }
    }
}
const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYwAAAAmCAMAAADgF1xEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIxREYyOUVENTVGRDExRTlBMEIwRkE1OTVGNDQ4Mzg5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIxREYyOUVFNTVGRDExRTlBMEIwRkE1OTVGNDQ4Mzg5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjFERjI5RUI1NUZEMTFFOUEwQjBGQTU5NUY0NDgzODkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjFERjI5RUM1NUZEMTFFOUEwQjBGQTU5NUY0NDgzODkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73B8DlAAAAt1BMVEUzMjIzMjEzMzIzMzQ0UmczNzk1XXk1W3c0V280TmAzMTAzPEIzPkU0QUs1ZYczNTY1YYA0TV4zODw0SVg1WHEzNDQ1YoM1Vm0zMS8zQEk1TWA1Xns0SFUzNzs0T2I1ZYY0UGMzOkA0TF0zNjgzO0A1YoI0W3Y0U2k0QUozNTc1Zok0PEM1ZIU0Qkw0Vm4zNDU1UWUzOT01YH40VGszOj80U2gzO0E0S1s1UGQzQkszODszMzMAAAA+cZkNAAAAPXRSTlP///////////////////////////////////////////////////////////////////////////////8ACS+sXwAAAmlJREFUeNrsmelWwjAQhdMFWcuiIOLCJm4sCogLTN//uWwBaQ0Hhc4kwZzMrzbTaW/v1yRNy3wdAkCL22B6sNCDhoFhYJCz0IKGgaEnDIQfKCsB0DRUSRcGA+EHzko8DGXStYMBgKahHQyEHzgr8TCUSdcOBgCahnYwEH7grMTDUCZdOxgAaBrawUD4kbAUfokjly4YBuLpTFAKe8VRSv8bRvVzV3bYSuwLwlISFojTiJPeGu7KfFZXMB4vnCmXKtfP3r/PX2u4xUS2IBwVD0N2adFt1L4PeT+rl7n01Ll4DGGc5sBa3EXtfTfPuAuwW/eIYJAMU3Klu7dblubdfpS/W1iQO/XZKBekbKeyaj3PPkVlbNZ9zTw3C+Fm6oR4FsUM9xRThkTpJ6nQ00LzOfPancXsfcqerw6oOHawnxux3iab925i/Kx5ZP/9wGKQPpaBdy8avsjrH1aaBmYN7iM0cyvWQW68/Ga7x8opa/uctpPlhryPycNBuhAvRRQvVL7Y6x9U+jD54Cbd7LIncGGlysEEfglcir20se/7okt9PAtl0sNov3CTiA2X63VGphPvOaUxevUlvpRk0adI+jLGpfic0MnEF31Xb9eFUtBDHC+N+yJxkCrMDVEswBVJX88lnhP0iFLh+u2KcAWOUIW5IYqPIYqki/scouzxomchtWcYGAaGgaE9DII5w8AwMCTASPDjC1FKCkO2dGEwfkhJtHJKUkoCQ5l0sTB27ooqpYOhQrrIYer3fTGlPpAMU0qkC4ShKDj7qf9HqwgNYOxsMDBkw/ijycCQB2OvRgNDBo39W/9HfAkwAEwNoH2d7kDwAAAAAElFTkSuQmCC'
</script>
