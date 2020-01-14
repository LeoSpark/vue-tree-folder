<template>
    <div class="virtual-tree-container" 
        @scroll.passive="updateScrollTop"
    >
        <div :style="paddingStyle">
            <tree-item 
                v-for="(itemData, index) in currentViewList"
                :key="index"
                :style="{height: itemHeight + 'px'}"
                :itemData="itemData"
                @toggleExpand="updateListView"
            ></tree-item>
        </div>
    </div>
</template>

<script>
import TreeItem from './tree-item';
import { throttle } from '../utils/index';

export default  {
    props: {
        viewList: { // 列表
            type: Array,
            default: () => []
        },
        itemHeight: { // 每个列表元素高度
            type: Number,
            default: 60 // px
        },
        viewHeight: { // 可视区域高度
            type: Number,
            default: 400
        },
        bufferItemLength: { // 可视区域外缓冲元素数量
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            scrollTop: 0,
            currentStartIndex: 0,
            currentEndIndex: 0,
            currentViewList: [],
            wrapperPaddingTop: 0,
            wrapperPaddingBottom: 0
        }
    },
    computed: {
        paddingStyle() {
            return {
                paddingTop: this.wrapperPaddingTop + 'px',
                paddingBottom: this.wrapperPaddingBottom + 'px'
            }
        }
    },
    watch: {
        scrollTop() {
            this.updateListView();
        }
    },
    methods: {
        updateScrollTop: throttle(function() {
            this.scrollTop = this.$el.scrollTop;
        }),
        // 更新整个视图区
        updateListView() {
            const itemHeight = this.itemHeight; // 单个元素高度
            const scrollTop = this.scrollTop;
            const viewListLength = this.viewList.length; // 整个列表总长度
            const wrapperHeight = itemHeight * viewListLength; // 内部模块高度
            const restBottom = wrapperHeight - scrollTop - this.viewHeight;
            const bufferItemLength = this.bufferItemLength; // 缓冲数量
            const defaultBufferHeight = bufferItemLength * itemHeight; // 缓冲区高度
            const currentBufferTop = scrollTop > defaultBufferHeight ? defaultBufferHeight : scrollTop; // 当前顶部缓冲区高度
            const currentBufferBottom = restBottom > defaultBufferHeight ? defaultBufferHeight : restBottom; // 当前底部缓冲区高度
            const currentItemStartIndex = Math.floor((scrollTop - currentBufferTop) / itemHeight); // 实例中元素开始的索引，向下取整预留空间给 buff 区域
            const restItemLength = Math.floor((restBottom - currentBufferBottom) / itemHeight); // 剩余数量
            const currentItemEndIndex = viewListLength - restItemLength - 1; // 视图区结束索引
            const currentFullViewItemLength = currentItemEndIndex - currentItemStartIndex + 1; // 整个视图区的元素数量
            const currentFullViewHeight = currentFullViewItemLength  * itemHeight; // 整个视图区高度

            const paddingBottom = restItemLength * itemHeight;
            const paddingTop = wrapperHeight - paddingBottom - currentFullViewHeight;

            // console.table({ currentItemStartIndex, currentItemEndIndex, paddingTop, paddingBottom });

            this.wrapperPaddingTop = paddingTop;
            this.wrapperPaddingBottom = paddingBottom;
            this.currentStartIndex = currentItemStartIndex;
            this.currentEndIndex = currentItemEndIndex;
            this.currentViewList = this.viewList.slice(currentItemStartIndex, currentItemEndIndex + 1);
        }
    },
    created() {
        this.updateListView();
    },
    components: {
        TreeItem
    }
}
</script>

