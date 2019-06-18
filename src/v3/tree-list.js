// 树列表组件
Vue.component('tree-list', {
    template: '#tree-list-template',
    props: {
        treeList: {
            type: Array,
            default: () => []
        }
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
    computed: {
        // 扁平化树列表
        flatTree() {
            const flat = (list) => {
                return list.reduce((total, item) => {
                    // 没有展开或者没有子元素
                    if(!item.expand || item.children.length <= 0) {
                        total.push(item);
                        return total;
                    } else if(item.children.length) {
                        // @see https://dev.to/uilicious/javascript-array-push-is-945x-faster-than-array-concat-1oki
                        total.push(item);
                        return total.concat(flat(item.children));
                    }
                }, [])
            }

            return flat(this.treeList);
        }
    },
    methods: {
        getNodeByPath(path) {
            const list = this.treeList;
            const pathList = path.split('-');
            let curNode = null;
            let recordList = []; // 栈记录

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
                this.treeList.push(EMPTY_NODE);
            }
        },
        changeNodeValue(path, value) {
            let [ curNode ] = this.getNodeByPath(path);

            Vue.set(curNode, 'name', value);
        },
        removeNode(path) {
            let pathList = path.split('-');

            if(pathList.length === 1) { // 根元素
                this.treeList.splice(path, 1);
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
    }
});