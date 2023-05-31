<template>
  <f7-block>
    <f7-block>
      <f7-sheet
        class="sheet-menu-list"
        style="height: auto; --f7-sheet-bg-color: #fff"
        swipe-to-close
        swipe-to-step
        backdrop
        animate
      >
        <f7-toolbar>
          <div class="left">
            <div
              class="display-flex padding justify-content-space-between align-items-center"
            >
              <div><b>Menu </b></div>
            </div>
          </div>
          <div class="right">
            <f7-link sheet-close>Cerrar</f7-link>
          </div>
        </f7-toolbar>

        <f7-list accordion-list class="no-hairline menu_user">
          <f7-list-item
            link="/user/profile/"
            title="Perfil"
            sheet-close=".sheet-menu-list"
          >
            <template #media>
              <f7-icon
                md="material:person"
                aurora="f7:person_fill"
                ios="f7:person_fill"
              />
            </template>
          </f7-list-item>

          <f7-list-item accordion-item title="Procesos">
            <template #media>
              <f7-icon
                md="material:rebase_edit"
                aurora="f7:rebase_edit"
                ios="f7:rebase_edit"
              />
            </template>

            <f7-accordion-content>
              <f7-list menu-list>
                <f7-list-item
                  link="/user/tickets/"
                  title="Tiquetes"
                  sheet-close=".sheet-menu-list"
                >
                  <template #media>
                    <f7-icon
                      md="material:article"
                      aurora="f7:house_fill"
                      ios="f7:house_fill"
                    />
                  </template>
                </f7-list-item>

                <f7-list-item
                  link="/user/vehicle-load/"
                  title="Cargues"
                  sheet-close=".sheet-menu-list"
                >
                  <template #media>
                    <f7-icon
                      md="material:bookmark"
                      aurora="f7:house_fill"
                      ios="f7:house_fill"
                    />
                  </template>
                </f7-list-item>

                <f7-list-item
                  link="/user/close-box/"
                  title="Cierre de caja"
                  sheet-close=".sheet-menu-list"
                >
                  <template #media>
                    <f7-icon
                      md="material:request_quote"
                      aurora="f7:house_fill"
                      ios="f7:house_fill"
                    />
                  </template>
                </f7-list-item>
              </f7-list>
            </f7-accordion-content>
          </f7-list-item>

          <f7-list-item accordion-item title="Reportes">
            <template #media>
              <f7-icon
                md="material:receipt_long"
                aurora="f7:receipt_long"
                ios="f7:receipt_long"
              />
            </template>

            <f7-accordion-content>
              <f7-list menu-list>
                <f7-list-item
                  link="/user/report/tickets/"
                  title="Tiquetes"
                  sheet-close=".sheet-menu-list"
                >
                  <template #media>
                    <f7-icon
                      md="material:article"
                      aurora="f7:house_fill"
                      ios="f7:house_fill"
                    />
                  </template>
                </f7-list-item>
              </f7-list>
            </f7-accordion-content>
          </f7-list-item>

          <f7-list-item
            link
            title="Cerrar sesiòn"
            @click="logout()"
            sheet-close=".sheet-menu-list"
          >
            <template #media>
              <f7-icon
                md="material:lock"
                aurora="f7:gear_alt_fill"
                ios="f7:gear_alt_fill"
              />
            </template>
          </f7-list-item>
        </f7-list>
      </f7-sheet>
    </f7-block>
  </f7-block>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    const logout = () => store.dispatch("middleware/logout");

    return { logout };
  },
};
</script>

<style>
.menu_user {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>