<template>
  <div class="navbar">
    <el-icon class="open-off-menu" @click="openOffMenu">
      <Expand />
    </el-icon>
    <el-breadcrumb class="nav-path">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(v, i) in permissionStore.menuDeep[route.path]"
        :key="i"
        >{{ v }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="nav-right">
      <div class="company-name">
        {{ userInfo.companyName }}
      </div>
      <el-autocomplete
        v-model="searchKey"
        @select="handleSelect"
        :fetch-suggestions="querySearch"
        clearable
        class="inline-input w-50"
        placeholder="功能搜索"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <search />
          </el-icon>
        </template>
      </el-autocomplete>
      <div class="user-avatar">
        <el-avatar src="/user-avatar.png" />
        {{ userInfo.userName }}
        <el-icon class="user-menu-down">
          <CaretBottom />
        </el-icon>
        <ul class="user-menu">
          <!-- <li>个人中心</li>
          <li>重置密码</li> -->
          <li v-if="isDev" @click="toDev">开发工具</li>
          <li @click="editUserInfo">个人信息</li>
          <li @click="updatePassword">修改密码</li>
          <li @click="loginOut">退出登录</li>
        </ul>
      </div>
    </div>
    <EditUserInfo
      :accountOwnership="userInfo.accountOwnership"
      :remarksPrefix="remarksPrefix"
      :editPersonalInformation="true"
      ref="editUserRef"
    />
    <EditUserPassword ref="editUserPasswordRef" />
  </div>
</template>

<script lang="ts" setup>
import { useTabsStore } from "@/stores/tabs";
import { usePermissionStore } from "@/stores/permission";
import { deleteToken, getUserInfoByToken } from "@/utils/authTokenUtil";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import EditUserInfo from "@/views/adminUser/components/EditUserInfo.vue";
import EditUserPassword from "@/views/adminUser/components/EditUserPassword.vue";

const router = useRouter();
const route = useRoute();
const userInfo = getUserInfoByToken();
console.log("用户信息", userInfo);
const remarksPrefix = ref("");
const remarksArr = userInfo.remarks.split("-");
if (remarksArr.length > 1) {
  remarksPrefix.value = remarksArr[0];
}
const emit = defineEmits(["openOffMenu"]);
const openOffMenu = () => {
  emit("openOffMenu");
};
const tabsStore = useTabsStore();
const permissionStore = usePermissionStore();
const searchKey = ref("");
const loginOut = () => {
  deleteToken();
  tabsStore.clean();
  permissionStore.clean();
  router.replace("/login");
};
const editUserRef = ref();
const editUserInfo = () => {
  editUserRef.value.open(userInfo, false);
};
const editUserPasswordRef = ref();
const updatePassword = async () => {
  editUserPasswordRef.value.open(userInfo, false);
};
const isDev = ref(window.location.hostname == "localhost");
const toDev = () => {
  router.push("/dev/autoCode");
};
const querySearch = (queryString: string, cb: any) => {
  const arr: any[] = permissionStore.menuList;
  const results = arr.filter(
    (m) => m.value.indexOf(queryString) >= 0 && m.isShow === "1"
  );
  cb(results);
};
const handleSelect = (item: any) => {
  router.push(item.menuActive);
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);

  .open-off-menu {
    height: 100%;
    float: left;
    cursor: pointer;
    font-size: 25px;
    padding: 0 10px;
    transform: rotate(180deg);
  }

  .nav-path {
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;
    float: left;
  }

  .nav-right {
    height: 100%;
    margin-right: 30px;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    .company-name {
      margin-right: 18px;
      font-size: 18px;
      font-weight: 700;
    }
  }

  .user-avatar {
    margin-left: 40px;
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;

    .user-menu-down {
      margin-left: 8px;
    }

    .user-menu {
      width: 88px;
      position: fixed;
      background: #fff;
      top: 50px;
      right: 25px;
      z-index: 999;
      box-shadow: 0 0 5px #ccc;
      text-align: center;
      padding: 6px 0;
      color: #333;
      display: none;
      font-size: 14px;

      li {
        padding: 6px 0;
      }

      li:hover {
        background-color: #47a0fa;
        color: #fff;
      }

      li:last-child {
        border-top: 1px solid #ddd;
      }
    }
  }

  .user-avatar:hover {
    .user-menu {
      display: block;
      z-index: 9999;
    }
  }
}

.hideSidebar {
  .open-off-menu {
    transform: rotate(0deg);
  }
}

.open-off-menu {
  transition: 0.8s;
}
</style>
