<template>
  <el-dialog v-model="dialogFormVisible" title="移动菜单" @closed="closeForm()">
    <el-form label-width="120px" ref="ruleFormRef" @keyup.enter="submitForm()">
      <el-form-item label="父级菜单">
        <el-cascader
          v-if="visible"
          v-model="pId"
          :options="menuTree"
          :props="menuTreeProps"
          style="width: 100%"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeForm()">取消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  AdminMenuControllerChangeParent,
  AdminMenuControllerGetTreeByMenuType,
} from "@/api/AdminMenuControllerApi";
import type { AdminMenuDto } from "@/api/dto/AdminMenuDto";
import { alertSuccess, alertWarning } from "@/utils/message";
import { reactive, ref } from "vue";

const dialogFormVisible = ref(false);
const updateId = ref("");
const pId = ref("");
const visible = ref(false);
const menuTree = ref(new Array<any>());
const menuTreeProps = {
  emitPath: false,
  checkStrictly: true,
  value: "_id",
  label: "menuName",
};
const getMenuTree = async () => {
  const {
    data: { status, data, message },
  } = await AdminMenuControllerGetTreeByMenuType(1);
  if (status === 1) {
    menuTree.value = data;
    menuTree.value.unshift({ _id: "0", menuName: "根目录" });
  } else {
    alertWarning(message);
  }
};

const emit = defineEmits(["getMenuTree"]);
const open = (row: AdminMenuDto) => {
  dialogFormVisible.value = true;
  if (row._id) {
    updateId.value = row._id;
    if (row.parentId) {
      pId.value = row.parentId;
    } else {
      pId.value = "0";
    }
    getMenuTree();
    visible.value = true;
  }
};
const submitForm = async () => {
  const {
    data: { status, message },
  } = await AdminMenuControllerChangeParent(updateId.value, pId.value);
  if (status === 1) {
    alertSuccess(message);
    dialogFormVisible.value = false;
    emit("getMenuTree");
  } else {
    alertWarning(message);
  }
};
const closeForm = () => {
  dialogFormVisible.value = false;
  visible.value = false;
};
defineExpose({ open });
</script>
