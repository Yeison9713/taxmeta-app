import { useStore } from "vuex";
import { current_date, loader } from "../../js/utils/plugins";

const init_form = () => {
    return {
        consecutive: {},
        travel: null,
        date: current_date().split("/").reverse().join("-"),
        origin: null,
        destination: null,
        time_route: null,
        vehicle: null,
        descrip_veh: null,
        driver: null,
        descrip_driver: null,
        service: null,
        passenger: {
            id: null,
            names: null,
            time_out: new Date().toISOString().substr(0, 16),
            quantity: 0,
            amount: 0,
            discount: 0,
        },
        detail: {
            subtotal: 0,
            safe_value: 0,
            value_pay: 0,
            payment_form: 1,
        },
    };
}

const f_pagos = [
    { value: 1, text: "Efectivo" },
    { value: 6, text: "Yates" },
    { value: 9, text: "Convenio brasilia" },
    { value: 7, text: "Redbus" },
    { value: 10, text: "PinBus" },
    { value: 2, text: "Tarjeta credito" },
    { value: 3, text: "Tarjeta debito" },
    { value: 8, text: "Reserva" },
    { value: 4, text: "Otro" },
];

var store = ""

const init_store = () => store = useStore();

const dispatch_data = async () => {
    let loader_src = loader(true)

    loader_src.setTitle(`Actualizando consecutivo...`);
    const response_iterator = await store.dispatch("setting/get_consecutive", "10|0001|")

    loader_src.setTitle(`Descargando viajes...`);
    await store.dispatch("travels/query_data");

    loader_src.setTitle(`Descargando embargues...`);
    await store.dispatch("embargoes/query_data");

    loader_src.setTitle(`Descargando horarios de rutas...`);
    await store.dispatch("schedules/query_data");

    let date_cons = new Date().toISOString().substr(0, 16).replace("T", " ");

    loader(false);

    return { succes: true, data: { date_cons, ...response_iterator.message[0] || {}, } }
}

export { init_store, init_form, f_pagos, dispatch_data }