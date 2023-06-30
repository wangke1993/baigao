<template>
  <el-dialog v-model="state.dialogFormVisible" title="通知记录" :close-on-press-escape="false" :close-on-click-modal="false"
    width="70%" @closed="closeForm()">
    <div class="list-box">
      <div class="page-head">
        <SearchBox placeholder="关键字" @handleSearch="handleSearch">
        </SearchBox>
      </div>
      <el-table :data="state.listData" row-key="_id">
        <el-table-column type="index" width="80" align="center" label="序号" />
        <el-table-column prop="notificationCompanyName" label="通知企业" />
        <el-table-column prop="phone" label="通知手机号" />
        <el-table-column prop="addDate" label="通知时间">
          <template #default="scope">
            {{ DateTime.fromISO(scope.row.addDate, { zone: 'utc+8' }).toFormat('yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="notificationResult" label="通知结果">
          <template #default="scope">
            {{ scope.row.notificationResult ? "成功" : "失败" }}
            <el-tooltip v-if="scope.row.notificationResult" effect="dark" :content="scope.row.notificationCause"
              placement="top">
              <el-icon>
                <Warning />
              </el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination v-model:currentPage="state.params.pageIndex" v-model:page-size="state.params.pageSize"
          :page-sizes="[10, 20, 30, 40, 50]" background layout="total, sizes, prev, pager, next, jumper"
          :total="state.total" :hide-on-single-page="true" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import SearchBox from './Search.vue';
import { ref } from "vue";
import { DateTime } from 'luxon';
import { BiddingMangerControllerGetBiddingSMSNotificationPage } from '@/api/BiddingMangerControllerApi';
const state = ref({
  dialogFormVisible: false,
  load: false,
  listData: new Array<any>(),
  params: {
    pageIndex: 1,
    pageSize: 10,
    keyWord: "", //搜索关键字
    notificationType: '' as String,
    biddingUUID: '' as String
  },
  total: 0,
});
const handleSearch = async (searchInfo: any) => {
  state.value.params.keyWord = searchInfo.keyWord;
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
const getList = async (params: any) => {
  try {
    let result = await BiddingMangerControllerGetBiddingSMSNotificationPage(params);
    let data = result.data;
    if (data.status === 1) {
      state.value.listData = data.data.list;
      state.value.total = data.data.total;
    }
  } catch (err) {
    return;
  }
};
const open = (biddingUUID: String, notificationType: String) => {
  state.value.params.biddingUUID = biddingUUID;
  state.value.params.notificationType = notificationType;
  getList(state.value.params);
  state.value.dialogFormVisible = true;
};
// 右上角关闭
const closeForm = () => {
  state.value.dialogFormVisible = false;
  state.value.listData = new Array<any>();
  state.value.params = {
    pageIndex: 1,
    pageSize: 10,
    keyWord: "", //搜索关键字
    notificationType: '' as String,
    biddingUUID: '' as String
  };
  state.value.total = 0;
};
defineExpose({ open });
</script>
<style lang="scss">
.title {
  font-weight: 600;
  font-size: 18px;
  margin-right: 20px;
}

.box-item {
  float: left;
}
</style>