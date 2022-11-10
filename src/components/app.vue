<template>
  <f7-app v-bind="f7params">
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script>
import { ref, onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";

import { getDevice } from "framework7/lite-bundle";
import capacitorApp from "../js/capacitor-app.js";
import routes from "../js/routes.js";
import store from "../js/store";

export default {
  setup() {
    const device = getDevice();
    const f7params = {
      name: "taxmeta-app",
      theme: "auto",

      id: "io.framework7.myapp",
      store: store,
      routes: routes,
      serviceWorker:
        process.env.NODE_ENV === "production"
          ? { path: "/service-worker.js" }
          : {},

      input: {
        scrollIntoViewOnFocus: device.capacitor,
        scrollIntoViewCentered: device.capacitor,
      },

      statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
      },
    };

    onMounted(() => {
      f7ready(() => {
        if (device.capacitor) {
          capacitorApp.init(f7);
        }
      });
    });

    return {
      f7params,
    };
  },
};
</script>