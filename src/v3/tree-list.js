// 树列表组件
Vue.component('tree-list', {
    template: '#tree-list-template',
    props: {
        itemData: {
            type: Object,
            default: () => ({
                value: '',
                checked: 0,
                isSelect: false,
            })
        }
    }
});