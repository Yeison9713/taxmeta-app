<template>
  <f7-page class="bg-ts">
    <f7-navbar theme-dark>
      <f7-nav-left>
        <f7-link :style="{ color: '#FFF' }" icon-f7="arrow_left" back></f7-link>
      </f7-nav-left>

      <f7-nav-title>
        <f7-icon
          size="22"
          f7="person_circle"
          class="margin-right-half"
        ></f7-icon>
        Perfil
      </f7-nav-title>
    </f7-navbar>

    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-card-content class="padding-half">
        <f7-list>
          <!-- <f7-list-item title="compañia" group-title /> -->

          <f7-list-input
            label="Compañia"
            type="text"
            required
            v-model:value="info.company"
            :disabled="true"
          ></f7-list-input>

          <!-- <f7-list-item title="Taquilla" group-title /> -->

          <f7-list-input
            label="Taquilla"
            type="text"
            required
            v-model:value="info.key_point.ticket_office.descrip_agc"
            :disabled="true"
          ></f7-list-input>

          <f7-list-input
            label="Turno"
            type="text"
            required
            v-model:value="info.key_point.turn.descrip_rep"
            :disabled="true"
          ></f7-list-input>
        </f7-list>
      </f7-card-content>
    </f7-card>
  </f7-page>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
export default {
  setup() {
    const store = useStore();
    const info = store.getters["middleware/get_info"];
    // const info = ref({});
    console.log(info);

    return { info };
  },
};
</script>
