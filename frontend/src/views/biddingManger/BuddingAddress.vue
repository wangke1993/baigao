<template>
  <div class="list-box">
    <div class="page-head">
      <Search placeholder="关键字" @handleSearch="handleSearch">
        <el-button type="primary" v-if="btnShow('add_buddingAddress')" @click="openDetail(null)">添加收件地址</el-button>
      </Search>
    </div>
    <el-table :data="state.ListData" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="name" label="别称" />
      <el-table-column prop="administrativeDivisionName" label="行政区划" />
      <el-table-column prop="addressDetail" label="详细地址" />
      <el-table-column prop="people" label="收件人" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="isDefault" label="默认地址">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.isDefault" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button d v-if="btnShow('edit_buddingAddress')" type="primary" :icon="Edit" @click="openDetail(scope.row)">编辑
            </el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" confirm-button-type="danger" title="确定删除？"
              @confirm="deleteRow(scope.row._id)">
              <template #reference>
                <el-button v-if="btnShow('delete_buddingAddress')" type="danger" :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination v-model:currentPage="state.params.pageIndex" v-model:page-size="state.params.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]" background layout="total, sizes, prev, pager, next, jumper"
        :total="state.total" :hide-on-single-page="true" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <Detail ref="DetailRef" @Refresh="RefreshList" />
  </div>
</template>
<script lang="ts">
export default {
  name: "buddingAddress",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { btnShow } from "../../utils/buttonShow";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import Detail from "./components/BuddingAddressDetail.vue";
import Search from './components/Search.vue';
import { DateTime } from 'luxon';
import { BiddingMangerControllerDeleteBiddingAddress, BiddingMangerControllerGetBiddingAddressPage } from "@/api/BiddingMangerControllerApi";
import { alertSuccess } from "@/utils/message";
const DetailRef = ref();

const state = ref({
  load: false,
  ListData: new Array<any>(),
  params: {
    pageIndex: 1,
    pageSize: 10,
    keyWord: "", //搜索关键字
  },
  total: 0,
});
// open 编辑
const openDetail = (items: any) => {
  DetailRef.value.open(items);
};

const handleSearch = async (searchInfo: any) => {
  state.value.params.keyWord = searchInfo.keyWord;
  getList(state.value.params);
};

// 删除
const deleteRow = async (id: String) => {
  try {
    let result = await BiddingMangerControllerDeleteBiddingAddress(id);
    let data = result.data;
    if (data.status === 1) {
      alertSuccess("删除成功")
      getList(state.value.params);
    }
  } catch (err) {
    return;
  }
};

// 获取分页
const getList = async (params: any) => {
  try {
    let result = await BiddingMangerControllerGetBiddingAddressPage(params);
    let data = result.data;
    if (data.status === 1) {
      state.value.ListData = data.data.list;
      state.value.total = data.data.total;
    }
  } catch (err) {
    return;
  }
};
getList(state.value.params);

// 刷新列表
const RefreshList = () => {
  getList(state.value.params);
};

// 分页控制
const handleSizeChange = (val: number) => {
  state.value.params.pageSize = val;
  getList(state.value.params);
};
const handleCurrentChange = (val: number) => {
  state.value.params.pageIndex = val;
  getList(state.value.params);
};
</script>
<style lang="scss">
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