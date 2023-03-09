<template>
  <f7-popup
    class="config_rut"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Libro de viajes">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-card-header class="no-padding">
            <f7-list class="width-100">
              <f7-list-item group-title>
                Libro de viaje {{ form.libroViaje }}
              </f7-list-item>
            </f7-list>
          </f7-card-header>
          <f7-card-content :padding="false">
            <f7-list accordion-list>
              <f7-list-input
                label="Origen"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.origen"
              >
              </f7-list-input>

              <f7-list-input
                label="Destino"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.destino"
              >
              </f7-list-input>

              <f7-list-item-row>
                <f7-row
                  no-gap
                  :style="{ width: '100%' }"
                  class="display-flex justify-content-end"
                >
                  <f7-col width="50">
                    <f7-list-input
                      label="Fecha"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      v-model:value="form.fecha"
                    >
                    </f7-list-input>
                  </f7-col>

                  <f7-col width="50">
                    <f7-list-input
                      label="Hora"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      v-model:value="form.hora"
                    >
                    </f7-list-input>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-item-row>
                <f7-row
                  no-gap
                  :style="{ width: '100%' }"
                  class="display-flex justify-content-end"
                >
                  <f7-col width="50">
                    <f7-list-input
                      label="Numero de cargue"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      v-model:value="form.nroCargue"
                    >
                    </f7-list-input>
                  </f7-col>

                  <f7-col width="50">
                    <f7-list-input
                      label="Vehiculo"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      v-model:value="form.vehiculo"
                    >
                    </f7-list-input>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-input
                label="Conductor"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.conductor"
              >
              </f7-list-input>

              <f7-list-item group-title> Tiquetes </f7-list-item>

              <f7-list-item
                accordion-item
                v-for="item in form.tiquetes"
                :key="item"
                :title="item.nombres"
                :after="parseFloat(item.nro_tiq.replace(/\s/g, '')) || 0"
              >
                <f7-accordion-content>
                  <f7-list>
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
                        <b>Sillas:</b>
                        <div>{{ item.sillas }}</div>
                      </div>
                    </f7-list-item>
                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Forma pago:</b>
                        <div>{{ item.formapago }}</div>
                      </div>
                    </f7-list-item>
                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Cantidad:</b>
                        <div>{{ item.cantidad }}</div>
                      </div>
                    </f7-list-item>
                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Valor:</b>
                        <div>{{ item.valor }}</div>
                      </div>
                    </f7-list-item>
                  </f7-list>
                </f7-accordion-content>
              </f7-list-item>

              <f7-list-item accordion-item title="Totales">
                <f7-accordion-content>
                  <f7-list>
                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Seguro:</b>
                        <div>${{ format_num(form.totalSeguro) }}</div>
                      </div>
                    </f7-list-item>
                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Cantidad:</b>
                        <div>{{ format_num(form.totalCantidad) }}</div>
                      </div>
                    </f7-list-item>
                    <f7-list-item>
                      <div
                        class="width-100 display-flex justify-content-space-between"
                      >
                        <b>Valor:</b>
                        <div>${{ format_num(form.totalValor) }}</div>
                      </div>
                    </f7-list-item>
                  </f7-list>
                </f7-accordion-content>
              </f7-list-item>

              <f7-list-item-row>
                <f7-row
                  no-gap
                  :style="{ width: '100%' }"
                  class="display-flex justify-content-end"
                >
                  <f7-col width="50">
                    <f7-list-input
                      label="Efectivo"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      :value="`$${format_num(form.efectivo)}`"
                    >
                    </f7-list-input>
                  </f7-col>

                  <f7-col width="50">
                    <f7-list-input
                      label="Redbus"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      :value="`$${format_num(form.redBus)}`"
                    >
                    </f7-list-input>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-item-row>
                <f7-row
                  no-gap
                  :style="{ width: '100%' }"
                  class="display-flex justify-content-end"
                >
                  <f7-col width="50">
                    <f7-list-input
                      label="Pinbus"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      :value="`$${format_num(form.pinBus)}`"
                    >
                    </f7-list-input>
                  </f7-col>

                  <f7-col width="50">
                    <f7-list-input
                      label="Brasilia"
                      type="text"
                      outline
                      floating-label
                      :disabled="true"
                      :value="`$${format_num(form.brasilia)}`"
                    >
                    </f7-list-input>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-input
                label="Avance"
                type="text"
                outline
                floating-label
                :value="format_num(form.avance)"
                @input="input_mask('avance')"
              >
              </f7-list-input>

              <f7-list-input
                label="Recaudo"
                type="text"
                outline
                floating-label
                :value="format_num(form.recaudo)"
                @input="input_mask('recaudo')"
              >
              </f7-list-input>

              <f7-list-input
                label="seguridad Social"
                type="text"
                outline
                floating-label
                :value="format_num(form.segSocial)"
                @input="input_mask('segSocial')"
              >
              </f7-list-input>

              <f7-list-input
                label="Total a pagar"
                type="text"
                outline
                floating-label
                :disabled="true"
                :value="`$${format_num(form.totalPagar)}`"
              >
              </f7-list-input>

              <f7-list-input
                label="Observaciones"
                type="textarea"
                floating-label
                outline
                v-model:value="form.observaciones"
              >
              </f7-list-input>
              <f7-list-item group-title> Taquilla de despacho: </f7-list-item>
            </f7-list>
          </f7-card-content>
          <f7-card-footer class="width-100 no-padding margin-top">
            <f7-list class="width-100">
              <f7-list-item class="width-100">
                <f7-button
                  class="width-100"
                  large
                  outline
                  :disabled="restarTotal() != 0 ? true : false"
                  @click="close_book"
                  >Cerrar. Libro</f7-button
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
import {
  loader,
  toast,
  format_num,
  formatComas,
  format_hora,
} from "../../js/utils/plugins";

import { f_pagos } from "./index";
import { useStore } from "vuex";
import { imprimir } from "../../js/utils/print";
export default {
  props: {
    estado: Boolean,
    travel: Object,
    id_agc: String,
  },
  setup(props, context) {
    const form = ref({});
    const store = useStore();

    watch(
      () => props.estado,
      async (val) => {
        if (val) get_travel_book();
        else form.value = {};
      }
    );

    const open = async () => {};

    const closed = () => {
      context.emit("closed", false);
    };

    const get_travel_book = async () => {
      try {
        const loader_src = loader(true);
        loader_src.setTitle("Consultando informacion del libro...");

        const {
          travel: { id_via },
          id_agc,
        } = props;

        const response = await store.dispatch(
          "travels/travel_book",
          `${id_agc}|${id_via}|`
        );

        set_data_book(response.message);
        loader(false);
      } catch (error) {
        loader(false);
        console.log("Error consultando travel book: ", error);
        toast("Error consultando informacion de libro");
      }
    };

    const set_data_book = (data = []) => {
      let totalSeguro = 0;
      let totalCantidad = 0;
      let totalValor = 0;
      let efectivo = 0;
      let redBus = 0;
      let pinBus = 0;
      let brasilia = 0;
      let avances = 0;
      let tiquetes = _.cloneDeep(data.filter((e) => e.agencia_tiq));

      const {
        id_agc,
        travel: {
          id_via,
          origen_lvia,
          destino_lvia,
          placa_via,
          fecha_via,
          horario_via,
          conductor1_via,
          desconductor_tiq,
        },
      } = props;

      if (tiquetes.length) {
        tiquetes.forEach((el, index) => {
          let nombres = "";
          let sillas = "";
          let valor = 0;
          let formapago = "";
          let cantidad = 0;

          formapago = f_pagos.find((e) => e.value == el.fpago_tiq)?.text || "";

          tiquetes[index].pasajeros.pop();

          let longPas = el.pasajeros.length;

          el.pasajeros.forEach((pa, i) => {
            nombres += formatComas(i, longPas, pa.nombrepasajero_tiq.trim());
            sillas += formatComas(i, longPas, pa.silla_tiq.trim());
            cantidad += parseFloat(pa.cantidad_tiq.replace(/\,/g, "")) || 0;

            valor += parseFloat(pa.vlrtotal_tiq.replace(/\,/g, "")) || 0;
            totalSeguro += parseFloat(pa.seguro_tiq.replace(/\,/g, "")) || 0;
          });

          efectivo += el.fpago_tiq === "01" ? valor : 0;
          redBus += el.fpago_tiq === "07" ? valor : 0;
          pinBus += el.fpago_tiq === "10" ? valor : 0;
          brasilia += el.fpago_tiq === "09" ? valor : 0;

          totalCantidad += cantidad;
          totalValor += valor;

          // if (id_agc === "0006") {
          avances = efectivo;
          // totalValor = totalValor - avances;
          restarTotal();
          // }

          tiquetes[index] = {
            ...tiquetes[index],
            nombres,
            sillas,
            formapago,
            cantidad,
            valor: "$" + format_num(valor),
          };
        });
      }

      form.value = {
        libroViaje: null,
        estado: 1,
        agencia: id_agc,
        origen: origen_lvia.trim(),
        destino: destino_lvia.trim(),
        fecha: fecha_via,
        hora: format_hora(horario_via),
        nroCargue: parseFloat(id_via),
        vehiculo: placa_via,
        conductor: `${parseFloat(conductor1_via)} - ${desconductor_tiq.trim()}`,
        tiquetes,
        totalSeguro,
        totalCantidad,
        totalValor,
        efectivo,
        redBus,
        pinBus,
        avance: avances,
        brasilia,
        totalPagar: totalValor,
        recaudo: 0,
        segSocial: 0,
        observaciones: null,
      };
    };

    const input_mask = (index) => {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");

      form.value[index] = val_edit;

      if (restarTotal() < 0) {
        toast("El valor total no puede ser negativo");
      } else {
        form.value.totalPagar = restarTotal();
      }
    };

    const restarTotal = () => {
      let libro = form.value;
      let totalValor = parseFloat(libro.totalValor) || 0;
      let avance = parseFloat(libro.avance) || 0;
      let recaudo = parseFloat(libro.recaudo) || 0;
      let segSocial = parseFloat(libro.segSocial) || 0;

      let totalPagar = totalValor - avance - recaudo - segSocial;
      return totalPagar;
    };

    const close_book = async () => {
      try {
        const loader_src = loader(true);
        loader_src.setTitle("Cerrando libro...");

        const response = await store.dispatch(
          "travels/close_book",
          _.cloneDeep(form.value)
        );

        let consecutive = response.message[0];

        loader_src.setTitle("Verificando informacion...");

        let get_book = await store.dispatch(
          "travels/get_book",
          `${props.id_agc}|${consecutive}|`
        );

        loader_src.setTitle("Contabilizando libro...");

        await store.dispatch(
          "travels/contab_book",
          _.cloneDeep(get_book.message[0])
        );

        loader_src.setTitle("Generando impresion...");

        get_book = await store.dispatch(
          "travels/get_book",
          `${props.id_agc}|${consecutive}|`
        );

        await print_close_box(get_book.message[0]);
        await time_out(500);

        await print_close_box(get_book.message[0]);
        await time_out(300);

        loader(false);
        closed();
      } catch (error) {
        loader(false);
        console.log("Ocurrio un error en el guardado", error);
        toast("Ocurrio un error en el cierre del libro");
      }
    };

    const print_close_box = async (data) => {
      try {
        await imprimir({ data: _.cloneDeep(data), formato: "travel_book" });
      } catch (error) {
        console.log("Ocurrio un error en la impresion", error);
      }

      return true;
    };

    const time_out = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    return {
      form,
      store,
      open,
      closed,
      get_travel_book,
      set_data_book,
      format_num,
      input_mask,
      restarTotal,
      close_book,
    };
  },
};
</script>