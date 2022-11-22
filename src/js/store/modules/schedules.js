import { request_titan } from '../../utils/request_titan'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => state.list.filter(e => e.id_hor != "")
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

                let data = {
                    data: token.session + "|",
                    url: state.rootGetters['setting/get_url']('schedules')
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