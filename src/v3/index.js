const treeList = [
    {
        name: '食物',
        checked: 1,
        selected: false,
        children: [
            {
                name: '水果',
                checked: 1,
                selected: false,
                children: [
                    {
                        name: '香蕉🍌',
                        checked: 2,
                        selected: false,
                        children: []
                    },
                    {
                        name: '苹果🍎',
                        checked: 0,
                        selected: false,
                        children: []
                    },
                    {
                        name: '橙子🍊',
                        checked: 0,
                        selected: false,
                        children: []
                    },
                    {
                        name: '樱桃🍒',
                        checked: 0,
                        selected: false,
                        children: []
                    },
                    {
                        name: '菠萝🍍',
                        checked: 0,
                        selected: false,
                        children: []
                    }
                ]
            },
            {
                name: '蔬菜',
                checked: 0,
                selected: false,
                children: []
            },
            {
                name: '谷物',
                checked: 2,
                selected: false,
                children: [
                    {
                        name: '小麦',
                        checked: 2,
                        selected: false,
                        children: []
                    },
                    {
                        name: '水稻',
                        checked: 2,
                        selected: false,
                        children: []
                    },
                    {
                        name: '高粱',
                        checked: 2,
                        selected: false,
                        children: []
                    },
                    {
                        name: '玉米🌽',
                        checked: 2,
                        selected: false,
                        children: []
                    }
                ]
            }
        ]
    }, {
        name: '药物',
        checked: 0,
        selected: false,
        children: []
    }, {
        name: '动物',
        checked: 0,
        selected: false,
        children: []
    }, {
        name: '植物',
        checked: 0,
        selected: false,
        children: []
    }, {
        name: '昆虫',
        checked: 0,
        selected: false,
        children: []
    }
];

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
                item.expand = true;
                item.value = item.name;
                item.parentPath = parentPath;

                if(item.children && item.children.length) {
                    const nodePath = parentPath ? `${parentPath}-${index}` : String(index);
                    format(item.children, nodePath);
                } else {
                    item.children = [];
                }
                
                return item;
            });
        }

        this.treeList = format(treeList);
    }
});