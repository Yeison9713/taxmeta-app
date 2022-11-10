export default {
    namespaced: true,

    state: {
        ip_service: "https://server1ts.net//financiero/inc/index.php",
        path: "https://server1ts.net/",
        routes: {
            login: "financiero/dlls/login.dll",
            agencies: "Transporte/dlls/CfAgencias00J.dll",
            turns: "Transporte/dlls/CfTurnosJ.dll",
            travels: "Transporte/dlls/PrviajesJ.dll"
        },
    },

    getters: {
        get_service: (state) => state.ip_service,

        get_url: (state) => (name) => {
            return `${state.routes[name]}`
        },
    }
}