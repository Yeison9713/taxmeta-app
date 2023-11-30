import { useStore } from "vuex";
import { db } from "../../js/firebase";
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
        template: null,
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
    { value: 11, text: "Gamarra" },
    { value: 4, text: "Otro" },
];

var store = ""

const init_store = () => store = useStore();

const dispatch_data = async (id_agencia) => {
    let loader_src = loader(true)
    const info = store.getters["middleware/get_info"];

    id_agencia = info?.key_point?.ticket_office?.id_agc || ''

    loader_src.setTitle(`Actualizando consecutivo...`);
    const response_iterator = await store.dispatch("setting/get_consecutive_t", `${id_agencia}|`)

    loader_src.setTitle(`Descargando viajes...`);
    await store.dispatch("travels/query_data");

    loader_src.setTitle(`Descargando embargues...`);
    await store.dispatch("embargoes/query_data");

    loader_src.setTitle(`Descargando horarios de rutas...`);
    await store.dispatch("schedules/query_data");

    let date_cons = new Date().toISOString().substr(0, 16).replace("T", " ");

    loader(false);

    return { success: true, data: { date_cons, ...response_iterator.message[0] || {}, } }
}

const dispatch_query_sillas = async (id_via) => {
    let loader_src = loader(true)

    loader_src.setTitle("Actualizando sillas...")
    await store.dispatch("travels/query_chairs_firebase", id_via);

    loader(false)
    return { success: true }
}

const template_bus = (tipo_veh) => {
    const data = [
        { id: 1, service: "1. Microbus - 16 pasajeros", template: 'plantilla1' },
        { id: 2, service: "2. Microbus - 17 pasajeros", template: 'plantilla2' },
        { id: 3, service: "3. Taxi - 8 pasajeros", template: 'plantilla3' },
        { id: 4, service: "4. Microbus - 15 pasajeros", template: 'plantilla4' },
        { id: 5, service: "5. Bus preferencial - 44 pasajeros", template: 'plantilla5' },
        { id: 6, service: "6. Microbus - 14 pasajeros", template: 'plantilla6' },
        { id: 7, service: "7. Taxi - 4 pasajeros", template: 'plantilla7' },
        { id: 8, service: "8. Microbus - 18 pasajeros", template: 'plantilla8' },
        { id: 9, service: "9. Bus - 36 pasajeros", template: 'plantilla9' },
        { id: 11, service: "11. Bus - 40 pasajeros", template: 'plantilla11' },
        { id: 12, service: "12. Bus - 42 pasajeros", template: 'plantilla12' },
        { id: 13, service: "13. Bus - 44 pasajeros", template: 'plantilla13' },
        { id: 14, service: "14. Bus - 9 pasajeros", template: 'plantilla14' },
    ]

    return data.find(e => e.id == tipo_veh) || {}
}

const get_template = (template) => {

    const data = {
        plantilla1: {
            sillas: [
                [16, 15, 14],
                [13, false, 12, 11],
                [10, false, 9, 8],
                [7, false, 6, 5],
                ["Puerta", 4, 3],
                [1, 2, "Conductor"],
            ],
        },
        plantilla2: {
            sillas: [
                [17, 16, 15, 14],
                [13, false, 12, 11],
                [10, false, 9, 8],
                [7, false, 6, 5],
                ["Puerta", 4, 3],
                [1, 2, "Conductor"],
            ],
        },
        plantilla3: {
            sillas: [
                [7, 6, 5],
                [8, false, 4],
                ["Puerta", 3, 2],
                [1, "Conductor"],
            ],
        },
        plantilla4: {
            sillas: [
                [15, 14, 13],
                [12, false, 11, 10],
                [9, false, 8, 7],
                ["", false, 6, 5],
                ["Puerta", false, 4, 3],
                [1, 2, "Conductor"],
            ],
        },
        plantilla5: {
            sillas: [
                [43, 44, false, 42, 41],
                [39, 40, false, 38, 37],
                [35, 36, false, 34, 33],
                [31, 32, false, 30, 29],
                [27, 28, false, 26, 25],
                [23, 24, false, 22, 21],
                [19, 20, false, 18, 17],
                [15, 16, false, 14, 13],
                [11, 12, false, 10, 9],
                [7, 8, false, 6, 5],
                [3, 4, false, 2, 1],
                ["Puerta", "Conductor"],
            ],
        },
        plantilla6: {
            sillas: [
                [14, 13, 12, 11],
                [10, false, 9, 8],
                [7, false, 6, 5],
                ["Puerta", false, 4, 3],
                [1, 2, "Conductor"],
            ],
        },
        plantilla7: {
            sillas: [
                [2, 3, 4],
                [1, "Conductor"],
            ],
        },

        plantilla8: {
            sillas: [
                [17, 16, 15, 14],
                [13, false, 12, 11],
                [10, false, 9, 8],
                [7, false, 6, 5],
                ["Puerta", 18, 4, 3],
                [1, 2, "Conductor"],
            ],
        },
        plantilla9: {
            sillas: [
                [35, 36, false, 34, 33],
                [31, 32, false, 30, 29],
                [27, 28, false, 26, 25],
                [23, 24, false, 22, 21],
                [19, 20, false, 18, 17],
                [15, 16, false, 14, 13],
                [11, 12, false, 10, 9],
                [7, 8, false, 6, 5],
                [3, 4, false, 2, 1],
                ["Puerta", "Conductor"],
            ],
        },

        plantilla20: {
            sillas: [
                [43, 44, false, 42, 41],
                [39, 40, false, 38, 37],
                [35, 36, false, 34, 33],
                [31, 32, false, 30, 29],
                [27, 28, false, 26, 25],
                [23, 24, false, 22, 21],
                [19, 20, false, 18, 17],
                [15, 16, false, 14, 13],
                [11, 12, false, 10, 9],
                [7, 8, false, 6, 5],
                [3, 4, false, 2, 1],
                ["Puerta", "Conductor"],
            ],
        },
        plantilla11: {
            sillas: [
                [39, 40, false, 38, 37],
                [35, 36, false, 34, 33],
                [31, 32, false, 30, 29],
                [27, 28, false, 26, 25],
                [23, 24, false, 22, 21],
                [19, 20, false, 18, 17],
                [15, 16, false, 14, 13],
                [11, 12, false, 10, 9],
                [7, 8, false, 6, 5],
                [3, 4, false, 2, 1],
                ["Puerta", "Conductor"],
            ],
        },
        plantilla12: {
            sillas: [
                [false, false, false, 42, 41],
                [39, 40, false, 38, 37],
                [35, 36, false, 34, 33],
                [31, 32, false, 30, 29],
                [27, 28, false, 26, 25],
                [23, 24, false, 22, 21],
                [19, 20, false, 18, 17],
                [15, 16, false, 14, 13],
                [11, 12, false, 10, 9],
                [7, 8, false, 6, 5],
                [3, 4, false, 2, 1],
                ["Puerta", "Conductor"],
            ],
        },
        plantilla13: {
            sillas: [
                [43, 44, false, 42, 41],
                [39, 40, false, 38, 37],
                [35, 36, false, 34, 33],
                [31, 32, false, 30, 29],
                [27, 28, false, 26, 25],
                [23, 24, false, 22, 21],
                [19, 20, false, 18, 17],
                [15, 16, false, 14, 13],
                [11, 12, false, 10, 9],
                [7, 8, false, 6, 5],
                [3, 4, false, 2, 1],
                ["Puerta", "Conductor"],
            ],
        },
        plantilla14: {
            sillas: [
                [7, 6, 5],
                [8, 9, 4],
                ["Puerta", 3, 2],
                [1, "Conductor"],
            ],
        },
        plantilla33: {
            sillas: [
                [16, 15, 14],
                [false, false, false],
                [13, false, 12, 11],
                [10, false, 9, 8],
                [7, false, 6, 5],
                ["Puerta", 4, 3],
                [1, 2, "Conductor"],
            ],
        },
        plantilla25: {
            sillas: [
                [16, 15, 14],
                [13, false, 12, 11],
                [10, false, 9, 8],
                [7, false, 6, 5],
                ["Puerta", 4, 3],
                [1, 2, "Conductor"],
            ],
        }
    }

    return data[template]
}

export {
    init_store,
    init_form,
    f_pagos,
    dispatch_data,
    dispatch_query_sillas,
    template_bus,
    get_template,

}