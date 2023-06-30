<template>
	<el-dialog v-model="dialogFormVisible" :title="title" @closed="closeForm" center>
		<el-form label-width="130px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="操作账号名称：">{{ data['operationUserName'] || '—' }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="操作时间：">
						{{ DateTime.fromISO(data['operationTime'], { zone: 'utc+8' }).toFormat('yyyy-MM-dd hh:mm:ss') }}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="操作IP：">{{ data['operationIp'] || '—' }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="来源：">{{ data['comeFrom'] || '—' }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="系统信息：">{{ data['systemInfo'] || '—' }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="请求路径：">{{ data['requestUrl'] || '—' }}</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="客户端：">{{ data['clientInfo'] || '—' }}</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="操作内容：">{{ data['operationContent'] || '—' }}</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeForm">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
//依赖
import { reactive, ref } from 'vue';
import { DateTime } from 'luxon';

//参数
const dialogFormVisible = ref(false);
const title = ref('');
const data = ref();

const emit = defineEmits(['getLogList']);
// 方法
/**
 * row：当前行
 */
const open = (row: any) => {
	console.log('row', row);
	title.value = row.modelName
	data.value = row;
	dialogFormVisible.value = true;
}

const submitForm = async () => {
	dialogFormVisible.value = false;
	emit('getLogList');
}
const closeForm = () => {
	dialogFormVisible.value = false;
	console.log('关闭');
}
defineExpose({ open });
</script>