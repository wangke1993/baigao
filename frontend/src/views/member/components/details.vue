<template>
  <el-dialog v-model="dialogFormVisible" :title="title" :close-on-press-escape="false" :close-on-click-modal="false"
    width="75%" @closed="closeForm()">
    <el-row>
      <el-col :span="6">
        <div class="cell">
          <p class="title">头像：</p>
          <div class="img"><img :src="item.avatar" alt="" /></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cell">
          <p class="title">名称：</p>
          <div class="text">{{ item.userName }}</div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="cell">
          <p class="title">性别：</p>
          <div class="text">
            {{ item.sex === 0 ? "-" : item.sex === 1 ? "男" : "女" }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cell">
          <p class="title">年龄：</p>
          <div class="text">{{ item.age === 0 ? item.age : "-" }}</div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        <div class="cell">
          <p class="title">电话号码：</p>
          <div class="text">
            {{ item.phoneNumber ? item.phoneNumber : "-" }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cell">
          <p class="title">会员等级：</p>
          <div class="text">{{ articleClass(item.rank) }}</div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="cell">
          <p class="title">个人消费总计：</p>
          <div class="text">
            {{ fen2yuan(item.consumptionAccumulation) }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cell">
          <p class="title">下级消费总计：</p>
          <div class="text">
            {{ fen2yuan(item.subordinateConsumptionAccumulation) }}
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="cell">
          <p class="title">领取新人红包：</p>
          <div class="text">
            {{ item.newcomerRedPaper ? "已领取" : "未领取" }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cell"></div>
      </el-col>
      <el-col :span="6">
        <div class="cell"></div>
      </el-col>
      <el-col :span="6">
        <div class="cell"></div>
      </el-col>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm()">更新</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { ref, reactive, toRefs, defineComponent, onMounted } from "vue";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";

import { MemberMangerControllerGetMemberDetail } from "@/api/MemberMangerControllerApi";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";

class Data {
  constructor() {
    this.title = '会员信息';
    this.dialogFormVisible = false;
    this.formShow = false;
    this.dictionaryData = [];
  }
  title: String;
  dialogFormVisible: Boolean;
  avatarImageUrl?: String;
  formShow?: Boolean;
  item: any;
  dictionaryData: any [];
}

export default defineComponent({
  emits: ["Refresh"],
  setup(props, { emit }) {
    const state = reactive(new Data());
    const open = (items: any) => {
      state.formShow = true;
      if (items) {
        console.log("编辑11", items);
        state.item = items;
        getDetails(items.UUID);
      }
      state.dialogFormVisible = true;
    };

    // 右上角关闭
    const closeForm = () => {
      state.avatarImageUrl = "";
      state.formShow = false;
      state.dialogFormVisible = false;
    };

    const submitForm = () => { };

    const getArticleDictionary = async (dicCode: string) => {
      try {
        let result = await DataDictionaryControllerGetListByDicClass(dicCode);
        let data = result.data;
        if (data.status === 1) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = data.data.map((item: any) => {
            return { name: item.dicName, value: item.dicCode };
          });
          state.dictionaryData = result;
        }
      } catch (err) {
        return;
      }
    };
    getArticleDictionary("DC0008");
    // 根据字典值返回分类名称
    const articleClass = (articleClass: string) => {
      let title;
      state.dictionaryData.forEach((item: any) => {
        if (item.value === articleClass) title = item.name;
      });
      return title;
    };
    // 根据分转元
    const fen2yuan = (num: number | string) => {
      if (typeof num !== "number" || isNaN(num)) return null;
      return (num / 100).toFixed(2);
    };

    // 获取详情 后面对接该接口
    const getDetails = async (uuid: string) => {
      try {
        let result = await MemberMangerControllerGetMemberDetail(uuid);
        let data = result.data;
        if (data.status === 1) {
          console.log("会员详情", data);
        }
      } catch (err) {
        return;
      }
    };
    return {
      ...toRefs(state),
      articleClass,
      fen2yuan,
      Delete,
      Download,
      Plus,
      ZoomIn,
      open,
      closeForm,
      submitForm,
    };
  },
});
</script>
<style lang="scss" scoped>
.cell {
  display: flex;
  align-items: center;
  height: 45px;

  .img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
    }
  }
}
</style>