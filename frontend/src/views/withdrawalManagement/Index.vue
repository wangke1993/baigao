<template>
  <div class="list-box">
    <div class="page-head">
      <WithdrawalManagementSearch @search="search">
      </WithdrawalManagementSearch>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="_id">
      <el-table-column width="80" label="序号">
        <template #default="scope">
          {{ (params.pageIndex - 1) * params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="withdrawal" label="提现类型">
        <template #default="scope">
          {{ scope.row.withdrawalText }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="申请人">
        <template #default="scope">
          <div v-if="scope.row.withdrawal == 'DC00140001'">
            <!-- 会员提现 -->
            <Avatar
              :name="JSON.parse(scope.row.userSnapshot).name"
              :src="JSON.parse(scope.row.userSnapshot).avatar"
            />
          </div>
          <div v-if="scope.row.withdrawal == 'DC00140002'">
            <!-- 员工提现 -->
            <Avatar
              :name="JSON.parse(scope.row.userSnapshot).name"
              :src="getImagePath(JSON.parse(scope.row.userSnapshot).avatar)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="提现金额">
        <template #default="scope">
          <el-button
            @click="walletDetail(scope.row)"
            type="text"
          >
            {{ (scope.row.amount / 100).toFixed(2) }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="审核状态">
        <template #default="scope">
          <div>
            {{ scope.row.statusText }}
            <el-tooltip
              class="box-item"
              effect="dark"
              v-if="scope.row.status == 2"
              :content="scope.row.rejectReason"
              placement="top-start"
            >
              <el-icon color="#e6a23c"><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注">
        <template #default="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column prop="addDate" label="申请时间">
        <template #default="scope">
          {{
            DateTime.fromISO(scope.row.addDate, { zone: "utc+8" }).toFormat(
              "yyyy-MM-dd HH:mm:ss"
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定通过吗？"
              @confirm="adopt(scope.row, scope.$index)"
            >
              <template #reference>
                <el-button
                  v-if="
                    btnShow('adopt-withdrawalManagement') &&
                    scope.row.status == 0
                  "
                  type="primary"
                  :icon="Select"
                  v-loading="adoptLoading == scope.$index"
                >
                  通过
                </el-button>
              </template>
            </el-popconfirm>
            <el-button
              v-if="
                btnShow('adopt-withdrawalManagement') && scope.row.status == 0
              "
              @click="openOrderManagement(scope.row)"
              type="primary"
            >
              相关订单
            </el-button>
            <el-button
              v-if="
                btnShow('refuse-withdrawalManagement') && scope.row.status == 0
              "
              type="danger"
              :icon="CloseBold"
              @click="refuse(scope.row)"
            >
              拒绝
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除？"
              v-if="scope.row.status != 0"
              @confirm="del(scope.row, scope.$index)"
            >
              <template #reference>
                <el-button
                  v-loading="delLoading == scope.$index"
                  v-if="btnShow('delete-withdrawalManagement')"
                  type="danger"
                  :icon="Delete"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        v-model:currentPage="params.pageIndex"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <WithdrawalManagementForm
      @Refresh="getPage"
      ref="withdrawalManagementFormRef"
    />
    <WalletDetail ref="walletDetailRef" />
  </div>
</template>
<script lang="ts">
export default {
  name: "withdrawalManagement",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { Delete, Select, CloseBold, Warning } from "@element-plus/icons-vue";
import { btnShow } from "@/utils/buttonShow";
import WalletDetail from "@/views/walletManagement/WalletDetail.vue";
import WithdrawalManagementForm from "@/views/withdrawalManagement/components/WithdrawalManagementForm.vue";
import WithdrawalManagementSearch from "@/views/withdrawalManagement/components/WithdrawalManagementSearch.vue";
import Avatar from "@/views/components/Avatar.vue";
import {
  WithdrawalManagementControllerGetPage,
  WithdrawalManagementControllerDelete,
  WithdrawalManagementControllerApproved,
} from "@/api/WithdrawalManagementControllerApi";
import { DateTime } from "luxon";
import { alertSuccess, alertWarning } from "@/utils/message";
import { getImagePath } from "@/utils/tools";
const withdrawalManagementFormRef = ref();
const listLoading = ref(false);
const list = ref(new Array<any>());
const total = ref(0);
const params = ref({
  pageIndex: 1,
  pageSize: 10,
  keyWord: "",
  status: "",
  withdrawal: "",
  walletUUID: "",
});
const refuse = (item: any) => {
  withdrawalManagementFormRef.value.open(item);
};
const walletDetailRef = ref();
const walletDetail = (item: any) => {
  walletDetailRef.value.open(JSON.parse(item.userSnapshot).UUID);
};
type SearchDto = {
  keyWord: string;
  status: "";
  withdrawal: "";
};
const search = async (searchDto: SearchDto) => {
  params.value.keyWord = searchDto.keyWord;
  params.value.status = searchDto.status;
  params.value.withdrawal = searchDto.withdrawal;
  getPage();
};

const delLoading = ref(-1);
const del = async (item: any, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  delLoading.value = index;
  const {
    data: { status, message },
  } = await WithdrawalManagementControllerDelete(item._id);
  delLoading.value = -1;
  if (status === 1) {
    alertSuccess("操作成功!");
    getPage();
  } else {
    alertWarning(message);
  }
};
const adoptLoading = ref(-1);
const adopt = async (item: any, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  adoptLoading.value = index;
  const {
    data: { status, message },
  } = await WithdrawalManagementControllerApproved(item._id);
  adoptLoading.value = -1;
  if (status === 1) {
    alertSuccess("操作成功!");
    getPage();
  } else {
    alertWarning(message);
  }
};
const getPage = async () => {
  listLoading.value = true;
  const {
    data: { status, data, message },
  } = await WithdrawalManagementControllerGetPage(params.value);
  listLoading.value = false;
  if (status === 1) {
    list.value = data.list;
    total.value = data.total;
  } else {
    alertWarning(message);
  }
};
getPage();
const sizeChange = (val: number) => {
  params.value.pageSize = val;
  getPage();
};
const currentChange = (val: number) => {
  params.value.pageIndex = val;
  getPage();
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
