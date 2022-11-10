import { request_titan } from '../../utils/request_titan'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => state.list.filter(e => e.id_agc != ''),
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
    },
    actions: {
        download(state) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: "0000008920001130000000860072432021010711510301|901|",
                    url: state.rootGetters['setting/get_url']('agencies')
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