<template>
  <el-dialog
    v-model="state.dialogFormVisible"
    :title="state.title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    @closed="closeForm(ruleFormRef)"
  >
    <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
      <el-form-item label="标题" prop="articleName">
        <el-input v-model="form.articleName" placeholder="请输入文章名称" />
      </el-form-item>
      <el-form-item prop="cover" label="文章封面">
        <div>
          <el-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            action="/api/file/upload"
            name="file"
            :auto-upload="true"
            :limit="1"
            :on-success="onSuccess"
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
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
          <el-input style="display: none" v-model="form.cover"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="分类" prop="articleClass">
        <el-select
          v-model="form.articleClass"
          class="m-2"
          placeholder="请选择文章分类"
          size="large"
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
      <el-form-item label="概要" prop="syn">
        <el-input
          v-model="form.syn"
          type="textarea"
          :rows="4"
          placeholder="请输入文章概要"
        />
      </el-form-item>
      <el-form-item label="是否发布" prop="release">
        <el-switch v-model="form.release" />
      </el-form-item>
      <el-form-item label="有效期" prop="expirationDate">
        <el-date-picker
          v-model="form.expirationDate"
          type="datetime"
          placeholder="请选择有效期"
        />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <div style="border: 1px solid #ccc" v-if="state.dialogFormVisible">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
            @onChange="onChange"
          />
        </div>
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
import { ref, reactive, onBeforeUnmount, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { IDomEditor } from "@wangeditor/editor";
import { btnShow } from "../../../utils/buttonShow";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
import {
  ArticleManagementControllerCreate,
  ArticleManagementControllerGetDetailByArticleId,
  ArticleManagementControllerUpdate,
} from "@/api/ArticleManagementControllerApi";
import { Delete, Edit, Plus, Download, ZoomIn } from "@element-plus/icons-vue";
import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadUserFile,
} from "element-plus";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { ArticleManagementDto } from "@/api/dto/ArticleManagementDto";

const emit = defineEmits(["Refresh"]);
const form = ref({ _id: "", ...new ArticleManagementDto() });
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  articleName: [
    { required: true, message: "文章标题不能为空", trigger: "blur" },
  ],
  cover: [],
  articleClass: [{ required: true, message: "不能为空", trigger: "change" }],
  syn: [],
  content: [],
  release: [],
});

// 编辑器实例，必须用 shallowRef 和 富文本内容 HTML
const editorRef = shallowRef();
const valueHtml = ref("");

// 文章封面相关配置
const fileList = ref<UploadUserFile[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);

const state = reactive({
  dialogFormVisible: false,
  title: "添加文章",
  load: false,
  userListData: [],
  params: {
    pageIndex: 1,
    pageSize: 10,
    total: 10,
  },
  dictionaryData: new Array<any>(),
});

const open = (item: any) => {
  if (item) getDetail(item._id);
  state.dialogFormVisible = true;
};

// 上传封面照片 成功回调
const onSuccess = (e: any) => {
  form.value.cover = e.data.url;
};

// 删除封面
const handleRemove = (file: UploadFile) => {
  fileList.value = [];
};

// 获取文章分类字典
const getArticleDictionary = async (dicCode: string) => {
  try {
    let result = await DataDictionaryControllerGetListByDicClass(dicCode);
    let data = result.data;
    if (data.status === 1) {
      const result = data.data.map((item: any) => {
        return { name: item.dicName, value: item.dicCode };
      });
      state.dictionaryData = result;
    }
  } catch (err) {
    return;
  }
};
getArticleDictionary("DC0001");

// 获取文章详情
const getDetail = async (id: string) => {
  try {
    let result = await ArticleManagementControllerGetDetailByArticleId(id);
    let data = result.data;
    if (data.status === 1) {
      const { articleName, cover, articleClass, syn, content, release } =
        data.data;
      // 设置表单
      form.value = data.data;
      valueHtml.value = content;
      if (cover) {
        // 封面
        fileList.value = [{ name: "", url: "/api/" + cover }];
      }
    }
  } catch (err) {
    return;
  }
};

// 编辑文章
const editArticle = async (id: string, params: any) => {
  try {
    let result = await ArticleManagementControllerUpdate(id, params);
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
    }
  } catch (err) {
    return;
  }
};

// 发布文章接口
const postArticleManagementControllerCreate = async (params: any) => {
  try {
    const { articleName, cover, articleClass, syn, content, release } = params;
    let result = await ArticleManagementControllerCreate({
      articleName,
      cover,
      articleClass,
      syn,
      content,
      release,
    });
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
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
      if (form.value._id) editArticle(form.value._id, form.value);
      else postArticleManagementControllerCreate(form.value);
    } else {
      console.log("校验失败", fields);
    }
  });
};

// 右上角关闭
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  state.dialogFormVisible = false;
  // 重置表单 富文本 封面
  form.value = {
    articleName: "",
    cover: "",
    articleClass: "",
    syn: "",
    content: "",
    release: true,
    _id: "",
  };
  valueHtml.value = "";
  fileList.value = [];
};

// 编辑框工具配置
const toolbarConfig = {};
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

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
// 获取编辑框html
const onChange = (editor: IDomEditor) => {
  form.value.content = editor.getHtml();
};
const mode = "default";
defineExpose({ open });
</script>
