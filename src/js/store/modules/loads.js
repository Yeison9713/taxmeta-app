import { request_titan } from '../../utils/request_titan'

export default {
    namespaced: true,
    state: {
        list: [],
    },
    getters: {
        get_list: (state) => state.list.filter(e => e.id_cargue != ""),
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
    },
    actions: {
        query_data(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('loads')
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

        save(state, send_data) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""
                let token = state.rootGetters['middleware/get_info']

                let data = {
                    data: `${token.session}|${send_data}`,
                    url: state.rootGetters['setting/get_url']('save_load')
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
        }
    }
}