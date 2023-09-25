<template>
  <div class="list-box">
    <el-table :data="userListData" row-key="_id">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column label="头像">
        <template #default="scope">
          <div style="
              border-radius: 50%;
              overflow: hidden;
              width: 45px;
              height: 45px;
            ">
            <img style="width: 100%" :src="scope.row.avatar" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column label="电话号码" align="center">
        <template #default="scope">
          <span>{{ scope.row.phoneNumber ? scope.row.phoneNumber : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template #default="scope">
          <span>{{ articleClass(scope.row.rank) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" :width="200">
				<template #default="scope">
					{{ DateTime.fromISO(scope.row.addDate, { zone: 'utc+8' }).toFormat('yyyy-MM-dd HH:mm:ss') }}
				</template>
			</el-table-column>

      <!-- <el-table-column label="操作" width="430">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button v-if="btnShow('show-member')" type="primary" :icon="View" @click="addAdvertisement(scope.row)">查看
            </el-button>
          </el-button-group>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pagination-box">
      <el-pagination v-model:currentPage="prams.pageIndex" v-model:page-size="prams.pageSize" :page-sizes="pageSize"
        layout="total, sizes, prev, pager, next, jumper" background :total="total" @size-change="handleSizeChange"
        :hide-on-single-page="true" @current-change="handleCurrentChange" />
    </div>
    <Details ref="DetailsRef" />
  </div>
</template>
<script lang="ts">
import { ref, reactive, toRefs, defineComponent } from "vue";
import { View, Setting } from "@element-plus/icons-vue";
import { btnShow } from "@/utils/buttonShow";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
import { MemberMangerControllerGetMemberPage } from "@/api/MemberMangerControllerApi";
import Details from "@/views/member/components/details.vue";
import { DateTime } from 'luxon';
export default defineComponent({
  name: "distributor",
  components: { Details},
  setup() {
    const state = reactive({
      load: false,
      userListData: [],
      total: 0,
      dictionaryData: [],
    });
    const prams = ref({
      pageIndex: 1,
      pageSize: 10,
      keyWord: "",
      memberRank: "",
    })
    const pageSize = ref([10, 30, 50, 100]);
    const DetailsRef = ref();
    const SetLevelRef = ref();
    const SetParentRef = ref();
    const SetBalanceRef = ref();

    const addAdvertisement = (row: any) => {
      DetailsRef.value.open(row);
    };
    const setLevelFun = (row: any) => {
      SetLevelRef.value.open(row);
    };
    const setParentFun = (row: any) => {
      SetParentRef.value.open(row);
    };
    const setBalanceFun = (row: any) => {
      SetBalanceRef.value.open(row);
    };

    // 获取会员列表
    const getMemberMangerControllerGetMemberPage = async () => {
      try {
        let query: any = prams.value;
        let result = await MemberMangerControllerGetMemberPage(query);
        let data = result.data;
        if (data.status === 1) {
          // console.log("会员列表", data);
          state.userListData = data.data.list;
          state.total = data.data.total;
        }
      } catch (err) {
        return;
      }
    };
    getMemberMangerControllerGetMemberPage();
    const handleSizeChange = (pageSize: number) => {
      prams.value.pageSize = pageSize;
      getMemberMangerControllerGetMemberPage();
    }
    const handleCurrentChange = (pageIndex: number) => {
      prams.value.pageIndex = pageIndex;
      getMemberMangerControllerGetMemberPage();
    }
    // 获取文章分类字典
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
    const RefreshList = () => {
      getMemberMangerControllerGetMemberPage();
    };

    return {
      ...toRefs(state),
      prams,
      DetailsRef,
      View,
      Setting,
      btnShow,
      articleClass,
      RefreshList,
      addAdvertisement,
      setLevelFun,
      fen2yuan,
      SetLevelRef,
      SetParentRef,
      setParentFun,
      SetBalanceRef,
      setBalanceFun,
      pageSize,
      handleSizeChange,
      handleCurrentChange,
      DateTime
    };
  },
});
</script>
<script lang="ts">
export default {
  name: "member",
};
</script>
<style lang="scss">
.list-box {
  padding: 20px;
}

.pagination-box {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.top {
  display: flex;
  justify-content: space-between;
}
</style>