<template>
  <f7-page name="tickets">
    <f7-navbar back-link="Back" title="Generar ticket"> </f7-navbar>

    <f7-tabs>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <f7-block-title>Taquilla principal - Villavicencio </f7-block-title>
        <f7-card>
          <f7-card-content :padding="false">
            <f7-list>
              <f7-list-item title="Cargues" smart-select>
                <select name="fruits">
                  <option value="apple" selected>Apple</option>
                  <option value="pineapple">Pineapple</option>
                  <option value="pear">Pear</option>
                  <option value="orange">Orange</option>
                  <option value="melon">Melon</option>
                  <option value="peach">Peach</option>
                  <option value="banana">Banana</option>
                </select>
              </f7-list-item>
            </f7-list>
          </f7-card-content>
        </f7-card>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-block>
          <p>Tab 2 content</p>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <f7-block>
          <p>Tab 3 content</p>
        </f7-block>
      </f7-tab>
    </f7-tabs>

    <f7-toolbar tabbar bottom>
      <f7-link tab-link="#tab-1" tab-link-active>Cargue</f7-link>
      <f7-link tab-link="#tab-2">Pasajero</f7-link>
      <f7-link tab-link="#tab-3">Pago</f7-link>
    </f7-toolbar>
  </f7-page>
</template>

<style lang="sass">
[data-name=tickets] .page-content
  background: rgb(204 204 204 / 5%)

  .tabs
    height: 100%

  .tab.tab-active
    padding: 0
</style>