<template>
  <f7-popup
    class="lookup"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar :title="`Busqueda de ${$props.params.text}`">
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
import _ from "lodash";
import { f7 } from "framework7-vue";
import { computed, ref } from "vue";

export default {
  props: {
    estado: Boolean,
    params: {
      type: Object,
      default: {
        text: "No se ha definido",
        data: [],
        columns: {},
      },
    },
  },
  setup(props, context) {
    const { params } = props;

    let lookup = ref([]);
    let vlData = ref({ items: [] });

    const list_id = computed(() => "lookup-list-" + params?.text);

    const open = async () => {
      let index = 0;
      let { columns, data } = props.params;
      lookup.value = [];

      for await (const item of data) {
        lookup.value.push({
          text: `${item[columns.text]}`,
          value: item[columns.value],
          index,
        });

        ++index;
      }

      replaceData(lookup.value);
    };

    const closed = () => context.emit("closed", false);

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

    const replaceData = (data = []) => {
      let virtualList = f7.virtualList.get(
        document.getElementById(list_id.value)
      );

      if (virtualList) {
        virtualList.replaceAllItems(data);
      }
    };

    const renderExternal = (vl, data) => {
      vlData.value = data;
    };

    const select_item = (item) => {
      let data = props.params.data[item.index] || {};
      context.emit("callback", _.cloneDeep(data));
    };

    return {
      params,
      lookup,
      vlData,
      list_id,
      open,
      closed,
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
  /* background: #029040 !important; */
  color: #fff;
}

.lookup .navbar,
.subnavbar,
.lookup .navbar .icon {
  color: #fff;
}
</style>