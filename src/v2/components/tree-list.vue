<template>
    <div class="tree-folder">
        <div class="button-wrap">
            <button @click="addSelectedChildNode">添加</button>
            <button @click="removeSelectedNode">删除</button>
        </div>

        <ol>
            <tree-item
                v-for="(tree, index) in list"
                :key="index"
                :name="tree.name"
                :index="index"
                :children="tree.children"
                :checked="tree.checked"
                :selected="tree.selected"
            ></tree-item>
        </ol>
    </div>
</template>

<script>
import TreeItem from './tree-item.vue';

export default {
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
    
                this.$set(this, 'selectedPath', newPathList);
            } else {
                let restPathList = oldPathList.filter(_path => !newPathList.includes(_path));

                newPathList.forEach(_path => setSelcetStatus(_path, false));
                this.$set(this, 'selectedPath', restPathList);
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

            this.$set(curNode, 'name', value);
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
    components: {
        TreeItem
    }
}
</script>
