<template>
  <f7-popup v-model:opened="estado" @popup:opened="open" @popup:closed="closed">
    <f7-view>
      <f7-page>
        <f7-navbar title="Listado de cargues">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-card-content :padding="false">
            <f7-list accordion-list>
              <f7-list-item
                accordion-item
                v-for="item in list"
                :key="item"
                :title="item.agencia_cargue"
                :after="parseFloat(item.id_cargue) || 0"
              >
                <f7-accordion-content>
                  <f7-list>
                    <f7-list-item>
                      <div
                        class="
                          width-100
                          display-flex
                          justify-content-space-between
                        "
                      >
                        <b>Hora salida:</b>
                        <div>{{ item.horario_cargue }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="
                          width-100
                          display-flex
                          justify-content-space-between
                        "
                      >
                        <b>Id interno:</b>
                        <div>{{ item.nrointer_cargue }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="
                          width-100
                          display-flex
                          justify-content-space-between
                        "
                      >
                        <b>Placa:</b>
                        <div>{{ item.placa_cargue }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="
                          width-100
                          display-flex
                          justify-content-space-between
                        "
                      >
                        <b>Conductor:</b>
                        <div>{{ item.desconductor_cargue }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="
                          width-100
                          display-flex
                          justify-content-space-between
                        "
                      >
                        <b>Estado:</b>
                        <div>{{ item.estado_cargue }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="
                          width-100
                          display-flex
                          justify-content-space-between
                        "
                      >
                        <b>Origen:</b>
                        <div>{{ item.origen_cargue }}</div>
                      </div>
                    </f7-list-item>

                    <f7-list-item>
                      <div
                        class="
                          width-100
                          display-flex
                          justify-content-space-between
                        "
                      >
                        <b>Destino:</b>
                        <div>{{ item.destino_cargue }}</div>
                      </div>
                    </f7-list-item>
                  </f7-list>
                </f7-accordion-content>
              </f7-list-item>
            </f7-list>
          </f7-card-content>
        </f7-card>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
export default {
  props: {
    estado: Boolean,
    list: Array,
  },
  setup(props, context) {
    const open = async () => {};

    const closed = () => {
      context.emit("closed", false);
    };

    return { open, closed };
  },
};
</script>