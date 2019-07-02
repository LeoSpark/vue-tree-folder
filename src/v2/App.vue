<template>
    <div id="app">
        <TreeList :list="treeData"></TreeList>
    </div>
</template>

<script>
    import TreeList from './components/tree-list';
    import simpleTreeData from '../mock/simple-tree';
    import areaData from '../mock/pca-code';
    import areasData from '../mock/pcas-code';

    export default {
        name: 'App',
        data() {
            return {
                treeData: []
            }
        },
        created() {
            const format = (list) => {
                return list.map(citi => {
                    citi.checked = 0;
                    citi.selected = false;

                    if (citi.children) {
                        format(citi.children);
                    } else {
                        citi.children = [];
                    }

                    return citi;
                });

            };

            this.treeData = format(simpleTreeData);
        },
        components: {
            TreeList
        }
    }
</script>

<style src="../assets/style/index.css"></style>