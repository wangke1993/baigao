<template>
  <div class="list-box">
    <div class="page-head">
      <Search placeholder="关键字" @handleSearch="handleSearch">
        <el-button type="primary" v-if="btnShow('add_buddingManagement')" @click="editBox(null)">新增招标公告</el-button>
      </Search>
    </div>
    <el-table :data="state.userListData" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="projectName" label="所属项目" />
      <el-table-column prop="openBiddingTime" label="开标时间" v-if="false">
        <template #default="scope">
          {{ DateTime.fromISO(scope.row.openBiddingTime, { zone: 'utc+8' }).toFormat('yyyy-MM-dd HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格(￥)" />
      <el-table-column prop="isRelease" label="是否发布">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.isRelease" />
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="进度">
        <template #default="scope">
          {{ BIDDING_PROGRESS[scope.row.progress as keyof typeof BIDDING_PROGRESS] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="510">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button v-if="btnShow('edit_buddingManagement')" type="primary" :icon="Edit" @click="editBox(scope.row)">编辑
            </el-button>
            <el-button v-if="btnShow('edit_buddingManagementProgress') && scope.row.isRelease" type="primary"
              :icon="DataLine" @click="progressOpen(scope.row)">进度跟踪
            </el-button>
            <el-button v-if="btnShow('edit_buddingManagementPay') && scope.row.isRelease" type="primary" :icon="Stamp"
              @click="orderBox(scope.row)">购买审核
            </el-button>
            <el-button v-if="btnShow('edit_buddingManagementSingUp') && scope.row.isRelease" type="primary"
              :icon="Tickets" @click="sinUpBox(scope.row)">报名管理
            </el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" confirm-button-type="danger" title="确定删除？"
              @confirm="deleteRow(scope.row._id)">
              <template #reference>
                <el-button v-if="btnShow('delete_buddingManagement')" type="danger" :icon="Delete">删除</el-button>
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
    <Progress ref="ProgressRef" @Refresh="RefreshList" />
    <SinUp ref="SinUpRef" />
    <OrderList ref="OrderListRef" />
  </div>
</template>
<script lang="ts">
export default {
  name: "biddingManger",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { btnShow } from "../../utils/buttonShow";
import { Delete, Edit, DataLine, Stamp, Tickets } from "@element-plus/icons-vue";
import Detail from "./components/Detail.vue";
import Progress from "./components/Progress.vue";
import Search from './components/Search.vue';
import SinUp from './components/SinUp.vue';
import OrderList from './components/OrderList.vue';
import { DateTime } from 'luxon';
import { alertSuccess } from "@/utils/message";
import { BiddingMangerControllerDeleteBidding, BiddingMangerControllerGetBiddingPage } from "@/api/BiddingMangerControllerApi";
const DetailRef = ref();
const ProgressRef = ref();
const SinUpRef = ref();
const OrderListRef = ref();
const BIDDING_PROGRESS = {
  '-1': "流标",
  1: "招标中",
  2: "竞标中",
  3: "已中标",
  4: "合同签订",
  5: "合同履行",
  0: "已结束",
}
const state = ref({
  load: false,
  userListData: new Array<any>(),
  params: {
    pageIndex: 1,
    pageSize: 10,
    keyWord: "", //搜索关键字
    projectUUID: '0',
    progress: '',
  },
  total: 0,
});
// open 编辑
const editBox = (item: any) => {
  DetailRef.value.open(item);
};
const orderBox = (item: any) => {
  OrderListRef.value.open(item.UUID);
};

enum SIGNUP_TYPE {
  "招标公告" = 1,
  "预招标公告" = 2,
}
const sinUpBox = (item: any) => {
  SinUpRef.value.open(item.UUID, SIGNUP_TYPE.招标公告);
};
const progressOpen = (item: any) => {
  ProgressRef.value.open(item);
}
const handleSearch = async (searchInfo: any) => {
  state.value.params.keyWord = searchInfo.keyWord;
  state.value.params.projectUUID = searchInfo.projectUUID;
  state.value.params.progress = searchInfo.progress;
  getList(state.value.params);
};

// 删除
const deleteRow = async (id: String) => {
  try {
    let result = await BiddingMangerControllerDeleteBidding(id);
    let data = result.data;
    if (data.status === 1) {
      alertSuccess("删除成功")
      getList(state.value.params);
    }
  } catch (err) {
    return;
  }
};
// TODO:订单管理完成后再完成购买审核
// 获取分页
const getList = async (params: any) => {
  try {
    let result = await BiddingMangerControllerGetBiddingPage(params);
    let data = result.data;
    if (data.status === 1) {
      state.value.userListData = data.data.list;
      state.value.total = data.data.total;
    }
  } catch (err) {
    return;
  }
};
getList(state.value.params);

// 发布文章刷文章列表
const RefreshList = async () => {
  await getList(state.value.params);
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