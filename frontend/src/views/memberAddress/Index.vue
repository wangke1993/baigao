<template>
  <div class="list-box">
    <div class="page-head">
      <MemberAddressSearch @search="search">
        <el-button
          type="primary"
          v-if="btnShow('add-memberAddress')"
          @click="add()"
        >
          新增
        </el-button>
      </MemberAddressSearch>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="_id">
      <el-table-column width="80" label="序号">
        <template #default="scope">
          {{ (params.pageIndex - 1) * params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="administrativeDivision" label="行政区划">
        <template #default="scope">
          {{ scope.row.administrativeDivisionText }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="详细地址">
        <template #default="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column prop="contacts" label="联系人">
        <template #default="scope">
          {{ scope.row.contacts }}
        </template>
      </el-table-column>
      <el-table-column prop="contactsPhone" label="联系电话">
        <template #default="scope">
          {{ scope.row.contactsPhone }}
        </template>
      </el-table-column>
      <el-table-column prop="addDate" label="添加时间">
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
              v-if="btnShow('edit-memberAddress')"
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
                  v-if="btnShow('delete-memberAddress')"
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
    <MemberAddressForm ref="memberAddressFormRef" @Refresh="getPage" />
  </div>
</template>
<script lang="ts">
export default {
  name: "memberAddress",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { btnShow } from "@/utils/buttonShow";
import MemberAddressForm from "@/views/memberAddress/components/MemberAddressForm.vue";
import MemberAddressSearch from "@/views/memberAddress/components/MemberAddressSearch.vue";
import {
  MemberAddressControllerGetPage,
  MemberAddressControllerDelete,
} from "@/api/MemberAddressControllerApi";
import type { MemberAddressDto } from "@/api/dto/MemberAddressDto";
import { DateTime } from "luxon";
import { alertSuccess, alertWarning } from "@/utils/message";
const memberAddressFormRef = ref();
const listLoading = ref(false);
const list = ref(new Array<MemberAddressDto>());
const total = ref(0);
const params = ref({
  pageIndex: 1,
  pageSize: 10,
  keyWord: "",
});
const edit = (item: MemberAddressDto) => {
  memberAddressFormRef.value.open(item);
};
const add = () => {
  memberAddressFormRef.value.open();
};
type SearchDto = {
  keyWord: string;
};
const search = async (searchDto: SearchDto) => {
  params.value.keyWord = searchDto.keyWord;
  getPage();
};

const delLoading = ref(-1);
const del = async (item: MemberAddressDto, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  delLoading.value = index;
  const {
    data: { status, message },
  } = await MemberAddressControllerDelete(item._id);
  delLoading.value = -1;
  if (status === 1) {
    alertSuccess("操作成功!");
    getPage();
  } else {
    // alertWarning(message);
  }
};

const getPage = async () => {
  listLoading.value = true;
  const {
    data: { status, data, message },
  } = await MemberAddressControllerGetPage(params.value);
  listLoading.value = false;
  if (status === 1) {
    list.value = data.list;
    total.value = data.total;
  } else {
    // alertWarning(message);
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
