<template>
    <li class="tree-item">
        <div v-if="isEditing">
            <empty-item 
                :name="name"
                :nodePath="myNodePath"
                @closeEditing="isEditing = false"
            ></empty-item>
        </div>
        <div v-else>
            <span 
                class="folder-arrow"
                :class="{'floding': isFolding}"
                v-if="children.length > 0"
                @click="isFolding = !isFolding"
            ></span>
            
            <span
                class="checkbox"
                :class="checkStatus"
                @click="toggleCheck"
            ></span>
            <span
                class="item-text"
                @click="toggleSelect"
                :class="{'item-select': selected}"
            >{{name}}</span>
        </div>

        
        <ol 
            v-if="children.length > 0" 
            v-show="!isFolding"
        >
            <tree-item
                v-for="(tree, index) in children"
                :key="tree.name"
                :name="tree.name"
                :index="index"
                :parentPath="myNodePath"
                :children="tree.children"
                :checked="tree.checked"
                :selected="tree.selected"
            ></tree-item>
        </ol>

    </li>
</template>


<script>
import EmptyItem from './empty-item';

export default {
    name: 'tree-item',
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
            isFolding: false,
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
    components: {
        EmptyItem
    }
}
</script>
