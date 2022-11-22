import { request_titan } from '../../utils/request_titan'
import { current_date } from '../../utils/plugins'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => state.list.filter(e => e.id_via != "")
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
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
                    .then(resolve).catch(reject)
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
                consecutive: { nro_cons },
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

            Object.keys(chairs).forEach((key, index) => {
                let index2 = index + 1;
                let name = `DATOJ-${String(index2).padStart(3, "0")}`;
                pasajeros[name] = `${String(id_passenger).padStart(15, "0")}|${chairs[key]
                    }|36.5|${names}|`;
            });

            let data =
                agencie +
                "|" +
                nro_cons +
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
                String(service).split("-")[0] +
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
        }
    }
}

const order_data_save = () => {

}