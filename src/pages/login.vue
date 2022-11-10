<template>
  <f7-page name="login">
    <f7-row
      :style="{ height: '100%' }"
      class="display-flex align-items-center justify-content-space-around"
    >
      <f7-col :style="{ 'border-radius': '5px', background: '#fff' }">
        <f7-list
          class="width-100"
          inset
          no-hairlines
          no-hairlines-between
          :style="{ margin: '11px 0 5px 0' }"
        >
          <f7-list-item id="logo">
            <div
              :style="{
                backgroundImage: `url(${logo})`,
                backgroundSize: '100% auto',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }"
            ></div>
          </f7-list-item>

          <f7-list-input
            label="Usuario"
            type="text"
            floating-label
            error-message="Campo obligatorio"
            required
            clear-button
            outline
            autofocus
            v-model:value="form.user"
            :error-message-force="errores.user"
            @input="errores.user = false"
          >
          </f7-list-input>

          <f7-list-item-row class="display-block input-login-password">
            <f7-row no-gap>
              <f7-col width="90">
                <f7-list-input
                  label="Contraseña"
                  :type="show_pass ? 'text' : 'password'"
                  floating-label
                  error-message="Campo obligatorio"
                  required
                  clear-button
                  outline
                  class="input-login"
                  v-model:value="form.password"
                  :error-message-force="errores.password"
                  @input="errores.password = false"
                >
                </f7-list-input>
              </f7-col>
              <f7-col
                width="10"
                class="align-self-center text-align-center"
                :style="{ 'margin-top': '10px' }"
              >
                <f7-link
                  :icon-material="show_pass ? 'visibility' : 'visibility_off'"
                  icon-size="24"
                  :icon-color="show_pass ? 'dark-blue' : 'gray'"
                  @click="show_pass = !show_pass"
                ></f7-link>
              </f7-col>
            </f7-row>
          </f7-list-item-row>

          <f7-list-item>
            <Autocomplete
              :idLabel="'autocomplete-taquilla'"
              :label="'Taquilla'"
              :errorLabel="errores.taquilla"
              :items="agencies"
              :keyItem="'id_agc'"
              :labelText="'descrip_agc'"
              :format="true"
              :returnObject="true"
              @output="(e) => (form.taquilla = e)"
            >
            </Autocomplete>
          </f7-list-item>

          <f7-list-item>
            <Autocomplete
              :idLabel="'autocomplete-turno'"
              :label="'Turno'"
              :errorLabel="errores.turno"
              :items="turns"
              :keyItem="'id_rep'"
              :labelText="'descrip_rep'"
              :returnObject="true"
              @output="(e) => (form.turno = e)"
            >
            </Autocomplete>
          </f7-list-item>

          <f7-list-item
            checkbox
            title="Recordar cuenta"
            name="demo-checkbox"
            v-model:checked="remember_account"
          ></f7-list-item>

          <f7-list-item>
            <f7-button
              large
              fill
              :style="{
                width: '100%',
              }"
              @click="validateLogin"
            >
              Ingresar
            </f7-button>
          </f7-list-item>

          <f7-list-item
            class="display-flex align-items-center justify-content-center"
          >
            <span
              :style="{
                'font-weight': '400',
                'font-size': ' 12px',
                color: '#CCC',
              }"
              class="text-align-center"
            >
              Titansoluciones
              <br />
              V.
              {{
                info_app.version
                  ? info_app.version + " - " + info_app.build
                  : "Taxmeta"
              }}
            </span>
          </f7-list-item>
        </f7-list>
      </f7-col>
    </f7-row>
  </f7-page>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { loader, toast } from "../js/utils/plugins";

import logo from "../assets/logo.png";
import Autocomplete from "../components/autocomplete.vue";
import _ from "lodash";

import { f7 } from "framework7-vue";

export default {
  components: {
    Autocomplete,
  },
  setup() {
    const show_pass = ref(false);
    const remember_account = ref(false);
    const store = useStore();
    const agencies = computed(() => store.getters["agencies/get_list"]);
    const turns = computed(() => store.getters["turns/get_list"]);

    const info_app = reactive({
      id: null,
      name: null,
      build: null,
      version: null,
    });

    const form = reactive({
      user: null,
      password: null,
      taquilla: null,
      turno: null,
    });

    const errores = reactive({
      user: false,
      password: false,
      taquilla: null,
      turno: false,
    });

    const validateLogin = () => {
      if (!form.user) errores.user = true;
      else if (!form.password) errores.password = true;
      else if (!form.taquilla) errores.taquilla = true;
      else if (!form.turno) errores.turno = true;
      else {
        loader(true);

        store
          .dispatch("middleware/login", {
            user: form.user,
            password: form.password,
            ticket_office: form.taquilla,
            turn: form.turno,
            remember_account: remember_account.value,
          })
          .then((res) => {
            setTimeout(() => location.reload(), 350);
            loader(false);
          })
          .catch((error) => {
            loader(false);
            toast(error?.message[0] || error);
          });
      }
    };

    const download_agencies = () => store.dispatch("agencies/download");
    const download_turns = (agencie) =>
      store.dispatch("turns/download", { agencie });

    onMounted(async () => {
      download_agencies();
      if (window.Capacitor || f7.device.electron) {
        let info = await window.Capacitor.Plugins.App.getInfo();
        info_app.id = info.id;
        info_app.name = info.name;
        info_app.build = info.build;
        info_app.version = info.version;

        console.log("[APP INFO]", info_app);
      }
    });

    watch(
      () => form.taquilla,
      (val) => {
        download_turns(val?.id_agc || "");
      }
    );

    return {
      logo,
      show_pass,
      form,
      errores,
      remember_account,
      info_app,
      agencies,
      turns,

      validateLogin,
      download_agencies,
    };
  },
};
</script>

<style lang="sass">
[data-name=ingreso].page-current
  display: flex
  justify-content: center

  .page-content
    width: 90%

#logo
  display: flex
  justify-content: space-around
  align-items: center

  .item-inner
    flex-direction: column
    padding: 0

  div
    width: 200px
    height: 70px

.input-login > .item-content > .item-media
  padding: 3px 0 0 0 !important
  align-self: center
  min-width: 0

.input-login-password
  padding-right: calc( var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-right) - var(--menu-list-offset))
</style>