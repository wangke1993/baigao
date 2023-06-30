<template>
	<div class="list-box">
		<div class="page-head">
			<Search @handleSearch="handleSearch" />
		</div>
		<el-table :data="logListData" row-key="_id" v-loading="load">
			<el-table-column prop="modelName" label="模块名称" :width="180" />
			<el-table-column prop="operationIp" label="操作IP" :width="150" />
			<el-table-column prop="operationUserName" label="操作账号" :width="150">
				<template #default="scope">{{ scope.row.operationUserName || '-' }}</template>
			</el-table-column>
			<el-table-column prop="systemInfo" label="客户端系统信息" :width="130" />
			<el-table-column prop="requestUrl" label="请求路径" />
			<el-table-column label="操作时间" :width="200">
				<template #default="scope">
					{{ DateTime.fromISO(scope.row.operationTime, { zone: 'utc+8' }).toFormat('yyyy-MM-dd HH:mm:ss') }}
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button-group class="ml-4">
						<el-button v-if="btnShow('log_detail')" @click="edit(scope.row)" type="primary" :icon="View">查看详情</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-box">
			<el-pagination
				v-model:currentPage="currentPage"
				v-model:page-size="currentPageSize"
				:page-sizes="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				@size-change="handleSizeChange"
				background :hide-on-single-page="true"
				@current-change="handleCurrentChange"
			/>
		</div>
		<LogDetail @getLogList="logList" ref="LogDetailRef" />
	</div>
</template>

<script lang="ts" setup>
// 依赖
import { SystemLogControllerGetPage } from '@/api/SystemLogControllerApi';
import { FileUploadControllerUpload, FileUploadControllerGetPrivateFile } from '@/api/FileUploadControllerApi';
import { alertSuccess, alertWarning } from '@/utils/message';
import { btnShow } from '@/utils/buttonShow';
import { View } from '@element-plus/icons-vue';
import { ref } from 'vue';
import LogDetail from '@/views/log/components/LogDetail.vue';
import Search from '@/views/log/components/Search.vue';
import { DateTime } from 'luxon';
// 参数
const logListData = ref([]);
const load = ref(true);
const currentPage = ref(1);
const currentPageSize = ref(10);
const pageSize = ref([10, 30, 50, 100]);
const total = ref(0);
const LogDetailRef = ref();
const param = ref({
	keyWord: '',
	IP: '',
	startTime: '',
	endTime: ''
})
const logList = async () => {
	load.value = true;
	const { data: res } = await SystemLogControllerGetPage({
		pageSize: currentPageSize.value.toString(),
		pageIndex: currentPage.value.toString(),
		keyWord: param.value.keyWord || '',
		IP: param.value.IP || '',
		startTime: param.value.startTime || '',
		endTime: param.value.endTime || ''
	});
	if (res.status === 1) {
		logListData.value = res.data.list;
		total.value = res.data.total;
	} else {
		alertWarning(res.message);
	}
	load.value = false;
}

logList();
const handleSearch = async (searchInfo: any) => {
	param.value.keyWord = searchInfo.keyWord;
	param.value.IP = searchInfo.IP;
	param.value.startTime = searchInfo.timeRange[0] || '';
	param.value.endTime = searchInfo.timeRange[1] || '';
	logList();
}

const edit = async (row: any) => {
	LogDetailRef.value.open(row, false);
}

// 更改分页大小
const handleSizeChange = (val: number) => {
	currentPageSize.value = val;
	logList();
}

// 更改当前页
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	logList();
}

</script>
<script lang="ts">
export default {
	name: "log",
};
</script>
<style lang="scss" scoped>
.list-box {
	padding: 20px;
}

.page-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 0;
}

.pagination-box {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
}
</style>
