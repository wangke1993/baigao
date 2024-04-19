<template>
	<div class="list-box" v-loading="load">
		<div class="page-head">
			<el-button type="primary" @click="add(null)" v-if="btnShow('role_add')" class="btn">新增角色</el-button>
			<Search placeholder="根据角色名称查询" @handleSearch="handleSearch" />
		</div>
		<el-table :data="roleListData" row-key="_id">
			<el-table-column prop="roleName" label="角色名称" width="300" />
			<!-- <el-table-column prop="_id" label="角色ID" width="300" align="center" /> -->
			<el-table-column prop="indexPath" label="用户首页" width="300" />
			<el-table-column label="超级管理员" width="300">
				<template #default="scope">
					{{ scope.row.isSuper === true ? '是' : scope.row.isSuper === false ? '否' : '-' }}
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button-group class="ml-4">
						<el-button v-if="btnShow('role_edit')" @click="edit(scope.row)" type="primary" :icon="Edit">编辑
						</el-button>
						<el-popconfirm v-if="btnShow('role_del')" confirm-button-text="确定" cancel-button-text="取消"
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
		<EditRole @getUserList="roleList" ref="EditRoleRef" />
	</div>
</template>

<script lang="ts" setup>
// 依赖
import { RolePermissionsControllerDelete, RolePermissionsControllerGetPage } from '@/api/RolePermissionsControllerApi';
import { alertSuccess, alertWarning } from '@/utils/message';
import { btnShow } from '@/utils/buttonShow';
import { Delete, Edit, Refresh } from '@element-plus/icons-vue';
import EditRole from '@/views/role/components/EditRole.vue';
import Search from '@/views/role/components/Search.vue';
import { ref, watch } from 'vue';
// 参数
const roleListData = ref([]);
const load = ref(false);
const EditRoleRef = ref();
const currentPage = ref(1);
const currentPageSize = ref(10);
const pageSize = ref([10, 30, 50, 100]);
const total = ref(0);
const param = ref({
	keyWord: ''
})

const handleSearch = async (searchInfo: any) => {
	param.value.keyWord = searchInfo.keyWord;
	roleList();
}

const add = async (row?: any) => {
	EditRoleRef.value.open(row);
}

const roleList = async () => {
	const { data: res } = await RolePermissionsControllerGetPage({
		pageSize: currentPageSize.value.toString(),
		pageIndex: currentPage.value.toString(),
		keyWord: param.value.keyWord || ''
	});
	if (res.status === 1) {
		roleListData.value = res.data.list;
		total.value = res.data.total;
	} else {
		alertWarning(res.message);
	}
}
roleList();

const edit = async (row: any) => {
	EditRoleRef.value.open(row, false);
}

const del = async (row: any) => {
	const { data: res } = await RolePermissionsControllerDelete(row._id);
	if (res.status === 1) {
		alertSuccess(res.message);
		roleList();
	} else {
		alertWarning(res.message);
	}
}


// 更改分页大小
const handleSizeChange = (val: number) => {
	currentPageSize.value = val;
	roleList();
}

// 更改当前页
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	roleList();
}

</script>
<script lang="ts">
export default {
	name: "role",
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
