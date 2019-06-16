Vue.component('tree-item', {
    template: '#tree-item-template',
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
        }
    },
    computed: {
        // 缩进
        indentClass() {
            const pathLength = this.itemData.parentPath.split('-').filter(item => item).length;
            return { 'margin-left': (pathLength * 40) + 'px' };
        },
        checkStatus() {
            const statusMap = { 0: 'no', 1: 'partial', 2: 'checked' };

            return statusMap[this.itemData.checked];
        },
        myNodePath() {
            if(!this.itemData.parentPath) { // 根节点
                return String(this.itemData.index);
            }

            return String(this.itemData.parentPath + '-' + this.itemData.index);
        }
    },
    inject: [
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
            this.changeSelected(this.myNodePath, !this.selected);
        }
    }
});