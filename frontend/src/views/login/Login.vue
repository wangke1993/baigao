<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dowebok filter">
    <div class="container">
      <div class="title">
        <span>欢迎进入</span>
        <p class="x">/</p>
        <p class="t">柏高系统</p>
      </div>
      <div class="right">
        <div class="form">
          <label for="userName">用户名</label>
          <input type="text" maxlength="20" placeholder="请输入用户名" autocomplete="off" id="userName"
            v-model="loginForm.userName" @keyup.enter="login" />
          <label for="password">密码</label>
          <input type="password" maxlength="20" placeholder="请输入密码" id="password" v-model="loginForm.password"
            @keyup.enter="login" />
          <input type="submit" class="submit" @click="login" :value="loginActive ? '登录中...' : '登录'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref } from "vue";
import { AuthControllerLogin } from "@/api/AuthControllerApi";
import { LoginFromDto } from "@/api/dto/LoginFromDto";
import { alertError, alertSuccess, alertWarning } from "@/utils/message";
import { INFO_STATUS } from "@/utils/enum/infoType";
import { saveToken } from "@/utils/authTokenUtil";
import { useRoute, useRouter } from "vue-router";
import { usePermissionStore } from "@/stores/permission";
import { useTabsStore } from "@/stores/tabs";

export default {
  setup() {
    const loginForm: LoginFromDto = reactive(new LoginFromDto());
    // 测试环境使用，正式环境删除
    // loginForm.password = '123456';
    // loginForm.userName = 'kmol';
    const loginActive = ref(false);
    const router = useRouter();
    const route = useRoute();
    const permissionStore = usePermissionStore();
    const tabsStore = useTabsStore();
    const login = async () => {
      if (!loginActive.value) {
        if (!loginForm.userName) {
          document.getElementById("userName")?.focus();
          alertWarning("请输入用户名");
          return;
        }
        if (!loginForm.password) {
          document.getElementById("password")?.focus();
          alertWarning("请输入密码");
          return;
        }
        loginActive.value = true;
        try {
          const { data } = await AuthControllerLogin(loginForm);
          if (data.status === INFO_STATUS.success) {
            alertSuccess("登录成功");
            saveToken(data.data);
            tabsStore.Init();
            //跳转首页
            if (route.query.redirect) {
              router.push(route.query.redirect as string);
            } else {
              router.push(tabsStore.userIndex.url);
            }
          } else {
            alertWarning(`登录失败：${data.data}`);
          }
        } catch (error: any) {
          alertError(error.message);
        }
        loginActive.value = false;
      }
    };
    const canvasSize = {
      WIDTH: document.documentElement.clientWidth,
      HEIGHT: document.documentElement.clientHeight,
    };
    onMounted(() => {
      // mouseEffect();
    });
    return {
      login,
      canvasSize,
      loginForm,
      loginActive,
    };
  },
};
</script>

<style>
::-moz-selection {
  background: #2d2f36;
}

::selection {
  background: #2d2f36;
}

::-webkit-selection {
  background: #2d2f36;
}

::-moz-selection {
  background: #2d2f36;
}

html,
body {
  height: 100%;
  width: 100%;
}

body {
  /*background: white;*/
  font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
}

.filter {
  width: 100%;
  height: 100%;
  background: url(./bj.jpg) no-repeat;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  mix-blend-mode: overlay;
}

.container {
  width: 330px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.container .title {
  padding: 20px 0;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
}

.container .title span {
  color: #2589ff;
  font-weight: bold;
  font-size: 24px;
  font-style: oblique;
  letter-spacing: 7px;
  margin-left: 3px;
}

.container .title p.x {
  margin-right: 12px;
  margin-left: 4px;
  color: #adacb8;
}

.container .title p.t {
  color: #000;
  letter-spacing: 1px;
}

.container .right {
  background: #fff;
  padding: 35px 0;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.12);
  box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.12);
}

.container .right .form {
  width: 85%;
  margin: 0 auto;
}

.login {
  font-size: 50px;
  font-weight: 900;
  margin: 50px 40px 40px;
}

label {
  color: #606060;
  height: 16px;
  font-size: 14px;
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input {
  background: transparent;
  border: 0;
  color: #f2f2f2;
  font-size: 20px;
  height: 35px;
  line-height: 30px;
  outline: none !important;
  width: 100%;
}

.form input:nth-child(even) {
  font-size: 14px;
  color: #0a0a0a;
  margin-bottom: 30px;
  border-bottom: 1px solid #e3e3e3;
}

input::-moz-focus-inner {
  border: 0;
}

.submit {
  display: block;
  width: 1005;
  height: 40px;
  text-align: center;
  color: #fff;
  background: #2589ff;
  border-radius: 6px;
  font-size: 16px;
  border: 0;
  outline: 0;
}

.submit:focus {
  color: #f2f2f2;
}

.submit:active {
  color: #d0d0d2;
}
</style>
