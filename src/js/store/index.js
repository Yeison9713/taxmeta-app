import { createStore } from 'vuex';
import middleware from './modules/middleware';
import setting from './modules/setting'
import agencies from './modules/agencies';
import turns from './modules/turns';
import travels from './modules/travels';

export default createStore({
    modules: {
        setting,
        agencies,
        turns,
        middleware,
        travels
    }
})