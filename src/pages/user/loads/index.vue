<template>
  <f7-page name="vehicle_load">
    <f7-navbar back-link="Back" title="Listado de cargues"> </f7-navbar>
    <f7-card :style="{ padding: '10px' }">
      <f7-card-header class="no-padding">
        <f7-list class="width-100">
          <f7-list-item
            class="width-100 flex justify-content-space-between"
            group-title
          >
            <div>
              {{ capitalize(info?.key_point?.ticket_office?.descrip_agc) }}
            </div>
            <div>
              <f7-link popover-open=".popover-actios">
                <f7-icon size="18" f7="ellipsis_vertical"></f7-icon>
              </f7-link>
            </div>
          </f7-list-item>
        </f7-list>
      </f7-card-header>

      <f7-list>
        <f7-list-item>
          <span>Solo cargues abiertos</span>
          <f7-toggle v-model:checked="form.loads"></f7-toggle>
        </f7-list-item>

        <f7-list-item-row no-gap>
          <f7-row
            no-gap
            :style="{ width: '100%' }"
            class="display-flex justify-content-end"
          >
            <f7-col width="100">
              <f7-list-input
                label="Fecha"
                type="date"
                outline
                floating-label
                v-model:value="form.date"
              >
              </f7-list-input>
            </f7-col>
          </f7-row>
        </f7-list-item-row>

        <f7-list-item>
          <f7-button
            color=""
            class="width-100"
            large
            outline
            @click="get_loads(true)"
            >Consultar</f7-button
          >
        </f7-list-item>
      </f7-list>
    </f7-card>

    <Add
      :estado="modalAdd"
      :info="info"
      :vehicles="vehicles"
      :customers="customers"
      :embargoes="embargoes"
      :schedules="schedules"
      @closed="modalAdd = false"
    >
    </Add>

    <List
      :estado="modalList"
      :list="loads_data || []"
      @closed="modalList = false"
    >
    </List>

    <f7-popover class="popover-actios">
      <f7-list>
        <f7-list-item
          link="#"
          popover-close
          title="Listado"
          @click="modalList = true"
        ></f7-list-item>
        <f7-list-item
          link="#"
          popover-close
          title="Agregar cargue"
          @click="modalAdd = true"
        ></f7-list-item>
      </f7-list>
    </f7-popover>
  </f7-page>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { current_date, capitalize, loader } from "../../../js/utils/plugins";
import { computed, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";

import Add from "../../../components/loads/add.vue";
import List from "../../../components/loads/list.vue";

import _ from "lodash";
export default {
  components: { Add, List },
  setup() {
    const store = useStore();
    const modalAdd = ref(false);
    const modalList = ref(false);

    const form = reactive({
      date: current_date().split("/").reverse().join("-"),
      loads: false,
    });

    const info = store.getters["middleware/get_info"];
    const loads_data = computed(() => store.getters["loads/get_list"]);
    const vehicles = computed(() => store.getters["vehicles/get_list"]);
    const customers = computed(() => store.getters["customers/get_list"]);
    const embargoes = computed(() => store.getters["embargoes/get_list"]);
    const schedules = computed(() => store.getters["schedules/get_list"]);

    onMounted(async () => {
      get_loads();

      await store.dispatch("vehicles/query_data");
      await store.dispatch("customers/query_data");
      await store.dispatch("embargoes/query_data");
      await store.dispatch("schedules/query_data");
    });

    const get_loads = async (openModal = false) => {
      let date = form.date.replaceAll("-", "");
      let alone = form.loads ? 1 : 0;

      loader(true);
      await store.dispatch("loads/query_data", `${date}|${alone}|`);

      setTimeout(() => {
        loader(false);
        modalList.value = true;
      }, 750);
    };

    return {
      form,
      info,
      loads_data,
      vehicles,
      customers,
      embargoes,
      schedules,
      modalAdd,
      modalList,
      get_loads,
      capitalize,
    };
  },
};
</script>

<style lang="sass">
[data-name=vehicle_load]
  .accordion-item .item-title
    font-size: 16px
    font-weight: 450 !important

  .item-after
    font-weight: 450 !important

  .accordion-item-content .item-content
    font-size: 14px

    b
      font-weight: 450 !important
</style>