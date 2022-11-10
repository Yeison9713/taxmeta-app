<template>
  <f7-page name="user" :style="{ height: f7.height }">
    <Navbar></Navbar>
    <Nav></Nav>
    <div class="list-cargues">
      <div
        :style="{
          backgroundImage: `url(${transport})`,
          backgroundSize: '95% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          width: '100%',
          height: '100%',
        }"
      ></div>
    </div>
  </f7-page>
</template>

<script>
import Navbar from "../../components/user/navbar.vue";
import Nav from "../../components/user/nav.vue";

import transport from "../../assets/boton_transporte.png";
import { f7 } from "framework7-vue";

export default {
  name: "index_user",
  components: {
    Navbar,
    Nav,
  },
  setup() {
    return {
      f7,
      transport,
    };
  },
};
</script>

<style lang="sass">
[data-name=user] .page-content
  background: rgb(204 204 204 / 13%)
  padding: 0

  .list-cargues
    display: flex
    justify-content: center
    align-items: center
    height: 80vh
</style>