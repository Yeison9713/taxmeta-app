<template>
  <f7-popup
    class="lookup"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Sillas">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-list>
          <f7-list-item
            v-for="item in select_chairs"
            :key="item?.silla?.silla"
            checkbox
            :disabled="item?.type == 'ocuped' ? true : false"
            :title="item.name"
            :name="item.name"
            :checked="item.select"
            @change="
              (e) => (
                (item.select = e.target.checked),
                (item.type = item.select ? 'selected' : '')
              )
            "
          ></f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import _ from "lodash";
import { watch, computed, ref } from "@vue/runtime-core";
import { dispatch_query_sillas, get_template } from ".";
import { useStore } from "vuex";

export default {
  props: {
    estado: Boolean,
    params: {
      template: String,
      id_via: String,
    },
  },
  setup(props, context) {
    const store = useStore();
    const select_chairs = ref([]);

    const chairs_store = computed(
      () => store.getters["travels/get_list_chairs"]
    );

    watch(
      () => props.params.id_via,
      async (val) => {
        if (val) await dispatch_query_sillas(val);
        else select_chairs.value = [];
      }
    );

    watch(
      () => chairs_store,
      (val) => {
        const template = get_template(props.params.template);
        const glass = [];

        template.sillas.forEach((el, row) => {
          el.forEach((cell, col) => {
            if (!["Puerta", "Conductor", false].includes(cell)) {
              let data = val.value.find((e) => e.silla.silla == cell);

              glass.push({
                type: data?.type || "",
                silla: {
                  col,
                  row,
                  silla: cell,
                  ref: `silla-${row}-${col}`,
                  type: data?.silla?.type || "",
                },
                name: `Silla ${cell}`,
                select: data?.type ? true : false,
              });
            }
          });
        });

        select_chairs.value = _.cloneDeep(
          glass.sort((a, b) => a.silla.silla - b.silla.silla)
        );
      },
      { deep: true }
    );

    const closed = () => {
      context.emit("closed", _.cloneDeep(select_chairs.value));
    };

    const open = async () => {};

    return { closed, open, select_chairs };
  },
};
</script>