import { request_titan } from '../../utils/request_titan'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => state.list.filter(e => e.id_rep != ''),
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
    },
    actions: {
        download(state, { agencie }) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: `${agencie}|`,
                    url: state.rootGetters['setting/get_url']('turns')
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