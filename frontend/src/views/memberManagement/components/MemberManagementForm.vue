<template>
  <el-dialog
    v-model="show"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    @closed="close(memberManagementFormRef)"
  >
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="memberManagementFormRef"
    >
      <el-form-item label="用户名:" prop="userName">
        <el-input
          v-model="form.userName"
          placeholder="用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="头像:" prop="avatar">
        <div>
          <el-upload
            v-model:file-list="avatarFileList"
            list-type="picture-card"
            action="/api/file/upload"
            name="file"
            :auto-upload="true"
            :limit="1"
            :on-success="avatarOnSuccess"
          >
            <el-icon>
              <Plus />
            </el-icon>
            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="avatarRemove(file)"
                  >
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                  <el-image
                    :src="viewIcon"
                    preview-teleported
                    style="width: 32px; margin-left: 10px"
                    :preview-src-list="[file.url]"
                  >
                  </el-image>
                </span>
              </div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="openId:" prop="openId">
        <el-input
          v-model="form.openId"
          placeholder="openId"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="电话:" prop="phoneNumber">
        <el-input
          v-model="form.phoneNumber"
          placeholder="电话"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用户角色:" prop="role">
        <el-select
          style="width: 100%"
          v-model="roleSelectValue"
          @change="roleSelectChange"
          multiple
          clearable
          placeholder="请选择用户角色"
        >
          <el-option
            v-for="item in roleSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员等级:" prop="rank">
        <el-select
          style="width: 100%"
          v-model="form.rank"
          clearable
          placeholder="请选择会员等级"
          @change="rankSelectChange"
        >
          <el-option
            v-for="item in rankSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-loading="saveLoading"
          v-if="btnShow('save-memberManagement')"
          type="primary"
          @click="save(memberManagementFormRef)"
        >
          {{ form._id ? "更新" : "保存" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { btnShow } from "@/utils/buttonShow";
import { getToken } from "@/utils/authTokenUtil";
import { viewIcon } from "@/utils/enum/iconBase64";
import { alertSuccess, alertWarning } from "@/utils/message";
import { AdministrativeDivisionsControllerGetListByDicClass } from "@/api/AdministrativeDivisionsControllerApi";
import { SelectDto } from "@/common/CommonDto";
import {
  MemberManagementControllerCreate,
  MemberManagementControllerGetDetailById,
  MemberManagementControllerUpdate,
} from "@/api/MemberManagementControllerApi";
import type {
  FormInstance,
  CascaderProps,
  FormRules,
  UploadFile,
  UploadUserFile,
} from "element-plus";
import { MemberManagementDto } from "@/api/dto/MemberManagementDto";
const emit = defineEmits(["Refresh"]);
const show = ref(false);
const title = ref("添加会员管理");
const form = ref(new MemberManagementDto());
const memberManagementFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  userName: [],
  avatar: [],
  openId: [],
  memberQR: [],
  sex: [],
  age: [],
  phoneNumber: [],
  role: [],
  rank: [],
});
const open = (item: MemberManagementDto) => {
  show.value = true;
  if (item?._id) {
    title.value = "编辑会员管理";
    getDetail(item._id);
  } else {
    title.value = "添加会员管理";
  }
};

const avatarFileList = ref<UploadUserFile[]>([]);
const avatarOnSuccess = (response: any) => {
  const { data, status, message } = response;
  if (status == 1) {
    const { UUID, fileName: name, url } = data;
    form.value.fileIds?.push(UUID);
    form.value.avatar = `${name},${url};`;
  } else {
    alertWarning(message);
  }
};
const avatarRemove = (file: UploadFile) => {
  console.log("handleRemove", file);
  avatarFileList.value = avatarFileList.value.filter(
    (item: any) => item.uid != file.uid
  );
  if (form.value.avatar) {
    let temp = "";
    form.value.avatar.split(";").map((item, i) => {
      if (item) {
        if (item.indexOf(file.name) == -1) {
          temp += `${item};`;
        }
      }
    });
    form.value.avatar = temp;
  }
};
// 获取select数据
const roleSelect = ref(new Array<SelectDto<any>>());
const getRoleSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/rolePermissions/getList");
  if (status === 1) {
    data.map((item: any) => {
      roleSelect.value.push(new SelectDto<any>(item["roleName"], item["_id"]));
    });
  } else {
    alertWarning(message);
  }
};
getRoleSelect();
const roleSelectValue = ref(new Array<any>());
const roleSelectChange = (value: any) => {
  console.log(value);
};
// 获取select数据
const rankSelect = ref(new Array<SelectDto<any>>());
const getRankSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/admin/dic/getList/DC0008");
  if (status === 1) {
    data.map((item: any) => {
      rankSelect.value.push(
        new SelectDto<any>(item["dicName"], item["dicCode"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getRankSelect();
const rankSelectChange = (value: string) => {
  form.value.rankText = rankSelect.value.filter(
    (item) => item.value == value
  )[0].label;
};
const getDetail = async (id: string) => {
  const {
    data: { status, data, message },
  } = await MemberManagementControllerGetDetailById(id);
  if (status === 1) {
    form.value = data;
    initOtherValue(data);
  } else {
    alertWarning(message);
  }
};
const initOtherValue = (data: MemberManagementDto) => {
  console.log(data);

  if (data.avatar) {
    const photoFrontFileArr = data.avatar.split(";");
    if (photoFrontFileArr.length > 1) {
      let [name, url] = photoFrontFileArr[0].split(",");
      url = "/api" + url;
      name = name ?? "用户头像";
      avatarFileList.value.push({ name, url });
    } else {
      const url = "/api" + data.avatar;
      const name = "用户头像";
      avatarFileList.value.push({ name, url });
    }
  } else {
    avatarFileList.value = [];
  }

  if (data.role) {
    roleSelectValue.value = data.role;
  }
};
const saveLoading = ref(false);
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      saveLoading.value = true;
      const {
        data: { status, message },
      } = form.value._id
        ? await MemberManagementControllerUpdate(form.value._id, form.value)
        : await MemberManagementControllerCreate(form.value);
      saveLoading.value = false;
      if (status === 1) {
        alertSuccess("成功");
        if (!form.value?._id) {
          show.value = false;
        }
        emit("Refresh");
      } else {
        alertWarning(message);
      }
    } else {
      alertWarning("表单校验未通过，请根据提示重新填写");
    }
  });
};

const close = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  show.value = false;
  form.value = new MemberManagementDto();
  initOtherValue(form.value);
};

defineExpose({ open });
</script>
