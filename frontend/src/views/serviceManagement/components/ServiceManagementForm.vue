<template>
  <el-dialog
    v-model="show"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    @closed="close(serviceManagementFormRef)"
  >
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="serviceManagementFormRef"
    >
      <el-form-item label="图片:" prop="picture">
        <div>
          <el-upload
            v-model:file-list="pictureFileList"
            list-type="picture-card"
            action="/api/file/upload"
            name="file"
            :auto-upload="true"
            :limit="1"
            :on-success="pictureOnSuccess"
          >
            <el-icon>
              <Plus />
            </el-icon>
            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="pictureRemove(file)"
                  >
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                  <el-image
                    :src="viewIcon"
                    preview-teleported
                    style="width: 32px; margin-left: 10px"
                    :preview-src-list="[file.url]"
                  >
                  </el-image>
                </span>
              </div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="简称:" prop="forShort">
        <el-input
          v-model="form.forShort"
          placeholder="简称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number
          v-model="form.sort"
          placeholder="排序"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="是否启用:" prop="enableOrNot">
        <el-switch v-model="form.enableOrNot"></el-switch>
      </el-form-item>
      <el-form-item label="关联服务:" prop="relatedServices">
        <el-select
          style="width: 100%"
          v-model="relatedServicesSelectValue"
          @change="relatedServicesSelectChange"
          multiple
          clearable
          placeholder="请选择关联服务"
        >
          <el-option
            v-for="item in relatedServicesSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约信息类型:" prop="appointmentInformationType">
        <el-select
          style="width: 100%"
          v-model="form.appointmentInformationType"
          clearable
          placeholder="请选择预约信息类型"
          @change="appointmentInformationTypeSelectChange"
        >
          <el-option
            v-for="item in appointmentInformationTypeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务说明:" prop="serviceDescription">
        <el-input
          type="textarea"
          clearable
          :rows="2"
          placeholder="请输入服务说明"
          v-model="form.serviceDescription"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="付费方式:" prop="paymentMethod">
        <el-select
          style="width: 100%"
          v-model="form.paymentMethod"
          clearable
          placeholder="请选择付费方式"
          @change="paymentMethodSelectChange"
        >
          <el-option
            v-for="item in paymentMethodSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同模板:" prop="contractTemplate">
        <el-select
          style="width: 100%"
          v-model="form.contractTemplate"
          clearable
          placeholder="请选择合同模板"
          @change="contractTemplateSelectChange"
        >
          <el-option
            v-for="item in contractTemplateSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开放区域:" prop="openArea">
        <el-cascader
          style="width: 100%"
          clearable
          collapse-tags
          v-model="openAreaTreeValue"
          :props="openAreaTreeProps"
          :options="openAreaTreeOptions"
          ref="openAreaTreeRef"
          @change="openAreaTreeChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="服务类型:" prop="serviceType">
        <el-select
          style="width: 100%"
          v-model="form.serviceType"
          clearable
          placeholder="请选择服务类型"
          @change="serviceTypeSelectChange"
        >
          <el-option
            v-for="item in serviceTypeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="卡片类型:"
        v-if="form.serviceType === 'DC00330002'"
        prop="cardType"
      >
        <el-select
          style="width: 100%"
          v-model="form.cardType"
          clearable
          placeholder="请选择卡片类型"
          @change="cardTypeSelectChange"
        >
          <el-option
            v-for="item in cardTypeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务详情:" prop="serviceDetails">
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="serviceDetailsEditorRef"
            mode="default"
          />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="serviceDetailsHtml"
            :defaultConfig="serviceDetailsEditorConfig"
            mode="default"
            @onCreated="serviceDetailsEditorCreated"
            @onChange="(editor: IDomEditor) => {form.serviceDetails=editor.getHtml();}"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-loading="saveLoading"
          v-if="btnShow('save-serviceManagement')"
          type="primary"
          @click="save(serviceManagementFormRef)"
        >
          {{ form._id ? "更新" : "保存" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount, shallowRef } from "vue";
import axios from "axios";
import { btnShow } from "@/utils/buttonShow";
import { getToken } from "@/utils/authTokenUtil";
import { viewIcon } from "@/utils/enum/iconBase64";
import { alertSuccess, alertWarning } from "@/utils/message";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { IDomEditor } from "@wangeditor/editor";
import { MENU_CONF } from "@/common/EditorConfig";

import { AdministrativeDivisionsControllerGetListByDicClass } from "@/api/AdministrativeDivisionsControllerApi";
import { SelectDto } from "@/common/CommonDto";
import {
  ServiceManagementControllerCreate,
  ServiceManagementControllerGetDetailById,
  ServiceManagementControllerUpdate,
} from "@/api/ServiceManagementControllerApi";
import type {
  FormInstance,
  CascaderProps,
  FormRules,
  UploadFile,
  UploadUserFile,
} from "element-plus";
import { ExpandTrigger } from "element-plus";
import { ServiceManagementDto } from "@/api/dto/ServiceManagementDto";
const emit = defineEmits(["Refresh"]);
const show = ref(false);
const title = ref("添加服务管理");
const form = ref(new ServiceManagementDto());
const serviceManagementFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  picture: [{ required: true, message: "图片不能为空", trigger: "blur" }],
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  forShort: [{ required: true, message: "简称不能为空", trigger: "blur" }],
  enableOrNot: [],
  relatedServices: [],
  appointmentInformationType: [
    { required: true, message: "预约信息类型不能为空", trigger: "blur" },
  ],
  serviceDescription: [
    { required: true, message: "服务说明不能为空", trigger: "blur" },
  ],
  paymentMethod: [
    { required: true, message: "付费方式不能为空", trigger: "blur" },
  ],
  contractTemplate: [
    { required: true, message: "合同模板不能为空", trigger: "blur" },
  ],
  openArea: [{ required: true, message: "开放区域不能为空", trigger: "blur" }],
  serviceType: [
    { required: true, message: "服务类型不能为空", trigger: "blur" },
  ],
  cardType: [],
  serviceDetails: [],
});

const open = (item: ServiceManagementDto) => {
  show.value = true;
  if (item?._id) {
    title.value = "编辑服务管理";
    getDetail(item._id);
  } else {
    title.value = "添加服务管理";
    form.value.enableOrNot = true;
  }
};

// 获取select数据
const contractTemplateSelect = ref(new Array<SelectDto<any>>());
const getContractTemplateSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/contractTemplate/getList/DC00110001");
  if (status === 1) {
    data.map((item: any) => {
      contractTemplateSelect.value.push(
        new SelectDto<any>(item["name"], item["UUID"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getContractTemplateSelect();
const contractTemplateSelectChange = (value: string) => {
  form.value.contractTemplateText = contractTemplateSelect.value.filter(
    (item) => item.value == value
  )[0].label;
};

const pictureFileList = ref<UploadUserFile[]>([]);
const pictureOnSuccess = (response: any) => {
  const { data, status, message } = response;
  if (status == 1) {
    const { UUID, fileName: name, url } = data;
    form.value.fileIds?.push(UUID);
    form.value.picture += `${name},${url};`;
  } else {
    alertWarning(message);
  }
};
const pictureRemove = (file: UploadFile) => {
  console.log("handleRemove", file);
  pictureFileList.value = pictureFileList.value.filter(
    (item: any) => item.uid != file.uid
  );
  if (form.value.picture) {
    let temp = "";
    form.value.picture.split(";").map((item, i) => {
      if (item) {
        if (item.indexOf(file.name) == -1) {
          temp += `${item};`;
        }
      }
    });
    form.value.picture = temp;
  }
};
// 获取select数据
const relatedServicesSelect = ref(new Array<SelectDto<any>>());
const getRelatedServicesSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/serviceManagement/getList");
  if (status === 1) {
    data.map((item: any) => {
      relatedServicesSelect.value.push(
        new SelectDto<any>(item["forShort"], item["UUID"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getRelatedServicesSelect();
const relatedServicesSelectValue = ref(new Array<any>());
const relatedServicesSelectChange = (value: any) => {
  form.value.relatedServices = value.join();
};
// 获取select数据
const appointmentInformationTypeSelect = ref(new Array<SelectDto<any>>());
const getAppointmentInformationTypeSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/admin/dic/getList/DC0030");
  if (status === 1) {
    data.map((item: any) => {
      appointmentInformationTypeSelect.value.push(
        new SelectDto<any>(item["dicName"], item["dicCode"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getAppointmentInformationTypeSelect();
const appointmentInformationTypeSelectChange = (value: string) => {
  form.value.appointmentInformationTypeText =
    appointmentInformationTypeSelect.value.filter(
      (item) => item.value == value
    )[0].label;
};
// 获取select数据
const paymentMethodSelect = ref(new Array<SelectDto<any>>());
const getPaymentMethodSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/billingMethodManagement/getList");
  if (status === 1) {
    data.map((item: any) => {
      paymentMethodSelect.value.push(
        new SelectDto<any>(item["name"], item["UUID"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getPaymentMethodSelect();
const paymentMethodSelectChange = (value: string) => {
  form.value.paymentMethodText = paymentMethodSelect.value.filter(
    (item) => item.value == value
  )[0].label;
};
const openAreaTreeValue = ref(new Array<any>());
const openAreaTreeRef = ref();
const openAreaTreeOptions = ref(new Array<any>());

const openAreaTreeProps = {
  emitPath: false,

  multiple: true,

  checkStrictly: true,
  value: "UUID",
  label: "name",
  children: "children",
};
const getOpenAreaTree = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/treeClassification/getTree/DC00070001");
  if (status === 1) {
    openAreaTreeOptions.value = data;
  } else {
    alertWarning(message);
  }
};
getOpenAreaTree();

const openAreaTreeChange = (value: any) => {
  console.log(value);

  form.value.openArea = value.join();
  form.value.openAreaText = openAreaTreeRef.value
    .getCheckedNodes(true)
    .map((node: any) => node.text)
    .join();
};
// 获取select数据
const serviceTypeSelect = ref(new Array<SelectDto<any>>());
const getServiceTypeSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/admin/dic/getList/DC0033");
  if (status === 1) {
    data.map((item: any) => {
      serviceTypeSelect.value.push(
        new SelectDto<any>(item["dicName"], item["dicCode"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getServiceTypeSelect();
const serviceTypeSelectChange = (value: string) => {
  form.value.serviceTypeText = serviceTypeSelect.value.filter(
    (item) => item.value == value
  )[0].label;
};
// 获取select数据
const cardTypeSelect = ref(new Array<SelectDto<any>>());
const getCardTypeSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/admin/dic/getList/DC0032");
  if (status === 1) {
    data.map((item: any) => {
      cardTypeSelect.value.push(
        new SelectDto<any>(item["dicName"], item["dicCode"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getCardTypeSelect();
const cardTypeSelectChange = (value: string) => {
  form.value.cardTypeText = cardTypeSelect.value.filter(
    (item) => item.value == value
  )[0].label;
};
const serviceDetailsEditorRef = shallowRef();
const serviceDetailsHtml = ref("");
const serviceDetailsEditorConfig: any = {
  placeholder: "请输入内容...",
  MENU_CONF,
};
const serviceDetailsEditorCreated = (editor: any) => {
  serviceDetailsEditorRef.value = editor;
};
onBeforeUnmount(() => {
  if (serviceDetailsEditorRef.value) {
    serviceDetailsEditorRef.value.destroy();
  }
});
const getDetail = async (id: string) => {
  const {
    data: { status, data, message },
  } = await ServiceManagementControllerGetDetailById(id);
  if (status === 1) {
    form.value = data;
    initOtherValue(data);
  } else {
    alertWarning(message);
  }
};
const initOtherValue = (data: ServiceManagementDto) => {
  console.log(data);

  if (data.picture) {
    const pictureFileArr = data.picture.split(";");
    pictureFileArr.map((item) => {
      if (item) {
        let [name, url] = item.split(",");
        url = "/api" + url;
        pictureFileList.value.push({ name, url });
      }
    });
  } else {
    pictureFileList.value = [];
  }

  if (data.relatedServices) {
    relatedServicesSelectValue.value = data.relatedServices.split(",");
  } else {
    relatedServicesSelectValue.value = [];
  }

  if (data.openArea) {
    openAreaTreeValue.value = data.openArea.split(",");
  } else {
    openAreaTreeValue.value = [];
  }

  if (data.serviceDetails) {
    serviceDetailsHtml.value = data.serviceDetails;
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
        ? await ServiceManagementControllerUpdate(form.value._id, form.value)
        : await ServiceManagementControllerCreate(form.value);
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
  form.value = new ServiceManagementDto();
  initOtherValue(form.value);
};

defineExpose({ open });
</script>
