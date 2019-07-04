<template>
    <div :style="indentClass">
        <empty-item 
            v-if="isEditing"
            :value="itemData.value"
            :nodePath="myNodePath"
            @closeEditing="isEditing = false"
        ></empty-item>

        <template v-else>
            <span 
                class="folder-arrow"
                :class="{'floding': !itemData.expand}"
                v-if="itemData.children.length > 0"
                @click="toggleExpand"
            ></span>
            
            <span
                class="checkbox"
                :class="checkStatus"
                @click="toggleCheck"
            ></span>
            <span
                class="item-text"
                @click="toggleSelect"
                :class="{'item-select': itemData.selected}"
            >{{ itemData.value }}</span>
        </template>
    </div>
</template>

<script>
import EmptyItem from './empty-item.vue';

export default {
    props: {
        itemData: {
            type: Object,
            default: () => ({
                value: '',
                checked: 0,
                isSelect: false,
                index: 0,
                parentPath: '',
                children: [],
                expand: false
            })
        },
        intendWidth: { // 每个等级缩进宽度
            type: Number,
            default: 40
        }
    },
    data() {
        return {
            // isEditing: false
        }
    },
    computed: {
        // 缩进
        indentClass() {
            let pathLength = 0;

            if(this.itemData.parentPath) {
                pathLength = this.itemData.parentPath.split('-').length;
            }
            
            return { 'margin-left': (pathLength * this.intendWidth) + 'px' };
        },
        checkStatus() {
            const statusMap = { 0: 'no', 1: 'partial', 2: 'checked' };

            return statusMap[this.itemData.checked];
        },
        isEditing() {
            return this.itemData.value === '';
        },
        myNodePath() {
            if(!this.itemData.parentPath) { // 根节点
                return String(this.itemData.index);
            }

            return String(this.itemData.parentPath + '-' + this.itemData.index);
        }
    },
    inject: [
        'changeExpand',
        'changeSelected',
        'getSelectedPath', 
        'changeCheckStatus'
    ],
    methods: {
        toggleCheck() {
            const newStatus = this.itemData.checked === 1 ? 2 : (this.itemData.checked === 0 ? 2 : 0);
            this.changeCheckStatus(this.myNodePath, newStatus);
        },
        toggleSelect() {
            this.changeSelected(this.myNodePath, !this.itemData.selected);
        },
        toggleExpand() {
            this.changeExpand(this.myNodePath, !this.itemData.expand);
            this.$emit('toggleExpand'); // 向父组件触发更新事件
        }
    },
    components: {
        EmptyItem
    }
}
</script>

