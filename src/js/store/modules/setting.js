import { request_titan } from "../../utils/request_titan"

export default {
    namespaced: true,

    state: {
        ip_service: "https://server1ts.net//financiero/inc/index.php",
        path: "https://server1ts.net/",
        routes: {
            login: "financiero/dlls/login.dll",
            agencies: "Transporte/dlls/CfAgencias00J.dll",
            turns: "Transporte/dlls/CfTurnosJ.dll",
            travels: "Transporte/dlls/PrviajesJ.dll",
            consecutive: "Transporte/dlls/PrconsecutivoJ.dll",
            vehicles: "Transporte/dlls/PrVehiculosJ.dll",
            customers: "Financiero/dlls/Cfrutsj.dll",
            embargoes: "Transporte/dlls/PrembarquesJ.dll",
            schedules: "Transporte/dlls/PrhorariosJ.dll",
            tickets: "Transporte/dlls/PrTiquetesV02J.dll",
            save_ticket: "Transporte/dlls/PrTiquetesV.dll",
            ticket: "Transporte/dlls/prtiquetesvj.dll",
        },
    },

    getters: {
        get_service: (state) => state.ip_service,

        get_url: (state) => (name) => {
            return `${state.routes[name]}`
        },
    },
    actions: {
        get_consecutive(state, data = null) {
            return new Promise((resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let send_data = {
                    data: `${info.session}|${data}`,
                    url: state.rootGetters['setting/get_url']('consecutive'),
                }

                request_titan({ url: ip_service, data: send_data })
                    .then(resolve)
                    .catch(reject)
            })
        }
    }
}