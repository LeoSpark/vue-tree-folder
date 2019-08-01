<template>
	<div id="app">
		<tree-list 
			:treeList="treeData" 
		/>
	</div>
</template>

<script>
	import TreeList from './components/tree-list';
	import simpleTreeData from '../mock/simple-tree';
	import areaData from '../mock/pca-code';
	import areasData from '../mock/pcas-code';

	export default {
		name: 'app',
		data() {
			return {
				treeData: {}
			}
		},
		created() {
			// 格式化数据
			const format = (list, parentPath = '') => {
				return list.map((item, index) => {
					item.checked = 0;
					item.selected = false;
					item.expand = false;
					item.value = item.name;
					item.parentPath = parentPath;
					item.index = index;

					if(item.children && item.children.length) {
						const nodePath = parentPath ? `${parentPath}-${index}` : String(index);
						format(item.children, nodePath);
						item.expand = true;
					} else {
						item.children = [];
					}
					
					return item;
				});
			}

			this.treeData = format(areaData);
		},
		components: {
			TreeList
		}
	}
</script>

<style src="../assets/style/index.css"></style>
