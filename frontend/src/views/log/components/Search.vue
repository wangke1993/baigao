<template>
	<el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
		<el-form-item label="关键词：">
			<el-input v-model="searchForm.keyWord" placeholder="模块名称/请求路径/操作内容/账号" style="width:280px" />
		</el-form-item>
		<el-form-item label="操作IP：">
			<el-input v-model="searchForm.IP" placeholder="IP地址" />
		</el-form-item>
		<el-form-item label="时间范围：">
			<el-date-picker v-model="searchForm.timeRange" type="datetimerange" range-separator="-"
				format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s a" start-placeholder="开始时间"
				end-placeholder="结束时间" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit">搜索</el-button>
			<el-button @click="onResetForm">重置</el-button>
		</el-form-item>
	</el-form>
</template>
<script lang="ts" setup>
//依赖
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
const searchFormRef = ref<FormInstance>()
const searchForm = ref({
	keyWord: '',
	IP: '',
	timeRange: [],
});

const emit = defineEmits(['handleSearch']);

const onSubmit = () => {
	emit('handleSearch', searchForm.value);
}

const onResetForm = () => {
	searchForm.value = {
		keyWord: '',
		IP: '',
		timeRange: [],
	}
	emit('handleSearch', searchForm.value);
}

</script>