<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="list-box">
    <div class="page-head">
      <Search placeholder="关键字" @handleSearch="handleSearch">
        <el-button
          type="primary"
          v-if="btnShow('add-article')"
          @click="addArticleFun(null)"
          >添加文章</el-button
        >
      </Search>
    </div>
    <el-table :data="state.userListData" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="articleName" label="文章名称" />
      <el-table-column label="所属分类">
        <template #default="scope">
          <span>{{ articleClass(scope.row.articleClass) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="syn" label="文章概要" />
      <el-table-column prop="addDate" label="添加时间">
        <template #default="scope">
          {{
            DateTime.fromISO(scope.row.addDate, { zone: "utc+8" }).toFormat(
              "yyyy-MM-dd HH:mm:ss"
            )
          }}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="是否发布">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.release" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button
              d
              v-if="btnShow('article-edit')"
              type="primary"
              :icon="Edit"
              @click="addArticleFun(scope.row)"
              >编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除该文章？"
              @confirm="deleteDictionary(scope.row)"
            >
              <template #reference>
                <el-button
                  v-if="btnShow('article-delete')"
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
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <AddArticle ref="AddArticleRef" @Refresh="RefreshList" />
  </div>
</template>
<script lang="ts">
export default {
  name: "article",
};
</script>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { btnShow } from "../../utils/buttonShow";
import { Delete, Edit } from "@element-plus/icons-vue";
import AddArticle from "@/views/article/components/AddArticle.vue";
import Search from "@/views/article/components/Search.vue";
import {
  ArticleManagementControllerGetPage,
  ArticleManagementControllerDelete,
} from "@/api/ArticleManagementControllerApi";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
import { DateTime } from "luxon";
import { alertSuccess } from "@/utils/message";
const AddArticleRef = ref();
const state = reactive({
  load: false,
  userListData: [],
  params: {
    pageIndex: 1,
    pageSize: 10,
    keyWord: "", //搜索关键字
    articleClass: "", //所属分类
    isRelease: "", //发布状态 0全部，1已发布，2未发布;
  },
  total: 0,
  dictionaryData: [],
});
// open 发布文章
const addArticleFun = (items: any) => {
  AddArticleRef.value.open(items);
};
const handleSearch = async (searchInfo: any) => {
  state.params.keyWord = searchInfo.keyWord;
  state.params.articleClass = searchInfo.articleClass;
  getList(state.params);
};

// 获取文章分类字典
const getArticleDictionary = async (dicCode: string) => {
  try {
    let result = await DataDictionaryControllerGetListByDicClass(dicCode);
    let data = result.data;
    if (data.status === 1) state.dictionaryData = data.data;
  } catch (err) {
    return;
  }
};
getArticleDictionary("DC0001");

// 根据字典值返回分类名称
const articleClass = (articleClass: string) => {
  let title;
  state.dictionaryData.forEach((item: any) => {
    if (item.dicCode === articleClass) title = item.dicName;
  });
  return title;
};

// 删除文章
const deleteDictionary = async (row: any) => {
  try {
    let result = await ArticleManagementControllerDelete(row._id);
    let data = result.data;
    if (data.status === 1) {
      console.log(data.data);
      alertSuccess("操作成功!");
      getList(state.params);
    }
  } catch (err) {
    return;
  }
};

// 获取文章列表
const getList = async (params: any) => {
  try {
    let result = await ArticleManagementControllerGetPage(params);
    let data = result.data;
    if (data.status === 1) {
      // console.log("获取文章列表", data);
      state.userListData = data.data.list;
      state.total = data.data.total;
    }
  } catch (err) {
    return;
  }
};
getList(state.params);

// 发布文章刷文章列表
const RefreshList = () => {
  getList(state.params);
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
</script>
<style lang="scss" scoped>
.list-box {
  padding: 20px;
}

.page-head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0;

  .btn {
    margin-bottom: 18px !important;
  }
}

.pagination-box {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
