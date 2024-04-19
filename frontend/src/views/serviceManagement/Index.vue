<template>
  <div class="list-box">
    <div class="page-head">
      <ServiceManagementSearch @search="search">
        <el-button
          type="primary"
          v-if="btnShow('add-serviceManagement')"
          @click="add()"
        >
          新增
        </el-button>
      </ServiceManagementSearch>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="_id">
      <el-table-column width="80" label="序号">
        <template #default="scope">
          {{ (params.pageIndex - 1) * params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="picture" width="100" label="图片">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            preview-teleported="true"
            v-if="scope.row.picture"
            :src="`/api${scope.row.picture.split(';')[0].split(',')[1]}`"
            :zoom-rate="0.8"
            :preview-src-list="scope.row.picture.split(';').map((item: string) => item.split(',')[1] ? `/api${item.split(',')[1]}` : '').filter((item: any) => Boolean(item))"
            fit="cover"
            loading="lazy"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="全称">
        <template #default="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column prop="forShort" label="简称">
        <template #default="scope">
          {{ scope.row.forShort }}
        </template>
      </el-table-column>
      <el-table-column prop="enableOrNot" label="是否启用">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.enableOrNot" />
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="付费方式">
        <template #default="scope">
          {{ scope.row.paymentMethodText }}
        </template>
      </el-table-column>
      <el-table-column prop="openArea" width="128" label="开放区域">
        <template #default="scope">
          <div v-html="scope.row.openAreaText.split(',').join('<br>')"></div>
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="预约类型">
        <template #default="scope">
          {{ scope.row.serviceTypeText }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button
              v-if="btnShow('edit-serviceManagement')"
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
                  v-if="btnShow('delete-serviceManagement')"
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
    <ServiceManagementForm ref="serviceManagementFormRef" @Refresh="getPage" />
  </div>
</template>
<script lang="ts">
// 路由地址 默认全部挂载到 business
// 名称:服务管理
// 路由地址:/business/serviceManagement
// {
//   path: 'serviceManagement',
//   component: () => import('@/views/serviceManagement/Index.vue'),
//   name: 'serviceManagement',
//   meta: { title: '服务管理' }
// },
// 接口权限：
// 创建服务管理:createServiceManagement
// 编辑服务管理:updateServiceManagement
// 删除服务管理:deleteServiceManagementById
// 根据id获取服务管理详情:getServiceManagementById
// 获取服务管理分页:getServiceManagementPage
// 按钮权限
// 添加服务管理:add-serviceManagement
// 编辑服务管理:edit-serviceManagement
// 删除服务管理:delete-serviceManagement
// 保存或更新服务管理:save-serviceManagement
// 组件名称
export default {
  name: "serviceManagement",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { Delete, Edit } from "@element-plus/icons-vue";
import { btnShow } from "@/utils/buttonShow";
import ServiceManagementForm from "@/views/serviceManagement/components/ServiceManagementForm.vue";
import ServiceManagementSearch from "@/views/serviceManagement/components/ServiceManagementSearch.vue";
import {
  ServiceManagementControllerGetPage,
  ServiceManagementControllerDelete,
} from "@/api/ServiceManagementControllerApi";
import type { ServiceManagementDto } from "@/api/dto/ServiceManagementDto";
import { DateTime } from "luxon";
import { alertSuccess, alertWarning } from "@/utils/message";
const serviceManagementFormRef = ref();
const listLoading = ref(false);
const list = ref(new Array<ServiceManagementDto>());
const total = ref(0);
const params = ref({
  pageIndex: 1,
  pageSize: 10,
  keyWord: "",
});
const edit = (item: ServiceManagementDto) => {
  serviceManagementFormRef.value.open(item);
};
const add = () => {
  serviceManagementFormRef.value.open();
};
type SearchDto = {
  keyWord: string;
};
const search = async (searchDto: SearchDto) => {
  params.value.keyWord = searchDto.keyWord;

  getPage();
};

const delLoading = ref(-1);
const del = async (item: ServiceManagementDto, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  delLoading.value = index;
  const {
    data: { status, message },
  } = await ServiceManagementControllerDelete(item._id);
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
  } = await ServiceManagementControllerGetPage(params.value);
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
</style>
