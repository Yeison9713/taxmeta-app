<template>
  <f7-page name="tickets">
    <f7-navbar back-link="Back" title="Generar tiquete"> </f7-navbar>

    <f7-tabs animated swipeable>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <f7-card>
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
                  <f7-link
                    v-if="form.travel"
                    popover-open=".popover-menu-tickets"
                  >
                    <f7-icon size="18" f7="ellipsis_vertical"></f7-icon>
                  </f7-link>
                </div>
              </f7-list-item>
            </f7-list>
          </f7-card-header>
          <f7-card-content :padding="false">
            <f7-list>
              <f7-list-item>
                <Autocomplete
                  :idLabel="'autocomplete-cargues'"
                  :label="'Cargues'"
                  :keyItem="'id_via'"
                  :labelText="'text'"
                  :returnObject="true"
                  :clearText="true"
                  :items="travels"
                  :value="form.travel"
                  @output="(e) => (form.travel = e)"
                >
                </Autocomplete>
              </f7-list-item>

              <f7-list-input
                label="Fecha de viaje"
                type="date"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.date"
              >
              </f7-list-input>

              <f7-list-item
                title="Origen"
                smart-select
                :smart-select-params="{
                  closeOnSelect: true,
                  setValueText: false,
                  searchbar: true,
                  searchbarPlaceholder: 'Buscar origen',
                }"
                :after="
                  textValue(embargoes, form.origin, 'id_emb', 'descrip_emb')
                "
              >
                <select name="origen" v-model="form.origin">
                  <option
                    v-for="item in embargoes"
                    :key="item"
                    :value="item.id_emb"
                    selected
                  >
                    {{ item.descrip_emb }}
                  </option>
                </select>
              </f7-list-item>

              <f7-list-item
                title="Destino"
                smart-select
                :smart-select-params="{
                  closeOnSelect: true,
                  setValueText: false,
                  searchbar: true,
                  searchbarPlaceholder: 'Buscar destino',
                }"
                :after="
                  textValue(
                    embargoes,
                    form.destination,
                    'id_emb',
                    'descrip_emb'
                  )
                "
              >
                <select name="destino" v-model="form.destination">
                  <option
                    v-for="item in embargoes"
                    :key="item"
                    :value="item.id_emb"
                    selected
                  >
                    {{ item.descrip_emb }}
                  </option>
                </select>
              </f7-list-item>

              <f7-list-item
                title="Hora de ruta"
                smart-select
                :disabled="true"
                :smart-select-params="{
                  closeOnSelect: true,
                  setValueText: false,
                  searchbar: true,
                  searchbarPlaceholder: 'Buscar hora',
                }"
                :after="
                  textValue(schedules, form.time_route, 'id_hor', 'horasal_hor')
                "
              >
                <select name="time_route" v-model="form.time_route">
                  <option
                    v-for="item in schedules"
                    :key="item"
                    :value="item.id_hor"
                  >
                    {{ item.horasal_hor }}
                  </option>
                </select>
              </f7-list-item>

              <f7-list-input
                label="Vehiculo"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.descrip_veh"
              >
              </f7-list-input>

              <f7-list-input
                label="Conductor"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.descrip_driver"
              >
              </f7-list-input>
            </f7-list>
          </f7-card-content>
        </f7-card>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-card>
          <f7-card-content :padding="false">
            <f7-list>
              <f7-list-input
                label="Servicio"
                type="text"
                floating-label
                outline
                :disabled="true"
                v-model:value="form.service"
              >
              </f7-list-input>

              <f7-list-item group-title> Detalle pasajero </f7-list-item>

              <f7-list-item class="width-100">
                <f7-button
                  class="width-100 no-padding"
                  color="green"
                  fill
                  @click="popup_sillas.state = true"
                  >Selecionar sillas
                </f7-button>
              </f7-list-item>

              <f7-list-input
                label="Hora embargue"
                type="datetime-local"
                outline
                v-model:value="form.passenger.time_out"
              >
              </f7-list-input>

              <f7-list-input
                label="Identificacion"
                type="number"
                floating-label
                outline
                v-model:value="form.passenger.id"
              >
              </f7-list-input>

              <f7-list-input
                label="Nombres completos"
                type="text"
                floating-label
                outline
                v-model:value="form.passenger.names"
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
                      label="Cantidad"
                      type="number"
                      outline
                      floating-label
                      :disabled="true"
                      v-model:value="form.passenger.quantity"
                    >
                    </f7-list-input>
                  </f7-col>
                  <f7-col width="50">
                    <f7-list-input
                      label="Valor unitario "
                      type="number"
                      outline
                      floating-label
                      v-model:value="form.passenger.amount"
                      @input="calcular_subtotal()"
                    >
                    </f7-list-input>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>
              <f7-list-input
                v-if="false"
                label="Descuento"
                type="number"
                outline
                floating-label
                v-model:value="form.passenger.discount"
                @input="calcular_subtotal()"
              >
              </f7-list-input>
            </f7-list>
          </f7-card-content>
        </f7-card>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <f7-card>
          <f7-card-header>
            <f7-block> Informacion general </f7-block>
          </f7-card-header>
          <f7-card-content :padding="false">
            <f7-list>
              <f7-list-input
                label="Tiquete #"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.consecutive.nro_cons"
              >
              </f7-list-input>

              <f7-list-input
                label="Fecha"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.consecutive.date_cons"
              >
              </f7-list-input>
            </f7-list>
          </f7-card-content>
        </f7-card>

        <f7-card>
          <f7-card-header>
            <f7-block> Detalles pago </f7-block>
          </f7-card-header>
          <f7-card-content>
            <f7-list>
              <f7-list-input
                label="Sub total"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.detail.subtotal"
              >
              </f7-list-input>

              <f7-list-input
                label="Valor seguro"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.detail.safe_value"
              >
              </f7-list-input>

              <f7-list-input
                label="Valor a pagar"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.detail.value_pay"
              >
              </f7-list-input>

              <f7-list-item title="Forma de pago" smart-select>
                <select name="f_pago" v-model="form.detail.payment_form">
                  <option
                    v-for="item in f_pagos"
                    :key="item"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </f7-list-item>
            </f7-list>
          </f7-card-content>
          <f7-card-footer class="width-100 no-padding">
            <f7-list class="width-100">
              <f7-list-item class="width-100">
                <f7-button
                  class="width-100"
                  large
                  outline
                  @click="validate_form"
                  >Grabar factura</f7-button
                >
              </f7-list-item>
            </f7-list>
          </f7-card-footer>
        </f7-card>
      </f7-tab>
    </f7-tabs>

    <f7-toolbar tabbar bottom class="bg-color-white">
      <f7-link tab-link="#tab-1" tab-link-active class="text-color-primary"
        >Cargue</f7-link
      >

      <f7-link tab-link="#tab-2" class="text-color-primary">Pasajero</f7-link>
      <f7-link tab-link="#tab-3" class="text-color-primary">Pago</f7-link>
    </f7-toolbar>

    <f7-popover class="popover-menu-tickets">
      <f7-list>
        <f7-list-item
          v-if="form.passenger.quantity || form.passenger.amount ? false : true"
          link="#"
          popover-close
          title="Cerrar libro"
          @click="params_popup_book.estado = true"
        ></f7-list-item>
        <f7-list-item
          link="#"
          @click="enabled_popup_tickets()"
          popover-close
          title="Pasajeros"
        ></f7-list-item>
      </f7-list>
    </f7-popover>

    <popupTickets
      :estado="params_popup_tickets.estado"
      :params="params_popup_tickets.params"
      @closed="params_popup_tickets.estado = false"
    ></popupTickets>

    <Travelbook
      :estado="params_popup_book.estado"
      :travel="form?.travel || {}"
      :id_agc="info?.key_point?.ticket_office?.id_agc || ''"
      @closed="params_popup_book.estado = false"
    ></Travelbook>

    <Sillas
      :estado="popup_sillas.state"
      @closed="get_select_chairs"
      :params="popup_sillas.params"
    ></Sillas>
  </f7-page>
</template>

<script>
import _ from "lodash";
import { useStore } from "vuex";
import {
  loader,
  toast,
  textValue,
  capitalize,
  format_num,
} from "../../../js/utils/plugins";
import Autocomplete from "../../../components/autocomplete.vue";
import { computed, onMounted, reactive, ref, watch } from "@vue/runtime-core";
import popupTickets from "../../../components/tickets/popup_tickets.vue";
import { imprimir } from "../../../js/utils/print";

import {
  init_form,
  f_pagos,
  dispatch_data,
  init_store,
  template_bus,
} from "../../../components/tickets/index";
import Sillas from "../../../components/tickets/chairs.vue";
import Travelbook from "../../../components/tickets/travel_book.vue";

export default {
  components: {
    Autocomplete,
    popupTickets,
    Sillas,
    Travelbook,
  },
  setup() {
    const store = useStore();

    const popup_sillas = ref({
      state: false,
      params: {
        template: null,
        id_via: null,
      },
      selects: [],
    });

    const params_popup_tickets = reactive({
      estado: false,
      params: { id_via: null },
    });

    const params_popup_book = reactive({
      estado: false,
    });

    init_store();
    let form = reactive(_.cloneDeep(init_form()));

    onMounted(async () => {
      try {
        const response = await dispatch_data();
        form.consecutive = response.data;
      } catch (error) {
        loader(false);
        console.log("Error cargando datos", error);
      }
    });

    const info = store.getters["middleware/get_info"];
    const travels = computed(() => store.getters["travels/get_list"]);
    const embargoes = computed(() => store.getters["embargoes/get_list"]);
    const schedules = computed(() => store.getters["schedules/get_list"]);

    watch(
      () => travels,
      (val) => {
        val.value.map((e) => {
          let id_via = parseFloat(e.id_via) || 0;
          let hour = e.idhorario_via;
          let format_hour = `${hour.substr(0, 2)}:${hour.substr(2, 2)}`;
          let nro = parseFloat(e.nrointer_via);
          let date = e.fecha_via;
          let destino = e.destino_lvia;
          e.text = `${id_via}. ${format_hour} - ${e.placa_via} - ${nro} - ${date} - ${destino}`;
          return e;
        });
      },
      { deep: true }
    );

    watch(
      () => form.travel,
      async (val) => {
        let data = { ...val };

        form.origin = parseFloat(data.codorigen_via) || "";
        form.time_route = data.idhorario_via;
        form.vehicle = data.placa_via;
        form.descrip_veh = `${parseFloat(data.nrointer_via)} - ${form.vehicle}`;

        form.driver = parseFloat(data.conductor1_via) || 0;
        form.descrip_driver = `${form.driver} - ${data.desconductor_tiq}`;

        let template = template_bus(data.tipoveh2_via);

        form.service = template?.service || "";
        popup_sillas.value.params.template = template?.template;
        popup_sillas.value.params.id_via = data.id_via;

        if (!data.cantpasajeros_via) {
          let glass = init_form();

          Object.keys(glass).forEach((k, v) => {
            if (k != "consecutive") form[k] = glass[k];
          });
        }
      }
    );

    const get_select_chairs = (data) => {
      popup_sillas.value.state = false;

      let selects = data.filter((e) => e.type == "selected");
      popup_sillas.value.selects = selects;
      form.passenger.quantity = selects.length;

      calcular_subtotal();
    };

    let timeout = null;

    const calcular_subtotal = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        let minimo = 200;
        let maximo = 500;
        let safe = 0;

        let { amount, quantity, discount } = form.passenger;

        let subtotal =
          (parseFloat(amount) || 0 - parseFloat(discount) || 0) *
          parseFloat(quantity || 0);

        if (subtotal < 5000) safe = minimo * parseFloat(quantity || 0);
        else safe = maximo * parseFloat(quantity || 0);

        let total = subtotal - safe;

        form.detail.subtotal = format_num(total || 0);
        form.detail.value_pay = format_num(subtotal || 0);
        form.detail.safe_value = format_num(safe);
      }, 1000);
    };

    const enabled_popup_tickets = () => {
      params_popup_tickets.estado = true;
      params_popup_tickets.params = form.travel;
    };

    const validate_form = () => {
      if (!form.travel) toast("Debe selecionar un viaje");
      else if (!form.destination) toast("Debe selecionar un destino");
      // else if (!form.driver) toast("Debe selecionar un conductor");
      else if (!form.descrip_driver) toast("Debe selecionar un conductor");
      else if (!form.passenger.quantity) toast("Debe selecionar la silla");
      else if (!form.passenger.id)
        toast("Debe ingresar la identificacion del pasajero");
      else if (!form.passenger.names)
        toast("Debe ingresar el nombre del pasajero");
      else if (!form.passenger.amount) toast("Debe ingresar el valor unitario");
      else if (!form.passenger.amount) toast("Debe ingresar el valor unitario");
      else {
        save();
      }
    };

    const save = async () => {
      try {
        loader(true);
        form.pasajeros = popup_sillas.value.selects;

        let { message } = await store.dispatch(
          "travels/save_ticket",
          _.cloneDeep(form)
        );

        await print_ticket(message[0]);

        let glass = init_form();
        Object.keys(glass).forEach((k, v) => {
          form[k] = glass[k];
        });

        const response = await dispatch_data();
        form.consecutive = response.data;

        loader(false);
      } catch (error) {
        loader(false);
        console.log("Error save data", error);
        toast("Ocurrio un error en el guardado");
      }
    };

    const print_ticket = async (data) => {
      let dato1 = data.substring(0, 4);
      let dato2 = data.substring(4);

      let { message } = await store.dispatch(
        "travels/get_ticket",
        `${dato1}|${dato2}|`
      );

      await imprimir({ data: message[0], formato: "ticket" });

      return true;
    };

    return {
      info,
      form,
      dispatch_data,
      travels,
      embargoes,
      schedules,
      f_pagos,
      params_popup_tickets,
      params_popup_book,
      capitalize,
      enabled_popup_tickets,
      textValue,
      calcular_subtotal,
      format_num,
      validate_form,
      save,
      init_form,
      print_ticket,
      popup_sillas,
      get_select_chairs,
    };
  },
};
</script>

<style lang="sass">
[data-name=tickets] .page-content
  background: rgb(204 204 204 / 5%)

  .tabs
    height: 100%

  .tab.tab-active
    padding: 0

  .toolbar
    background: var(--f7-bg-ts)

  .icon-card .icon
    font-size: 22px !important

  .page-content
    height: 100%

  .autocomplete-dropdown
    margin-top: 60px

  .smart-select .item-content
    padding-left: 20px
    padding-top: 5px
    padding-bottom: 5px
</style>