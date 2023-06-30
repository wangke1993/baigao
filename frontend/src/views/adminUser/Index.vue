<template>
	<div class="list-box" v-loading="load">
		<div class="page-head">
			<el-button type="primary" @click="add(null)" v-if="btnShow('user_add')" class="btn">新增用户</el-button>
			<Search @handleSearch="handleSearch" />
		</div>
		<el-table :data="userListData" row-key="_id">
			<el-table-column prop="userName" label="用户名" width="200" />
			<el-table-column prop="roleName" label="用户角色" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button-group class="ml-4">
						<el-button v-if="btnShow('user_edit')" @click="edit(scope.row)" type="primary" :icon="Edit">编辑
						</el-button>
						<el-button v-if="btnShow('user_update_password')" @click="updatePassword(scope.row)"
							type="success" :icon="Refresh">修改密码</el-button>
						<el-popconfirm v-if="btnShow('user_reset_password')" confirm-button-text="确定"
							cancel-button-text="取消" confirm-button-type="warning"
							:title="`确定要重置用户【${scope.row.userName}】的密码吗？`" @confirm="resetPassword(scope.row)">
							<template #reference>
								<el-button type="warning" :icon="Delete">重置密码</el-button>
							</template>
						</el-popconfirm>
						<el-popconfirm v-if="btnShow('user_del')" confirm-button-text="确定" cancel-button-text="取消"
							confirm-button-type="danger" title="确定删除吗？" @confirm="del(scope.row)">
							<template #reference>
								<el-button type="danger" :icon="Delete">删除</el-button>
							</template>
						</el-popconfirm>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-box">
			<el-pagination v-model:currentPage="currentPage" v-model:page-size="currentPageSize" :page-sizes="pageSize"
				layout="total, sizes, prev, pager, next, jumper" background :total="total"
				@size-change="handleSizeChange" :hide-on-single-page="true" @current-change="handleCurrentChange" />
		</div>
		<EditUserInfo @getUserList="userList" ref="EditUserRef" />
		<EditUserPassword @updatePassword="userList" ref="EditUserPasswordRef" />
	</div>
</template>

<script lang="ts" setup>
// 依赖
import { AdminUserControllerResetPassword, AdminUserControllerDelete, AdminUserControllerGetPage } from '@/api/AdminUserControllerApi';
import { alertSuccess, alertWarning } from '@/utils/message';
import { btnShow } from '@/utils/buttonShow';
import { Delete, Edit, Refresh } from '@element-plus/icons-vue';
import EditUserInfo from '@/views/adminUser/components/EditUserInfo.vue';
import EditUserPassword from '@/views/adminUser/components/EditUserPassword.vue';
import Search from '@/views/adminUser/components/Search.vue';
import { ref } from 'vue';
// 参数
const userListData = ref([]);
const load = ref(false);
const EditUserRef = ref();
const EditUserPasswordRef = ref();
const currentPage = ref(1);
const currentPageSize = ref(10);
const pageSize = ref([10, 30, 50, 100]);
const total = ref(0);
const param = ref({
	keyWord: ''
})

const handleSearch = async (searchInfo: any) => {
	param.value.keyWord = searchInfo.keyWord;
	userList();
}

const add = async (row?: any) => {
	EditUserRef.value.open(row);
}

const userList = async () => {
	const { data: res } = await AdminUserControllerGetPage({
		pageSize: currentPageSize.value.toString(),
		pageIndex: currentPage.value.toString(),
		keyWord: param.value.keyWord || ''
	});
	if (res.status === 1) {
		userListData.value = res.data.list;
		total.value = res.data.total;
	} else {
		alertWarning(res.message);
	}
}
userList();

const edit = async (row: any) => {
	EditUserRef.value.open(row, false);
}

const updatePassword = async (row: any) => {
	EditUserPasswordRef.value.open(row, false);
}

const resetPassword = async (row: any) => {
	const { data: res } = await AdminUserControllerResetPassword(row._id);
	if (res.status === 1) {
		alertSuccess(res.message);
		userList();
	} else {
		alertWarning(res.message);
	}
}

const del = async (row: any) => {
	const { data: res } = await AdminUserControllerDelete(row._id);
	if (res.status === 1) {
		alertSuccess(res.message);
		userList();
	} else {
		alertWarning(res.message);
	}
}

// 更改分页大小
const handleSizeChange = (val: number) => {
	currentPageSize.value = val;
	userList();
}

// 更改当前页
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	userList();
}

</script>
<script lang="ts">
export default {
	name: "adminUser",
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

	.btn {
		margin-bottom: 18px !important;
	}
}

.pagination-box {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
}
</style>
