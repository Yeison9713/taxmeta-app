<template>
  <f7-block>
    <f7-block>
      <f7-sheet
        class="sheet-menu-list"
        style="height: auto; --f7-sheet-bg-color: #fff"
        swipe-to-close
        backdrop
        animate
        push
      >
        <f7-list menu-list>
          <f7-list-item
            link="/user/lookup/"
            title="Buscador"
            :selected="selected === 'search'"
            @click="selected = 'search'"
            sheet-close=".sheet-menu-list"
          >
          </f7-list-item>

          <f7-list-item
            link
            title="Perfil"
            :selected="selected === 'profile'"
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
            :selected="selected === 'tickets'"
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
            :selected="selected === 'logout'"
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