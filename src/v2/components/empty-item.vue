<template>
    <div>
        <input 
            type="text" 
            name="empty-item" 
            v-model="value"
        >
        <button @click="emitValue">✔</button>
        <button @click="cancelEditing">✖</button>
    </div>  
</template>


<script>
export default {
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
}
</script>
