<template>
  <div class="dev-box">
    <div class="top-box">
      <el-button type="primary" @click="create()">新增模型</el-button>
      <div class="right" v-if="moduleForm.UUID">
        <el-button
          type="primary"
          @click="createCode()"
          >生成</el-button
        >
        <el-button type="primary">挂载目录</el-button>
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
          <ModuleField
            ref="moduleFieldListRef"
            :moduleForm="moduleForm"
            @list-change="(data:Array<ModuleFieldDto>)=>moduleFieldList = data"
          />
          <ModuleSearch
            ref="moduleSearchListRef"
            :moduleForm="moduleForm"
            :moduleFieldList="moduleFieldList"
          />
        </div>
      </div>
    </div>
    <CreateConf
            ref="createConfRef"
            :moduleForm="moduleForm"
          />
  </div>
</template>
<script lang="ts">
export default {
  name: "dev",
};
</script>
<script lang="ts" setup>
import { Delete } from "@element-plus/icons-vue";
import ModuleField from "@/views/dev/components/ModuleField.vue";
import ModuleSearch from "@/views/dev/components/ModuleSearch.vue";
import CreateConf from "@/views/dev/components/CreateConf.vue";
import { AdminMenuControllerGetTreeByMenuType } from "@/api/AdminMenuControllerApi";
import {
  SystemDevControllerCreateModule,
  SystemDevControllerDeleteModule,
  SystemDevControllerDevUpdateModule,
  SystemDevControllerGetModuleList,
  SystemDevControllerCreateCode,
} from "@/api/SystemDevControllerApi";
import { ModuleConfDto } from "@/api/dto/ModuleConfDto";
import { alertSuccess, alertWarning } from "@/utils/message";
import { nextTick, ref } from "vue";
import type { ModuleFieldDto } from "@/api/dto/ModuleFieldDto";

//#region 模型管理
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
    menuTree.value.unshift({ _id: "0", menuName: "根目录" });
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
const delModule = async (id?: string) => {
  if (!id) {
    throw new Error("id不能为空");
  }
  const {
    data: { status, message },
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
const moduleFieldListRef = ref();
const moduleSearchListRef = ref();
const moduleFieldList = ref(new Array<ModuleFieldDto>());
const moduleDetail = (item: ModuleConfDto) => {
  moduleForm.value = item;
  showConf.value.content = true;
  nextTick(() => {
    moduleFieldListRef.value.getList();
    moduleSearchListRef.value.getList();
  });
};
const createConfRef = ref();
const createCode = async () => {
  createConfRef.value.open();
};
//#endregion
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
  box-sizing: border-box;
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
      width: 288px;
      box-sizing: border-box;
      margin-right: 28px;
      .list-box {
        .item {
          display: flex;
          padding: 8px;
          .left {
            width: 80%;
            p {
              margin-top: 8px;
              color: #666;
            }
          }
          &:hover {
            background-color: #eee;
            cursor: pointer;
            border-radius: 8px;
            color: #222;
            p {
              color: #666 !important;
            }
          }
        }
        .active {
          background-color: #eee;
          cursor: pointer;
          border-radius: 8px;
          color: #222;
          p {
            color: #666 !important;
          }
        }
      }
    }
    .dev-content {
      width: calc(100% - 288px);
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
