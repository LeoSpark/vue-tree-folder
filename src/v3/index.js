const app = window.app = new Vue({
    el: '#app',
    template: `
        <div id="app">        
            <virtual-view 
                :itemHeight="60"
                :treeList="treeList"
                :viewHeight="400"
            ></virtual-view>
        </div>
    `,
    data: {
        treeList: []
    },
    component: {
        'virtual-view': 'virtual-view'
    },
    created() {
        // 创建测试数据
        this.treeList = Array.from({ length: 10000 }).map((empty, i) => i + 1);
    }
});