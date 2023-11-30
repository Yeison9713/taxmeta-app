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
                            <f7-list-item swipeout accordion-item v-for="item in tickets" :key="item"
                                :title="item.descagencia_lvia" :after="item.fecha_lvia" :style="{ ...setStyle(item) }">
                                <f7-accordion-content>
                                    <f7-list>
                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Libro:</b>
                                                <div>{{ item.id_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Nº interno:</b>
                                                <div>{{ item.nrointerno_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Placa:</b>
                                                <div>{{ item.placa_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>F. pago:</b>
                                                <div>{{ item.fpago_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Subtotal:</b>
                                                <div>{{ item.subtotal_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Seguro:</b>
                                                <div>{{ item.seguro_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Total:</b>
                                                <div>{{ item.total_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Origen:</b>
                                                <div>{{ item.origen_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Estado:</b>
                                                <div>{{ item.estado_lvia == '0' ? 'Activo' : 'Desactivado' }}</div>
                                            </div>
                                        </f7-list-item>

                                        <f7-list-item>
                                            <div class="width-100 display-flex justify-content-space-between">
                                                <b>Taquillero:</b>
                                                <div>{{ item.descuser_lvia }}</div>
                                            </div>
                                        </f7-list-item>

                                    </f7-list>
                                </f7-accordion-content>

                                <f7-swipeout-actions right>
                                    <f7-swipeout-button>
                                        <f7-link icon-f7="printer" icon-color="white" icon-size="20" class="swipeout-red"
                                            color="gray" @click="print_ticket(item)"></f7-link>
                                    </f7-swipeout-button>

                                </f7-swipeout-actions>
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-page>
        </f7-view>

    </f7-popup>
</template>
  
<script>
import _ from "lodash";
import { ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";

import { loader } from "../../js/utils/plugins";
import { imprimir } from '../../js/utils/print';

export default {
    props: {
        estado: Boolean,
        list: Array,
    },
    setup(props, context) {
        let tickets = ref([]);
        const store = useStore();

        watch(
            () => props.estado,
            (val) => {
                if (val) tickets.value = props.list;
                else tickets.value = [];
            }
        );

        const open = async () => { };

        const closed = () => {
            context.emit("closed", false);
        };

        const print_ticket = async (item) => {
            const { agencia_lvia, id_lvia } = item;
            loader(true)

            let { message } = await store.dispatch(
                "travels/get_book",
                `${agencia_lvia}|${id_lvia.trim()}|`
            );

            await imprimir({ data: _.cloneDeep(message[0]), formato: "travel_book" });
            await new Promise(r => setTimeout(r, 500));

            await imprimir({ data: _.cloneDeep(message[0]), formato: "travel_book" });
            await new Promise(r => setTimeout(r, 300));
            loader(false)
        };

        const setStyle = (item) => {
            return item.estado_tiq != "1"
                ? {}
                : { background: "rgb(249 91 107)", color: "white !important" };
        };

        return {
            tickets,
            open,
            closed,
            print_ticket,
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