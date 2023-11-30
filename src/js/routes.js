import store from "../js/store";

import Login from '../pages/login.vue'
import User from '../pages/user/index.vue'
import Profile from '../pages/user/profile.vue'
import Tickets from '../pages/user/tickets/index.vue'
import VehicleLoad from '../pages/user/loads/index.vue'
import closeBox from '../pages/user/closeBox/index.vue'
import reportTickets from '../pages/user/tickets/report.vue'
import reportTravel from '../pages/user/tickets/reportTravel.vue'

import NotFoundPage from '../pages/404.vue';

var routes = [
  {
    path: '/',
    redirect: '/login/'
  },
  securedRoute('/login/', Login),
  securedRoute('/user/', User),
  securedRoute('/user/profile/', Profile),
  securedRoute('/user/tickets/', Tickets),
  securedRoute('/user/vehicle-load/', VehicleLoad),
  securedRoute('/user/close-box/', closeBox),
  securedRoute('/user/report/tickets/', reportTickets),
  securedRoute('/user/report/travel/', reportTravel),
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
