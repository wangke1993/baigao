<template>
  <div class="list-box">
    <el-button type="primary" v-if="btnShow('add-dictionary')" @click="addDictionaryFun(null)">新增字典</el-button>
    <el-table :data="userListData" v-loading="load" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="dicName" label="字典名称" />
      <el-table-column prop="dicCode" label="编码" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button v-if="btnShow('list-edit')" type="primary" :icon="Edit" @click="addDictionaryFun(scope.row)">编辑
            </el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" confirm-button-type="danger" title="确定删除该字典？"
              @confirm="deleteDictionary(scope.row)">
              <template #reference>
                <el-button v-if="btnShow('list-delete') && !scope.row.isSystem" type="danger" :icon="Delete">删除
                </el-button>
              </template>
            </el-popconfirm>
            <el-button v-if="btnShow('list-admin')" type="primary" :icon="Collection"
              @click="editDictionaryFun(scope.row)">
              字典值管理</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination v-model:currentPage="parms.pageIndex" v-model:page-size="parms.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]" :small="small" background layout="total, sizes, prev, pager, next, jumper"
        :total="total" :hide-on-single-page="true" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <AddDictionary ref="AddDictionaryRef" @refreshList="refreshList" />
    <EditDictionary ref="EditDictionaryRef" />
  </div>
</template>
<script lang="ts">
import { ref, reactive, toRefs, defineComponent } from "vue";
import { btnShow } from "../../utils/buttonShow";
import { Delete, Edit, Plus, Collection } from "@element-plus/icons-vue";
import {
  DataDictionaryControllerGetPage,
  DataDictionaryControllerDelete,
} from "../../api/DataDictionaryControllerApi";
import AddDictionary from "../../views/dictionary/components/addDictionary.vue";
import EditDictionary from "../../views/dictionary/components/editDictionary.vue";
import { alertSuccess } from "@/utils/message";
export default defineComponent({
  name: 'dictionary',
  components: { AddDictionary, EditDictionary },
  setup() {
    const AddDictionaryRef = ref();
    const EditDictionaryRef = ref();
    const state = reactive({
      userListData: [{ index: 1 }],
      parms: { pageSize: 10, pageIndex: 1, keyWord: "", dicClass: "" },
      total: 0,
      small: false,
      load: false,
    });

    // 获取数据字典列表
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getDataDictionaryControllerGetPage = async (parms: any) => {
      try {
        state.load = true;
        let result = await DataDictionaryControllerGetPage(parms);
        let data = result.data;
        if (data.status === 1) {
          state.userListData = data.data.list;
          state.total = data.data.total;
        }
      } catch (err) {
        return;
      }
      state.load = false;
    };
    getDataDictionaryControllerGetPage(state.parms);

    // 分页控制
    const handleSizeChange = (val: number) => {
      state.parms.pageSize = val;
      getDataDictionaryControllerGetPage(state.parms);
    };
    const handleCurrentChange = (val: number) => {
      state.parms.pageIndex = val;
      getDataDictionaryControllerGetPage(state.parms);
    };

    // 打开新增字典分类弹窗
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addDictionaryFun = (itmes: any) => {
      AddDictionaryRef.value.open(itmes);
    };

    // 保存字典或者编辑字典刷新列表
    const refreshList = () => {
      getDataDictionaryControllerGetPage(state.parms);
    };

    // 删除字典分类
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deleteDictionary = async (parms: any) => {
      try {
        let result = await DataDictionaryControllerDelete(parms.dicCode);
        let data = result.data;
        if (data.status === 1) {
          alertSuccess('操作成功!')
          getDataDictionaryControllerGetPage(state.parms);
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

    return {
      ...toRefs(state),
      Edit,
      Delete,
      Plus,
      Collection,
      AddDictionaryRef,
      EditDictionaryRef,
      btnShow,
      handleSizeChange,
      handleCurrentChange,
      addDictionaryFun,
      refreshList,
      deleteDictionary,
      editDictionaryFun,
    };
  },
});
</script>
<style lang="scss">
.list-box {
  padding: 20px;
}

.pagination-box {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>