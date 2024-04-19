<script>
import { weChatLogin, weChatLoginRefresh } from "@/utils/authTools.js";
import { saveToken, getToken, tokenIsOk } from "@/utils/authToken.js";
import { connect } from "@/utils/ws.js";

export default {
  onLaunch: async function () {
    // #ifdef MP-WEIXIN
    await weChatLogin();
    uni.hideLoading();
    // #endif
    this.setAuthState();
    connect();
  },
  onShow: async function () {
    await this.CheckUserPort();
  },
  onHide: async function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>
