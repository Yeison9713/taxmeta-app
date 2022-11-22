import { request_titan } from '../../utils/request_titan'

export default {
    namespaced: true,
    state: {
        list: [],
    },
    getters: {
        get_list: (state) => {
            return state.list.filter(e => e.identificacion_rut != "")
        },

    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
    },
    actions: {
        query_data(state) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: info.session + "|",
                    url: state.rootGetters['setting/get_url']('customers'),
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {

                        try {

                            let filtro = res.message.filter(e => e.identificacion_rut != "")
                            state.commit('set_data', filtro)
                            resolve()

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)
            })
        },
    }
}