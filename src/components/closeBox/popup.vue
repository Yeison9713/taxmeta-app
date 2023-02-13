<template>
  <f7-popup v-model:opened="estado" @popup:opened="open" @popup:closed="closed">
    <f7-view>
      <f7-page>
        <f7-navbar title="Cierre de caja">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <!-- <f7-card-header class="no-padding">
            <f7-list class="width-100">
              <f7-list-item group-title> Cierre de caja </f7-list-item>
            </f7-list>
          </f7-card-header> -->

          <f7-card-content :padding="false">
            <f7-list>
              <f7-list-input
                label="Fecha"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.content.fecha_cua"
              >
              </f7-list-input>

              <f7-list-input
                label="Turno"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.content.turno_cua"
              >
              </f7-list-input>
              <f7-list-input
                label="Despachador"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.content.iddespacha_cua"
              >
              </f7-list-input>
              <f7-list-input
                label="Tiquete inicial"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.content.tiqini_rep"
              >
              </f7-list-input>
              <f7-list-input
                label="RPC inicial"
                type="text"
                outline
                floating-label
                :disabled="true"
                value="0"
              >
              </f7-list-input>

              <f7-list-input
                label="Tiquete final"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.content.tiqfin_rep"
              >
              </f7-list-input>
              <f7-list-input
                label="RPC final"
                type="text"
                outline
                floating-label
                :disabled="true"
                value="0"
              >
              </f7-list-input>

              <f7-list-input
                label="Total tiquetes"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.content.canttiq_rep"
              >
              </f7-list-input>

              <f7-list-item group-title>
                Ingreso intermunicipales
              </f7-list-item>

              <f7-list-input
                label="Saldo inicial"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.balance_init)}`"
              >
              </f7-list-input>
              <f7-list-input
                label="Ventas"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.ventas_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                label="Seguro"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.seguro_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                v-if="false"
                label="RPC"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.rpc_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                v-if="false"
                label="Egresos"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.egresos_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                label="Avances"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.avances_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                v-if="false"
                label="Redbus"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.redbus_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                v-if="false"
                label="tarjeta debito"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${form.content.tdebito_cua || '0'}`"
              >
              </f7-list-input>
              <f7-list-input
                v-if="false"
                label="Tarjeta credito"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${form.content.tcredito_cua || '0'}`"
              >
              </f7-list-input>
              <f7-list-input
                v-if="false"
                label="Brasilia"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.brasilia_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                v-if="false"
                label="Pinbus"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.pinbus_rep)}`"
              >
              </f7-list-input>
              <f7-list-input
                label="Totales"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$ ${format_num(form.content.totales)}`"
              >
              </f7-list-input>

              <f7-list-input
                label="Observaciones"
                type="textarea"
                floating-label
                outline
                v-model:value="form.content.observaciones"
              >
              </f7-list-input>
            </f7-list>
          </f7-card-content>
          <f7-card-footer class="width-100 no-padding">
            <f7-list class="width-100">
              <f7-list-item class="width-100">
                <f7-button class="width-100" large outline @click="save"
                  >Cierre de caja</f7-button
                >
              </f7-list-item>
              <f7-list-item class="width-100">
                <f7-button
                  class="width-100"
                  color="green"
                  large
                  outline
                  @click="print_close_box"
                  >Imprimir caja</f7-button
                >
              </f7-list-item>
            </f7-list>
          </f7-card-footer>
        </f7-card>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import _ from "lodash";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { loader, toast, format_num } from "../../js/utils/plugins";
import { useStore } from "vuex";
import { imprimir } from "../../js/utils/print";

export default {
  props: {
    estado: Boolean,
    params: Object,
    consecutive: String,
    date: String,
  },
  setup(props, context) {
    const store = useStore();
    const info = store.getters["middleware/get_info"];

    const form = ref({
      content: {},
      consecutive: null,
    });

    watch(
      () => props.estado,
      async (val) => {
        if (!val) form.value = { content: {} };
        else {
          form.value = {
            content: { ..._.cloneDeep(props.params.content) },
          };
          form.value.consecutive = props.consecutive;
        }
      }
    );

    const open = async () => {};

    const closed = () => {
      context.emit("closed", false);
    };

    const save = async () => {
      try {
        // loader(true);
        let data = { ...form.value.content };

        let agencia = info?.key_point?.turn?.agencia_rep || "";
        let consecutivo = form.value.consecutive;
        let fecha = props.date.replace(/\-/g, "");
        let turno = info?.key_point?.turn?.id_rep || "";
        let tiq_ini = data.tiqini_rep;
        let tiq_fin = data.tiqfin_rep;
        let ventas = data.ventas_rep ? data.ventas_rep.trim() : 0;
        let seguro = data.seguro_rep ? data.seguro_rep.trim() : 0;
        let rpc = data.rpc_rep ? data.rpc_rep.trim() : 0;
        let egresos = data.egresos_rep ? data.egresos_rep.trim() : 0;
        let avances = data.avances_rep ? data.avances_rep.trim() : 0;
        let redbus = data.redbus_rep ? data.redbus_rep.trim() : 0;
        let pinbus = data.pinbus_rep ? data.pinbus_rep.trim() : 0;
        let gtotal = data.totales || 0;
        let sdoini = data.balance_init || 0;

        let tdebito = "0";
        let tcredito = "0";
        let convenios = "0";

        let monedas = 0;
        let cant1 = 0;
        let cant2 = 0;
        let cant5 = 0;
        let cant10 = 0;
        let cant20 = 0;
        let cant50 = 0;
        let cant100 = 0;
        let observacion = data.observaciones || "";

        let send_data =
          agencia +
          "|" +
          consecutivo +
          "|" +
          fecha +
          "|" +
          turno +
          "|" +
          tiq_ini +
          "|" +
          tiq_fin +
          "|" +
          ventas +
          "|" +
          rpc +
          "|" +
          egresos +
          "|" +
          avances +
          "|" +
          redbus +
          "|" +
          pinbus +
          "|" +
          tdebito +
          "|" +
          tcredito +
          "|" +
          convenios +
          "|" +
          monedas +
          "|" +
          cant1 +
          "|" +
          cant2 +
          "|" +
          cant5 +
          "|" +
          cant10 +
          "|" +
          cant20 +
          "|" +
          cant50 +
          "|" +
          cant100 +
          "|" +
          observacion +
          "|" +
          seguro +
          "|" +
          sdoini +
          "|" +
          gtotal +
          "|";

        const response = await store.dispatch("closebox/save", send_data);

        form.value.consecutive = response.message[0];
        print_close_box();
      } catch (error) {
        loader(false);
        toast("Error cerrando caja");
        console.log("Error en el cierre de caja: ", error);
      }
    };

    const print_close_box = async () => {
      try {
        loader(true);
        const response = await store.dispatch(
          "closebox/print",
          `${form.value.consecutive}|`
        );

        imprimir({
          data: {
            ...response.message[0],
            id_logo: parseFloat(info.session.substr(0, 15)),
          },
          formato: "close_box",
        })
          .then(() => {
            loader(false);
          })
          .catch((error) => {
            loader(false);
          });
      } catch (error) {
        loader(false);
        toast("Error generando la impresion");
        console.log("Error print cierre de caja: ", error);
      }
    };

    return { form, open, closed, format_num, print_close_box, save };
  },
};
</script>