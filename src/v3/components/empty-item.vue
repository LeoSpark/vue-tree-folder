<template>
    <div>
        <input 
            type="text" 
            name="empty-item" 
            v-model="inputValue"
        >
        <button @click="emitValue">✔</button>
        <button @click="cancelEditing">✖</button>
    </div>  
</template>


<script>
export default {
    props: {
        value: { type: String, default: ''},
        nodePath: String
    },
    data() {
        return {
            inputValue: ''
        }
    },
    inject: [
        'changeNodeValue',
        'removeNode'
    ],
    created() {
        this.inputValue = this.value;
    },
    methods: {
        emitValue() {
            if(this.inputValue) {
                this.changeNodeValue(this.nodePath, this.inputValue);
                // this.$emit('closeEditing');
            }
        },
        cancelEditing() {
            if(this.value) {
                this.$emit('closeEditing'); // @todo 修复
            } else {
                this.removeNode(this.nodePath);
            }
        }
    }
}
</script>
