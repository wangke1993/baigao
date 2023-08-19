<template>
  <div class="list-box" v-loading="load">
    <el-button type="primary" @click="add(null)" v-if="btnShow('menu_add_top')"
      >添加一级菜单</el-button
    >
    <el-table :data="menuTree" row-key="_id" empty-text="无数据">
      <el-table-column prop="menuName" label="名称">
        <template #default="scope">
          <span>
            <el-icon style="margin-right: 2px" v-if="scope.row.menuIcon">
              <component :is="scope.row.menuIcon" />
            </el-icon>
            <span>{{ scope.row.menuName }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" label="属性">
        <template #default="scope">
          <div>
            <span
              :style="{
                color: MENU_TYPE_TRANSLATE_COLOR[scope.row.menuType],
              }"
            >
              {{ MENU_TYPE_TRANSLATE[scope.row.menuType] }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="menuActive" label="路由" />
      <el-table-column prop="menuPowerTag" label="权限标识" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button
              v-if="btnShow('menu_edit')"
              @click="edit(scope.row)"
              type="primary"
              :icon="Edit"
            >
              编辑
            </el-button>
            <el-button
              v-if="btnShow('menu_add_child') && scope.row.menuType === 1"
              @click="add(scope.row)"
              type="primary"
              :icon="Plus"
            >
              添加子级
            </el-button>
            <el-popconfirm
              v-if="btnShow('menu_del')"
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除吗？"
              @confirm="del(scope.row)"
            >
              <template #reference>
                <el-button type="danger" :icon="Delete"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <EditMenu @getMenuTree="getMenuTree" ref="editMenu" />
</template>

<script lang="ts" setup>
// 依赖
import {
  AdminMenuControllerDelete,
  AdminMenuControllerGetTree,
} from "@/api/AdminMenuControllerApi";
import { alertSuccess, alertWarning } from "@/utils/message";
import { ref } from "vue";
import {
  MENU_TYPE_TRANSLATE,
  MENU_TYPE_TRANSLATE_COLOR,
} from "@/utils/enum/menuType";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import EditMenu from "@/views/menu/components/EditMenu.vue";
import { btnShow } from "@/utils/buttonShow";
// 参数
const menuTree = ref([]);
const load = ref(false);
const editMenu = ref();
// 方法
const getMenuTree = async () => {
  load.value = true;
  const { data: res } = await AdminMenuControllerGetTree();
  load.value = false;
  if (res.status === 1) {
    menuTree.value = res.data;
  } else {
    alertWarning(res.message);
  }
};
getMenuTree();
const add = (row?: any) => {
  // row为null时则添加顶级菜单
  editMenu.value.open(row);
};
const edit = (row: any) => {
  editMenu.value.open(row, false);
};
const del = async (row: any) => {
  const { data: res } = await AdminMenuControllerDelete(row._id);
  if (res.status === 1) {
    alertSuccess(res.message);
    getMenuTree();
  } else {
    alertWarning(res.message);
  }
};
</script>
<script lang="ts">
export default {
  name: "menuManage",
};
</script>
<style lang="scss" scoped>
.list-box {
  padding: 20px;
}
</style>
