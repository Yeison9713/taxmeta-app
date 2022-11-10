import store from "../js/store";

import Login from '../pages/login.vue'
import User from '../pages/user/index.vue'
import Tickets from '../pages/user/tickets/index.vue'
import Lookup from '../components/lookup.vue'

import NotFoundPage from '../pages/404.vue';

var routes = [
  {
    path: '/',
    redirect: '/login/'
  },
  securedRoute('/login/', Login),
  securedRoute('/user/', User),
  securedRoute('/user/tickets/', Tickets),
  securedRoute('/user/lookup/', Lookup),
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

function securedRoute(path, component, required) {
  return {
    path,
    meta: {
      required: required || false,
    },
    async({ to, from, resolve, reject }) {
      let info = store.getters['middleware/get_info']
      const required = to.route.meta ? to.route.meta.required : false

      if (required && !info) {
        resolve({ component: Ingreso })
      } else if (info && info.session && to.path == '/login/') {
        resolve({ component: User })
      } else {
        resolve({ component: component })
      }

    }
  }
}

export default routes;
