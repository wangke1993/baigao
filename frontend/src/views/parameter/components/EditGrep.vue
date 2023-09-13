<template>
  <el-dialog :title="title" v-model="visible" @close="close">
    <el-form :model="form">
      <el-form-item label="分组名称">
        <el-input v-model="form.name" placeholder="分组名称"></el-input>
      </el-form-item>
      <el-form-item label="分组说明">
        <el-input v-model="form.description" placeholder="分组说明"></el-input>
      </el-form-item>
      <el-form-item label="分组排序">
        <el-input-number
          v-model="form.sortAsc"
          placeholder="分组排序"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div>
      <div>
        <span>链接配置</span>
        <el-button class="add-btn" @click="addLink" type="primary"
          >添加</el-button
        >
      </div>
      <el-table :data="form.linkArr">
        <el-table-column label="名称" prop="linkName">
          <template #default="scope">
            <el-input
              v-model="scope.row.linkName"
              placeholder="名称"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="URL" prop="linkUrl">
          <template #default="scope">
            <el-input v-model="scope.row.linkUrl" placeholder="URL"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" @click="deleteLink(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ConfigGroup, GroupLink, SystemConfigPage } from "../SystemConfigPage";
import { alertWarning } from "@/utils/message";
/**
 * 保存编辑页面配置
 */
const form = ref(new ConfigGroup());
const visible = ref(false);
const title = ref("新增配置组");
const isEdit = ref(true);
let GroupList: ConfigGroup[] = [];
const open = (groupList: ConfigGroup[], group: ConfigGroup) => {
  visible.value = true;
  GroupList = groupList;
  if (group) {
    form.value = group;
    title.value = "编辑配置组";
    isEdit.value = true;
  } else {
    title.value = "新增配置组";
    form.value.sortAsc = 0;
    isEdit.value = false;
  }
};
const close = () => {
  form.value = new ConfigGroup();
  GroupList = [];
};
const save = () => {
  if (!isEdit.value) {
    if (!form.value.configItem) {
      form.value.configItem = [];
    }
    if (GroupList.filter((item) => item.name == form.value.name).length) {
      alertWarning("名称重复，请重新输入");
      return;
    }
    GroupList.push({ ...form.value });
  }
  GroupList.sort((a, b) => a.sortAsc - b.sortAsc);
  visible.value = false;
};
const addLink = () => {
  if (!form.value.linkArr) {
    form.value.linkArr = [];
  }
  form.value.linkArr.push(new GroupLink());
};
const deleteLink = (index: number) => {
  form.value.linkArr?.splice(index, 1);
};
defineExpose({ open });
</script>
<style lang="scss">
.add-btn {
  margin-left: 10px;
}
</style>
