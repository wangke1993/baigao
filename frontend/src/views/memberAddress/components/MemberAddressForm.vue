<template>
  <el-dialog
    v-model="show"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    @closed="close(memberAddressFormRef)"
  >
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="memberAddressFormRef"
    >
      <el-form-item label="所属会员:" prop="memberUUID">
        <el-input
          v-model="form.memberUUID"
          placeholder="所属会员"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="行政区划:" prop="administrativeDivision">
        <el-cascader
          style="width: 100%"
          clearable
          collapse-tags
          v-model="administrativeDivisionTreeValue"
          :props="administrativeDivisionTreeProps"
          :options="administrativeDivisionTreeOptions"
          ref="administrativeDivisionTreeRef"
          @change="administrativeDivisionTreeChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址:" prop="address">
        <el-input
          type="textarea"
          clearable
          :rows="2"
          placeholder="请输入详细地址"
          v-model="form.address"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="联系人:" prop="contacts">
        <el-input
          v-model="form.contacts"
          placeholder="联系人"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="contactsPhone">
        <el-input
          v-model="form.contactsPhone"
          placeholder="联系电话"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-loading="saveLoading"
          v-if="btnShow('save-memberAddress')"
          type="primary"
          @click="save(memberAddressFormRef)"
        >
          {{ form._id ? "更新" : "保存" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { btnShow } from "@/utils/buttonShow";
import { getToken } from "@/utils/authTokenUtil";
import { alertSuccess, alertWarning } from "@/utils/message";
import { AdministrativeDivisionsControllerGetListByDicClass } from "@/api/AdministrativeDivisionsControllerApi";
import { SelectDto } from "@/common/CommonDto";
import {
  MemberAddressControllerCreate,
  MemberAddressControllerGetDetailById,
  MemberAddressControllerUpdate,
} from "@/api/MemberAddressControllerApi";
import {
  ExpandTrigger,
  type FormInstance,
  type CascaderProps,
  type FormRules,
} from "element-plus";
import { MemberAddressDto } from "@/api/dto/MemberAddressDto";
const emit = defineEmits(["Refresh"]);
const show = ref(false);
const title = ref("添加收货地址管理");
const form = ref(new MemberAddressDto());
const memberAddressFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  memberUUID: [
    { required: true, message: "所属会员不能为空", trigger: "blur" },
  ],
  administrativeDivision: [
    { required: true, message: "行政区划不能为空", trigger: "blur" },
  ],
  address: [{ required: true, message: "详细地址不能为空", trigger: "blur" }],
  contacts: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
  contactsPhone: [
    { required: true, message: "联系电话不能为空", trigger: "blur" },
  ],
});
const open = (item: MemberAddressDto) => {
  show.value = true;
  if (item?._id) {
    title.value = "编辑收货地址管理";
    getDetail(item._id);
  } else {
    title.value = "添加收货地址管理";
  }
};

const administrativeDivisionTreeValue = ref(new Array<any>());
const administrativeDivisionTreeRef = ref();
const administrativeDivisionTreeOptions = ref(new Array<any>());
const administrativeDivisionSelectName: any = {};

const administrativeDivisionTreeProps: CascaderProps = {
  expandTrigger: ExpandTrigger.HOVER,
  value: "code",
  label: "name",
  lazy: true,
  checkStrictly: true,
  lazyLoad: async (node: any, resolve) => {
    const code = node.value || "0";
    const { data: res } =
      await AdministrativeDivisionsControllerGetListByDicClass(code);
    if (res.status == 1) {
      resolve(
        res.data.map((item: any) => {
          administrativeDivisionSelectName[item.code] = item.name;
          item.leaf = node.level >= 2;
          return item;
        })
      );
    } else {
      resolve();
    }
  },
};

const administrativeDivisionTreeChange = (value: any) => {
  console.log(value);

  form.value.administrativeDivision = value.join();
  form.value.administrativeDivisionText = "";
  value?.map(
    (key: any) =>
      (form.value.administrativeDivisionText += `${
        form.value.administrativeDivisionText ? "/" : ""
      }${administrativeDivisionSelectName[key]}`)
  );
  form.value.administrativeDivision =
    administrativeDivisionTreeValue.value.join(",");
};
const getDetail = async (id: string) => {
  const {
    data: { status, data, message },
  } = await MemberAddressControllerGetDetailById(id);
  if (status === 1) {
    form.value = data;
    initOtherValue(data);
  } else {
    alertWarning(message);
  }
};
const initOtherValue = (data: MemberAddressDto) => {
  console.log(data);
  if (data.administrativeDivision) {
    administrativeDivisionTreeValue.value =
      data.administrativeDivision.split(",");
  } else {
    administrativeDivisionTreeValue.value = [];
  }
};
const saveLoading = ref(false);
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      saveLoading.value = true;
      const {
        data: { status, message },
      } = form.value._id
        ? await MemberAddressControllerUpdate(form.value._id, form.value)
        : await MemberAddressControllerCreate(form.value);
      saveLoading.value = false;
      if (status === 1) {
        alertSuccess("成功");
        if (!form.value?._id) {
          show.value = false;
        }
        emit("Refresh");
      } else {
        alertWarning(message);
      }
    } else {
      alertWarning("表单校验未通过，请根据提示重新填写");
    }
  });
};

const close = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  show.value = false;
  form.value = new MemberAddressDto();
  initOtherValue(form.value);
};

defineExpose({ open });
</script>
