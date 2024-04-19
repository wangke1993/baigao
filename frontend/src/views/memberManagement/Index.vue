<template>
  <div class="list-box">
    <div class="page-head">
      <MemberManagementSearch @search="search">
        <el-button
          type="primary"
          v-if="btnShow('add-memberManagement')"
          @click="add()"
        >
          新增
        </el-button>
      </MemberManagementSearch>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="_id">
      <el-table-column width="80" label="序号">
        <template #default="scope">
          {{ (params.pageIndex - 1) * params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名">
        <template #default="scope">
          <div
            v-if="scope.row.userName"
            style="display: flex; align-items: center"
          >
            <el-tooltip
              effect="dark"
              :content="scope.row.openId"
              placement="bottom"
            >
              <span style="cursor: pointer">
                {{ scope.row.userName }}
              </span>
            </el-tooltip>
          </div>
          <div v-else>
            {{ scope.row.openId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="socketId" label="状态">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-tooltip
              effect="dark"
              :content="scope.row.socketId ? '在线' : '离线'"
              placement="bottom"
            >
              <div
                :class="{
                  online: scope.row.socketId,
                  offline: !scope.row.socketId,
                }"
              ></div>
            </el-tooltip>
            <span>
              {{ scope.row.socketId ? "在线" : "离线" }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            preview-teleported="true"
            v-if="scope.row.avatar"
            :src="`/api${avatarSrc(scope.row.avatar)}`"
            :zoom-rate="0.8"
            :preview-src-list="[`/api${avatarSrc(scope.row.avatar)}`]"
            fit="cover"
            loading="lazy"
          />
        </template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="电话">
        <template #default="scope">
          {{ scope.row.phoneNumber }}
        </template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="余额">
        <template #default="scope">
          ￥ {{ (scope.row.wallet.balance / 100).toFixed(2) }}
          <div v-if="scope.row.wallet?.freeze">
            <span class="freeze"> 已冻结 </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalExpenditure" label="总消费">
        <template #default="scope">
          ￥ {{ (scope.row.wallet.totalExpenditure / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="addDate" label="注册时间">
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
            <el-button
              v-if="btnShow('edit-memberManagement')"
              type="primary"
              :icon="Edit"
              @click="edit(scope.row)"
              >编辑
            </el-button>
            <el-button
              v-if="btnShow('edit-memberWallet')"
              type="primary"
              :icon="Edit"
              @click="editWalletDetail(scope.row)"
            >
              钱包管理
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
                  v-if="btnShow('delete-memberManagement')"
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
    <MemberManagementForm ref="memberManagementFormRef" @Refresh="getPage" />
    <WalletDetail ref="walletDetailRef" @Refresh="getPage" />
  </div>
</template>
<script lang="ts">
export default {
  name: "memberManagement",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { Delete, Edit } from "@element-plus/icons-vue";
import { btnShow } from "@/utils/buttonShow";
import MemberManagementForm from "@/views/memberManagement/components/MemberManagementForm.vue";
import MemberManagementSearch from "@/views/memberManagement/components/MemberManagementSearch.vue";
import {
  MemberManagementControllerGetPage,
  MemberManagementControllerDelete,
} from "@/api/MemberManagementControllerApi";
import type { MemberManagementDto } from "@/api/dto/MemberManagementDto";
import { DateTime } from "luxon";
import { alertSuccess, alertWarning } from "@/utils/message";
import WalletDetail from "@/views/walletManagement/WalletDetail.vue";
const memberManagementFormRef = ref();
const walletDetailRef = ref();
const listLoading = ref(false);
const list = ref(new Array<MemberManagementDto>());
const total = ref(0);
const params = ref({
  pageIndex: 1,
  pageSize: 10,
  keyWord: "",
  memberRank: "",
});
const edit = (item: MemberManagementDto) => {
  memberManagementFormRef.value.open(item);
};
const avatarSrc = (avatar: string) => {
  console.log("头像地址", avatar);
  const arr = avatar.split(";");
  if (arr.length > 1) {
    // 后端上传的
    avatar = arr.shift()?.split(",")[1] ?? avatar;
  }
  return avatar;
};
const editWalletDetail = (item: MemberManagementDto) => {
  walletDetailRef.value.open(item.UUID);
};
const add = () => {
  memberManagementFormRef.value.open();
};
type SearchDto = {
  keyWord: string;
};
const search = async (searchDto: SearchDto) => {
  params.value.keyWord = searchDto.keyWord;

  getPage();
};

const delLoading = ref(-1);
const del = async (item: MemberManagementDto, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  delLoading.value = index;
  const {
    data: { status, message },
  } = await MemberManagementControllerDelete(item._id);
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
  } = await MemberManagementControllerGetPage(params.value);
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
.freeze {
  color: #fff;
  background-color: orangered;
  border-radius: 15px;
  padding: 5px;
  font-size: 10px;
}
.offline {
  width: 10px;
  height: 10px;
  background-color: #aaa;
  cursor: pointer;
  border-radius: 50%;
  margin-right: 8px;
}
.online {
  width: 10px;
  height: 10px;
  background-color: rgb(16, 227, 16);
  cursor: pointer;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
