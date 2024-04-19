<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="list-box">
    <el-button
      type="primary"
      v-if="btnShow('add-Advertisement')"
      @click="addArticleFun(null)"
      >添加广告</el-button
    >

    <el-table :data="state.userListData" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="链接类型">
        <template #default="scope">
          <span>{{ linkTypeFun(scope.row.linkType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="linkValue" label="链接值">
        <template #default="scope">
          <span>{{
            scope.row.linkType == 2 ? scope.row.linkName : scope.row.linkValue
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告位置">
        <template #default="scope">
          <span>{{ dicCodeName(scope.row.position) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="release" label="是否发布">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.release" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button
              v-if="btnShow('ad-edit')"
              type="primary"
              :icon="Edit"
              @click="addArticleFun(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除？"
              @confirm="deleteDictionary(scope.row._id)"
            >
              <template #reference>
                <el-button
                  v-if="btnShow('ad-delete')"
                  type="danger"
                  :icon="Delete"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        v-model:currentPage="state.params.pageIndex"
        v-model:page-size="state.params.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <addAdvertisement ref="AddAdvertisementRef" @refresh="RefreshList" />
  </div>
</template>
<script lang="ts">
export default {
  name: "advertisement",
};
</script>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { btnShow } from "../../utils/buttonShow";
import { Delete, Edit } from "@element-plus/icons-vue";
import {
  AdManagementControllerGetPage,
  AdManagementControllerDelete,
} from "@/api/AdManagementControllerApi";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
import addAdvertisement from "@/views/advertisement/components/addAdvertisement.vue";
const types = [
  // { name: "商品", value: 1 },
  { name: "文章", value: 2 },
  { name: "自定义URL", value: 3 },
];
const AddAdvertisementRef = ref();
const state = reactive({
  load: false,
  userListData: [],
  params: {
    pageIndex: 1,
    pageSize: 10,
    keyWord: "", //搜索关键字
    position: "", //广告位置，取字典管理中：DC0002的值;
    isRelease: "", //发布状态，0全部，1已发布，2未发布;
  },
  total: 0,
  dictionaryData: [],
  positionType: [],
});

// 添加和编辑广告
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addArticleFun = (pamrs: any) => {
  AddAdvertisementRef.value.open(pamrs);
};
// 分页控制
const handleSizeChange = (val: number) => {
  state.params.pageSize = val;
  getList(state.params);
};
const handleCurrentChange = (val: number) => {
  state.params.pageIndex = val;
  getList(state.params);
};

// 根据链接类型返回name
const linkTypeFun = (type: string | number) => {
  let text;
  types.forEach((item) => {
    if (Number(type) === item.value) text = item.name;
  });
  return text;
};

// 广告列表
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getList = async (params: any) => {
  try {
    let result = await AdManagementControllerGetPage(params);
    let data = result.data;
    if (data.status === 1) {
      state.userListData = data.data.list;
      state.total = data.data.total;
    }
  } catch (err) {
    return;
  }
};
getList(state.params);

// 删除广告
const deleteDictionary = async (id: string) => {
  try {
    let result = await AdManagementControllerDelete(id);
    let data = result.data;
    if (data.status === 1) {
      console.log("删除广告", data);
      getList(state.params);
    }
  } catch (err) {
    return;
  }
};

// 发布文章刷文章列表
const RefreshList = () => {
  getList(state.params);
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

// 根据字典值返回分类名称
const dicCodeName = (articleClass: string) => {
  let title;
  state.positionType.forEach((item: any) => {
    if (item.value === articleClass) title = item.name;
  });
  return title;
};
</script>
<style lang="scss" scoped>
.list-box {
  padding: 20px;
}

.pagination-box {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
