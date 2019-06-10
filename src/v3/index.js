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
            currentIndex: 0,
            scrollTop: 0,
            wrapperHeight: 0,
            wrapperPaddingTop: 0,
            wrapperPaddingBottom: 400,
            viewsItemLength: 10
        }
    },
    computed: {
        currentViewList() { // 简单计算
            const currentIndex = this.currentIndex;
            const listLength = this.viewsItemLength + 5;
            const maxStartIndex = this.treeList.length - listLength - 1,
                maxEndIndex = this.treeList.length - 1;
            const currentStartIndex = currentIndex > maxStartIndex ? maxStartIndex : currentIndex,
                currentEndIndex = (currentIndex + listLength - 1) > maxEndIndex ? maxEndIndex : (currentIndex + listLength - 1);
            
            return this.treeList.slice(currentStartIndex, currentEndIndex).map(item => String(item).padStart(5, '0'))
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
            this.setCurrentPadding();
        }
    },
    methods: {
        updateScrollTop: throttle(function() {
            this.scrollTop = this.$el.scrollTop;
        }),
        setWrapperHeight() {
            this.wrapperHeight = this.itemHeight * this.treeList.length;
        },
        setCurrentPadding() {
            const itemsHeight = this.currentViewList.length * this.itemHeight;
            const scrollTop = this.scrollTop;
            this.wrapperPaddingTop = scrollTop;
            this.wrapperPaddingBottom = this.wrapperHeight - scrollTop - itemsHeight;
        }
    },
    created() {
        this.setWrapperHeight();
        this.setCurrentPadding();
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
        this.treeList = Array.from({ length: 1000 }).map((empty, i) => i + 1);
    }
});