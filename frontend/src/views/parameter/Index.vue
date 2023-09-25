<template>
  <div>
    <el-button
      v-if="isDev"
      type="primary"
      class="add-group-btn"
      @click="openEditGrep(null)"
      >新增配置组</el-button
    >
    <el-switch v-if="isDev" v-model="isDev"></el-switch>
    <div class="list-box">
      <div
        class="cell"
        v-for="(groupItem, index) in ConfigPage.group"
        :key="groupItem.name"
      >
        <div class="update">
          <span class="title">{{ groupItem.name }}</span>
          <el-button
            v-loading="ConfigSaveLoading[groupItem.name]"
            type="primary"
            @click="save(groupItem.name)"
            >保存</el-button
          >
          <span class="link">
            <a
              v-for="link in groupItem.linkArr"
              :key="link.linkName"
              :href="link.linkUrl"
              target="_blank"
              >{{ link.linkName }}</a
            >
          </span>
          <span v-if="isDev">
            <el-button
              type="text"
              @click="openEditGrepItem(groupItem.configItem, null)"
              >新增配置项</el-button
            >
            <el-button type="text" @click="openEditGrep(groupItem)"
              >编辑</el-button
            >
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除吗？"
              @confirm="delGroup(index)"
            >
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </span>
          <div class="description" v-if="groupItem.description">
            说明： {{ groupItem.description }}
          </div>
        </div>
        <div class="payment">
          <el-form
            v-if="groupItem.configItem?.length"
            label-width="120px"
            :inline="false"
            style="max-width: 688px"
          >
            <FormItem
              v-for="(configItem, cIndex) in groupItem.configItem"
              :key="configItem.confSelect"
              :configGroupItem="configItem"
              :defaultValue="configItem.defaultValue"
              :groupName="groupItem.name"
              :resData="
                configItem.confSelect
                  ? ConfigResValueList[configItem.confSelect]
                  : null
              "
              @change="formItemChange"
            >
              <template #default>
                <span v-if="isDev">
                  <el-button
                    type="text"
                    @click="copyString(configItem.confSelect)"
                    >{{ configItem.confSelect }} 复制</el-button
                  >
                  <el-button
                    type="text"
                    @click="openEditGrepItem(groupItem.configItem, configItem)"
                    >编辑</el-button
                  >
                  <el-popconfirm
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    confirm-button-type="danger"
                    title="确定删除吗？"
                    @confirm="delConfigItem(groupItem.configItem, cIndex)"
                  >
                    <template #reference>
                      <el-button type="text">删除</el-button>
                    </template>
                  </el-popconfirm>
                </span>
              </template>
            </FormItem>
          </el-form>
          <div v-else>
            <el-button
              type="text"
              @click="openEditGrepItem(groupItem.configItem, null)"
              >新增配置项</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <EditGrep ref="EditGrepRef"></EditGrep>
    <EditGrepItem ref="EditGrepItemRef"></EditGrepItem>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { ConfigGroupItem, SystemConfigPage } from "./SystemConfigPage";
import EditGrep from "./components/EditGrep.vue";
import EditGrepItem from "./components/EditGrepItem.vue";
import FormItem from "./components/FormItem.vue";
import { alertSuccess, alertWarning } from "@/utils/message";
import { copyString } from "@/utils/tools";
import {
  SystemConfigControllerDelete,
  SystemConfigControllerGetAll,
  SystemConfigControllerGetSystemPageConfig,
  SystemConfigControllerUpdate,
  SystemConfigControllerUpdateSystemPageConfig,
} from "@/api/SystemConfigControllerApi";
import type { SystemConfigDto } from "@/api/dto/SystemConfigDto";
const ConfigPage = ref(new SystemConfigPage());
const isDev = ref(window.location.hostname == "localhost");
// isDev.value = false;
const EditGrepRef = ref();
const ConfigValueList = ref({} as any);
const ConfigResValueList = ref({} as any);
const ConfigSaveLoading = ref({} as any);
const formItemChange = (
  groupName: string,
  configGroupItem: ConfigGroupItem,
  value: string
) => {
  if (configGroupItem.confSelect && ConfigValueList.value[groupName]) {
    ConfigValueList.value[groupName][configGroupItem.confSelect] = value;
  }
};
const save = async (groupName?: string) => {
  if (groupName) {
    console.log(ConfigValueList.value[groupName]);
    ConfigSaveLoading.value[groupName] = true;
    const axiosArr = [];
    for (const dicCode in ConfigValueList.value[groupName]) {
      axiosArr.push(
        SystemConfigControllerUpdate(dicCode, {
          confValue: ConfigValueList.value[groupName][dicCode],
        })
      );
    }
    await Promise.all(axiosArr);
    ConfigSaveLoading.value[groupName] = false;
    alertSuccess("保存成功");
  }
};
const openEditGrep = (groupItem: any) => {
  EditGrepRef.value.open(ConfigPage.value.group, groupItem);
};

const EditGrepItemRef = ref();
const openEditGrepItem = (
  groupItemList: ConfigGroupItem[] | any,
  configItem: ConfigGroupItem | any
) => {
  EditGrepItemRef.value.open(groupItemList, configItem);
};
const delGroup = (index: number) => {
  const group = ConfigPage.value.group;
  if (group) {
    if (!group[index].configItem?.length) {
      group.splice(index, 1);
    } else {
      alertWarning("请先删除所有配置项");
    }
  }
};
const delConfigItem = async (
  configGroupItem: ConfigGroupItem[] | any,
  index: number
) => {
  const {
    data: { status, message },
  } = await SystemConfigControllerDelete(configGroupItem[index].confSelect);
  if (status == 1) {
    configGroupItem.splice(index, 1);
    alertSuccess("删除成功");
  } else {
    alertWarning(message);
  }
};
let oldConfigPage = "";
watchEffect(async () => {
  if (
    ConfigPage.value.group &&
    oldConfigPage != JSON.stringify(ConfigPage.value)
  ) {
    //保存变更到服务器
    const {
      data: { status, message },
    } = await SystemConfigControllerUpdateSystemPageConfig({
      confValue: JSON.stringify(ConfigPage.value),
    });
    if (status != 1) {
      alertWarning(message);
    } else {
      oldConfigPage = JSON.stringify(ConfigPage.value);
      paramInit();
    }
  }
});
const paramInit = () => {
  ConfigPage.value.group.forEach((item) => {
    if (item.name && !ConfigValueList.value[`${item.name}`]) {
      ConfigValueList.value[`${item.name}`] = {};
      /**
       * ConfigValueList示例
       * {
       *  xxx配置:{DC00010001:true}
       * }
       */
    }
    if (item.name && !ConfigSaveLoading.value[`${item.name}`]) {
      ConfigSaveLoading.value[`${item.name}`] = false;
      /**
       * ConfigSaveLoading示例
       * {
       *  xxx配置:false
       * }
       */
    }
  });
};
onMounted(async () => {
  // const ConfigPageString = window.localStorage.getItem("ConfigPage");
  // 从服务器获取页面数据
  const {
    data: { status, data, message },
  } = await SystemConfigControllerGetSystemPageConfig();
  if (status == 1) {
    const ConfigPageString = data;
    oldConfigPage = data;
    if (ConfigPageString) {
      ConfigPage.value = JSON.parse(ConfigPageString);
    }
    if (!ConfigPage.value.group) {
      ConfigPage.value.group = [];
    }
    paramInit();
    const {
      data: { status, data: resData, message },
    } = await SystemConfigControllerGetAll();
    if (status == 1) {
      resData.forEach((item: SystemConfigDto) => {
        if (item.confSelect) {
          ConfigResValueList.value[item.confSelect] = item;
          /**
           * ConfigResValueList示例
           * {
           *  DC00010001:{}
           * }
           */
        }
      });
    } else {
      alertWarning(message);
    }
  } else {
    alertWarning(message);
  }
});
/**
 * 保存编辑页面配置
 */
</script>

<script lang="ts">
export default {
  name: "parameter",
};
</script>
<style lang="scss">
.list-box {
  padding: 20px;

  .cell {
    .update {
      border-bottom: 1px solid #ababab;
      padding-bottom: 10px;

      span.title {
        color: #222;
        font-size: 16px;
        font-weight: bold;
        margin-right: 20px;
      }
      .link {
        margin-left: 10px;
        font-size: 12px;
        margin-right: 20px;
        a {
          margin-left: 10px;
        }
      }
    }
    .description {
      color: #888;
      font-size: 13x;
      margin: 8px 0;
      margin-bottom: 0;
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
.add-group-btn {
  margin: 10px;
}
</style>
