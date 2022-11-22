<template>
  <f7-popup
    class="config_rut"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Listado de pasajeros">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-list form>
            <f7-list-item>
              <div class="list accordion-opposite width-100">
                <ul class="no-padding-left">
                  <li
                    class="accordion-item swipeout"
                    v-for="(item, index) in array"
                    :key="index"
                  >
                    <a class="item-content item-link" href="#">
                      <div class="item-inner swipeout-content">
                        <f7-row
                          no-gap
                          class="width-100 display-flex align-items-center"
                        >
                          <f7-col width="70">
                            <div
                              class="item-title"
                              :style="{ 'font-size': '12px' }"
                            >
                              <b
                                >{{ item.origen_tiq }} -
                                {{ item.destino_tiq }}</b
                              >
                            </div>
                          </f7-col>
                          <f7-col
                            width="30"
                            class="text-align-right"
                            :style="{ 'font-size': '12px' }"
                          >
                            $ {{ format_num(item.valor_ticket) }}
                          </f7-col>
                        </f7-row>
                      </div>

                      <div class="swipeout-actions-right">
                        <f7-link
                          icon-f7="printer"
                          icon-color="white"
                          icon-size="24"
                          class="swipeout-red"
                          color="gray"
                          @click="print_pdf(item)"
                        ></f7-link>
                      </div>
                    </a>
                    <div class="accordion-item-content">
                      <div class="block">
                        <f7-row>
                          <f7-col width="100">
                            <b>Nro ticket:</b>
                            {{ parseFloat(item.nro_tiq) || "" }}
                          </f7-col>

                          <f7-col width="100">
                            <b>Origen:</b>
                            {{ item.origen_tiq }}
                          </f7-col>

                          <f7-col width="100">
                            <b>Destino:</b>
                            {{ item.destino_tiq }}
                          </f7-col>

                          <f7-col width="100">
                            <b>Fecha embargue:</b>
                            {{ item.fechaemb_tiq }}
                          </f7-col>

                          <!-- more data -->

                          <f7-col width="100">
                            <b>Pasajeros:</b>
                            {{ item.names_pasajeros.toString() }}
                          </f7-col>

                          <f7-col width="100">
                            <b>Sillas:</b>
                            {{ item.sillas.toString() }}
                          </f7-col>

                          <!-- not more data -->

                          <f7-col width="100">
                            <b>Estado:</b>
                            {{ item.estado_tiq == "0" ? "Activo" : "Anulado" }}
                          </f7-col>

                          <f7-col width="100">
                            <b>Fecha elaboracion:</b>
                            {{ item.fechaelab_tiq }}
                          </f7-col>
                        </f7-row>
                      </div>
                    </div>
                  </li>
                  <li v-if="!array.length">
                    <a class="item-content" href="#">
                      <div class="item-inner swipeout-content">
                        <f7-row
                          no-gap
                          class="width-100 display-flex align-items-center"
                        >
                          <f7-col width="100">
                            <div
                              class="item-title"
                              :style="{ 'font-size': '12px' }"
                            >
                              <b>No hay datos</b>
                            </div>
                          </f7-col>
                        </f7-row>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </f7-list-item>
          </f7-list>
        </f7-card>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import {
  loader,
  format_num,
  current_date,
  getBase64,
} from "../../js/utils/plugins";
import { imprimir } from "../../js/utils/print";
import _ from "lodash";
import { mapGetters } from "vuex";

export default {
  props: {
    estado: Boolean,
    params: {
      id_via: null,
    },
  },
  data() {
    return {
      array: [],
    };
  },
  watch: {
    "params.id_via": async function (val) {
      try {
        let dispatch = this.$store.dispatch;

        loader(true);
        let data = `${val}|1|`;

        if (val) {
          const response = await dispatch("travels/all_tickets", data);

          this.array = response.message.map((e) => {
            let pasajeros = [];
            let sillas = [];
            let valor = 0;

            for (const item of e.pasajeros) {
              if (item.cantidad_tiq) {
                pasajeros.push(item.nombrepasajero_tiq.trim());
                sillas.push(item.silla_tiq.trim());

                valor += parseFloat(item.vlr_tiq.replace(/,/g, "")) || 0;
              }
            }

            e.valor_ticket = valor;
            e.names_pasajeros = pasajeros;
            e.sillas = sillas;
            return e;
          });
        }

        loader(false);
      } catch (error) {
        loader(false);
        console.log("error get tickets", error);
      }
    },
  },
  computed: {
    ...mapGetters({
      info: "middleware/get_info",
    }),
  },
  methods: {
    format_num,
    open() {},

    closed() {
      this.$emit("closed", false);
    },
    async print_pdf(item) {
      item.fecha = current_date();
      item.hora = new Date().toLocaleTimeString();

      try {
        imprimir({
          data: _.cloneDeep({
            ...item,
          }),
          formato: "ticket",
          // nit: this.info.company.id,
        })
          .then(() => {
            console.log("success ticket");
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>