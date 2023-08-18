import { request_titan } from '../../utils/request_titan'
import { current_date } from '../../utils/plugins'
import _ from 'lodash'

import { db } from '../../firebase';
import { where } from "@firebase/firestore";
import { collection, getDocs, query, addDoc } from "firebase/firestore";

export default {
    namespaced: true,
    state: {
        list: [],
        chairs: []
    },
    getters: {
        get_list: (state) => state.list.filter(e => e.id_via != ""),
        get_list_chairs: (state) => state.chairs
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
        set_data_chairs(state, data) {
            state.chairs = data
        }
    },
    actions: {
        query_data(state) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']
                let date = current_date().split('/').reverse().join("")

                let data = {
                    data: `${token.session}|${date}`,
                    url: state.rootGetters['setting/get_url']('travels')
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {

                        try {
                            state.commit('set_data', res.message)
                            resolve(res)

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)
            })
        },

        save_ticket(state, form) {
            return new Promise(async (resolve, reject) => {
                try {
                    let ip_service = state.rootState.setting?.ip_service || ""
                    let token = state.rootGetters['middleware/get_info']

                    const { data: send_data, pasajeros } = await state.dispatch("order_data_save", form)

                    let data = {
                        data: JSON.stringify({
                            importarhtml: `${token.session}|${send_data}`,
                            ...pasajeros
                        }),
                        url: state.rootGetters['setting/get_url']('save_ticket'),
                        json: true
                    }

                    request_titan({ url: ip_service, data })
                        .then(async (res) => {

                            await state.dispatch("update_chairs_firebase", {
                                form,
                                session: token.session,
                            })

                            resolve(res)
                        }).catch(reject)
                } catch (error) {
                    console.log("Error save ticket: ", error)
                    reject(error)
                }

            })
        },

        get_ticket(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: JSON.stringify({
                        importarhtml: `${token.session}|${send_data}`,
                    }),
                    url: state.rootGetters['setting/get_url']('ticket'),
                    json: true
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },

        all_tickets(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('tickets'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },

        order_data_save(state, form = {}) {
            let info = state.rootGetters['middleware/get_info']

            let agencie = info?.key_point?.ticket_office?.id_agc;
            let turn = info?.key_point?.turn?.id_rep;

            let {
                consecutive: { nro },
                date,
                vehicle,
                travel: { id_via, cantpasajeros_via: service },
                origin,
                destination,
                driver,
                passenger: { time_out, quantity, id: id_passenger, names, discount },
                detail: { payment_form, value_pay, safe_value, subtotal },
            } = form;

            let pasajeros = {}
            let chairs = form.pasajeros

            chairs.forEach((item, index) => {
                let index2 = index + 1;
                let name = `DATOJ-${String(index2).padStart(3, "0")}`;

                pasajeros[name] = `${String(id_passenger).padStart(15, "0")}|${item.silla.silla
                    }|36.5|${names}|`;
            });

            let data =
                agencie +
                "|" +
                String(nro).trim() +
                "|" +
                date.replace(/-/g, "") +
                "|" +
                time_out.split("T")[1].replace(":", "") +
                "|" +
                vehicle +
                "|" +
                id_via +
                "|" +
                String(origin).padStart(4, "0") +
                "|" +
                String(destination).padStart(4, "0") +
                "|" +
                String(driver).padStart(15, "0") +
                "|" +
                String(service) +
                "|" +
                payment_form +
                "|" +
                quantity +
                "|" +
                String(subtotal).replace(/,/g, "") +
                "|" +
                discount +
                "|" +
                String(safe_value).replace(/,/g, "") +
                "|" +
                turn +
                "|";

            return { data, pasajeros };
        },

        query_chairs_firebase(state, id_via) {
            return new Promise(async (resolve, reject) => {
                try {
                    const q = query(collection(db, "tax_sillas"), where("viaje", "==", id_via));
                    const snapshot = await getDocs(q);
                    let list = [];

                    snapshot.forEach(function (doc) {
                        let data = doc.data();
                        data.id = doc.id;
                        list.push(data);
                    });

                    state.commit('set_data_chairs', list)

                    resolve(true);
                } catch (error) {
                    console.log("Error query tax_sillas", error)
                    reject()
                }
            })
        },

        update_chairs_firebase(state, { form, session } = {}) {
            return new Promise(async (resolve, reject) => {
                try {
                    let list = form.pasajeros

                    let {
                        passenger: { id: id_passenger, names },
                        travel: { id_via },
                    } = form

                    for (const el of list) {
                        let obj = JSON.parse(JSON.stringify(el));
                        obj.silla.type = "selected"

                        const ref = {
                            silla: { ...obj.silla },
                            pasajero: { id: id_passenger, nombre: names, temperatura: "36.5" },
                            fecha: new Date().getTime(),
                            viaje: id_via,
                            sesion: session,
                            type: "ocuped"
                        }

                        const colRef = collection(db, "tax_sillas")
                        await addDoc(colRef, ref)
                    }

                    resolve({ success: true, data: null })
                } catch (error) {
                    console.log("Error update tax_sillas", error)
                    reject({ success: false, message: error })
                }
            })
        },

        travel_book(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('travel_book')
                }

                request_titan({ url: ip_service, data })
                    .then(resolve)
                    .catch(reject)
            })
        },

        get_book(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('book')
                }

                request_titan({ url: ip_service, data })
                    .then(resolve)
                    .catch(reject)
            })
        },

        close_book(state, form = {}) {
            return new Promise((resolve, reject) => {
                let agencia = form.agencia;
                let viaje = form.nroCargue;
                let avance = form.avance || 0;
                let recaudo = form.recaudo || 0;
                let redBus = form.redBus || 0;
                let segSocial = form.segSocial || 0;
                let total = form.totalPagar;
                let detalle = form.observaciones || 0;
                let placa = form.vehiculo;
                let pinBus = form.pinBus || 0;
                let brasilia = form.brasilia || 0;
                let gamarra = form.gamarra || 0;

                let token = state.rootGetters['middleware/get_info']
                let turno = token.key_point.turn.id_rep;
                let session = token.session;

                let send_data = {
                    data: session +
                        "|" +
                        agencia +
                        "|" +
                        viaje +
                        "|" +
                        avance +
                        "|" +
                        recaudo +
                        "|" +
                        redBus +
                        "|" +
                        segSocial +
                        "|" +
                        total +
                        "|" +
                        detalle +
                        "|" +
                        placa +
                        "|" +
                        pinBus +
                        "|" +
                        "0" +
                        "|" +
                        turno +
                        "|" +
                        brasilia +
                        "|" +
                        gamarra +
                        "|",
                    url: state.rootGetters['setting/get_url']('close_book')
                }

                let ip_service = state.rootState.setting?.ip_service || ""

                request_titan({ url: ip_service, data: send_data })
                    .then(resolve)
                    .catch(reject);
            })
        },

        contab_book(state, form = {}) {
            return new Promise((resolve, reject) => {
                let send_data = ""
                let ip_service = state.rootState.setting?.ip_service || ""

                const array_variable = [
                    'nro_lvia', 'nrocargue_lvia', 'fecha_lvia', 'agencia_lvia',
                    'placa_lvia', 'vlrbruto_lvia', 'vlrseguro_lvia', 'iderp_lvia', 'vlrefectivo_lvia',
                    'vlryates_lvia', 'codconvenio_lvia', 'vlrbrasilia_lvia', 'vlrredbus_lvia', 'vlrtcred_lvia',
                    'vlrtdeb_lvia', 'vlrreservas_lvia', 'vlrotros_lvia', 'ctacaja_lvia', 'ctaingreso_lvia', 'idpropietario_lvia',
                    'porcfondo_lvia', 'porcfondor_lvia', 'porcempresa_lvia', 'lote_lvia', 'ctavehiculo_lvia', 'tipoveh_lvia',
                    'idagencia_lvia', 'vlrpinbus_lvia'
                ]

                form.fecha_lvia = form.fecha_lvia.replaceAll("/", "")

                for (let name of array_variable) {
                    send_data += `${form[name].trim()}|`
                }

                send_data += `0|${form.vlrgamarra}|`

                let data = {
                    data: `${send_data}`,
                    url: state.rootGetters['setting/get_url']('contab_book'),
                    // setUrl: "https://server2ts.net/taxmeta/inc/index.php"
                }

                request_titan({ url: "https://server2ts.net/taxmeta/inc/index.php", data })
                    .then(resolve)
                    .catch(reject)
            })
        },

        all_tickets_r(state, send_data) {
            return new Promise((resolve, reject) => {
                let token = state.rootGetters['middleware/get_info']
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('tickets_r')
                }

                request_titan({ url: ip_service, data })
                    .then(resolve)
                    .catch(reject)
            })
        },

        cancel_travel(state, send_data) {
            return new Promise((resolve, reject) => {
                let token = state.rootGetters['middleware/get_info']
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('cancel_travel')
                }

                request_titan({ url: ip_service, data })
                    .then(resolve)
                    .catch(reject)
            })
        },
    }
}