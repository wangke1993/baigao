<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="78%"
    @closed="dialogFormVisible = false"
  >
    <div class="page-head">
      <Search placeholder="关键字" @handleSearch="handleSearch"></Search>
    </div>
    <el-table :data="userListData" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="_id" label="id" />
      <el-table-column prop="articleName" label="名称" />

      <el-table-column label="所属分类">
        <template #default="scope">
          <span>{{ articleClass(scope.row.articleClass) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="syn" label="文章概要" />
      <el-table-column prop="remarks" label="是否发布">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.release" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="selectIetm(scope.row)"
            >选择</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination
        v-model:currentPage="parms.pageIndex"
        v-model:page-size="parms.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { reactive, toRefs, defineComponent } from "vue";
import { ArticleMangerControllerGetPage } from "@/api/ArticleMangerControllerApi";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
import { Edit } from "@element-plus/icons-vue";
import Search from "@/views/article/components/Search.vue";
export default defineComponent({
  name: "choiceArticle",
  components: { Search },
  emits: ["selectArticle"],
  setup(props, { emit }) {
    const state = reactive({
      dialogFormVisible: false,
      title: "选择文章",
      parms: {
        pageIndex: 1,
        pageSize: 10,
        keyWord: "", //搜索关键字
        articleClass: "", //所属分类
        isRelease: "1", //发布状态 0全部，1已发布，2未发布;
      },
      total: 0,
      userListData: [],
      dictionaryData: [],
    });
    const open = () => {
      state.dialogFormVisible = true;
    };
    const handleSearch = async (searchInfo: any) => {
      state.parms.keyWord = searchInfo.keyWord;
      state.parms.articleClass = searchInfo.articleClass;
      getList(state.parms);
    };
    // 获取文章列表
    const getList = async (parms: any) => {
      try {
        let result = await ArticleMangerControllerGetPage(parms);
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
    getList(state.parms);

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

    // 分页控制
    const handleSizeChange = (val: number) => {
      state.parms.pageSize = val;
      getList(state.parms);
    };
    const handleCurrentChange = (val: number) => {
      state.parms.pageIndex = val;
      getList(state.parms);
    };

    // 根据字典值返回分类名称
    const articleClass = (articleClass: string) => {
      let title;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.dictionaryData.forEach((item: any) => {
        if (item.dicCode === articleClass) title = item.dicName;
      });
      return title;
    };

    // 选中文章
    const selectIetm = (item: any) => {
      emit("selectArticle", item);
      state.dialogFormVisible = false;
    };
    return {
      Edit,
      ...toRefs(state),
      open,
      handleSearch,
      articleClass,
      selectIetm,
      handleSizeChange,
      handleCurrentChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0 10px 0;

  .btn {
    margin-bottom: 18px !important;
  }
}
</style>
