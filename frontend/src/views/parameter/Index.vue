<template>
  <div class="list-box">
    <div class="cell">
      <div class="updata">
        <span class="title">短信参数设置</span>
        <el-button v-loading="state.msnBtnLoading" type="primary" style="width: 80px" @click="saveApiReset">保存</el-button>
        <a style="margin-left:10px;font-size:12px" href="https://unisms.apistd.com/console/" target="_blank">短信运营商</a>
      </div>
      <div class="payment">
        <el-form style="width: 640px" label-width="180px" :inline="false" class="demo-form-inline">
          <el-form-item label="是否启用:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-switch v-model="state.msmConf.DC00030003" active-value="1" inactive-value="0" />
            </div>
          </el-form-item>
          <el-form-item label="accessKeyId:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.msmConf.DC00030001" style="width: 380px" placeholder="只能查看不能设置" />
              <span style="flex-shrink: 0; margin-left: 10px">{{
                state.msmConf.DC00030001Status ? "已设置" : "未设置"
              }}</span>
            </div>
          </el-form-item>
          <el-form-item label="签名:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.msmConf.DC00030002" style="width: 380px" placeholder="请输入" />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cell">
      <div class="updata">
        <span class="title">会员等级角色绑定</span>
        <el-button v-loading="state.memberConfLoading" type="primary" style="width: 80px"
          @click="saveMemberConf">保存</el-button>
      </div>
      <div class="payment">
        <el-form style="width: 640px" label-width="180px" :inline="false" class="demo-form-inline">
          <el-form-item v-for="item in state.memberConf" :key="item.confSelect" :label="item.remarks">
            <div style="display: flex; align-items: center; width: 100%">
              <el-select v-model="item.confValue" multiple class="m-2" placeholder="请选择绑定的角色" size="large">
                <el-option v-for="sItem in state.roleTypeData" :key="sItem.value" :label="sItem.name"
                  :value="sItem.value" />
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cell">
      <div class="updata">
        <span class="title">小程序参数设置</span>
        <el-button type="primary" style="width: 80px" @click="saveWeChatConf">保存</el-button>
        <a style="margin-left:10px;font-size:12px" href="https://mp.weixin.qq.com/" target="_blank">微信小程序</a>
      </div>
      <div class="payment">
        <el-form style="width: 640px" label-width="180px" :inline="false" class="demo-form-inline">
          <el-form-item label="appId:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.weChatConf.DC00040001" show-password style="width: 380px" placeholder="只能设置不能查看" />
              <span style="flex-shrink: 0; margin-left: 10px">{{
                state.weChatConf.DC00040001Status ? "已设置" : "未设置"
              }}</span>
            </div>
          </el-form-item>
          <el-form-item label="appSecrt:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.weChatConf.DC00040002" show-password style="width: 380px" placeholder="只能设置不能查看" />
              <span style="flex-shrink: 0; margin-left: 10px">{{
                state.weChatConf.DC00040002Status ? "已设置" : "未设置"
              }}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cell">
      <div class="updata">
        <span class="title">支付参数设置</span>
        <el-button type="primary" style="width: 80px" @click="savePayment">保存</el-button>
        <a style="margin-left:10px;font-size:12px" href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=F"
          target="_blank">微信支付</a>
      </div>
      <div class="payment">
        <el-form style="width: 640px" label-width="180px" :inline="false" class="demo-form-inline">
          <el-form-item label="应用ID:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.payConf.DC00050001" style="width: 380px" placeholder="只能查看不能设置" />
              <span style="flex-shrink: 0; margin-left: 10px">{{
                state.payConf.DC00050001Status ? "已设置" : "未设置"
              }}</span>
            </div>
          </el-form-item>
          <el-form-item label="APIv3密钥:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.payConf.DC00050007" style="width: 380px" placeholder="只能查看不能设置" />
              <span style="flex-shrink: 0; margin-left: 10px">{{
                state.payConf.DC00050007Status ? "已设置" : "未设置"
              }}</span>
            </div>
          </el-form-item>
          <el-form-item label="商户号:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.payConf.DC00050002" style="width: 380px" placeholder="请输入" />
            </div>
          </el-form-item>
          <el-form-item label="支付回调地址:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.payConf.DC00050005" style="width: 380px" placeholder="请输入 "
                :autosize="{ minRows: 6, maxRows: 10 }" type="textarea" />
            </div>
          </el-form-item>
          <el-form-item label="退款回调地址:">
            <div style="display: flex; align-items: center; width: 100%">
              <el-input v-model="state.payConf.DC00050006" style="width: 380px" placeholder="请输入 "
                :autosize="{ minRows: 6, maxRows: 10 }" type="textarea" />
            </div>
          </el-form-item>
          <el-form-item label="API证书(apiclient_cert):">
            <el-upload ref="upload03" class="upload-demo" action="/api/file/uploadPrivate" :limit="1"
              :on-exceed="handleExceed03" :headers="{ Authorization: `Bearer ${token}` }" :on-success="uploadDC00050003"
              :auto-upload="false">
              <template #trigger>
                <el-button type="primary">选择文件</el-button>
              </template>
              <el-button class="ml-3" type="success" @click="submitUpload03">
                上传
              </el-button>
              <span style="flex-shrink: 0; margin-left: 10px">{{
                state.payConf.DC00050003Status ? "已上传" : "未上传"
              }}(只能设置不能查看)</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="API密钥(apiclient_key):">
            <el-upload ref="upload04" class="upload-demo" action="/api/file/uploadPrivate" :limit="1"
              :on-exceed="handleExceed04" :headers="{ Authorization: `Bearer ${token}` }" :on-success="uploadDC00050004"
              :auto-upload="false">
              <template #trigger>
                <el-button type="primary">选择文件</el-button>
              </template>
              <el-button class="ml-3" type="success" @click="submitUpload04">
                上传
              </el-button>
              <span style="flex-shrink: 0; margin-left: 10px">{{
                state.payConf.DC00050004Status ? "已上传" : "未上传"
              }}(只能设置不能查看)</span>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
/**
 * TODO:参数改为分组编辑+数据字典点选的方式，动态生成参数设置界面；参数结构表（存储参数页，页面结构），字典表（存储参数、值、值类型（表单类型））
 */
import { ref, reactive } from "vue";
import {
  SystemConfigControllerUpdate,
  SystemConfigControllerGetAll,
} from "@/api/SystemConfigControllerApi";
import { RolePermissionsControllerGetList } from "@/api/RolePermissionsControllerApi";
import { alertSuccess } from "@/utils/message";
import { type UploadInstance, type UploadProps, type UploadRawFile, genFileId } from "element-plus";
import { getToken } from '@/utils/authTokenUtil';
const state = reactive({
  appletArticle: new Array<any>(),
  confType: "",
  appletArticleIndex: 0,
  roleTypeData: new Array<any>(),
  memberConf: new Array<any>(),
  msmConf: {
    DC00030001: '',
    DC00030001Status: false,
    DC00030002: '',
    DC00030003: '1'
  },
  payConf: {
    DC00050001: '',
    DC00050001Status: false,
    DC00050002: '',
    DC00050002Status: false,
    DC00050003: '',
    DC00050003Status: false,
    DC00050004: '',
    DC00050004Status: false,
    DC00050005: '',
    DC00050006: '',
    DC00050007: '',
    DC00050007Status: false,
  },
  weChatConf: {
    DC00040001: '',  // appID
    DC00040001Status: false,
    DC00040002: '',  // appID
    DC00040002Status: false,
  },
  msnBtnLoading: false,
  memberConfLoading: false
});

const saveWeChatConf = async () => {
  await Promise.all([
    postSystemConfigControllerUpdate('DC00040001', state.weChatConf.DC00040001),
    postSystemConfigControllerUpdate('DC00040002', state.weChatConf.DC00040002),
  ])
  state.weChatConf.DC00040001 = '';
  state.weChatConf.DC00040002 = '';
  alertSuccess('保存成功');
};
// 保存短信参数设置
const saveMemberConf = async () => {
  state.memberConfLoading = true;
  await Promise.all(state.memberConf.map(item => postSystemConfigControllerUpdate(
    item.confSelect,
    item.confValue.join(',')
  )))
  state.msmConf.DC00030001 = '';
  alertSuccess('保存成功');
  state.memberConfLoading = false;
};

// 保存短信参数设置
const saveApiReset = async () => {
  state.msnBtnLoading = true;
  await Promise.all([
    postSystemConfigControllerUpdate(
      'DC00030001',
      state.msmConf.DC00030001
    ),
    postSystemConfigControllerUpdate(
      'DC00030002',
      state.msmConf.DC00030002
    ),
    postSystemConfigControllerUpdate(
      'DC00030003',
      state.msmConf.DC00030003
    ),
  ])
  state.msmConf.DC00030001 = '';
  alertSuccess('保存成功');
  state.msnBtnLoading = false;
};

// 支付参数设置保存
const savePayment = async () => {
  await Promise.all([
    postSystemConfigControllerUpdate(
      'DC00050001',
      state.payConf.DC00050001
    ),
    postSystemConfigControllerUpdate(
      'DC00050002',
      state.payConf.DC00050002
    ),
    postSystemConfigControllerUpdate(
      'DC00050003',
      state.payConf.DC00050003
    ),
    postSystemConfigControllerUpdate(
      'DC00050004',
      state.payConf.DC00050004
    ),
    postSystemConfigControllerUpdate(
      'DC00050005',
      state.payConf.DC00050005
    ),
    postSystemConfigControllerUpdate(
      'DC00050006',
      state.payConf.DC00050006
    ),
    postSystemConfigControllerUpdate(
      'DC00050007',
      state.payConf.DC00050007
    ),
  ]);
  state.payConf.DC00050001 = '';
  state.payConf.DC00050007 = '';
  alertSuccess('保存成功');
};

// 保存设置
const postSystemConfigControllerUpdate = async (
  dicCode: any,
  value: any
) => {
  await SystemConfigControllerUpdate(dicCode, {
    confValue: value,
  });
  await getSystemConfigControllerGetAll("");
};

// 获取角色权限列表
const getRolePermissionsControllerGetList = async () => {
  try {
    let { data: { data, status, message } } = await RolePermissionsControllerGetList();
    if (status === 1) {
      console.log("获取角色权限列表", data);
      const result = data.map((item: any) => {
        return { name: item.roleName, value: item._id };
      });
      console.log("result", result);
      state.roleTypeData = result;
    }
  } catch (err) {
    return;
  }
};

getRolePermissionsControllerGetList();

// 获取所有配置信息
const getSystemConfigControllerGetAll = async (dicCode: string) => {
  try {
    let { data: { data, status, message } } = await SystemConfigControllerGetAll(dicCode);
    if (status === 1) {
      console.log("获取所有配置信息", data);
      let ARRDC0003: any = [];
      state.memberConf = [];
      data.map((item: any) => {
        const { _id, remarks, confSelect, confType, confValue, isSet } = item;
        if (confType == 'DC0008') {
          state.memberConf.push({ ...item, confValue: confValue.split(',') });
        }
        if (confSelect == 'DC00040001') {
          state.weChatConf.DC00040001Status = isSet;
        }
        if (confSelect == 'DC00040002') {
          state.weChatConf.DC00040002Status = isSet;
        }
        if (confSelect == 'DC00050001') {
          state.payConf.DC00050001Status = isSet;
        }
        if (confSelect == 'DC00050002') {
          state.payConf.DC00050002 = confValue;
        }
        if (confSelect == 'DC00050003') {
          state.payConf.DC00050003Status = isSet;
        }
        if (confSelect == 'DC00050004') {
          state.payConf.DC00050004Status = isSet;
        }
        if (confSelect == 'DC00050007') {
          state.payConf.DC00050007Status = isSet;
        }
        if (confSelect == 'DC00050005') {
          state.payConf.DC00050005 = confValue;
        }
        if (confSelect == 'DC00050006') {
          state.payConf.DC00050006 = confValue;
        }
        if (confSelect == "DC00030001") {
          state.msmConf.DC00030001Status = isSet;
        } else if (confSelect == "DC00030002") {
          state.msmConf.DC00030002 = confValue;
        } else if (confSelect == "DC00030003") {
          state.msmConf.DC00030003 = confValue;
        }
      });
      state.appletArticle = ARRDC0003;
    }
  } catch (err) {
    return;
  }
};
getSystemConfigControllerGetAll("");

const upload03 = ref<UploadInstance>()
const handleExceed03: UploadProps['onExceed'] = (files) => {
  upload03.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload03.value!.handleStart(file)
}
const submitUpload03 = () => {
  upload03.value!.submit()
}
const upload04 = ref<UploadInstance>()
const handleExceed04: UploadProps['onExceed'] = (files) => {
  upload04.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload04.value!.handleStart(file)
}
const submitUpload04 = () => {
  upload04.value!.submit()
}
const uploadDC00050004 = (res: any) => {
  // 私钥上传成功
  state.payConf.DC00050004 = res?.data?.path;
}
const uploadDC00050003 = (res: any) => {
  // 公钥上传成功
  state.payConf.DC00050003 = res?.data?.path;
}
const token = getToken();
</script>
<style lang="scss">
.list-box {
  padding: 20px;

  .cell {
    .updata {
      border-bottom: 1px solid #ababab;
      padding-bottom: 10px;

      span.title {
        color: #222;
        font-size: 16px;
        font-weight: bold;
        margin-right: 20px;
      }
    }

    .items {
      padding: 10px 0;

      .list {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        span {
          cursor: pointer;
        }
      }
    }

    .Grade {
      display: flex;
      flex-wrap: wrap;
      padding: 20px 0;

      .Grade-cells {
        width: 48%;
        flex-shrink: 0;

        .Grade-title {
          margin-bottom: 10px;
        }
      }

      .Grade-cells:nth-child(odd) {
        margin-right: 4%;
      }
    }

    .Mall {
      padding: 10px 0;
    }

    .Reflect {
      padding: 10px 0;
    }

    .Luckdraw {
      padding: 10px 0;
    }

    .apiReset {
      padding: 10px 0;
      display: flex;

      .apiReset-cells {
        span {
          color: #ccc;
        }
      }
    }

    .payment {
      padding: 10px 0;
    }
  }
}

.pagination-box {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>