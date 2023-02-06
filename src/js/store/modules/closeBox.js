import { request_titan } from "../../utils/request_titan"

export default {
    namespaced: true,
    state: {

    },
    getters: {},
    actions: {
        square(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('square'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },
        balance_aux(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('balance_aux'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },

        query_travels(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('travels3'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },

        query_tickets(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('tickets04'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },

        query_ltravels(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('travelsVJ'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },

        query_vouchers(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('vouchers'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },

        get_consecutive(state, agencie) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|17|${agencie}|`,
                    url: state.rootGetters['setting/get_url']('consecutive'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },
        save(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}${send_data}`,
                    url: state.rootGetters['setting/get_url']('save_close_box'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        },
        print(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('print_close_box'),
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)
            })
        }
    }
}