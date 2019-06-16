/* global Vue */

const throttle = (fn, delay = 20, mustRunDelay = 30) => {
    let timer = null;
    let t_start;
    return function () {
        const context = this,
            args = arguments,
            t_curr = +new Date();
        clearTimeout(timer);
        if (!t_start) {
            t_start = t_curr;
        }
        if (t_curr - t_start >= mustRunDelay) {
            fn.apply(context, args);
            t_start = t_curr;
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
};

Vue.component('virtual-tree-list', {
    template: '#virtual-tree-list-template',
    props: {
        treeList: { // 列表
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
            wrapperHeight: 0,
            wrapperPaddingTop: 0,
            wrapperPaddingBottom: 0
        }
    },
    computed: {
        currentViewList() { 
            return this.treeList.slice(this.currentStartIndex, this.currentEndIndex + 1).map(item => String(item).padStart(5, '0'));
        },
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
        setWrapperHeight() {
            this.wrapperHeight = this.itemHeight * this.treeList.length;
        },
        // 更新整个视图区
        updateListView() {
            const itemHeight = this.itemHeight; // 单个元素高度
            const scrollTop = this.scrollTop;
            const treeListLength = this.treeList.length; // 整个列表总长度
            const wrapperHeight = itemHeight * treeListLength; // 内部模块高度
            const restBottom = wrapperHeight - scrollTop - this.viewHeight;
            const bufferItemLength = this.bufferItemLength; // 缓冲数量
            const defaultBufferHeight = bufferItemLength * itemHeight; // 缓冲区高度
            const currentBufferTop = scrollTop > defaultBufferHeight ? defaultBufferHeight : scrollTop; // 当前顶部缓冲区高度
            const currentBufferBottom = restBottom > defaultBufferHeight ? defaultBufferHeight : restBottom; // 当前底部缓冲区高度
            const currentItemStartIndex = Math.floor((scrollTop - currentBufferTop) / itemHeight); // 实例中元素开始的索引，向下取整预留空间给 buff 区域
            const restItemLength = Math.floor((restBottom - currentBufferBottom) / itemHeight); // 剩余数量
            const currentItemEndIndex = treeListLength - restItemLength - 1; // 视图区结束索引
            const currentFullViewItemLength = currentItemEndIndex - currentItemStartIndex + 1; // 整个视图区的元素数量
            const currentFullViewHeight = currentFullViewItemLength  * itemHeight; // 整个视图区高度

            const paddingBottom = restItemLength * itemHeight;
            const paddingTop = wrapperHeight - paddingBottom - currentFullViewHeight;

            // console.table({ currentItemStartIndex, currentItemEndIndex, paddingTop, paddingBottom });

            this.wrapperPaddingTop = paddingTop;
            this.wrapperPaddingBottom = paddingBottom;
            this.currentStartIndex = currentItemStartIndex;
            this.currentEndIndex = currentItemEndIndex;
        }
    },
    created() {
        this.setWrapperHeight();
        this.updateListView();
    }
});

const app = window.app = new Vue({
    el: '#app',
    template: `
        <virtual-tree-list 
            :itemHeight="60"
            :treeList="treeList"
            :viewHeight="400"
        ></virtual-tree-list>
    `,
    data: {
        treeList: []
    },
    component: {
        'virtual-tree-list': 'virtual-tree-list'
    },
    created() {
        // 创建测试数据
        this.treeList = Array.from({ length: 10000 }).map((empty, i) => i + 1);
    }
});