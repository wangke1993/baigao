<template>
  <div class="dev-box">
    <div class="top-box">
      <el-button type="primary" @click="create()">新增模型</el-button>
      <div class="right" v-if="moduleForm.UUID">
        <el-button type="primary">生成</el-button>
      </div>
    </div>
    <div class="bottom-box">
      <div class="module-list" v-loading="loading.moduleList">
        <div class="list-box" v-if="moduleList.length > 0">
          <div
            :class="{ active: moduleForm.UUID == item.UUID }"
            @click="moduleDetail(item)"
            v-for="item in moduleList"
            :key="item.nameEn"
            class="item"
          >
            <div class="left">
              <h5>{{ item.name }}</h5>
              <p>{{ item.nameEn }}</p>
            </div>
            <div class="right">
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                confirm-button-type="danger"
                title="确定删除吗？"
                @confirm.stop="delModule(item._id)"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle />
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
        <div v-else class="empty-box">暂无数据</div>
      </div>
      <div class="dev-content" v-if="showConf.content">
        <div class="content-top">
          <h3 style="margin-bottom: 20px">模型信息</h3>
          <el-button
            v-loading="btnLoading.moduleSave"
            class="btn"
            @click="saveModuleConf"
            type="primary"
          >
            {{ moduleForm.UUID ? "更新" : "保存" }}
          </el-button>
        </div>
        <el-form label-width="120px" :model="moduleForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="中文名称">
                <el-input
                  v-model="moduleForm.name"
                  placeholder="中文名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英文名称">
                <el-input
                  v-model="moduleForm.nameEn"
                  placeholder="英文名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="挂载菜单">
                <el-cascader
                  v-if="visible"
                  v-model="moduleForm.parentMenu"
                  :options="menuTree"
                  :props="menuTreeProps"
                  style="width: 100%"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  autosize
                  v-model="moduleForm.remakes"
                  placeholder="备注"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="more-conf" v-if="moduleForm.UUID">
          <div style="margin-top: 20px">
            <h3 style="margin-bottom: 20px">字段配置</h3>
            <el-button type="primary" @click="addField()">新增</el-button>
            <el-table :data="moduleFieldList" style="width: 100%">
              <el-table-column label="中文名" prop="name">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.name"
                    placeholder="中文名称"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="英文名称" prop="nameEn">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.nameEn"
                    placeholder="中文名称"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="type">
                <template #default="scope">
                  <el-select
                    v-model="scope.row.type"
                    placeholder="请选择数据类型"
                  >
                    <el-option
                      v-for="item in dataType"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="是否唯一" prop="notRepeat">
                <template #default="scope">
                  <el-switch v-model="scope.row.notRepeat" />
                </template>
              </el-table-column>
              <el-table-column label="默认值" prop="defaultValue">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.defaultValue"
                    placeholder="默认值"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="列表显示" prop="listShow">
                <template #default="scope">
                  <el-switch v-model="scope.row.listShow" />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="description">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.description"
                    type="textarea"
                    placeholder="备注"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="展示组件" prop="dom">
                <template #default="scope">
                  <el-select
                    v-model="scope.row.dom"
                    placeholder="请选择展示组件"
                  >
                    <el-option
                      v-for="item in domType"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <div>
                    <div class="edit" v-if="scope.row.UUID">
                      <el-button type="primary">更新</el-button>
                      <el-button type="danger">删除</el-button>
                    </div>
                    <div class="add" v-else>
                      <el-button type="primary">保存</el-button>
                      <el-button type="danger">取消</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top: 20px" v-if="moduleForm.UUID">
            <h3 style="margin-bottom: 20px">搜索配置</h3>
            <el-button type="primary">新增</el-button>
            <el-table :data="moduleSearchList" style="width: 100%">
              <el-table-column
                label="绑定字段"
                prop="fieldUUID"
              ></el-table-column>
              <el-table-column label="检索方式" prop="method"></el-table-column>
              <el-table-column label="展示组件" prop="dom"></el-table-column>
              <el-table-column label="自动检索" prop="isAuto"></el-table-column>
              <el-table-column label="操作"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Delete } from "@element-plus/icons-vue";
import { AdminMenuControllerGetTreeByMenuType } from "@/api/AdminMenuControllerApi";
import {
  SystemDevControllerCreateModule,
  SystemDevControllerDeleteModule,
  SystemDevControllerDevUpdateModule,
  SystemDevControllerGetModuleList,
} from "@/api/SystemDevControllerApi";
import type { AdminMenuDto } from "@/api/dto/AdminMenuDto";
import { ModuleConfDto } from "@/api/dto/ModuleConfDto";
import { ModuleFieldDto } from "@/api/dto/ModuleFieldDto";
import type { ModuleSearchDto } from "@/api/dto/ModuleSearchDto";
import { alertSuccess, alertWarning } from "@/utils/message";
import { ref } from "vue";
const moduleKeyWords = ref("");
const moduleList = ref(new Array<ModuleConfDto>());
const loading = ref({ moduleList: false, moduleContext: false });
const showConf = ref({
  content: false,
});
const getModelList = async () => {
  loading.value.moduleList = true;
  const {
    data: { status, data, message },
  } = await SystemDevControllerGetModuleList({ keyWord: moduleKeyWords.value });
  loading.value.moduleList = false;
  if (status == 1) {
    moduleList.value = data;
  } else {
    alertWarning(message);
  }
};
getModelList();
const moduleForm = ref(new ModuleConfDto());
const menuTree = ref(new Array<any>());
const visible = ref(true);
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
    menuTree.value.unshift({ _id: 0, menuName: "根目录" });
  } else {
    alertWarning(message);
  }
};
getMenuTree();
const btnLoading = ref({
  moduleSave: false,
});
const create = () => {
  showConf.value.content = true;
  moduleForm.value = new ModuleConfDto();
};
const saveModuleConf = async () => {
  btnLoading.value.moduleSave = true;
  const {
    data: { status, data, message },
  } = moduleForm.value.UUID
    ? await SystemDevControllerDevUpdateModule(
        moduleForm.value.UUID,
        moduleForm.value
      )
    : await SystemDevControllerCreateModule(moduleForm.value);
  btnLoading.value.moduleSave = false;
  if (status === 1) {
    alertSuccess("成功");
    if (!moduleForm.value.UUID) {
      moduleForm.value = data;
    }
    getModelList();
  } else {
    alertWarning(message);
  }
};
const delModule = async (id: string) => {
  const {
    data: { status, data, message },
  } = await SystemDevControllerDeleteModule(id);
  if (status === 1) {
    alertSuccess("删除成功");
    getModelList();
    if (moduleForm.value._id === id) {
      moduleForm.value = new ModuleConfDto();
      showConf.value.content = false;
    }
  } else {
    alertWarning(message);
  }
};
const moduleDetail = (item: ModuleConfDto) => {
  moduleForm.value = item;
  showConf.value.content = true;
};
const moduleFieldList = ref(new Array<ModuleFieldDto>());
const dataType = [
  {
    name: "字符串",
    value: "string",
  },
  {
    name: "数字",
    value: "number",
  },
  {
    name: "字符串数组",
    value: "string[]",
  },
  {
    name: "数字数组",
    value: "number[]",
  },
  {
    name: "布尔值",
    value: "boolean",
  },
];
const domType = [
  {
    name: "单行文本",
    value: "Input",
    needData: false,
  },
  {
    name: "多行输入",
    value: "TextArea",
    needData: false,
  },
  {
    name: "单选下拉框",
    value: "Select",
    needData: true,
  },
  {
    name: "多选下拉框",
    value: "MoreSelect",
    needData: true,
  },
  {
    name: "单选级联下拉框",
    value: "TreeSelect",
    needData: true,
  },
  {
    name: "多选级联下拉框",
    value: "MoreTreeSelect",
    needData: true,
  },
  {
    name: "图片上传",
    value: "MoreImage",
    needData: false,
  },
  {
    name: "附件上传",
    value: "MoreFile",
    needData: false,
  },
  {
    name: "富文本",
    value: "MoreText",
    needData: false,
  },
];
const addField = () => {
  const dto = new ModuleFieldDto();
  dto.listShow = false;
  dto.type = "string";
  dto.notRepeat = false;
  dto.dom = "Input";
  moduleFieldList.value.unshift(dto);
};
const moduleSearchList = ref(new Array<ModuleSearchDto>());
</script>
<style lang="scss" scoped>
.empty-box {
  color: #666;
  text-align: center;
  padding: 100px 0;
}

.dev-box {
  padding: 18px;
  width: 100%;
  .top-box {
    padding: 8px 0;
    display: flex;
    position: relative;
    .right {
      position: absolute;
      right: 5%;
    }
  }
  .bottom-box {
    display: flex;
    .module-list {
      width: 200px;
      .list-box {
        .item {
          display: flex;
          padding: 8px;
          .left {
            width: 80%;
            p {
              color: #666;
            }
          }
          &:hover {
            background-color: #eee;
            cursor: pointer;
            border-radius: 8px;
          }
        }
        .active {
          background-color: #ccc;
          border-radius: 8px;
        }
      }
    }
    .dev-content {
      width: calc(100% - 200px);
      padding: 0 8px;
      .content-top {
        display: flex;
        .btn {
          margin-left: 28px;
        }
      }
    }
  }
}
</style>
