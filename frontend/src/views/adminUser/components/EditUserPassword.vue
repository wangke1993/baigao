<template>
	<el-dialog v-model="dialogFormVisible" :title="title" @closed="closeForm(ruleFormRef)">
		<el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef" @keyup.enter="submitForm(ruleFormRef)">
			<el-form-item label="旧密码" prop="oldPassword">
				<el-input v-model="form.oldPassword" type="password" />
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="form.newPassword" type="password" />
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmPassword">
				<el-input v-model="form.confirmPassword" type="password" />
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
import { AdminUserControllerUpdatePassword } from '@/api/AdminUserControllerApi';
import type { AdminUserDto } from '@/api/dto/AdminUserDto';
import { alertError, alertSuccess, alertWarning } from '@/utils/message';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

//参数
const dialogFormVisible = ref(false);
const formBase: AdminUserDto = {
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
}
const form = ref({ ...formBase });
const ruleFormRef = ref<FormInstance>()
const title = ref('');
const rules = reactive<FormRules>({
	oldPassword: [
		{ required: true, message: '不能为空', trigger: 'blur' },
	],
	newPassword: [
		{ required: true, message: '不能为空', trigger: 'blur' },
	],
	confirmPassword: [
		{ required: true, message: '不能为空', trigger: 'blur' },
	]
})
const updateId = ref('');
const emit = defineEmits(['updatePassword']);
// 方法
/**
 * row：当前行（为空且add为true时，添加顶级导航，否则添加子菜单）
 */
const open = (row: any) => {
	console.log('row', row);
	dialogFormVisible.value = true;
	title.value = '修改密码';
	updateId.value = row._id;
}

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			let data = null;
			if(form.value.newPassword !== form.value.confirmPassword) {
				alertError('您两次输入的密码不一样，请重新输入...');
				return;
			}
			const { data: res } = await AdminUserControllerUpdatePassword(updateId.value, form.value);
			data = res;
			if (data.status === 1) {
				alertSuccess(data.message);
				console.log('存储结果', data.data);
				dialogFormVisible.value = false;
				emit('updatePassword');
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
	dialogFormVisible.value = false;
	form.value = { ...formBase };
	console.log('关闭');
}
defineExpose({ open });
</script>