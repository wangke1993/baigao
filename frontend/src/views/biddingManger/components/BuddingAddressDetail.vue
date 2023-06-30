<template>
  <el-dialog v-model="state.dialogFormVisible" :title="state.title" :close-on-press-escape="false"
    :close-on-click-modal="false" width="70%" @closed="closeForm(ruleFormRef)">
    <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef"
      @submit.native.prevent="submitForm(ruleFormRef)">
      <el-form-item label="别名" prop="name">
        <el-input v-model="form.name" placeholder="请输入别名" />
      </el-form-item>
      <el-form-item label="行政区划" prop="administrativeDivision">
        <el-cascader style="width: 100%;" v-model="administrativeDivisionsValue" :props="cascadeProps"
          @change="cascadeChange" placeholder="请选择行政区划" />
      </el-form-item>
      <el-form-item label="详细地址" prop="addressDetail">
        <el-input type="textarea" v-model="form.addressDetail" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="收件人" prop="people">
        <el-input type="people" v-model="form.people" placeholder="请输入收件人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input type="phone" v-model="form.phone" placeholder="请输入收件人联系电话" />
      </el-form-item>
      <el-form-item label="默认地址" prop="isDefault">
        <el-switch v-model="form.isDefault" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { ExpandTrigger, type CascaderProps, type FormInstance, type FormRules, type UploadFile, type UploadUserFile } from "element-plus";
import { alertSuccess, alertWarning } from "@/utils/message";
import { BiddingAddressDto } from "@/api/dto/BiddingAddressDto";
import { AdministrativeDivisionsControllerGetListByDicClass } from "@/api/AdministrativeDivisionsControllerApi";
import { BiddingMangerControllerAddBiddingAddress, BiddingMangerControllerGetBiddingAddressDetailById, BiddingMangerControllerUpdateBiddingAddress } from "@/api/BiddingMangerControllerApi";
const emit = defineEmits(["Refresh"]);
const _id = ref("");
const form = ref(new BiddingAddressDto());
const administrativeDivisionsValue = ref(new Array<String>());
const ruleFormRef = ref<FormInstance>();
const checkPhone = (rule: any, value: any, callback: any) => {
  if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
    callback(new Error("请输入正确的手机号码"))
  } else {
    callback()
  }
};
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "不能为空", trigger: "blur" },
  ],
  administrativeDivision: [
    { required: true, message: "不能为空", trigger: "blur" },
  ],
  addressDetail: [
    { required: true, message: "不能为空", trigger: "blur" },
  ],
  people: [
    { required: true, message: "不能为空", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "不能为空", trigger: "blur" },
    { validator: checkPhone, trigger: "blur" },
  ],
});
const areaNameDic: any = {};
const cascadeProps: CascaderProps = {
  expandTrigger: ExpandTrigger.HOVER,
  value: "code",
  label: "name",
  lazy: true,
  lazyLoad: async (node: any, resolve) => {
    const code = node.value || "0";
    const { data: res } = await AdministrativeDivisionsControllerGetListByDicClass(code);
    if (res.status == 1) {
      resolve(res.data.map((item: any) => {
        areaNameDic[item.code] = item.name;
        item.leaf = node.level >= 2;
        return item;
      }));
    } else {
      resolve();
    }
  },
}
const state = ref({
  dialogFormVisible: false,
  title: "添加收件地址",
  load: false,
  userListData: [],
  params: {
    pageIndex: 1,
    pageSize: 10,
    total: 10,
  },
  dictionaryData: new Array<any>(),
});
const cascadeChange = (value: any) => {
  form.value.administrativeDivisionName = "";
  value?.map((code: any) => form.value.administrativeDivisionName += `${form.value.administrativeDivisionName ? "/" : ""}${areaNameDic[code]}`);
  form.value.administrativeDivision = administrativeDivisionsValue.value.join(",");
}
// 获取详情
const getDetail = async (id: string) => {
  try {
    let result = await BiddingMangerControllerGetBiddingAddressDetailById(id);
    let data = result.data;
    if (data.status === 1) {
      delete data.data._id;
      form.value = data.data;
      administrativeDivisionsValue.value = form.value.administrativeDivision.split(",");
    }
  } catch (err) {
    return;
  }
};

const open = (item: any) => {
  if (item) {
    getDetail(item._id);
    _id.value = item._id;
    state.value.title = "修改收件地址"
  } else {
    _id.value = "";
    state.value.title = "添加收件地址"
  }
  state.value.dialogFormVisible = true;
};

// 编辑
const edit = async (id: String, params: BiddingAddressDto) => {
  try {
    let result = await BiddingMangerControllerUpdateBiddingAddress(id, params);
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
      alertSuccess("更新成功")
    } else {
      alertWarning(data.message)
    }
  } catch (err) {
    return;
  }
};

// 创建
const create = async (params: BiddingAddressDto) => {
  try {
    let result = await BiddingMangerControllerAddBiddingAddress(params);
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
      alertSuccess("保存成功")
    } else {
      alertWarning(data.message)
    }
  } catch (err) {
    return;
  }
};

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (_id.value) {
        edit(_id.value, form.value);
      } else {
        create(form.value)
      };
    }
  });
};

// 右上角关闭
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  state.value.dialogFormVisible = false;
  form.value = new BiddingAddressDto();
  administrativeDivisionsValue.value = [];
};
defineExpose({ open });
</script>