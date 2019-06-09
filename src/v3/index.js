/* global Vue */
Vue.component('virtual-tree-list', {
    template: '#virtual-tree-list-template',
    props: {
        treeList: Array,
        itemHeight: 60 // px
    },
    data() {
        return {
            currentIndex: 0,
            viewsItemLength: 20
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
            
            return this.treeList.slice(currentStartIndex, currentEndIndex);
        }
    }
});

const app = window.app = new Vue({
    el: '#app',
    template: `
        <virtual-tree-list :treeList="treeList"></virtual-tree-list>
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