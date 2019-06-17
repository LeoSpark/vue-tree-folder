
const app = window.app = new Vue({
    el: '#app',
    template: `
        <div id="app">
            <tree-list :treeList="treeList"></tree-list>
        </div>
    `,
    data: {
        treeList: []
    },
    created() {
        // 创建测试数据
        // this.treeList = Array.from({ length: 10000 }).map((empty, i) => i + 1);

        const format = (list, parentPath = '') => {
            return list.map((item, index) => {
                item.checked = 0;
                item.selected = false;
                item.expand = true;
                item.value = item.name;
                item.parentPath = parentPath;
                item.index = index;

                if(item.children && item.children.length) {
                    const nodePath = parentPath ? `${parentPath}-${index}` : String(index);
                    format(item.children, nodePath);
                } else {
                    item.children = [];
                }
                
                return item;
            });
        }

        this.treeList = format(window.treeList);
        this.treeList = format(window.areas);
    }
});