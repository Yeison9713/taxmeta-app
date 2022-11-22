<template>
  <f7-navbar class="header_nav">
    <f7-nav-title>
      <div>
        <div class="content_nav">
          <div class="logo">
            <div
              :style="{
                backgroundImage: `url(${logo})`,
                backgroundSize: '95% auto',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                width: '100%',
              }"
            ></div>
          </div>

          <div class="data_user">
            <div style="width: 100%">
              {{ capitalize(info?.user?.names, true) }}
            </div>
            <div style="width: 100%; font-weight: 400; font-size: 13px">
              {{ capitalize(info?.key_point?.ticket_office?.descrip_agc) }}
            </div>
          </div>
        </div>
      </div>
    </f7-nav-title>
    <f7-nav-right>
      <f7-link
        icon-ios="f7:menu"
        icon-aurora="f7:menu"
        icon-md="material:menu"
        sheet-open=".sheet-menu-list"
      ></f7-link>
    </f7-nav-right>
  </f7-navbar>
</template>

<script>
import { useStore } from "vuex";
import logo from "../../assets/logo.png";
import { capitalize } from "../../js/utils/plugins.js";

export default {
  name: "navbar",
  setup() {
    const store = useStore();
    const info = store.getters["middleware/get_info"];

    return { logo, info, capitalize };
  },
};
</script>

<style lang="sass">
.header_nav,
.content_nav,
.logo
  display: flex
  font-size: 16px
  font-weight: 600

.header_nav
  width: 100%
  align-items: center

.content_nav
  width: 100%

.header_nav .logo
  width: 110px
  justify-content: center

.data_user
  display: flex
  flex-wrap: wrap
  align-items: center
  width: 100%
  font-size: 14px
</style>