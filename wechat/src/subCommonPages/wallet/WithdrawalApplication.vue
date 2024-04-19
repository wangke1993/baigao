<template>
  <div class="box">
    <TabList
      ref="tabListRef"
      listBoxBgColor="#fff"
      :tabList="tabList"
      @queryList="queryList"
    >
      <template #list="{ list }">
        <WithdrawalApplicationItem
          :key="index"
          :data="item"
          v-for="(item, index) in list"
        />
      </template>
    </TabList>
  </div>
</template>
<script>
import TabList from "components/TabList.vue";
import WithdrawalApplicationItem from "./components/WithdrawalApplicationItem.vue";
import { WithdrawalManagementControllerGetPageByWeChat } from "api/WithdrawalManagementControllerApi.js";
export default {
  components: {
    TabList,
    WithdrawalApplicationItem,
  },
  onLoad(query) {
    const { UUID } = query;
    this.UUID = UUID;
  },
  data() {
    return {
      UUID: "",
      tabList: [
        {
          name: "全部",
          id: "",
        },
        {
          name: "待审核",
          id: "0",
        },
        {
          name: "被拒绝",
          id: "2",
        },
        {
          name: "已通过",
          id: "1",
        },
      ],
    };
  },
  methods: {
    async queryList(page) {
      const {
        pageNo: pageIndex,
        pageSize,
        target: { id: targetId },
      } = page;
      console.log({ pageIndex, pageSize });
      const {
        data: { status, data, message },
      } = await WithdrawalManagementControllerGetPageByWeChat(this.userPort, {
        pageIndex,
        pageSize,
        status: targetId,
      });
      if (status === 1) {
        this.$refs.tabListRef.queryRes(data.list);
      } else {
        this.alertInfo(message);
        this.$refs.tabListRef.queryRes([]);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
}
</style>
