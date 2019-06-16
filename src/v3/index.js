/* global Vue */

const throttle = (fn, delay = 30, mustRunDelay = 50) => {
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
        treeList: Array,
        itemHeight: Number // px
    },
    data() {
        return {
            currentStartIndex: 0,
            currentEndIndex: 0,
            scrollTop: 0,
            wrapperHeight: 0,
            wrapperPaddingTop: 0,
            wrapperPaddingBottom: 400,
            viewsItemLength: 10,
            viewHeight: 400, // 可视区域高度
            bufferItemLength: 3 // 不在可视区域缓冲数量
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
        updateListView() {
            const itemHeight = this.itemHeight;
            const scrollTop = this.scrollTop;
            const treeListLength = this.treeList.length;
            const wrapperHeight = itemHeight * treeListLength;
            const restBottom = wrapperHeight - scrollTop - this.viewHeight;
            const bufferItemLength = this.bufferItemLength; // 缓冲数量
            const defaultBufferHeight = bufferItemLength * itemHeight;
            const currentBufferTop = scrollTop > defaultBufferHeight ? defaultBufferHeight : scrollTop;
            const currentBufferBottom = restBottom > defaultBufferHeight ? defaultBufferHeight : restBottom;
            const currentItemStartIndex = Math.floor((scrollTop - currentBufferTop) / itemHeight); // 实例中元素开始的索引，向下取整预留空间给 buff 区域
            const restItemLength = Math.floor((restBottom - currentBufferBottom) / itemHeight);
            const currentItemEndIndex = treeListLength - restItemLength - 1;
            const currentFullViewItemLength = currentItemEndIndex - currentItemStartIndex + 1;
            const currentFullViewHeight = currentFullViewItemLength  * itemHeight;

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