<template>
  <f7-popup v-model:opened="estado" @popup:opened="open" @popup:closed="closed">
    <f7-view>
      <f7-page>
        <f7-navbar title="Listado de viajes">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-card-content :padding="false">
            <f7-list accordion-list>
              <f7-list-item
                swipeout
                accordion-item
                v-for="item in tickets"
                :key="item"
                :title="item.nombreagencia_tiq"
                :after="item.fechaelab_tiq"
                :style="{ ...setStyle(item) }"
              >
                <f7-accordion-content>
                  <f7-list>
                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Tiquete:</b>
                        <div>{{ item.nro_tiq }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Placa:</b>
                        <div>{{ item.placa_tiq }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Libro:</b>
                        <div>{{ item.libroviaje_tiq }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Pasajero:</b>
                        <div>{{ item.nombrepasaj_tiq }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Destino:</b>
                        <div>{{ item.destino_tiq }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Valor:</b>
                        <div>{{ item.vlr_tiq }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>F. pago:</b>
                        <div>{{ item.fpago_tiq }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Estado:</b>
                        <div>
                          {{ item.estado_tiq == "0" ? "Ativo" : "Anulado" }}
                        </div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Elaboro:</b>
                        <div>{{ item.nombreuser_tiq }}</div>
                      </div>
                    </f7-list-item>
                  </f7-list>
                </f7-accordion-content>

                <f7-swipeout-actions right>
                  <f7-swipeout-button>
                    <f7-link
                      icon-f7="printer"
                      icon-color="white"
                      icon-size="20"
                      class="swipeout-red"
                      color="gray"
                      @click="print_ticket(item)"
                    ></f7-link>
                  </f7-swipeout-button>

                  <f7-swipeout-button color="red">
                    <f7-link
                      icon-f7="trash"
                      icon-color="white"
                      icon-size="20"
                      color="gray"
                      @click="sheetComment(item)"
                    ></f7-link>
                  </f7-swipeout-button>
                </f7-swipeout-actions>
              </f7-list-item>
            </f7-list>
          </f7-card-content>
        </f7-card>
      </f7-page>
    </f7-view>
    <comment_sheet
      :estado="params_sheet.estado"
      :item="params_sheet.item"
      @closed="params_sheet.estado = false"
      @callback="anularTicket"
    ></comment_sheet>
  </f7-popup>
</template>

<script>
import { reactive, ref, watch } from "@vue/runtime-core";
import comment_sheet from "./comment_sheet.vue";
import { useStore } from "vuex";
import { loader, toast } from "../../js/utils/plugins";
import { imprimir } from '../../js/utils/print';

export default {
  props: {
    estado: Boolean,
    list: Array,
  },
  components: { comment_sheet },
  setup(props, context) {
    const store = useStore();
    let tickets = ref([]);

    const params_sheet = reactive({
      estado: false,
      item: {},
    });

    watch(
      () => props.estado,
      (val) => {
        if (val) tickets.value = props.list;
        else tickets.value = [];
      }
    );

    const open = async () => {};

    const closed = () => {
      context.emit("closed", false);
    };

    const print_ticket = async (item) => {
      const { agencia_tiq, nro_tiq } = item;

      let { message } = await store.dispatch(
        "travels/get_ticket",
        `${agencia_tiq}|${nro_tiq}|`
      );

      await imprimir({ data: message[0], formato: "ticket" });
    };

    const sheetComment = (item) => {
      params_sheet.estado = true;
      params_sheet.item = item;
    };

    const anularTicket = async (item) => {
      try {
        loader(true);
        params_sheet.estado = false;
        const { agencia_tiq, nro_tiq, comment } = item;
        let data = agencia_tiq + "|" + nro_tiq + "|" + comment + "|";

        await store.dispatch("travels/cancel_travel", data);

        let estado = null;
        let find = tickets.value.find((e) => e.nro_tiq == item.nro_tiq);

        if (find.estado_tiq == "1") estado = "0";
        else estado = "1";

        params_sheet.item = {};
        find.estado_tiq = estado;

        loader(false);
        toast("Proceso realizado correctamente!");
      } catch (error) {
        loader(false);
        toast(error?.message[0] || "Error anulando el registro");
      }
    };

    const setStyle = (item) => {
      return item.estado_tiq != "1"
        ? {}
        : { background: "rgb(249 91 107)", color: "white !important" };
    };

    return {
      tickets,
      params_sheet,
      open,
      closed,
      print_ticket,
      sheetComment,
      anularTicket,
      setStyle,
    };
  },
};
</script>

<style>
.item-after {
  color: inherit !important;
}
</style>