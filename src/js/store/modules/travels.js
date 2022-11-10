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
        queryData(state) {
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
        }
    }
}