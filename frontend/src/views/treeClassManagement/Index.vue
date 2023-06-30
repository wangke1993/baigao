<template>
  <div class="content-box">
    <div class="top">
      <h4>数据类型</h4>
      <el-select @change="dataTypeChange" v-model="dataClass" placeholder="请选择类型">
        <el-option v-for="item in dataClassArr" :label="item.dicName" :value="item.dicCode"></el-option>
      </el-select>
    </div>
    <div class="bottom-btn">
      <el-button @click="create({ UUID: '0' })" type="primary">添加一级分类</el-button>
    </div>
    <div class="bottom">
      <div class="left">
        <el-input v-model="treeSearchKey" style="margin-bottom: 12px;" placeholder="请输入名称进行搜索"></el-input>
        <el-tree v-loading="loading" :props="{ label: 'name' }" :data="treeData" node-key="UUID" default-expand-all
          :expand-on-click-node="false">
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div @click="update(data)" class="tree-label">{{ node.label }}</div>
              <div class="tree-btn">
                <el-icon>
                  <Plus @click="create(data)" />
                </el-icon>
                <el-icon>
                  <Delete color="red" @click="del(data._id)" />
                </el-icon>
                <el-icon v-if="data.sort != 1">
                  <ArrowUp @click="move(data, '1')" />
                </el-icon>
                <el-icon v-if="data.sort < data.breathCount">
                  <ArrowDown @click="move(data, '-1')" />
                </el-icon>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
      <div class="right">
        <Detail ref="DetailFormRef" @getTree="getTree"></Detail>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "treeClassManagement",
};
</script>
<script lang="ts" setup>
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
import type { DataDictionaryDto } from "@/api/dto/DataDictionaryDto";
import { TreeClassificationControllerDelete, TreeClassificationControllerGetTree, TreeClassificationControllerMove } from "@/api/TreeClassificationControllerApi";
import { alertWarning } from "@/utils/message";
import { ref } from "vue";
import Detail from './components/Detail.vue'
// 数据定义
const treeData = ref(new Array<any>());
const dataClass = ref("DC00070001");
const dataClassArr = ref(new Array<DataDictionaryDto>());
const treeSearchKey = ref("");
const DetailFormRef = ref();
const loading = ref(false);

// 方法
const getDataClassArr = async () => {
  const { data: res } = await DataDictionaryControllerGetListByDicClass("DC0007");
  if (res.status == 1) {
    dataClassArr.value = res.data;
  }
}
getDataClassArr();
const getTree = async () => {
  loading.value = true;
  const { data: res } = await TreeClassificationControllerGetTree(dataClass.value, { keyWord: treeSearchKey.value });
  if (res.status == 1) {
    treeData.value = res.data;
  }
  loading.value = false;
}
getTree();
const dataTypeChange = (value: string) => {
  dataClass.value = value;
  DetailFormRef.value.close();
  getTree();
}
const create = (item?: any) => {
  let breathCount = 0;
  if (item.UUID == "0") {
    breathCount = treeData.value.length;
    item.dataClass = dataClass.value;
  } else {
    breathCount = item.children.length;
  }
  DetailFormRef.value.open(true, item, breathCount + 1);
};
const move = async (item: any, moveTag: String) => {
  const { data: res } = await TreeClassificationControllerMove(moveTag, item);
  if (res.status == 1) {
    await getTree();
  } else {
    alertWarning(res.message);
  }
}
const update = (item: any) => {
  DetailFormRef.value.open(false, item)
}
const del = async (id: String) => {
  const { data: res } = await TreeClassificationControllerDelete(id);
  if (res.status == 1) {
    await getTree();
  } else {
    alertWarning(res.message);
  }
}
</script>
<style lang="scss">
.content-box {
  .top {
    margin: 0 25px;
    padding-top: 25px;
    padding-bottom: 20px;
    border-bottom: #ddd 2px solid;
    padding-bottom: 10px;
    display: flex;
    line-height: 35px;

    h4 {
      margin-right: 10px;
    }
  }

  .bottom-btn {
    margin: 15px 25px;
  }

  .bottom {
    padding: 0 20px;
    display: flex;
    width: 100%;
    box-sizing: border-box;

    .left {
      width: 40%;

      .custom-tree-node {
        flex: 1;
        display: flex;
        // align-items: center;
        justify-content: space-between;
        font-size: 18px;
        padding-right: 8px;

        .el-icon {
          margin: 0 5px;
        }
      }
      .tree-label{
        width: 100%;
      }
    }

    .right {
      width: 60%;
    }
  }
}
</style>