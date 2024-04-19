<template>
  <div class="list-box">
    <div class="page-head">
      <WalletLogSearch @search="search">
        <el-button
          type="primary"
          v-if="btnShow('add-walletLog')"
          @click="add()"
        >
          新增
        </el-button>
      </WalletLogSearch>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="_id">
      <el-table-column width="80" label="序号">
        <template #default="scope">
          {{ (params.pageIndex - 1) * params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="logType" label="交易类型">
        <template #default="scope">
          {{ scope.row.logTypeText }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="交易金额">
        <template #default="scope">
          ￥ {{ (scope.row.amount / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="余额">
        <template #default="scope">
          ￥ {{ (scope.row.balance / 100).toFixed(2) }}
        </template>
      </el-table-column>

      <el-table-column prop="remarks" label="备注">
        <template #default="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column prop="addDate" label="交易时间">
        <template #default="scope">
          {{
            DateTime.fromISO(scope.row.addDate, { zone: "utc+8" }).toFormat(
              "yyyy-MM-dd HH:mm:ss"
            )
          }}
        </template>
      </el-table-column>
      <el-table-column prop="addUser" label="操作用户">
        <template #default="scope">
          {{ scope.row.addUser }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button
              v-if="btnShow('edit-walletLog')"
              type="primary"
              :icon="Edit"
              @click="edit(scope.row)"
              >编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除？"
              @confirm="del(scope.row, scope.$index)"
            >
              <template #reference>
                <el-button
                  v-loading="delLoading == scope.$index"
                  v-if="btnShow('delete-walletLog')"
                  type="danger"
                  :icon="Delete"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column> -->
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
    <WalletLogForm ref="walletLogFormRef" @Refresh="getPage" />
  </div>
</template>
<script lang="ts">
export default {
  name: "walletLog",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { Delete, Edit } from "@element-plus/icons-vue";
import { btnShow } from "@/utils/buttonShow";
import WalletLogForm from "@/views/walletLog/components/WalletLogForm.vue";
import WalletLogSearch from "@/views/walletLog/components/WalletLogSearch.vue";
import {
  WalletLogControllerGetPage,
  WalletLogControllerDelete,
} from "@/api/WalletLogControllerApi";
import type { WalletLogDto } from "@/api/dto/WalletLogDto";
import { DateTime } from "luxon";
import { alertSuccess, alertWarning } from "@/utils/message";
const walletLogFormRef = ref();
const listLoading = ref(false);
const list = ref(new Array<WalletLogDto>());
const total = ref(0);
const props = defineProps({ walletUUID: { type: String } });
const params = ref({
  pageIndex: 1,
  pageSize: 10,
  keyWord: "",
  walletUUID: props.walletUUID ?? "",
});

const edit = (item: WalletLogDto) => {
  walletLogFormRef.value.open(item);
};
const add = () => {
  walletLogFormRef.value.open();
};
type SearchDto = {
  keyWord: string;
};
const search = async (searchDto: SearchDto) => {
  params.value.keyWord = searchDto.keyWord;
  getPage();
};

const delLoading = ref(-1);
const del = async (item: WalletLogDto, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  delLoading.value = index;
  const {
    data: { status, message },
  } = await WalletLogControllerDelete(item._id);
  delLoading.value = -1;
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
  } = await WalletLogControllerGetPage(params.value);
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
defineExpose({ getPage });
</script>
<style lang="scss" scoped>
.list-box {
  padding: 20px;
}

.page-head {
  display: flex;
  justify-content: flex-start;
  align-items: center;

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
