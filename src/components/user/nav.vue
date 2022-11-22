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
              class="
                display-flex
                padding
                justify-content-space-between
                align-items-center
              "
            >
              <div><b>Menu </b></div>
            </div>
          </div>
          <div class="right">
            <f7-link sheet-close>Cerrar</f7-link>
          </div>
        </f7-toolbar>

        <f7-list menu-list class="no-hairline menu_user">
          <f7-list-item
            link="/user/profile/"
            title="Perfil"
            @click="() => (selected = 'profile')"
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

          <f7-list-item
            link="/user/tickets/"
            title="Tiquetes"
            @click="() => (selected = 'tickets')"
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
            link
            title="Cerrar sesiòn"
            @click="(selected = 'logout'), logout()"
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
    const selected = ref("home");
    const selectedMedia = ref("home");
    const store = useStore();

    const logout = () => store.dispatch("middleware/logout");

    return { selected, selectedMedia, logout };
  },
};
</script>