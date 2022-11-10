<template>
  <f7-popup
    class="lookup"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar :title="`Busqueda de ${params?.text?.toLocaleLowerCase()}`">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>

          <f7-subnavbar :inner="false">
            <f7-searchbar
              search-container=".lookup .virtual-list"
              search-item=".lookup li"
              search-in=".lookup .item-title"
              placeholder="Buscar por código o nombre..."
            ></f7-searchbar>
          </f7-subnavbar>
        </f7-navbar>

        <f7-list class="searchbar-not-found">
          <f7-list-item
            title="No se han encontrado coincidencias"
          ></f7-list-item>
        </f7-list>

        <f7-list
          :id="list_id"
          class="search-list searchbar-found"
          virtual-list
          :virtual-list-params="{
            items: lookup,
            searchAll: filter_data,
            renderExternal,
          }"
        >
          <ul style="height: auto !important">
            <f7-list-item
              media-item
              v-for="(item, j) in vlData.items"
              :key="j"
              link="#"
              :title="item.text"
              after="Seleccionar"
              custom-search
              :style="`top: ${vlData.topPosition}px`"
              @click="select_item(item)"
            >
              <template #text>
                <b>Código:</b>
                {{ parseInt(item.value) }}
              </template>
            </f7-list-item>
          </ul>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import { f7 } from "framework7-vue";
import { reactive, computed } from "vue";

export default {
  setup({ params = {}, estado = true }) {
    let lookup = reactive([]);
    let vlData = reactive({
      items: [],
    });

    const list_id = computed(() => "lookup-list-" + params?.text);

    const open = async () => {
      console.log("open");
      for (const iterator of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        lookup.push({
          text: `texto - ${iterator}`,
          value: iterator,
          index: iterator,
        });
      }
    };

    const close = () => {
      console.log("close");
    };

    const filter_data = (query, items) => {
      const found = [];
      let keys = ["text", "value"];

      let data = items
        .map((el, index) => {
          el.index = index;
          return el;
        })
        .filter((el) =>
          keys.some((key) =>
            el[key].toString().toUpperCase().includes(query.toUpperCase())
          )
        );

      data.forEach((el) => found.push(el.index));
      return found;
    };

    const replaceData = () => {
      let virtualList = f7.virtualList.get(document.getElementById(list_id));

      if (virtualList) {
        virtualList.replaceAllItems(data);
      }
    };

    const renderExternal = (vl, data) => {
      vlData = data;
    };

    const select_item = (item) => {
      console.log(item);
    };

    return {
      estado,
      params,
      lookup,
      vlData,
      list_id,
      open,
      close,
      filter_data,
      replaceData,
      renderExternal,
      select_item,
    };
  },
};
</script>


<style>
.lookup .navbar .navbar-bg,
.lookup .navbar .subnavbar {
  background: #029040 !important;
  color: #fff;
}

.lookup .navbar,
.subnavbar,
.lookup .navbar .icon {
  color: #fff;
}
</style>