/*
 * @Author: Oak
 * @Date: 2019-01-08 23:32:58
 * @Last Modified by:   Oak
 * @Last Modified time: 2019-01-08 23:32:58
 */

const BestTopTransition = '0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out'
const Transition = {
    'before-enter': function (BestTop) {
        BestTop.style.transition = BestTopTransition
        if (!BestTop.dataset) BestTop.dataset = {}

        BestTop.dataset.oldPaddingTop = BestTop.style.paddingTop
        BestTop.dataset.oldPaddingBottom = BestTop.style.paddingBottom

        BestTop.style.height = 0
        BestTop.style.paddingTop = 0
        BestTop.style.paddingBottom = 0
    },

    enter (BestTop) {
        BestTop.dataset.oldOverflow = BestTop.style.overflow
        if (BestTop.scrollHeight !== 0) {
            BestTop.style.height = BestTop.scrollHeight + 'px'
            BestTop.style.paddingTop = BestTop.dataset.oldPaddingTop
            BestTop.style.paddingBottom = BestTop.dataset.oldPaddingBottom
        } else {
            BestTop.style.height = ''
            BestTop.style.paddingTop = BestTop.dataset.oldPaddingTop
            BestTop.style.paddingBottom = BestTop.dataset.oldPaddingBottom
        }

        BestTop.style.overflow = 'hidden'
    },

    'after-enter': function (BestTop) {
        BestTop.style.transition = ''
        BestTop.style.height = ''
        BestTop.style.overflow = BestTop.dataset.oldOverflow
    },

    'before-leave': function (BestTop) {
        if (!BestTop.dataset) BestTop.dataset = {}
        BestTop.dataset.oldPaddingTop = BestTop.style.paddingTop
        BestTop.dataset.oldPaddingBottom = BestTop.style.paddingBottom
        BestTop.dataset.oldOverflow = BestTop.style.overflow

        BestTop.style.height = BestTop.scrollHeight + 'px'
        BestTop.style.overflow = 'hidden'
    },

    leave (BestTop) {
        if (BestTop.scrollHeight !== 0) {
            BestTop.style.transition = BestTopTransition
            BestTop.style.height = 0
            BestTop.style.paddingTop = 0
            BestTop.style.paddingBottom = 0
        }
    },

    'after-leave': function (BestTop) {
        BestTop.style.transition = ''
        BestTop.style.height = ''
        BestTop.style.overflow = BestTop.dataset.oldOverflow
        BestTop.style.paddingTop = BestTop.dataset.oldPaddingTop
        BestTop.style.paddingBottom = BestTop.dataset.oldPaddingBottom
    }
}

export default {
    name: 'collapseTransition',
    functional: true,
    render (h, { children }) {
        const data = {
            on: Transition
        }
        return h('transition', data, children)
    }
}
