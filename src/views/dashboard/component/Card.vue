<script>
import Title from './Title'
export default {
  functional: true,
  render (h, { $listeners, children, props, data, slots }) {
    const bodyStyle = {
      padding: '19px 20px 19px'
    }
    const _slots = slots() || {}
    return (
      <a-card
        bodyStyle={bodyStyle}
        style={{ ...data.staticStyle }}
        bordered={false}
        on={$listeners}
      >
        <template slot='extra'>
          {_slots.extra}
        </template>
        <Title color={props.color} text={props.title} slot='title' />
        {_slots.default}
      </a-card>
    )
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-card-head-title {
  padding: 7px 0;
}
/deep/ .ant-card-extra {
  padding-top: 0;
  padding-bottom: 0;
}
/deep/ .ant-card-head {
  min-height: 40px;
  padding: 0 20px;
  height: 40px;
}
</style>
