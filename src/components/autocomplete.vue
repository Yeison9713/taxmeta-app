<template >
  <f7-list-input
    class="autocomplete-ts"
    :id="idLabel"
    :label="label"
    type="text"
    floating-label
    error-message="Campo obligatorio"
    :required="required"
    clear-button
    outline
    :error-message-force="errorLabel"
    @input="errorLabel = false"
  >
  </f7-list-input>
</template>

<script>
import { onMounted } from "vue";
import { f7 } from "framework7-vue";
import _ from "lodash";

export default {
  name: "autocomplete",
  props: {
    idLabel: {
      type: String,
      default: "autocomplete-dropdown",
    },
    label: {
      type: String,
      default: "Without label",
    },
    required: {
      type: Boolean,
      default: false,
    },
    errorLabel: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: [],
    },
    keyItem: {
      type: String,
      default: "Without label",
    },
    labelText: {
      type: String,
      default: "",
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    format: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const set_data = ({ query, items, key, label, format }) => {
      let results = [];

      for (let item of items) {
        let index = item[key].toLowerCase().indexOf(query.toLowerCase());

        if (index >= 0) {
          let log = format ? item[key] + " - " + item[label] : item[label];
          let obj = { [key]: log, [label]: log, key: item[key] };

          results.push(obj);
        }
      }

      return results;
    };

    onMounted(() => {
      f7.autocomplete.create({
        inputEl: `#${props.idLabel} input`,
        openIn: "dropdown",
        preloader: true,
        valueProperty: props.keyItem,
        textProperty: props.labelText,
        source: function (query, render) {
          render(
            set_data({
              query,
              items: props.items,
              key: props.keyItem,
              label: props.labelText,
              format: props.format,
            })
          );
        },
        on: {
          open: function (val) {
            setTimeout(() => {
              if (!val.$inputEl[0]._value) emit("output", null);
            }, 150);
          },
          change: function (val) {
            let item = props.items.find((e) => e[props.keyItem] == val[0].key);
            let data = props.returnObject ? item : item[props.keyItem];

            emit("output", data);
          },
        },
      });
    });
  },
};
</script>

<style lang="sass">
.autocomplete-ts
  width: 100%

.autocomplete-ts .item-content
  padding: 0
.autocomplete-ts .item-inner
  padding: 0

.autocomplete-dropdown .item-title
  font-size: 14px !important

.autocomplete-dropdown > .autocomplete-dropdown-inner
  margin: 0 auto
  background: rgba(204, 204, 204, 0.16)
  max-width: 92%
</style>