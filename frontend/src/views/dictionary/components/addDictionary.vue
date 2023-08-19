<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="新增字典分类"
    @closed="closeForm(ruleFormRef)"
  >
    <el-form :model="form" :rules="rules" label-width="120px" ref="ruleFormRef">
      <el-form-item label="字典分类名称" prop="dicName">
        <el-input v-model="form.dicName" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" />
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
<script lang="ts">
import { ref, reactive, toRefs, defineComponent } from "vue";
import {
  DataDictionaryControllerCreate,
  DataDictionaryControllerUpdate,
} from "../../../api/DataDictionaryControllerApi";
import type { FormInstance, FormRules } from "element-plus";
import { alertSuccess } from "@/utils/message";
export default defineComponent({
  emits: ["refreshList"],
  setup(props, { emit }) {
    const formBase = {
      dicName: "",
      dicType: 1,
      remarks: "",
      _id: "",
    };
    const ruleFormRef = ref<FormInstance>();
    const form = ref({ ...formBase });

    const state = reactive({
      dialogFormVisible: false,
    });
    // 校验
    const rules = reactive<FormRules>({
      dicName: [{ required: true, message: "字典名称", trigger: "blur" }],
    });

    // 打开弹窗
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const open = (items: any) => {
      if (items) form.value = items;
      state.dialogFormVisible = true;
    };

    // 关闭弹窗
    const closeForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      state.dialogFormVisible = false;
      form.value = { ...formBase };
    };

    //
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          // 编辑
          if (form.value._id) {
            const { dicName, dicType, remarks, _id } = form.value;
            let params = { dicName, dicType, remarks };
            postDataDictionaryControllerUpdate(_id, params);
          } else {
            const { dicName, dicType, remarks } = form.value;
            let params = { dicName, dicType, remarks };
            postDataDictionaryControllerCreate(params);
          }
        }
      });
    };

    // 新增
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postDataDictionaryControllerCreate = async (params: any) => {
      try {
        let result = await DataDictionaryControllerCreate(params);
        let data = result.data;
        if (data.status === 1) {
          alertSuccess("操作成功！");
          state.dialogFormVisible = false;
          emit("refreshList");
        }
      } catch (err) {
        return;
      }
    };

    // 编辑
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postDataDictionaryControllerUpdate = async (id: any, params: any) => {
      try {
        let result = await DataDictionaryControllerUpdate(id, params);
        let data = result.data;
        if (data.status === 1) {
          alertSuccess("操作成功！");
          state.dialogFormVisible = false;
          emit("refreshList");
        }
      } catch (err) {
        return;
      }
    };

    return {
      ...toRefs(state),
      form,
      rules,
      ruleFormRef,
      open,
      closeForm,
      submitForm,
    };
  },
});
</script>
