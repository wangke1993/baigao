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
      <el-form-item label="名称" prop="menuName">
        <el-input v-model="form.menuName" />
      </el-form-item>
      <el-form-item label="属性" prop="menuType">
        <el-select
          v-model="form.menuType"
          placeholder="选择属性"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="(v, k) in menuTypeSelect"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="Number(form.menuType) === 1"
        label="是否显示"
        prop="isShow"
      >
        <el-switch v-model="form.isShow" active-value="1" inactive-value="0" />
      </el-form-item>
      <el-form-item
        v-show="Number(form.menuType) === 1 && form.parentDeep.length === 0"
        label="图标"
        prop="menuIcon"
      >
        <el-input
          placeholder="element-plus ICON 名称"
          v-model="form.menuIcon"
        />
      </el-form-item>
      <el-form-item
        v-show="Number(form.menuType) === 1"
        label="路由"
        prop="menuActive"
      >
        <el-input v-model="form.menuActive" />
      </el-form-item>
      <el-form-item
        v-show="Number(form.menuType) > 1"
        label="权限标识"
        prop="menuPowerTag"
      >
        <el-input v-model="form.menuPowerTag" />
      </el-form-item>
      <el-form-item
        v-show="Number(form.menuType) === 1"
        label="排序"
        prop="sort"
      >
        <el-input placeholder="降序，数值越小越靠前" v-model="form.sort" />
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
  AdminMenuControllerCreate,
  AdminMenuControllerUpdate,
} from "@/api/AdminMenuControllerApi";
import type { AdminMenuDto } from "@/api/dto/AdminMenuDto";
import {
  MENU_TYPE_TRANSLATE,
  MENU_TYPE_TRANSLATE_NO_MENU,
} from "@/utils/enum/menuType";
import { alertSuccess, alertWarning } from "@/utils/message";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

//参数
const dialogFormVisible = ref(false);
const form = ref({
  menuName: "",
  menuType: "1",
  menuActive: "",
  menuPowerTag: "",
  parentId: "0",
  parentDeep: new Array<any>(),
  isShow: "1",
  menuIcon: "",
  sort: "0",
});
const ruleFormRef = ref<FormInstance>();
const title = ref("");
const rules = reactive<FormRules>({
  menuName: [{ required: true, message: "不能为空", trigger: "blur" }],
  menuType: [{ required: true, message: "不能为空", trigger: "blur" }],
});
const menuTypeSelect = ref({});
const addMenu = ref(true);
const updateId = ref("");
const emit = defineEmits(["getMenuTree"]);
// 方法
/**
 * row：当前行（为空且add为true时，添加顶级导航，否则添加子菜单）
 * add: 是否是添加操作，默认为true
 */
const open = (row: any, add = true) => {
  menuTypeSelect.value = { ...MENU_TYPE_TRANSLATE };
  dialogFormVisible.value = true;
  addMenu.value = add;
  if (add) {
    if (row) {
      title.value = "添加子级";
      if (row.parentDeep.length >= 2) {
        //最大可以添加3级菜单
        form.value.menuType = "2";
        menuTypeSelect.value = { ...MENU_TYPE_TRANSLATE_NO_MENU };
      }
      form.value.parentId = row._id;
      form.value.parentDeep = [...row.parentDeep];
      form.value.parentDeep?.push(row._id);
    } else {
      title.value = "添加一级菜单";
    }
  } else {
    title.value = "编辑";
    const tempRow = { ...row };
    delete tempRow.children;
    form.value = { ...form.value, ...tempRow };
    form.value.menuType = form.value.menuType.toString();
    form.value.parentId = row.parentDeep.slice(-1)[0];
    updateId.value = row._id;
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let data = null;
      if (form.value.menuType !== "1") {
        form.value.menuActive = "";
      }
      if (addMenu.value) {
        const { data: res } = await AdminMenuControllerCreate(form.value);
        data = res;
      } else {
        const { data: res } = await AdminMenuControllerUpdate(
          updateId.value,
          form.value
        );
        data = res;
      }
      if (data.status === 1) {
        alertSuccess(data.message);
        dialogFormVisible.value = false;
        emit("getMenuTree");
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
  form.value = {
    menuName: "",
    menuType: "1",
    menuActive: "",
    menuPowerTag: "",
    parentId: "0",
    parentDeep: [],
    isShow: "1",
    menuIcon: "",
    sort: "0",
  };
};
defineExpose({ open });
</script>
