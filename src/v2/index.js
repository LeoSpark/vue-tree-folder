/* global Vue */

// 大模块
Vue.component('tree-folder-list', {
    template: '#tree-folder-template',
    props: {
        list: Array
    },
    data() {
        return {
            selectedPath: [] // 选中的节点
        };
    },
    provide() {
        return {
            getSelectedPath: () => this.selectedPath,
            changeSelected: this.changeSelected,
            changeCheckStatus: this.changeCheckStatus,
            changeNodeValue: this.changeNodeValue,
            removeNode: this.removeNode
        };
    },
    methods: {
        getNodeByPath(path) {
            const list = this.list;
            const pathList = path.split('-');
            let curNode = null;
            let recordList = []; // 堆栈记录

            if (typeof path !== 'string') {
                return null;
            }

            pathList.forEach((p, idx) => {
                if (idx === 0) {
                    curNode = list[p];
                } else {
                    curNode = curNode.children[p];
                }
                recordList.unshift(curNode); // 后进先出
            });

            return recordList;
        },
        changeCheckStatus(path, checkStatus) {
            if(!path) return;

            let nodePathCache = []; // 父节点索引缓存
            let curNode = null;
            const PARTIAL = 1; // 部分选中状态

            // 递归更新子节点
            const unifyChildNode = (chilren) => {

                chilren.forEach(child => {
                    // 状态不变则不用往下遍历
                    if(child.checked === checkStatus) { return; }

                    child.checked = checkStatus;

                    if(child.children && child.children.length > 0) {
                        unifyChildNode(child.children);
                    }
                });
            };

            [ curNode, ...nodePathCache ] = this.getNodeByPath(path);

            if(!curNode) return;

            curNode.checked = checkStatus; // 设置当前节点

            if(curNode.children && curNode.children.length > 0) {
                unifyChildNode(curNode.children); // 设置所有子节点
            }

            // 往上遍历父节点
            for(let i=0, length = nodePathCache.length; i < length; i++) {
                let pNode = nodePathCache[i],
                    childList = pNode.children;
                let newStatus = null;
                let count = 0;

                for(let j=0, lens = childList.length; j < lens; j++) {
                    let curNode = childList[j];

                    if(curNode.checked === checkStatus) {
                        count ++;
                    }
                }

                if(count >= childList.length) { // 全部子节点状态一致
                    newStatus = checkStatus;
                } else {
                    newStatus = PARTIAL; // 部分选中
                }

                if(pNode.checked === newStatus) { // 状态不更新，则不用往上遍历
                    return;
                }

                pNode.checked = newStatus;
            }
        },
        changeSelected(path = '', isSelected = true) {
            const oldPathList = this.selectedPath;
            const newPathList = Array.isArray(path) ? [ ...path ] : [path];

            const setSelcetStatus = (nodePath, newStatus) => {
                let [ curNode ] = this.getNodeByPath(nodePath);

                curNode.selected = newStatus;
            }

            if (isSelected) {
                oldPathList.forEach(_path => setSelcetStatus(_path, false));
                newPathList.forEach(_path => setSelcetStatus(_path, true));
    
                Vue.set(this, 'selectedPath', newPathList);
            } else {
                let restPathList = oldPathList.filter(_path => !newPathList.includes(_path));

                newPathList.forEach(_path => setSelcetStatus(_path, false));
                Vue.set(this, 'selectedPath', restPathList);
            }
        },
        createEmptyNode(parentPath = '') {
            const EMPTY_NODE = { 
                name: '',
                checked: 0, 
                selected: false, 
                children: []
            };

            // 判断是否为根节点
            if (parentPath) {
                let [ curNode ] = this.getNodeByPath(parentPath);
                curNode.children.push(EMPTY_NODE);
            } else {
                this.list.push(EMPTY_NODE);
            }
        },
        changeNodeValue(path, value) {
            let [ curNode ] = this.getNodeByPath(path);

            Vue.set(curNode, 'name', value);
        },
        removeNode(path) {
            let pathList = path.split('-');

            if(pathList.length === 1) { // 根元素
                this.list.splice(path, 1);
            } else {
                const childIndex = pathList.reverse()[0]; // 元素数组索引
                let [ childNode, parentNode ] = this.getNodeByPath(path);
    
                parentNode.children.splice(childIndex, 1);
            }
        },
        addSelectedChildNode() {
            // 给第一个选中的节点添加子节点，如果没有选择任何节点，则添加根节点
            const [ curPath ] = this.selectedPath;
            this.createEmptyNode(curPath || '');
        },
        removeSelectedNode() {
            const [ curPath ] = this.selectedPath;
            if(curPath) {
                this.removeNode(curPath);
                this.selectedPath.splice(0, 1); // 删除
            }
        }
    },
    component: {
        'tree-item': 'tree-item'
    }
});


Vue.component('tree-item', {
    template: '#tree-item-template',
    props: {
        index: Number,
        name: { type: String, default: '' },
        checked: { type: Number, default: 0 },
        selected: { type: Boolean, default: false },
        children: { type: Array, default: () => [] },
        parentPath: String // '0-1-0'
    },
    inject: [
        'changeSelected',
        'getSelectedPath', 
        'changeCheckStatus'
    ],
    data() {
        return {
            isFolding: true,
            isEditing: false
        };
    },
    created() {
        if(!this.name) {
            this.isEditing = true;
        }
    },
    computed: {
        checkStatus() {
            const statusMap = { 0: 'no', 1: 'partial', 2: 'checked' };

            return statusMap[this.checked];
        },
        myNodePath() {
            if(!this.parentPath) { // 根节点
                return String(this.index);
            }

            return String(this.parentPath + '-' + this.index);
        }
    },
    methods: {
        toggleCheck() {
            const newStatus = this.checked === 1 ? 2 : (this.checked === 0 ? 2 : 0);
            this.changeCheckStatus(this.myNodePath, newStatus);
        },
        toggleSelect() {
            this.changeSelected(this.myNodePath, !this.selected);
        }
    },
    component: {
        'empty-item': 'empty-item'
    }
});

Vue.component('empty-item', {
    template: '#empty-item-template',
    props: {
        name: { type: String, default: ''},
        nodePath: String
    },
    data() {
        return {
            value: ''
        }
    },
    inject: [
        'changeNodeValue',
        'removeNode'
    ],
    created() {
        this.value = this.name;
    },
    methods: {
        emitValue() {
            if(this.value) {
                this.changeNodeValue(this.nodePath, this.value);
                this.$emit('closeEditing');
            }
        },
        cancelEditing() {
            if(this.name) {
                this.$emit('closeEditing');
            } else {
                this.removeNode(this.nodePath);
            }
        }
    }
});

const app = window.app = new Vue({
    el: '#app',
    template: `
        <tree-folder-list :list.sync=treeList></tree-folder-list>
    `,
    data: {
        treeList: [
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
        ]
    },
    component: {
        'tree-folder-list': 'tree-folder-list'
    },
    created() {
        console.log(window.areas);

        const format = (list) => {
            return list.map(citi => {
              citi.checked = 0;
              citi.selected = false;

              if(citi.children) {
                  format(citi.children);
              } else {
                  citi.children = [];
              }
      
              return citi;
            });
      
          };
        console.log(this.treeList = format(window.areas));
    }
});