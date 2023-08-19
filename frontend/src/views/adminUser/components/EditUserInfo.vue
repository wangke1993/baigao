<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    @closed="closeForm(ruleFormRef)"
  >
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="ruleFormRef"
      @keyup.enter="submitForm(ruleFormRef)"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="form.userName"
          onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item v-if="addUser" label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item v-if="addUser" label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请输入确认密码"
        />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="form.role"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="选择角色"
          size="large"
          style="width: 100%"
          @change="handleChangeRole"
        >
          <el-option
            v-for="(v, k) in userRoleListData"
            :key="k"
            :label="v['roleName']"
            :value="v['_id']"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户首页" prop="indexPath">
        <el-input
          v-model="form.indexPath"
          placeholder="选填：缺省值为第一个角色的【用户首页】"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="form.remarks"
          :rows="4"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
//依赖
import {
  AdminUserControllerUpdate,
  AdminUserControllerCreate,
} from "@/api/AdminUserControllerApi";
import type { AdminUserDto } from "@/api/dto/AdminUserDto";
import { RolePermissionsControllerGetList } from "@/api/RolePermissionsControllerApi";
import { alertError, alertSuccess, alertWarning } from "@/utils/message";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

//参数
const dialogFormVisible = ref(false);
const formBase = {
  userName: "",
  password: "",
  confirmPassword: "",
  role: [],
  roleName: new Array<string>(),
  remarks: "",
  indexPath: "",
};
const form = ref({ ...formBase });
const ruleFormRef = ref<FormInstance>();
const title = ref("");
const rules = reactive<FormRules>({
  userName: [{ required: true, message: "不能为空", trigger: "blur" }],
  password: [{ required: true, message: "不能为空", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "不能为空", trigger: "blur" }],
  role: [{ required: true, message: "不能为空", trigger: "change" }],
  roleName: [{ required: true, message: "不能为空", trigger: "blur" }],
  indexPath: [],
  remarks: [],
});
const userRoleListData = ref([]);
const addUser = ref(true);
const updateId = ref("");
const emit = defineEmits(["getUserList"]);
// 方法
/**
 * row：当前行（为空且add为true时，添加顶级导航，否则添加子菜单）
 * add: 是否是添加操作，默认为true
 */
const open = (row: any, add = true) => {
  console.log("row", row);
  getUserRoleList();
  dialogFormVisible.value = true;
  addUser.value = add;
  if (add) {
    title.value = "新增用户";
  } else {
    title.value = "编辑用户";
    form.value = { ...form.value, ...row };
    updateId.value = row._id;
  }
};

/**
 * 获取用户角色列表 获取角色全部列表
 * pageSize： 设置为 0
 * pageIndex: 设置为-1
 */
const getUserRoleList = async () => {
  const { data: res } = await RolePermissionsControllerGetList();
  if (res.status === 1) {
    userRoleListData.value = res.data;
  } else {
    alertWarning(res.message);
  }
};

const handleChangeRole = async (item: any) => {
  console.log("handleChangeRole", item);
  console.log("userRoleListData", userRoleListData.value[0]["roleName"]);
  let newList: any[] = [];
  item.map((id: any) => {
    const list = userRoleListData.value.filter((ele) => ele["_id"] === id);
    let obj = list[0]["roleName"];
    newList.push(obj);
  });
  form.value.roleName = newList;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let data = null;
      if (addUser.value) {
        if (form.value.password !== form.value.confirmPassword) {
          alertError("您两次输入的密码不一样，请重新输入...");
          return;
        }
        const { data: res } = await AdminUserControllerCreate(form.value);
        data = res;
      } else {
        const { data: res } = await AdminUserControllerUpdate(
          updateId.value,
          form.value
        );
        data = res;
      }
      if (data.status === 1) {
        alertSuccess(data.message);
        console.log("存储结果", data.data);
        dialogFormVisible.value = false;
        emit("getUserList");
      } else {
        alertWarning(data.message);
      }
    } else {
      console.log("校验失败", fields);
    }
  });
};
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogFormVisible.value = false;
  form.value = { ...formBase };
  console.log("关闭");
};
defineExpose({ open });
</script>
