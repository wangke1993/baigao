<template>
  <div class="box">
    <TabList
      ref="tabListRef"
      listBoxBgColor="#fff"
      :tabList="tabList"
      @queryList="queryList"
    >
      <template #list="{ list }">
        <WalletDetailsItem
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
import WalletDetailsItem from "./components/WalletDetailsItem.vue";
import { WalletLogControllerGetPage } from "api/WalletLogControllerApi.js";
export default {
  components: {
    TabList,
    WalletDetailsItem,
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
          name: "收入",
          id: "1",
        },
        {
          name: "支出",
          id: "-1",
        },
      ],
    };
  },
  methods: {
    async queryList(page) {
      const {
        pageNo: pageIndex,
        pageSize,
        target: { id: moneyFlow },
      } = page;
      console.log({ pageIndex, pageSize });
      const {
        data: { status, data, message },
      } = await WalletLogControllerGetPage({
        pageIndex,
        pageSize,
        walletUUID: this.UUID,
        logType: moneyFlow,
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
