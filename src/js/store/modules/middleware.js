import { request_titan } from '../../utils/request_titan'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        session: null,
        user: null,
        key_point: null
    },
    getters: {
        get_info: (state) => {

            try {
                let token = localStorage.token || sessionStorage.token
                return JSON.parse(atob(token) || '{}')
            } catch (error) {
                return {}
            }

        }

    },
    actions: {
        login(state, { user, password, ticket_office, turn, remember_account }) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: `892000113|${user}|${password}|0|`,
                    url: state.rootGetters['setting/get_url']('login')
                }

                request_titan({ url: ip_service, data })
                    .then(res => {
                        try {
                            let [session, names, company, complete_names, code] = res.message

                            let token = {
                                code,
                                session,
                                company,
                                user: { names, complete_names },
                                key_point: { ticket_office, turn }
                            }

                            let encode = btoa(JSON.stringify(token))
                            remember_account ? localStorage.token = encode : sessionStorage.token = encode

                            res.token = encode
                            resolve(res)

                        } catch (error) {
                            reject(error)
                        }
                    }).catch(reject)


            })
        },
        logout(state) {
            sessionStorage.clear()
            localStorage.clear()

            setTimeout(() => location.reload(), 750);
        }
    }
}