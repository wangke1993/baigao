<template>
	<el-dialog v-model="dialogFormVisible" :title="title" @closed="closeForm(ruleFormRef)">
		<el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef"
			@keyup.enter="submitForm(ruleFormRef)">
			<el-form-item label="角色名称" prop="roleName">
				<el-input v-model="form.roleName" placeholder="请输入角色名称" />
			</el-form-item>
			<el-form-item label="超级管理员" prop="isSuper">
				<el-switch v-model="form.isSuper" class="ml-2"
					style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
			</el-form-item>
			<el-form-item label="用户首页" prop="indexPath">
				<el-input v-model="form.indexPath" placeholder="选填：缺省值为第一个角色的【用户首页】" />
			</el-form-item>
			<el-form-item v-if="!form.isSuper" label="权限列表" prop="permissionsList">
				<el-tree :data="treeByMenuTypeListData" show-checkbox node-key="_id" style="width: 100%;"
					:default-checked-keys="defaultCheckedKeys" :props="{ label: 'menuName', children: 'children' }"
					@check="handleCheckChange">
					<template #default="{ node, data }">
						<span class="custom-tree-node">
							<span :style="{ color: MENU_TYPE_TRANSLATE_COLOR[data.menuType] }">
								{{ node.label }}
							</span>
						</span>
					</template>
				</el-tree>
			</el-form-item>

		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeForm(ruleFormRef)">取消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
//依赖
import { RolePermissionsControllerCreate, RolePermissionsControllerUpdate } from '@/api/RolePermissionsControllerApi';
import type { RolePermissionsDto } from '@/api/dto/RolePermissionsDto';
import { AdminMenuControllerGetTree, AdminMenuControllerGetTreeByMenuType } from '@/api/AdminMenuControllerApi';
import { alertError, alertSuccess, alertWarning } from '@/utils/message';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { MENU_TYPE_TRANSLATE_COLOR } from '@/utils/enum/menuType'


//参数
const dialogFormVisible = ref(false);
const form = ref({
	roleName: '',
	permissionsList: [],
	indexPath: '',
	isSuper: false
});
const ruleFormRef = ref<FormInstance>()
const title = ref('');

const rules = reactive<FormRules>({
	roleName: [
		{ required: true, message: '不能为空', trigger: 'blur' },
	],
	permissionsList: [
		{ required: true, message: '不能为空', trigger: 'change' },
	],
	indexPath: [],
	isSuper: [
		{ required: true, message: '不能为空', trigger: 'blur' },
	]
})
const treeByMenuTypeListData = ref([]);
const defaultCheckedKeys = ref();
const addUser = ref(true);
const updateId = ref('');
const emit = defineEmits(['getUserList']);

// 方法
/**
 * row：当前行（为空且add为true时，添加顶级导航，否则添加子菜单）
 * add: 是否是添加操作，默认为true
 */
const open = (row: any, add: boolean = true) => {
	getTreeByMenuType();
	dialogFormVisible.value = true;
	addUser.value = add;
	if (add) {
		title.value = '新增用户角色';
	} else {
		title.value = '编辑用户角色';
		updateId.value = row._id;
		form.value = { ...form.value, ...row };
		if (!form.value.isSuper) {
			defaultCheckedKeys.value = row.permissionsList.join(',').split('division,')[1].split(',');
		}
	}
}

/**
 * 获取系统菜单
 * menuType 菜单类型
 */
const getTreeByMenuType = async () => {
	const { data: res } = await AdminMenuControllerGetTree();
	if (res.status === 1) {
		treeByMenuTypeListData.value = res.data;
	} else {
		alertWarning(res.message);
	}
}
const tempCheckNode = ref([]);
const handleCheckChange = async (nodeObj: any, selectNodeObj: any) => {
	const division = ['division'];
	const parent = selectNodeObj.halfCheckedKeys.concat(division);
	tempCheckNode.value = parent.concat(selectNodeObj.checkedKeys);
	form.value.permissionsList = selectNodeObj.checkedKeys;
	// console.log(form.value.permissionsList.join(',').split(',division,'));
}

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async (valid, fields) => {
		console.log(form.value)
		if (valid) {
			let data = null;
			form.value.permissionsList = tempCheckNode.value;
			if (addUser.value) {
				const { data: res } = await RolePermissionsControllerCreate(form.value);
				data = res;
			} else {
				const { data: res } = await RolePermissionsControllerUpdate(updateId.value, form.value);
				data = res;
			}
			if (data.status === 1) {
				alertSuccess(data.message);
				console.log('存储结果', data.data);
				dialogFormVisible.value = false;
				emit('getUserList');
			} else {
				alertWarning(data.message);
			}
		} else {
			console.log('校验失败', fields)
		}
	})
}
const closeForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	defaultCheckedKeys.value = [];
	dialogFormVisible.value = false;
	form.value = {
		roleName: '',
		permissionsList: [],
		indexPath: '',
		isSuper: false
	};
	console.log('关闭');
}

defineExpose({ open });
</script>