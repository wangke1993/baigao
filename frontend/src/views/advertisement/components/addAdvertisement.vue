<template>
  <el-dialog
    v-model="state.dialogFormVisible"
    :title="state.title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="78%"
    @closed="closeForm(ruleFormRef)"
  >
    <el-form
      :model="form"
      v-if="formShow"
      label-width="120px"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入广告名称" />
      </el-form-item>
      <el-form-item prop="photo" label="广告图片">
        <el-upload
          class="avatar-uploader"
          action="/api/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <div class="avatar-box" v-if="imageUrl">
            <img :src="imageUrl" class="avatar" />
          </div>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
          <el-input style="display: none" v-model="form.photo"></el-input>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否发布" prop="release">
        <el-switch v-model="form.release" />
      </el-form-item>
      <el-form-item label="链接类型" prop="linkType">
        <el-select
          v-model="form.linkType"
          class="m-2"
          placeholder="请选中链接类型"
          size="large"
          @change="selectChange"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in state.dictionaryData"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="链接值" prop="linkValue">
        <div v-if="form.linkType === 2">
          <el-input v-show="false" v-model="form.linkValue" />
          <el-button type="text" @click="openChoiceArticle()">{{
            form.linkName ? "重新选择" : "选择文章"
          }}</el-button>
          <div>{{ form.linkName }}</div>
          <ChoiceArticle
            ref="ChoiceArticleRef"
            @selectArticle="selectArticle"
          />
        </div>
        <el-input
          v-if="form.linkType === 3"
          v-model="form.linkName"
          placeholder="请输入网址"
        />
      </el-form-item>
      <el-form-item label="广告位置" prop="position">
        <el-select
          v-model="form.position"
          class="m-2"
          placeholder="请选中广告位置"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in state.positionType"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="position">
        <el-input v-model="form.sort" placeholder="请输入广告名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="form.remarks"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm(ruleFormRef)">{{
          form._id ? "更新" : "保存"
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, defineComponent, onMounted } from "vue";
import { btnShow } from "@/utils/buttonShow";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
import {
  AdMangerControllerCreate,
  AdMangerControllerUpdate,
} from "@/api/AdMangerControllerApi";
import type { UploadProps } from "element-plus";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import ChoiceArticle from "@/views/advertisement/components/choiceArticle.vue";
import { alertError } from "@/utils/message";
interface typeInter {
  name: string;
  value: number;
}
interface typeForm {
  name: string | number;
  photo: string | number;
  linkType: string | number;
  linkName: string;
  linkValue: string | number;
  position: string | number;
  remarks: string | number;
  release: boolean;
  _id: string;
  fileIds: string[];
  sort: number;
}
const type = [
  { name: "文章", value: 2 },
  { name: "自定义URL", value: 3 },
];
const emit = defineEmits(["refresh"]);
const form = ref<typeForm>({
  name: "",
  photo: "",
  linkType: "",
  linkName: "",
  linkValue: "",
  position: "",
  remarks: "",
  release: true,
  _id: "",
  fileIds: [],
  sort: 0,
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: "广告名称不能为空", trigger: "blur" }],
  photo: [{ required: true, message: "广告图片不能为空", trigger: "blur" }],
  linkType: [
    { required: true, message: "链接类型不能为空", trigger: "change" },
  ],
  linkName: [{ required: true, message: "链接名不能为空", trigger: "blur" }],
  linkValue: [{ required: true, message: "链接值不能为空", trigger: "blur" }],
  position: [
    { required: true, message: "广告位置不能为空", trigger: "change" },
  ],
  remarks: [],
  release: [],
});

// 文章封面图片
const imageUrl = ref("");
const formShow = ref(false);

// 选择文章组件
const ChoiceArticleRef = ref();

const state = reactive({
  dialogFormVisible: false,
  title: "添加广告",
  load: false,
  userListData: [],
  params: {
    pageIndex: 1,
    pageSize: 10,
    total: 10,
  },
  dictionaryData: new Array<typeInter>(),
  positionType: new Array<typeInter>(),
});

const open = (item: any) => {
  console.log("item", item);
  formShow.value = true;
  if (item) {
    const {
      name,
      photo,
      linkType,
      linkName,
      linkValue,
      position,
      remarks,
      release,
      _id,
    } = item;
    form.value = {
      name,
      photo,
      linkType: Number(linkType),
      linkName,
      linkValue,
      position,
      remarks,
      release,
      _id,
      fileIds: item.fileIds,
      sort: item.sort,
    };
    state.title = _id ? "更新广告" : "添加广告";
    if (photo) {
      // 封面
      imageUrl.value = "/api/" + photo;
    }
  }
  state.dialogFormVisible = true;
};

// 上传封面照片 成功回调
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response: any,
  uploadFile: any
) => {
  console.log("uploadFile", uploadFile);
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  form.value.photo = response.data.url;
  form.value.fileIds.push(response.data._id);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile: any) => {
  console.log("图片类型", rawFile.type);
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    alertError("请上传图片 JPG 或者PNG 格式");
    return false;
  }
  return true;
};

// 链接类型处理
const selectChange = (e: any) => {
  form.value.linkName = "";
  form.value.linkValue = "";
};

// 选中文章
const openChoiceArticle = () => {
  ChoiceArticleRef.value.open();
};

// 设置选中文章值
const selectArticle = (item: any) => {
  console.log("选择文章", item);
  form.value.linkName = item.articleName;
  form.value.linkValue = item._id;
};

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  console.log("表达组件", formEl);
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("验证通过", form.value);
      if (form.value._id) editAdManger(form.value);
      else Create(form.value);
    } else {
      console.log("校验失败", fields);
    }
  });
};

// 右上角关闭
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // 重置表单 富文本 封面
  form.value = {
    name: "",
    photo: "",
    linkType: "",
    linkName: "",
    linkValue: "",
    position: "",
    remarks: "",
    release: true,
    _id: "",
    fileIds: [],
    sort: 0,
  };
  imageUrl.value = "";
  state.dialogFormVisible = false;
  formShow.value = false;
};

// 获取广告位置字典
const getArticleDictionary = async (dicCode: string) => {
  try {
    let result = await DataDictionaryControllerGetListByDicClass(dicCode);
    let data = result.data;
    if (data.status === 1) {
      const result = data.data.map((item: any) => {
        return { name: item.dicName, value: item.dicCode };
      });
      state.positionType = result;
    }
  } catch (err) {
    return;
  }
};
getArticleDictionary("DC0002");

// 创建广告
const Create = async (params: any) => {
  try {
    const {
      name,
      photo,
      linkType,
      linkName,
      linkValue,
      position,
      remarks,
      release,
      sort,
    } = params;
    let result = await AdMangerControllerCreate({
      name,
      photo,
      linkType,
      linkName,
      linkValue,
      position,
      remarks,
      release,
      fileIds: params.fileIds,
      sort,
    });
    let data = result.data;
    if (data.status === 1) {
      console.log("创建广告", data);
      closeForm(ruleFormRef.value);
      emit("refresh");
    }
  } catch (err) {
    return;
  }
};

// 编辑广告
const editAdManger = async (params: any) => {
  try {
    const {
      name,
      photo,
      linkType,
      linkName,
      linkValue,
      position,
      remarks,
      release,
      _id,
      sort,
    } = params;
    let result = await AdMangerControllerUpdate(_id, {
      name,
      photo,
      linkType,
      linkName,
      linkValue,
      position,
      remarks,
      release,
      fileIds: params.fileIds,
      sort,
    });
    let data = result.data;
    if (data.status === 1) {
      console.log("编辑广告广告", data);
      closeForm(ruleFormRef.value);
      emit("refresh");
    }
  } catch (err) {
    return;
  }
};

onMounted(() => {
  state.dictionaryData = type;
});
defineExpose({ open });
</script>
<style lang="scss">
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  text-align: center;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-box {
  position: relative;
  width: 128px;
  height: 128px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 20px;
}

.avatar-box img {
  width: 100%;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
