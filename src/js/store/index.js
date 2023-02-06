import { createStore } from 'vuex';
import middleware from './modules/middleware';
import setting from './modules/setting'
import agencies from './modules/agencies';
import turns from './modules/turns';
import travels from './modules/travels';
import vehicles from './modules/vehicles';
import customers from './modules/customers'
import embargoes from './modules/embargoes';
import schedules from './modules/schedules';
import loads from './modules/loads';
import closebox from './modules/closeBox';

export default createStore({
    modules: {
        setting,
        agencies,
        turns,
        middleware,
        travels,
        vehicles,
        customers,
        embargoes,
        schedules,
        loads,
        closebox
    }
})