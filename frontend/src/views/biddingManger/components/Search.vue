<template>
	<el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
		<el-form-item>
			<slot></slot>
		</el-form-item>
		<!-- <el-form-item label="所诉项目">
			<el-cascader placeholder="所属项目" :show-all-levels="false" ref="biddingSelectRef"
				:props="{ value: 'UUID', label: 'name', emitPath: false, checkStrictly: true }"
				v-model="searchForm.projectUUID" :options="projectTree"></el-cascader>
		</el-form-item> -->
		<!-- <el-form-item label="进度">
			<el-select v-model="searchForm.progress" class="m-2" placeholder="招标进度">
				<el-option v-for="item in BIDDING_PROGRESS" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</el-form-item> -->
		<el-form-item label="关键字">
			<el-input v-model="searchForm.keyWord" placeholder="名称/概述/内容" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit">搜索</el-button>
			<el-button @click="onResetForm">重置</el-button>
		</el-form-item>
	</el-form>
</template>
<script lang="ts" setup>
//依赖
import { TreeClassificationControllerGetTree } from '@/api/TreeClassificationControllerApi';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
const searchFormRef = ref<FormInstance>()
const searchForm = ref({
	keyWord: '',
	projectUUID: '0',
	progress: ''
});
const BIDDING_PROGRESS = [
	{ label: '全部', value: '' },
	{ label: '招标中', value: '1' },
	{ label: '竞标中', value: '2' },
	{ label: '已中标', value: '3' },
	{ label: '合同签订', value: '4' },
	{ label: '合同履行', value: '5' },
	{ label: '已结束', value: '0' },
	{ label: '流标', value: '-1' },
]
const projectTree = ref([] as Array<any>);
const getProjectTree = async () => {
	const { data: { status, data } } = await TreeClassificationControllerGetTree('DC00140002', { keyWord: '' });
	if (status == 1) {
		projectTree.value = [{ UUID: '0', name: '全部' }].concat(data);
	}
}
getProjectTree();
const emit = defineEmits(['handleSearch']);

const onSubmit = () => {
	emit('handleSearch', searchForm.value);
}

const onResetForm = () => {
	searchForm.value = {
		keyWord: '',
		projectUUID: '',
		progress: ''
	}
	emit('handleSearch', searchForm.value);
}

</script>