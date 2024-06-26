<template>
  <div>
    <slot></slot>
  </div>
  <el-form-item :label="`${props.configGroupItem.labelName}:`">
    <el-input
      v-model="modelValue"
      v-if="props.configGroupItem.dom == 'Input'"
      :placeholder="props.configGroupItem.description"
      clearable
    ></el-input>
    <el-input
      v-model="modelValue"
      type="password"
      v-if="props.configGroupItem.dom == 'Password'"
      :placeholder="props.configGroupItem.description"
      clearable
    ></el-input>
    <el-input
      v-model="modelValue"
      type="textarea"
      v-if="props.configGroupItem.dom == 'Area'"
      :placeholder="props.configGroupItem.description"
      clearable
    ></el-input>
    <el-switch
      v-model="modelValue"
      v-if="props.configGroupItem.dom == 'Swatch'"
    />
    <el-select
      v-model="modelValue"
      :placeholder="props.configGroupItem.description"
      v-if="props.configGroupItem.dom == 'Select'"
      style="width: 100%"
      clearable
      filterable
    >
      <el-option
        v-for="item in selectValue"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
    <el-select
      v-model="modelValue"
      :placeholder="props.configGroupItem.description"
      v-if="props.configGroupItem.dom == 'MoreSelect'"
      multiple
      clearable
      filterable
      style="width: 100%"
    >
      <el-option
        v-for="item in selectValue"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
    <el-upload
      ref="uploadRef"
      action="/api/file/uploadPrivate"
      v-model:file-list="fileList"
      :limit="1"
      :headers="{ Authorization: `Bearer ${token}` }"
      :on-success="uploadSuccess"
      :auto-upload="false"
      v-if="props.configGroupItem.dom == 'File'"
      style="width: 100%"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <el-button style="margin-left: 18px" type="success" @click="submitUpload">
        上传
      </el-button>
      <template v-if="props.configGroupItem.description" #tip>
        <div class="el-upload__tip">
          说明：{{ props.configGroupItem.description }}
        </div>
      </template>
    </el-upload>
    <h5 v-if="!props.configGroupItem?.allowFetch">
      {{ props.resData?.isSet ? "已设置" : "未设置" }}
    </h5>
  </el-form-item>
</template>

<script lang="ts" setup>
import { watchEffect, ref } from "vue";
import { ConfigGroupItem } from "../SystemConfigPage";
import { getToken } from "@/utils/authTokenUtil";
import type { UploadInstance, UploadUserFile } from "element-plus";
import { alertWarning } from "@/utils/message";
import axios from "axios";
import { SystemConfigDto } from "@/api/dto/SystemConfigDto";
const props = defineProps({
  configGroupItem: {
    type: ConfigGroupItem,
    required: true,
  },
  defaultValue: {
    type: String,
    required: false,
  },
  groupName: {
    type: String,
    required: false,
  },
  resData: {
    type: SystemConfigDto,
    required: false,
  },
});
const emits = defineEmits(["change"]);
const token = getToken();
const modelValue = ref("" as any);
const selectValue = ref([
  {
    label: "选项一",
    value: 1,
  },
  {
    label: "选项二",
    value: 2,
  },
]);
const fileList = ref<UploadUserFile[]>([]);
const uploadSuccess = (res: any) => {
  const { status, data, message } = res;
  if (status == 1) {
    modelValue.value = JSON.stringify(data);
  } else {
    alertWarning(message);
  }
};
const uploadRef = ref<UploadInstance>();
const submitUpload = () => {
  uploadRef.value!.submit();
};
watchEffect(() => {
  if (
    props.configGroupItem.dom === "MoreSelect" &&
    Array.isArray(modelValue.value) &&
    modelValue.value.length
  ) {
    emits(
      "change",
      props.groupName,
      props.configGroupItem,
      modelValue.value.join(",")
    );
  } else {
    emits("change", props.groupName, props.configGroupItem, modelValue.value);
  }
});
watchEffect(async () => {
  if (props.resData) {
    // 设置服务器返回值
    if (props.configGroupItem.dom === "Swatch") {
      modelValue.value = props.resData.confValue == "true";
    } else if (props.configGroupItem.dom === "MoreSelect") {
      modelValue.value = props.resData.confValue?.split(",");
    } else if (props.configGroupItem.dom === "File") {
      if (props.resData.confValue) {
        const fileObj = JSON.parse(props.resData.confValue);
        fileList.value = [
          {
            name: fileObj.fileName,
            url: fileObj.url,
          },
        ];
      }
    } else {
      modelValue.value = props.resData.confValue;
    }
  } else {
    // 设置默认值
    if (props.configGroupItem.dom === "Swatch") {
      modelValue.value = props.defaultValue == "true";
    } else if (props.configGroupItem.dom === "MoreSelect") {
      modelValue.value = props.defaultValue?.split(",");
    } else {
      modelValue.value = props.defaultValue;
    }
  }
});
watchEffect(async () => {
  if (props.configGroupItem.dataUrl) {
    const {
      data: { status, data, message },
    } = await axios.get(props.configGroupItem.dataUrl);
    if (status == 1) {
      if (props.configGroupItem.dataLabel && props.configGroupItem.dataValue) {
        selectValue.value = data.map((item: any) => {
          return {
            label: item[props.configGroupItem.dataLabel],
            value: item[props.configGroupItem.dataValue],
          };
        });
      } else {
        selectValue.value = data;
      }
    } else {
      alertWarning(message);
    }
  }
});
</script>
