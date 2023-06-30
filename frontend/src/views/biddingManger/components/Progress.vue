<template>
  <el-dialog v-model="state.dialogFormVisible" title="进度管理" :close-on-press-escape="false" :close-on-click-modal="false"
    width="70%" @closed="closeForm()">
    <el-timeline>
      <el-timeline-item center v-if="state.progressDetail.progress == '-1'" :color="isActive(-1) ? state.activeColor : ''"
        placement="top">
        <span class="title">流标</span> <span class="sync">说明：项目已流标</span>
      </el-timeline-item>
      <el-timeline-item center :color="isActive(1) ? state.activeColor : ''" placement="top">
        <span class="title">招标中</span> <span class="sync">说明：开标前均为招标阶段</span>
        <el-button class="notice-btn" type="text" @click="openNotice(NOTIFICATION_TYPE.发布或修改)">查看通知记录</el-button>
      </el-timeline-item>
      <el-timeline-item center :color="isActive(2) ? state.activeColor : ''" placement="top">
        <span class="title">评标中</span> <span class="sync">说明：录入中标企业以前</span>
        <div v-if="!state.progressDetail.startSecond && isActive(2) && state.progressDetail.progress != '0'">
          <el-button class="notice-btn" type="text" @click="startSecond()">开启第二轮</el-button>
        </div>
        <div v-else-if="state.progressDetail.startSecond && isActive(2) && state.progressDetail.progress != '0'">
          <el-button class="notice-btn" type="text" @click="startSecond()">编辑第二轮设置</el-button>
          <el-button class="notice-btn" type="text" @click="openSecond()">查看明细</el-button>
        </div>
        <div
          v-else-if="state.progressDetail.startSecond && (state.progressDetail.progress == '0' || Number(state.progressDetail.progress) > 2)">
          <el-button class="notice-btn" type="text" @click="openSecond()">查看二轮明细</el-button>
        </div>
      </el-timeline-item>
      <el-timeline-item center :color="isActive(3) ? state.activeColor : ''" placement="top">
        <el-card>
          <div class="box">
            <div class="box-item"><span class="title">已&nbsp;&nbsp;中&nbsp;&nbsp;标</span></div>
            <div class="box-item">
              <div class="sync">说明：选定中标企业后进入已中标阶段，确定中标企业后会通知所有报名供应商中标结果</div>
              <div class="form-box">
                <el-form-item label="中标企业：">
                  <el-select :disabled="!isActive(3)" @change="selectChange" v-model="state.biddingCompany" class="m-2"
                    placeholder="选择中标企业">
                    <el-option v-for="item in state.sinUpCompany" :key="item.supplierUUID" :label="item.supplierName"
                      :value="item.supplierUUID" />
                  </el-select>
                  <el-button class="notice-btn" type="text" @click="openNotice(NOTIFICATION_TYPE.中标结果)">查看通知记录</el-button>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item center :color="isActive(4) ? state.activeColor : ''" placement="top">
        <el-card>
          <div class="box">
            <div class="box-item"><span class="title">合同签订</span></div>
            <div class="box-item">
              <div class="sync">说明：签订合同时，录入佐证材料</div>
              <el-form-item label="佐证材料：" label-width="100px" style="margin:15px 0 10px 0;">
                <el-upload class="upload-demo" :disabled="!isActive(4)" style="width: 100%;" action="/api/file/upload"
                  :on-success="signUploadSuccess" multiple :limit="1" :file-list="state.sign.file">
                  <el-button size="small" :disabled="!isActive(4)" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="备注：" label-width="100px">
                <el-input v-model="state.sign.remarks" :disabled="!isActive(4)" type="textarea"
                  placeholder="请输入备注"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item center :color="isActive(5) ? state.activeColor : ''" placement="top">
        <el-card>
          <div class="box">
            <div class="box-item"><span class="title">合同履行</span></div>
            <div class="box-item">
              <div class="sync">说明：签订合同时，录入佐证材料</div>
              <el-form-item label="佐证材料：" label-width="100px" style="margin:15px 0 10px 0;">
                <el-upload class="upload-demo" :disabled="!isActive(5)" style="width: 100%;" action="/api/file/upload"
                  :on-success="performUploadSuccess" multiple :limit="1" :file-list="state.perform.file">
                  <el-button size="small" :disabled="!isActive(5)" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="备注：" label-width="100px">
                <el-input v-model="state.perform.remarks" :disabled="!isActive(5)" type="textarea"
                  placeholder="请输入备注"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item center :color="isActive(0) ? state.activeColor : ''" placement="top">
        <span class="title">已结束</span>
      </el-timeline-item>
    </el-timeline>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary"
          v-if="Number(state.progressDetail.progress) <= 3 && Number(state.progressDetail.progress) > 0"
          @click="biddingFail()">流标</el-button>
        <el-button type="primary" v-if="Number(state.progressDetail.progress) > 0"
          @click="nextProgress()">下一个阶段</el-button>
      </span>
    </template>
    <Notice ref="noticeRef"></Notice>
    <SinUp ref="sinUpRef"></SinUp>
    <SecondSignUp ref="secondSignUpRef" @getProgressDetail="getDetail"></SecondSignUp>
  </el-dialog>
</template>
<script lang="ts" setup>
import { BiddingMangerControllerGetBiddingProgressDetailByBiddingUUID, BiddingMangerControllerGetBiddingSignUpList, BiddingMangerControllerGetBiddingSignUpSecondList, BiddingMangerControllerUpdateBiddingProgress } from "@/api/BiddingMangerControllerApi";
import type { BiddingProgressDto } from "@/api/dto/BiddingProgressDto";
import { alertConfirm, alertSuccess, alertWarning } from "@/utils/message";
import SinUp from './SinUp.vue';
import SecondSignUp from './SecondSignUp.vue';
import { ref, watch } from "vue";
import Notice from "./Notice.vue"
enum BIDDING_PROGRESS {
  "流标" = -1,
  "招标中" = 1,
  "竞标中" = 2,
  "已中标" = 3,
  "合同签订" = 4,
  "合同履行" = 5,
  "已结束" = 0,
}
const state = ref({
  dialogFormVisible: false,
  activeColor: '#47a0fa',
  biddingCompany: '' as String,
  sinUpCompany: [] as any[],
  sign: {
    file: [] as any[],
    remarks: "",
    fileRes: ""
  },
  perform: {
    file: [] as any[],
    remarks: "",
    fileRes: ""
  },
  progressDetail: {} as BiddingProgressDto,
  progressId: "",
  biddingUUID: ""
});
const selectChange = (value: any) => {
  console.log('数据变化', value)
}
const isActive = (progress: BIDDING_PROGRESS) => {
  if (Number(state.value.progressDetail.progress) == 0) {
    return true;
  } else if (progress != 0 && progress <= Number(state.value.progressDetail.progress)) {
    return true
  }
  return false;
}
const nextProgress = async () => {
  const progressConf = {
    [BIDDING_PROGRESS.招标中]: BIDDING_PROGRESS.竞标中,
    [BIDDING_PROGRESS.竞标中]: BIDDING_PROGRESS.已中标,
    [BIDDING_PROGRESS.已中标]: BIDDING_PROGRESS.合同签订,
    [BIDDING_PROGRESS.合同签订]: BIDDING_PROGRESS.合同履行,
    [BIDDING_PROGRESS.合同履行]: BIDDING_PROGRESS.已结束,
    [BIDDING_PROGRESS.已结束]: BIDDING_PROGRESS.已结束,
    [BIDDING_PROGRESS.流标]: BIDDING_PROGRESS.流标,
  }
  const progressNow: BIDDING_PROGRESS = Number(state.value.progressDetail?.progress);
  const nestSubmit = async () => {
    state.value.progressDetail.progress = `${progressConf[progressNow]}`
    const { data: res } = await BiddingMangerControllerUpdateBiddingProgress(state.value.progressId, state.value.progressDetail);
    const { status, message } = res;
    if (status == 1) {
      alertSuccess("成功");
    } else {
      alertWarning(message);
    }
  }
  switch (progressNow) {
    case BIDDING_PROGRESS.已中标:
      console.log('选中中标企业');
      if (state.value.biddingCompany) {
        state.value.progressDetail.winTheBidding = state.value.biddingCompany;
        nestSubmit();
      } else {
        alertWarning("请选择中标企业!");
        return;
      }
      break;
    case BIDDING_PROGRESS.合同签订:
      if (state.value.sign.file.length < 1) {
        alertConfirm("佐证材料未填写，确定下一步吗？").then(() => {
          nestSubmit();
        }).catch(() => {
          return false;
        });
      } else {
        state.value.progressDetail.contractSigning = [state.value.sign.fileRes, state.value.sign.remarks].join(";")
        nestSubmit();
      }
      break;
    case BIDDING_PROGRESS.合同履行:
      if (state.value.perform.file.length < 1) {
        alertConfirm("佐证材料未上传，确定下一步吗？").then(() => {
          nestSubmit();
        }).catch(() => {
          return false;
        });
      } else {
        state.value.progressDetail.contractPerformance = [state.value.perform.fileRes, state.value.perform.remarks].join(";")
        nestSubmit();
      }
      break;
    default:
      nestSubmit();
  }
}

const biddingFail = async () => {
  state.value.progressDetail.progress = `-1`
  const { data: res } = await BiddingMangerControllerUpdateBiddingProgress(state.value.progressId, state.value.progressDetail);
  const { status, message } = res;
  if (status == 1) {
    alertSuccess("成功");
  } else {
    alertWarning(message);
  }
};
const emit = defineEmits(["Refresh"]);
const noticeRef = ref();
enum NOTIFICATION_TYPE {
  "发布或修改" = 1,
  "中标结果" = 2,
}
const openNotice = (notificationType: NOTIFICATION_TYPE) => {
  noticeRef.value.open(state.value.biddingUUID, notificationType);
}
const secondSignUpRef = ref();
const startSecond = () => {
  secondSignUpRef.value.open(state.value.biddingUUID, state.value.progressId);
}
const sinUpRef = ref();
enum SIGNUP_TYPE {
  "招标公告" = 1,
  "预招标公告" = 2,
}
const openSecond = () => {
  sinUpRef.value.open(state.value.biddingUUID, SIGNUP_TYPE.招标公告, true);
}
const signUploadSuccess = (response: any) => {
  const { data, status, message } = response;
  if (status == 1) {
    const { UUID, fileName: name, url } = data;
    state.value.progressDetail.fileIds?.push(UUID);
    state.value.sign.file.push({ UUID, name, url });
    state.value.sign.fileRes = [name, url].join(",");
  } else {
    alertWarning(message);
  }
}
const performUploadSuccess = (response: any) => {
  const { data, status, message } = response;
  if (status == 1) {
    const { UUID, fileName: name, url } = data;
    state.value.progressDetail.fileIds?.push(UUID);
    state.value.perform.file.push({ UUID, name, url })
    state.value.perform.fileRes = [name, url].join(",");
  } else {
    alertWarning(message);
  }
}
// 获取详情
const getDetail = async (buddingUUID: string) => {
  console.log("获取详情", buddingUUID);
  const { data: res } = await BiddingMangerControllerGetBiddingProgressDetailByBiddingUUID(buddingUUID);
  if (res.status == 1) {
    console.log('获取详情', res.data);
    state.value.progressId = res.data._id;
    state.value.progressDetail = res.data;
    state.value.biddingCompany = state.value.progressDetail.winTheBidding;
    if (state.value.progressDetail.contractPerformance) {
      const [file, remarks] = state.value.progressDetail.contractPerformance.split(";");
      if (file) {
        const [name, url] = file.split(",");
        state.value.perform.file = [{ name, url }]
        state.value.perform.fileRes = file;
      }
      state.value.perform.remarks = remarks
    }
    if (state.value.progressDetail.contractSigning) {
      const [file, remarks] = state.value.progressDetail.contractSigning.split(";");
      if (file) {
        const [name, url] = file.split(",");
        state.value.sign.file = [{ name, url }]
        state.value.sign.fileRes = file;
      }
      state.value.sign.remarks = remarks
    }
  }
};
const getSinUpCompany = async (biddingOrNoteUUID: String) => {
  // 获取报名的企业
  const { data: res } = state.value.progressDetail.startSecond ?
    await BiddingMangerControllerGetBiddingSignUpSecondList(biddingOrNoteUUID) :
    await BiddingMangerControllerGetBiddingSignUpList(biddingOrNoteUUID);
  const { data, status } = res;
  if (status == 1) {
    state.value.sinUpCompany = data;
  }
}
watch(state.value.progressDetail.startSecond, getSinUpCompany);
const open = (item: any) => {
  getDetail(item.UUID);
  getSinUpCompany(item.UUID);
  state.value.biddingUUID = item.UUID;
  state.value.dialogFormVisible = true;
};

// 右上角关闭
const closeForm = () => {
  state.value.dialogFormVisible = false;
  emit("Refresh");
};
defineExpose({ open });
</script>
<style lang="scss" scoped>
.title {
  font-weight: 600;
  font-size: 18px;
  margin-right: 20px;
}

.sync {
  min-width: 400px;
  color: #666;
  margin-right: 10px;
}

.box-item {
  float: left;



  .form-box {
    margin-top: 10px;

    .label {
      display: inline-block;
      width: 80px;
      text-align: right;
    }

    .notice-btn {
      margin-left: 20px;
    }
  }
}
</style>