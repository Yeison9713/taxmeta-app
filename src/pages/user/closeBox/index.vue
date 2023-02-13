<template>
  <f7-page name="close_box">
    <f7-navbar back-link="Back" title="Cierre de caja"> </f7-navbar>

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
              <f7-link>
                <f7-icon size="18" f7="ellipsis_vertical"></f7-icon>
              </f7-link>
            </div>
          </f7-list-item>
        </f7-list>
      </f7-card-header>

      <f7-list>
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

        <f7-list-input
          label="Operador"
          type="text"
          outline
          floating-label
          :disabled="true"
          v-model:value="form.operator"
        >
        </f7-list-input>

        <f7-list-input
          label="Turno"
          type="text"
          outline
          floating-label
          :disabled="true"
          v-model:value="form.turn"
        >
        </f7-list-input>

        <f7-list-item>
          <f7-button
            color=""
            class="width-100"
            large
            outline
            @click="query_data"
            >Consultar</f7-button
          >
        </f7-list-item>
      </f7-list>
    </f7-card>
    <popup_close_box
      :estado="modal.estado"
      :params="modal.form"
      :consecutive="form.consecutive"
      :date="form.date"
      @closed="modal.estado = false"
    ></popup_close_box>
  </f7-page>
</template>

<script>
import _ from "lodash";

import { reactive, ref } from "@vue/reactivity";
import {
  current_date,
  capitalize,
  loader,
  toast,
} from "../../../js/utils/plugins";
import { useStore } from "vuex";

import popup_close_box from "../../../components/closeBox/popup.vue";
import { onMounted } from "@vue/runtime-core";

export default {
  components: {
    popup_close_box,
  },
  setup() {
    const store = useStore();
    const info = store.getters["middleware/get_info"];

    const modal = reactive({
      estado: false,
      form: {
        content: {},
      },
    });

    onMounted(async () => {
      try {
      } catch (error) {
        console.log("Error get consecutive: ", error);
      }
    });

    const form = reactive({
      date: current_date().split("/").reverse().join("-"),
      operator: info?.user?.names || "",
      turn: info?.key_point?.turn?.id_rep || "",
      agencie: info?.key_point?.turn?.agencia_rep || "",
      consecutive: 0,
    });

    const query_data = async () => {
      try {
        loader(true);

        let { date, turn, agencie } = form;
        let date_end = date.split("-").join("");

        await store.dispatch(
          "closebox/square",
          `${date_end}|${turn}|${agencie}|0|`
        );

        await query_balance();
        await query_travels();
        await query_tickets();
        await query_ltravels();
        await query_vouchers();
        await get_consecutive();

        loader(false);
        modal.estado = true;
      } catch (error) {
        loader(false);
        console.log("Error save data", error);
        toast("Ocurrio un error en la consulta");
      }
    };

    const query_balance = async () => {
      try {
        let { date, agencie } = form;
        let date_end = date.split("-").join("");
        let account = "1105050190";

        const response = await store.dispatch(
          "closebox/balance_aux",
          `${date_end}|${account}|${agencie}|1|`
        );

        modal.form.content.balance_init = response.message[0]?.saldo || "";
      } catch (error) {
        console.log("Error query balance: ", error);
      }
    };

    const query_travels = async () => {
      try {
        let { date } = form;
        let date_end = date.split("-").join("");

        await store.dispatch("closebox/query_travels", `${date_end}|`);
      } catch (error) {
        console.log("Error query travels: ", error);
      }
    };

    const query_tickets = async () => {
      try {
        let { date, turn, agencie } = form;
        let date_end = date.split("-").join("");

        const response = await store.dispatch(
          "closebox/query_tickets",
          `${date_end}|${turn}|${agencie}|`
        );

        let tickets = JSON.parse(JSON.stringify(response.message))[0].msg.split(
          "-"
        );
        modal.form.content = {
          ...modal.form.content,
          tiqini_rep: tickets[0],
          tiqfin_rep: tickets[1],
          canttiq_rep: parseInt(tickets[2]),
        };
      } catch (error) {
        console.log("Error query tickets: ", error);
      }
    };

    const query_ltravels = async () => {
      try {
        let { date, agencie } = form;
        let date_end = date.split("-").join("");

        const response = await store.dispatch(
          "closebox/query_ltravels",
          `${date_end}|0|${agencie}|`
        );

        modal.form.content = {
          ...modal.form.content,
          ...JSON.parse(JSON.stringify(response.message[0])),
        };
      } catch (error) {
        console.log("Error query travels: ", error);
      }
    };

    const query_vouchers = async () => {
      try {
        let { date, agencie } = form;
        let date_end = date.split("-").join("");

        const response = await store.dispatch(
          "closebox/query_vouchers",
          `${date_end}|0|${agencie}|`
        );

        let data = response.message;

        modal.form.content = {
          ...modal.form.content,
          ...JSON.parse(JSON.stringify(data[0])),
        };

        let ventas = parseFloat(modal.form.content?.ventas_rep || 0);
        let seguro = parseFloat(modal.form.content?.seguro_rep || 0);
        let rpc = parseFloat(modal.form.content?.rpc_rep || 0);
        let egresos = parseFloat(modal.form.content?.egresos || 0);
        let avances = parseFloat(modal.form.content?.avances_rep || 0);
        let saldoini = parseFloat(modal.form.balance_init || 0);

        ventas = ventas + seguro;

        let totales =
          parseFloat(ventas) +
          parseFloat(rpc) -
          parseFloat(egresos) -
          parseFloat(avances) +
          parseFloat(saldoini);

          console.log(totales)
          console.log(avances)

        modal.form.content.totales = parseFloat(totales);
      } catch (error) {
        console.log("Error query vouchers: ", error);
      }
    };

    const get_consecutive = async () => {
      try {
        const response = await store.dispatch(
          "closebox/get_consecutive",
          form.agencie
        );

        form.consecutive = response.message[0].nro_cons.trim();
      } catch (error) {
        console.log("Error query consecutive: ", error);
      }
    };

    return {
      info,
      form,
      modal,
      capitalize,
      query_data,
    };
  },
};
</script>