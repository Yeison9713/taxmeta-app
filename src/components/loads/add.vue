<template>
  <f7-popup
    class="add_load"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Agregar nuevo cargue">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-card-content :padding="false">
            <f7-list>
              <f7-list-item-row>
                <f7-row no-gap :style="{ width: '100%' }">
                  <f7-col width="80">
                    <f7-list-input
                      label="Vehiculo"
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
                      @click="map_data_lookup({ id: 'vehicles' })"
                    >
                      <f7-icon f7="search" size="22"></f7-icon>
                    </f7-button>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-item-row>
                <f7-row no-gap :style="{ width: '100%' }">
                  <f7-col width="80">
                    <f7-list-input
                      label="Conductor"
                      type="text"
                      outline
                      floating-label
                      :value="`${
                        parseFloat(form.driver?.identificacion_rut) || ''
                      } - ${form.driver?.descripcion_rut || ''}`"
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
                      @click="map_data_lookup({ id: 'customers' })"
                    >
                      <f7-icon f7="search" size="22"></f7-icon>
                    </f7-button>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-item-row>
                <f7-row no-gap :style="{ width: '100%' }">
                  <f7-col width="80">
                    <f7-list-input
                      label="Origen"
                      type="text"
                      outline
                      floating-label
                      :value="`${parseFloat(form.origin?.id_emb) || ''} - ${
                        form.origin?.descrip_emb || ''
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
                      @click="map_data_lookup({ id: 'embargoes' })"
                    >
                      <f7-icon f7="search" size="22"></f7-icon>
                    </f7-button>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-item-row>
                <f7-row no-gap :style="{ width: '100%' }">
                  <f7-col width="80">
                    <f7-list-input
                      label="Destino"
                      type="text"
                      outline
                      floating-label
                      :value="`${
                        parseFloat(form.destination?.id_emb) || ''
                      } - ${form.destination?.descrip_emb || ''}`"
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
                      @click="
                        map_data_lookup({ id: 'embargoes', text: 'Destino' })
                      "
                    >
                      <f7-icon f7="search" size="22"></f7-icon>
                    </f7-button>
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
                      label="Fecha"
                      type="date"
                      outline
                      floating-label
                      v-model:value="form.date"
                      disabled
                    >
                    </f7-list-input>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-item-row>
                <f7-row no-gap :style="{ width: '100%' }">
                  <f7-col width="80">
                    <f7-list-input
                      label="Horario"
                      type="text"
                      outline
                      floating-label
                      :value="`${parseFloat(form.schedule?.id_hor) || ''} - ${
                        form.schedule?.horasal_hor || ''
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
                      @click="map_data_lookup({ id: 'schedules' })"
                    >
                      <f7-icon f7="search" size="22"></f7-icon>
                    </f7-button>
                  </f7-col>
                </f7-row>
              </f7-list-item-row>

              <f7-list-item>
                <f7-button
                  class="width-100"
                  large
                  outline
                  @click="validate_save"
                  >Grabar</f7-button
                >
              </f7-list-item>
            </f7-list>
          </f7-card-content>
        </f7-card>
      </f7-page>
    </f7-view>
    <Lookup
      :estado="modalLookUp.estado"
      :params="modalLookUp.params"
      @closed="modalLookUp.estado = false"
      @callback="callback_lookup"
    ></Lookup>
  </f7-popup>
</template>

<script>
import _ from "lodash";
import { reactive } from "@vue/reactivity";
import { textValue, loader, toast, current_date } from "../../js/utils/plugins";
import Lookup from "../../components/lookup.vue";
import { watch } from "@vue/runtime-core";

import { useStore } from "vuex";

export default {
  components: { Lookup },
  props: {
    estado: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Boolean,
      default: false,
    },
    vehicles: {
      type: Array,
      default: [],
    },
    customers: {
      type: Array,
      default: [],
    },
    embargoes: {
      type: Array,
      default: [],
    },
    schedules: {
      type: Array,
      default: [],
    },
  },
  setup(props, context) {
    const store = useStore();

    const form = reactive({
      vehicle: null,
      driver: null,
      origin: null,
      destination: null,
      date: current_date().split("/").reverse().join("-"),
      schedule: null,
    });

    const modalLookUp = reactive({
      estado: false,
      params: {
        text: "",
        data: [],
        columns: {
          text: "",
          value: "",
        },
      },
    });

    watch(
      () => form.vehicle,
      async (val) => {
        if (val) {
          let item = props.customers.find(
            (e) => e.identificacion_rut == val.idcond1_veh
          );

          if (item) form.driver = _.cloneDeep(item);
        }
      }
    );

    const open = async () => {
      form.vehicle = null;
      form.driver = null;
      form.origin = null;
      form.destination = null;
      form.date = current_date().split("/").reverse().join("-");
      form.schedule = null;
    };

    const closed = () => {
      context.emit("closed", false);
    };

    const map_data_lookup = ({ id, text }) => {
      let data = [
        {
          id: "vehicles",
          text: "Vehiculo",
          data: _.cloneDeep(props.vehicles),
          columns: { text: "placa_veh", value: "nrointer_veh" },
        },
        {
          id: "customers",
          text: "Conductor",
          data: _.cloneDeep(props.customers),
          columns: { text: "descripcion_rut", value: "identificacion_rut" },
        },
        {
          id: "embargoes",
          text: "Origen",
          data: _.cloneDeep(props.embargoes),
          columns: { text: "descrip_emb", value: "id_emb" },
        },
        {
          id: "schedules",
          text: "Horario",
          data: _.cloneDeep(props.schedules),
          columns: { text: "horasal_hor", value: "id_hor" },
        },
      ];

      let params = data.find((e) => e.id == id);
      params.text = text || params.text;

      modalLookUp.params = {
        text: params.text,
        data: params.data,
        columns: params.columns,
      };

      modalLookUp.estado = true;
    };

    const callback_lookup = (item) => {
      switch (modalLookUp.params.text) {
        case "Vehiculo":
          form.vehicle = item;
          break;
        case "Conductor":
          form.driver = item;
          break;
        case "Origen":
          form.origin = item;
          break;
        case "Destino":
          form.destination = item;
          break;
        case "Horario":
          form.schedule = item;
          break;
        default:
          console.log("Callback no definido");
          break;
      }

      modalLookUp.estado = false;
      modalLookUp.params = {
        text: "",
        data: [],
        columns: {
          text: "",
          value: "",
        },
      };
    };

    const validate_save = async () => {
      try {
        if (!form.vehicle) toast("Debe selecionar un vehiculo");
        else if (!form.driver) toast("Debe selecionar un conductor");
        else if (!form.origin) toast("Debe selecionar un origen");
        else if (!form.destination) toast("Debe selecionar un destino");
        else if (!form.schedule) toast("Debe selecionar un horario");
        else {
          loader(true);
          let date = form.date.replaceAll("-", "");
          let agencie = props.info?.key_point?.ticket_office?.id_agc || "";

          let send_data =
            "0|" +
            date +
            "|" +
            form.vehicle.placa_veh +
            "|" +
            form.driver?.identificacion_rut +
            "|0|" +
            form.schedule?.id_hor +
            "|0|0|" +
            form.origin.id_emb +
            "|" +
            form.destination.id_emb +
            "|" +
            agencie +
            "|";

          await store.dispatch("loads/save", send_data);
          toast("Se registro correctamente");
          setTimeout(() => {
            closed();
            loader(false);
          }, 1000);
        }
      } catch (error) {
        loader(false);
        console.log("Error en el guardado: ", error);
        toast("Ocurrio un error en el guardado");
      }
    };

    return {
      form,
      modalLookUp,
      open,
      closed,
      textValue,
      map_data_lookup,
      callback_lookup,
      validate_save,
    };
  },
};
</script>