<template>
  <el-dialog v-model="state.dialogFormVisible" :title="state.title" :close-on-press-escape="false"
    :close-on-click-modal="false" width="70%" @closed="closeForm(ruleFormRef)">
    <el-config-provider :locale="zhCn">
      <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef"
        @submit.native.prevent="submitForm(ruleFormRef)">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="概要" prop="syn">
          <el-input type="textarea" v-model="form.syn" placeholder="请输入概要" />
        </el-form-item>
        <el-form-item label="通知范围" prop="noticeScope">
          <el-cascader style="width: 100%" v-model="cascaderValue.noticeScope" :options="noticeScopeTree"
            :props="{ ...cascaderProps, multiple: true }" @change="noticeScopeChange" placeholder="请选择通知范围" />
        </el-form-item>
        <el-form-item label="所属项目" prop="projectUUID">
          <el-cascader ref="ProjectCascader" style="width: 100%" v-model="cascaderValue.project" :options="projectTree"
            :props="cascaderProps" @change="projectChange" placeholder="请选择所属项目" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input placeholder="请输价格（￥）" v-model="form.price">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发布" prop="isRelease">
          <el-switch v-model="form.isRelease" />
        </el-form-item>
        <el-form-item label="招标/询价文件" prop="biddingFile">
          <el-upload class="upload-demo" style="width: 100%" action="/api/file/uploadPrivate" :on-success="uploadSuccess"
            :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1"
            :on-exceed="handleExceed" :file-list="fileList" :headers="{ Authorization: `Bearer ${getToken()}` }">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="开放方式" prop="openType">
          <el-radio-group v-model="form.openType" size="large">
            <el-radio-button label="0">立即生效</el-radio-button>
            <el-radio-button label="1">大于指定时间</el-radio-button>
            <el-radio-button label="2">时间区间</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.openType == '1'" label="指定时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="请选择开始时间" />
        </el-form-item>
        <el-form-item v-if="form.openType == '2'" label="指定区间" prop="startTime">
          <el-date-picker v-model="timeArea" @change="timeAreaChange" type="datetimerange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="开标时间" prop="openBiddingTime" v-if="false">
          <el-date-picker v-model="form.openBiddingTime" type="datetime" placeholder="请选择开标时间" />
        </el-form-item>
        <el-form-item label="报名截止日期" prop="signUpTime">
          <el-date-picker v-model="form.signUpTime" type="datetime" placeholder="请选择报名截止日期" />
        </el-form-item>
        <el-form-item label="收款账号" prop="collectionAccount" v-if="false" >
          <el-select v-model="form.collectionAccount" placeholder="请选择收款账号">
            <el-option v-for="item in collectionAccountSelect" :key="item._id" :label="item.name" :value="item.UUID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投标邮寄地址" prop="biddingAddrUUID">
          <el-select v-model="form.biddingAddrUUID" placeholder="请选择投标邮寄地址">
            <el-option v-for="item in biddingAddressSelect" :key="item._id" :label="item.name" :value="item.UUID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招标说明" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
              mode="default" />
            <Editor style="height: 500px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig"
              mode="default" @onCreated="handleCreated" @onChange="onContentChange" />
          </div>
        </el-form-item>
      </el-form>
    </el-config-provider>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  toRefs,
  defineComponent,
  onBeforeUnmount,
  shallowRef,
  onMounted,
} from "vue";
import { alertConfirm, alertSuccess, alertWarning } from "@/utils/message";
import { BiddingMangerDto } from "@/api/dto/BiddingMangerDto";
import { TreeClassificationControllerGetTree } from "@/api/TreeClassificationControllerApi";
import {
  BiddingMangerControllerAddBidding,
  BiddingMangerControllerGetBiddingAddressList,
  BiddingMangerControllerGetBiddingDetailById,
  BiddingMangerControllerUpdateBidding,
} from "@/api/BiddingMangerControllerApi";
import {
  ElConfigProvider,
  type FormInstance,
  type FormRules,
  type UploadFile,
  type UploadFiles,
  type UploadUserFile,
} from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { CollectionAccountManagementControllerGetList } from "@/api/CollectionAccountManagementControllerApi";
import type { IDomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { getToken } from "@/utils/authTokenUtil";
const emit = defineEmits(["Refresh"]);
const _id = ref("");
const ProjectCascader = ref();
const form = ref(new BiddingMangerDto());
// from初始化

const ruleFormRef = ref<FormInstance>();
const checkStartTime = (rule: any, value: any, callback: any) => {
  if (form.value.openType == "1" && !value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
const checkEndTime = (rule: any, value: any, callback: any) => {
  if (form.value.openType == "2" && !value) {
    callback(new Error("不能为空"));
  } else {
    callback();
  }
};
const checkPrice = (rule: any, value: any, callback: any) => {
  if (!/^(([0-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(value)) {
    callback(new Error("仅允许整数或保留1-2位小数的数字"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  title: [{ required: true, message: "不能为空", trigger: "blur" }],
  noticeScope: [{ required: true, message: "不能为空", trigger: "blur" }],
  projectUUID: [{ required: true, message: "不能为空", trigger: "blur" }],
  sync: [{ required: true, message: "不能为空", trigger: "blur" }],
  startTime: [{ validator: checkStartTime, trigger: "blur" }],
  endTime: [{ validator: checkEndTime, trigger: "blur" }],
  // openBiddingTime: [{ required: true, message: "不能为空", trigger: "blur" }],
  signUpTime: [{ required: true, message: "不能为空", trigger: "blur" }],
  price: [{ validator: checkPrice, trigger: "blur" }],
  collectionAccount: [{ required: true, message: "不能为空", trigger: "blur" }],
  biddingAddrUUID: [{ required: true, message: "不能为空", trigger: "blur" }],
  biddingFile: [{ required: true, message: "不能为空", trigger: "blur" }],
  content: [{ required: true, message: "不能为空", trigger: "blur" }],
});
const timeArea = ref(new Array<any>());
const editorRef = shallowRef();
const toolbarConfig = {};
const fileList = ref<UploadUserFile[]>([]);
const uploadSuccess = (
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  const { data, status, message } = response;
  if (status == 1) {
    const { UUID, fileName, url } = data;
    form.value.fileIds?.push(UUID);
    form.value.biddingFile = [fileName, url].join(",");
  } else {
    alertWarning(message);
  }
};
const handleRemove = (file: any, fileList: any) => {
  console.log("handleRemove");
};
const handlePreview = (file: any) => {
  console.log("handlePreview");
};
const handleExceed = (files: any, fileList: any): any => {
  console.log("handleExceed");
};
const beforeRemove = (file: any, fileList: any) => {
  return alertConfirm(`确定移除 ${file.name}？`);
};
// 富文本配置
const editorConfig: any = {
  placeholder: "请输入内容...",
  MENU_CONF: {},
};
// 上传图片配置
editorConfig.MENU_CONF["uploadImage"] = {
  server: "/api/file/upload",
  timeout: 5 * 1000, // 5s

  fieldName: "file",
  // meta: { token: "xxx", a: 100 },
  // metaWithUrl: true, // join params to url
  // headers: { Accept: "text/x-json" },

  // maxFileSize: 10 * 1024 * 1024, // 10M

  // base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb

  onBeforeUpload(file: any) {
    return file; // will upload this file
    // return false // prevent upload
  },
  onProgress(progress: any) {
    console.log("onProgress", progress);
  },
  onSuccess(file: any, res: any) {
    console.log("onSuccess", file, res);
  },
  onFailed(file: any, res: any) {
    console.log("onFailed", file);
    console.log("onFailed", res);
  },
  customInsert(res: any, insertFn: any) {
    console.log("insertFn", insertFn);
    console.log("customInsert", res);
    let data = res.data;
    insertFn("/api" + data.url, data.fileName, "/api" + data.url);
  },
  onError(file: any, err: any, res: any) {
    console.error("onError", file, err, res);
  },
};
editorConfig.MENU_CONF["uploadVideo"] = {
  ...editorConfig.MENU_CONF["uploadImage"],
};
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
// 获取编辑框html
const onContentChange = (editor: IDomEditor) => {
  form.value.content = editor.getHtml();
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const valueHtml = ref("");
const state = ref({
  dialogFormVisible: false,
  title: "添加银行账号",
  load: false,
  userListData: [],
  params: {
    pageIndex: 1,
    pageSize: 10,
    total: 10,
  },
  dictionaryData: new Array<any>(),
});
const collectionAccountSelect = ref(new Array<any>());
const getCollectionAccountSelect = async () => {
  const { data: res } = await CollectionAccountManagementControllerGetList();
  if (res.status == 1) {
    collectionAccountSelect.value = res.data;
    const [one] = collectionAccountSelect.value;
    if (!form.value.collectionAccount) {
      form.value.collectionAccount = one?.UUID;
    }
  } else {
    console.warn(res.message);
  }
};
const biddingAddressSelect = ref(new Array<any>());
const getBiddingAddressSelect = async () => {
  const { data: res } = await BiddingMangerControllerGetBiddingAddressList();
  if (res.status == 1) {
    biddingAddressSelect.value = res.data;
    const [one] = biddingAddressSelect.value;
    if (!form.value.biddingAddrUUID) {
      form.value.biddingAddrUUID = one?.UUID;
    }
  } else {
    console.warn(res.message);
  }
};
enum TREE_TYPE {
  "公司项目分类" = "DC00140002",
  "供应商分类" = "DC00140001",
}
const cascaderProps = {
  value: "UUID" as const,
  label: "name" as const,
  expandTrigger: "hover" as const,
};
const noticeScopeTree = ref(new Array<any>());
const projectTree = ref(new Array<any>());
const cascaderValue = ref({
  noticeScope: new Array<any>(),
  project: new Array<any>(),
});
const getTree = async (treeType: TREE_TYPE) => {
  const { data: res } = await TreeClassificationControllerGetTree(treeType, {
    keyWord: "",
  });
  if (res.status == 1) {
    if (treeType == TREE_TYPE.供应商分类) {
      noticeScopeTree.value = res.data;
    } else if (treeType == TREE_TYPE.公司项目分类) {
      projectTree.value = res.data;
    }
  } else {
    console.warn(res.message);
  }
};
const noticeScopeChange = (value: any) => {
  form.value.noticeScope = value.map((item: Array<string>) => item.join(","));
};
const projectChange = (value: any) => {
  form.value.projectUUID = value;
  const [note] = ProjectCascader.value.getCheckedNodes();
  form.value.projectName = note.label;
};
const timeAreaChange = (value: any) => {
  const [start, end] = value;
  form.value.startTime = start;
  form.value.endTime = end;
};
// 获取详情
const getDetail = async (id: string) => {
  try {
    let { data: res } = await BiddingMangerControllerGetBiddingDetailById(id);
    if (res.status === 1) {
      delete res.data._id;
      form.value = { ...res.data };
      const [name, url] = form.value.biddingFile.split(",");
      fileList.value = [{ name, url }];
      cascaderValue.value.noticeScope = form.value.noticeScope.map((item) =>
        item.split(",")
      );
      cascaderValue.value.project = form.value.projectUUID;
      valueHtml.value = `${form.value.content}`;
      if (form.value.openType != "2") {
        timeArea.value = [form.value.startTime, form.value.endTime];
      }
    }
  } catch (err) {
    return;
  }
};

const open = (item: any) => {
  form.value.openType = "0";
  form.value.isRelease = true;
  form.value.price = "0";
  getTree(TREE_TYPE.供应商分类);
  getTree(TREE_TYPE.公司项目分类);
  getCollectionAccountSelect();
  getBiddingAddressSelect();
  if (item) {
    getDetail(item._id);
    _id.value = item._id;
    state.value.title = "修改招标公告";
  } else {
    _id.value = "";
    state.value.title = "添加招标公告";
  }
  state.value.dialogFormVisible = true;
};

// 编辑
const edit = async (id: string, params: BiddingMangerDto) => {
  try {
    let result = await BiddingMangerControllerUpdateBidding(id, params);
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
      alertSuccess("更新成功");
    } else {
      alertWarning(data.message);
    }
  } catch (err) {
    return;
  }
};

// 创建
const create = async (params: BiddingMangerDto) => {
  try {
    let result = await BiddingMangerControllerAddBidding(params);
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
      alertSuccess("保存成功");
    } else {
      alertWarning(data.message);
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
        create(form.value);
      }
    } else {
      alertWarning("请检查表单输入");
    }
  });
};

// 右上角关闭
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  state.value.dialogFormVisible = false;
  form.value = { ...new BiddingMangerDto() };
  cascaderValue.value.noticeScope = [];
  cascaderValue.value.project = [];
  valueHtml.value = "";
  fileList.value = [];
};
defineExpose({ open });
</script>
