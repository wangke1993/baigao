<template>
  <div class="list-box">
    <div class="search-box">
      <el-button
        type="primary"
        v-if="btnShow('add-dictionary')"
        @click="addDictionaryFun(null)"
        >新增字典</el-button
      >
      <el-button
        v-loading="createLoading"
        type="primary"
        v-if="isDev"
        @click="createCode"
      >
        生成
      </el-button>
      <el-input
        style="width: 288px; margin-left: 18px; margin-right: 8px"
        v-model="state.params.keyWord"
        placeholder="字典名称/字典编码"
      ></el-input>
    </div>
    <el-table :data="state.userListData" v-loading="state.load" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="dicName" label="字典名称" />
      <el-table-column prop="dicCode" label="编码" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column label="字典值">
        <template #default="scope">
          {{ scope.row.items.map((item: any) => item.dicName).join("/") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button
              v-if="btnShow('list-edit')"
              type="primary"
              :icon="Edit"
              @click="addDictionaryFun(scope.row)"
              >编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除该字典？"
              @confirm="deleteDictionary(scope.row)"
            >
              <template #reference>
                <el-button
                  v-if="btnShow('list-delete') && !scope.row.isSystem"
                  type="danger"
                  :icon="Delete"
                  >删除
                </el-button>
              </template>
            </el-popconfirm>
            <el-button
              v-if="btnShow('list-admin')"
              type="primary"
              :icon="Collection"
              @click="editDictionaryFun(scope.row)"
            >
              字典值管理</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        v-model:currentPage="state.params.pageIndex"
        v-model:page-size="state.params.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :small="state.small"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <AddDictionary ref="AddDictionaryRef" @refreshList="refreshList" />
    <EditDictionary ref="EditDictionaryRef" @refresh-list="refreshList" />
  </div>
</template>
<script lang="ts">
export default {
  name: "dictionary",
};
</script>
<script lang="ts" setup>
import { ref, reactive, toRefs, defineComponent, watch } from "vue";
import { btnShow } from "../../utils/buttonShow";
import { Delete, Edit, Plus, Collection } from "@element-plus/icons-vue";
import {
  DataDictionaryControllerGetPage,
  DataDictionaryControllerDelete,
  DataDictionaryControllerCreateDicEnum,
} from "../../api/DataDictionaryControllerApi";
import AddDictionary from "../../views/dictionary/components/addDictionary.vue";
import EditDictionary from "../../views/dictionary/components/editDictionary.vue";
import { alertSuccess, alertWarning } from "@/utils/message";
const isDev = ref(window.location.hostname == "localhost");
const AddDictionaryRef = ref();
const EditDictionaryRef = ref();
const state = reactive({
  userListData: [{ index: 1 }],
  params: { pageSize: 10, pageIndex: 1, keyWord: "", dicClass: "" },
  total: 0,
  small: false,
  load: false,
});
watch(
  () => state.params.keyWord,
  () => {
    getDataDictionaryControllerGetPage();
  }
);
// 获取数据字典列表
const getDataDictionaryControllerGetPage = async () => {
  state.load = true;
  let result = await DataDictionaryControllerGetPage(state.params);
  let data = result.data;
  if (data.status === 1) {
    state.userListData = data.data.list;
    state.total = data.data.total;
  }
  state.load = false;
};
getDataDictionaryControllerGetPage();
const createLoading = ref(false);
const createCode = async () => {
  createLoading.value = true;
  let {
    data: { status, message },
  } = await DataDictionaryControllerCreateDicEnum();
  if (status === 1) {
    alertSuccess("生成成功");
  } else {
    alertWarning(message);
  }
  createLoading.value = false;
};
// 分页控制
const handleSizeChange = (val: number) => {
  state.params.pageSize = val;
  getDataDictionaryControllerGetPage();
};
const handleCurrentChange = (val: number) => {
  state.params.pageIndex = val;
  getDataDictionaryControllerGetPage();
};

// 打开新增字典分类弹窗
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addDictionaryFun = (itmes: any) => {
  AddDictionaryRef.value.open(itmes);
};

// 保存字典或者编辑字典刷新列表
const refreshList = () => {
  getDataDictionaryControllerGetPage();
};

// 删除字典分类
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteDictionary = async (params: any) => {
  try {
    let result = await DataDictionaryControllerDelete(params.dicCode);
    let data = result.data;
    if (data.status === 1) {
      alertSuccess("操作成功!");
      getDataDictionaryControllerGetPage();
    }
  } catch (err) {
    return;
  }
};

// 字典值管理
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editDictionaryFun = (itmes: any) => {
  EditDictionaryRef.value.open(itmes);
};
</script>
<style lang="scss" scoped>
.list-box {
  padding: 20px;
}
.search-box {
  display: flex;
}
.pagination-box {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
