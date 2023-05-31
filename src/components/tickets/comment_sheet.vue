<template>
  <f7-sheet
    id="comment-sheet"
    style="height: auto; --f7-sheet-bg-color: #fff"
    swipe-to-close
    swipe-to-step
    backdrop
    @sheet:closed="closed"
  >
    <f7-toolbar>
      <div class="left">
        <div
          class="display-flex padding justify-content-space-between align-items-center"
        >
          <div><b>Nro viaje: </b></div>
          <div>
            &nbsp;
            {{ parseFloat(item?.nro_tiq) || "" }}
          </div>
        </div>
      </div>
      <div class="right">
        <f7-link sheet-close>Cerrar</f7-link>
      </div>
    </f7-toolbar>

    <f7-block-title class="margin-top" style="font-size: 16px"
      >Observación:</f7-block-title
    >

    <f7-list no-hairlines>
      <f7-list-input
        type="textarea"
        floating-label
        error-message="Campo obligatorio"
        required
        outline
        maxlength="270"
        v-model:value="form.comment"
        placeholder="Ingrese una observación"
      >
      </f7-list-input>
      <f7-list-item>
        <f7-button class="width-100" large outline @click="grabar"
          >Grabar</f7-button
        >
      </f7-list-item>
    </f7-list>
  </f7-sheet>
</template>

<script>
import { reactive, watch } from "@vue/runtime-core";
import { f7 } from "framework7-vue";
import { toast } from "../../js/utils/plugins";
export default {
  props: {
    estado: Boolean,
    item: Object,
  },
  setup(props, context) {
    const form = reactive({ comment: null });

    watch(
      () => props.estado,
      (val) => {
        let element = document.getElementById("comment-sheet");
        const sheet = f7.sheet.get(element);

        if (val) sheet.open();
        else {
          form.comment = null;
          sheet.close();
        }
      }
    );

    const grabar = () => {
      if (form.comment) context.emit("callback", { ...props.item, ...form });
      else toast("Debe ingresar una observacion");
    };

    const closed = () => {
      context.emit("closed");
    };

    return { form, grabar, closed };
  },
};
</script>