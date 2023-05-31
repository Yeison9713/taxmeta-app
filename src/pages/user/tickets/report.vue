<template>
  <f7-page name="report_tickets">
    <f7-navbar back-link="Back" title="Reporte tiquetes"> </f7-navbar>

    <f7-card :style="{ padding: '10px' }">
      <f7-card-header class="no-padding">
        <f7-list class="width-100">
          <f7-list-item
            class="width-100 flex justify-content-space-between"
            group-title
          >
            {{ capitalize(info?.key_point?.ticket_office?.descrip_agc) }}
          </f7-list-item>
        </f7-list>
      </f7-card-header>

      <!--  -->
      <f7-list>
        <f7-list-item-row no-gap>
          <f7-row
            no-gap
            :style="{ width: '100%' }"
            class="display-flex justify-content-end"
          >
            <f7-col width="100">
              <f7-list-input
                label="Fecha inicial"
                type="date"
                outline
                floating-label
                v-model:value="form.start_date"
              >
              </f7-list-input>
            </f7-col>
          </f7-row>
        </f7-list-item-row>

        <f7-list-item-row no-gap>
          <f7-row
            no-gap
            :style="{ width: '100%' }"
            class="display-flex justify-content-end"
          >
            <f7-col width="100">
              <f7-list-input
                label="Fecha final"
                type="date"
                outline
                floating-label
                v-model:value="form.finish_date"
              >
              </f7-list-input>
            </f7-col>
          </f7-row>
        </f7-list-item-row>

        <f7-list-item-row>
          <f7-row no-gap :style="{ width: '100%' }">
            <f7-col width="80">
              <f7-list-input
                label="Placas"
                type="text"
                outline
                floating-label
                :value="`${form.vehicle?.nrointer_veh || ''} - ${
                  form.vehicle?.placa_veh || ''
                }`"
                disabled
              />
            </f7-col>
            <f7-col
              width="20"
              :style="{ height: '100%' }"
              class="display-flex align-items-center padding-right"
            >
              <f7-button
                fill
                color="green"
                :style="{ width: '100%', 'margin-top': '8px' }"
                @click="() => (modalLookUp.estado = true)"
              >
                <f7-icon f7="search" size="22"></f7-icon>
              </f7-button>
            </f7-col>
          </f7-row>
        </f7-list-item-row>
        <f7-list-item title="Forma de pago" smart-select>
          <select name="f_pago" v-model="form.payment_form">
            <option
              v-for="item in payment_forms"
              :key="item"
              :value="item.value"
            >
              {{ item.text }}
            </option>
          </select>
        </f7-list-item>
      </f7-list>
      <f7-card-footer class="width-100 no-padding">
        <f7-list class="width-100">
          <f7-list-item class="width-100">
            <f7-button class="width-100" large outline @click="query_data"
              >Consultar</f7-button
            >
          </f7-list-item>
        </f7-list>
      </f7-card-footer>
    </f7-card>

    <Lookup
      :estado="modalLookUp.estado"
      :params="modalLookUp.params"
      @closed="modalLookUp.estado = false"
      @callback="callback_lookup"
    ></Lookup>

    <ListTickets
      :estado="modalList.estado"
      :list="modalList.list"
      @close="modalList.estado = false"
    ></ListTickets>
  </f7-page>
</template>

<script>
import _ from "lodash";
import { useStore } from "vuex";
import { onMounted, computed } from "vue";
import { reactive } from "@vue/reactivity";
import Lookup from "../../../components/lookup.vue";
import { f_pagos } from "../../../components/tickets/index";
import ListTickets from "../../../components/tickets/list.vue";

import {
  current_date,
  capitalize,
  loader,
  toast,
} from "../../../js/utils/plugins";
export default {
  components: {
    Lookup,
    ListTickets,
  },
  setup() {
    const store = useStore();
    const info = store.getters["middleware/get_info"];

    const form = reactive({
      start_date: current_date().split("/").reverse().join("-"),
      finish_date: current_date().split("/").reverse().join("-"),
      vehicle: {},
      payment_form: null,
    });

    const modalLookUp = reactive({
      estado: false,
      params: {
        text: "Vehiculo",
        data: [],
        columns: { text: "placa_veh", value: "nrointer_veh" },
      },
    });

    const modalList = reactive({
      estado: false,
      list: [],
    });

    const vehicles = computed(() => store.getters["vehicles/get_list"]);

    onMounted(async () => {
      loader(true);
      await store.dispatch("vehicles/query_data");

      loader(false);

      modalLookUp.params.data = _.cloneDeep(vehicles);
      modalLookUp.params.data.unshift({
        placa_veh: "Todas las placas",
        nrointer_veh: 0,
      });
    });

    const callback_lookup = (data) => {
      form.vehicle = data;

      modalLookUp.estado = false;
    };

    const payment_forms = _.cloneDeep(f_pagos);

    payment_forms.unshift({
      value: 0,
      text: "Todas las formas",
    });

    const query_data = async () => {
      try {
        let start_date = form.start_date.replace(/\-/g, "");
        let finish_date = form.finish_date.replace(/\-/g, "");
        let placa = form.vehicle.placa_veh ?? "";
        let payment_form = form.payment_form ?? "";

        placa = placa == "Todas las placas" ? "0" : placa;

        if (placa === "") toast("Debe selecionar una placa");
        else if (payment_form === "")
          toast("Debe selecionar una forma de pago");
        else {
          loader(true);
          let data_send = `${start_date}|${finish_date}|${placa}|${payment_form}|`;

          let { message } = await store.dispatch(
            "travels/all_tickets_r",
            data_send
          );

          modalList.list = message.filter((e) => e.nro_tiq);
          modalList.estado = true;

          loader(false);
        }
      } catch (error) {
        loader(false);
        console.log("Error: ", error);
        toast("Error consultando datos");
      }
    };

    return {
      info,
      form,
      modalLookUp,
      vehicles,
      payment_forms,
      modalList,
      capitalize,
      callback_lookup,
      query_data,
    };
  },
};
</script>