<script>
export default {
  functional: true,
  render (h, { props, data }) {
    const { style, staticStyle, class: classs, staticClass } = data
    return (
      <div
        style={staticStyle || style}
        class={[staticClass || classs, 'title']}>
        <span
          class="title-line"
          style={{ background: props.color || '#1890FF' }} />
        <span
          style={{ color: props.color ? '#fff' : '#606266' }}
          class="title-text">
          {props.text}
        </span>
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
.title {
  white-space: nowrap;
}
.title-line {
  display: inline-block;
  width: 3px;
  height: 14px;
  margin-right: 10px;
  background: rgba(24, 144, 255, 1);
  border-radius: 2px;
}

.title-text {
  display: inline-block;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(96, 98, 102, 1);
  top: -1px;
  position: relative;
}
</style>
