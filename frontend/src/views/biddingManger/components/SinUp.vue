<template>
  <el-dialog v-model="state.dialogFormVisible" title="报名管理" :close-on-press-escape="false" :close-on-click-modal="false"
    width="70%" @closed="closeForm()">
    <div class="list-box">
      <div class="page-head">
        <SearchBox placeholder="关键字" @handleSearch="handleSearch">
        </SearchBox>
      </div>
      <el-table :data="state.listData" row-key="_id">
        <el-table-column type="index" width="80" align="center" label="序号" />
        <el-table-column prop="supplierName" label="供应商名称">
          <template #default="scope">
            <el-button @click="showDetail(scope.row)" type="primary" link>{{ scope.row.supplierName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="tenderDocuments" label="投标文件">
          <template #default="scope">
            <el-button @click="down(scope.row, scope.row._id)"
              :disabled="state.secondSignUp ? !scope.row.secondDocuments : !scope.row.tenderDocuments" type="primary"
              link>{{ state.secondSignUp ? (scope.row.secondDocuments ? '点击下载' : '未上传') :
                (scope.row.tenderDocuments ? '点击下载' : '未上传')
              }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="tenderDocuments" label="状态">
          <template #default="scope">
            {{ scope.row.documentsDown === 0 ? '未查阅' : `已查阅${scope.row.documentsDown}次` }}
          </template>
        </el-table-column>
        <el-table-column prop="supplierClassName" label="供应商分类" />
        <el-table-column prop="addDate" label="报名时间">
          <template #default="scope">
            {{ DateTime.fromISO(scope.row.addDate, { zone: 'utc+8' }).toFormat('yyyy-MM-dd HH:mm:ss') }}
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
    <Process ref="processRef" />
  </el-dialog>
</template>

<script lang="ts" setup>
import SearchBox from './Search.vue';
import { ref } from "vue";
import { DateTime } from 'luxon';
import {
  BiddingMangerControllerDownTenderDocuments,
  BiddingMangerControllerGetBiddingSignUpPage,
  BiddingMangerControllerGetBiddingSecondSignUpPage,
  BiddingMangerControllerDownSecondDocuments
} from '@/api/BiddingMangerControllerApi';
import Process from "@/views/supplierManagement/components/Process.vue"
import { alertWarning } from '@/utils/message';
import qs from 'qs'

const state = ref({
  dialogFormVisible: false,
  load: false,
  listData: new Array<any>(),
  params: {
    pageIndex: 1,
    pageSize: 10,
    keyWord: "", //搜索关键字
  },
  biddingOrNoteUUID: '' as String,
  signUpType: '' as String,
  secondSignUp: false,
  total: 0,
});
const processRef = ref();
const showDetail = (item: any) => {
  processRef.value.open({ UUID: item.supplierUUID, bySinUp: true });
}
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
const downLoading = ref({} as any);
const cell = ['csv', 'fods', 'ods', 'ots', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx'];
const slide = ['fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx']
const down = async (item: any, loadingKey: string) => {
  downLoading.value[loadingKey] = true;
  const { tenderDocuments, _id: id, secondDocuments } = item;
  const res = !state.value.secondSignUp ?
    await BiddingMangerControllerDownTenderDocuments(id, tenderDocuments, { responseType: "blob", timeout: 3600000 }) :
    await BiddingMangerControllerDownSecondDocuments(id, secondDocuments, { responseType: "blob", timeout: 3600000 });
  console.log(res);
  if (res.data.type == 'application/json') {
    const file = new FileReader();
    file.readAsText(res.data, 'utf-8');
    file.onload = function () {
      const { data: { viewUUID, fileType, file: viewFile } } = JSON.parse(file?.result ? file?.result.toString() : "");
      if (fileType === 'pdf') {
        window.open(`http://211.149.135.249:888/api/file/privateTemp/${viewUUID}`)
      } else {
        let documentType = 'word';
        if (cell.includes(fileType)) {
          documentType = 'cell';
        } else if (slide.includes(fileType)) {
          documentType = 'slide';
        }
        // alertWarning(message);
        const query = {
          fileType,
          key: viewUUID,
          title: `${item.supplierName}-${viewFile.fileName}`,
          url: `http://211.149.135.249:888/api/file/privateTemp/${viewUUID}`,
          documentType
        }
        window.open(`${window.location.origin}/documentView?${qs.stringify(query)}`)
      }
    }
  } else {
    const blob = new Blob([res.data], {
      type: res?.headers['content-type'],
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const fileType = decodeURI(atob(res?.headers['file-name'])).split('.').pop() ?? 'xxx';
    const webOpen = ['jpg', 'png', 'jpeg', 'gif', 'bmp'];
    if (webOpen.includes(fileType)) {
      window.open(a.href);
    } else {
      if (state.value.secondSignUp) {
        a.download = `${item.supplierName}二轮报价文件${decodeURI(atob(res?.headers['file-name']))}`;
      } else {
        a.download = `${item.supplierName}投标文件${decodeURI(atob(res?.headers['file-name']))}`;
      }
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    getList(state.value.params);
  }
  downLoading.value[loadingKey] = false;
}
const getList = async (params: any) => {
  try {
    const result = !state.value.secondSignUp ?
      await BiddingMangerControllerGetBiddingSignUpPage(state.value.biddingOrNoteUUID, state.value.signUpType, params) :
      await BiddingMangerControllerGetBiddingSecondSignUpPage(state.value.biddingOrNoteUUID, params);
    const data = result.data;
    if (data.status === 1) {
      state.value.listData = data.data.list;
      state.value.total = data.data.total;
    }
  } catch (err) {
    return;
  }
};
const open = (biddingUUID: String, signUpType: String, secondSignUp?: boolean) => {
  state.value.biddingOrNoteUUID = biddingUUID;
  state.value.signUpType = signUpType;
  if (secondSignUp) {
    state.value.secondSignUp = secondSignUp;
  }
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
  };
  state.value.biddingOrNoteUUID = '' as String;
  state.value.total = 0;
  state.value.secondSignUp = false;
};
defineExpose({ open });
</script>
<style lang="scss" scoped>
.title {
  font-weight: 600;
  font-size: 18px;
  margin-right: 20px;
}

.box-item {
  float: left;
}
</style>