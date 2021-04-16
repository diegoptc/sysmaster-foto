<template>
  <div>
    <BlockUI :blocked="loading" :fullScreen="true">
      <div class="p-d-flex p-jc-center p-ai-center">
        <ProgressSpinner v-if="loading"/>
      </div>
    </BlockUI>
    <Toast />
    <Card>
      <template #title>
          Buscar Clientes
      </template>
      <template #content>
        <div class="p-grid">
          <div class="p-inputgroup p-mb-4">
            <InputText v-mask="['###.###.###-##', '##.###.###/####-##']" type="text" placeholder="Buscar por Código, CPF, CNPJ" v-model="searchValue"/>
            <Button icon="pi pi-search" @click="searchPeople()" />
          </div>
          <div class="p-col-12">
            <Toolbar>
              <template #right>
                <Button v-if="!buttonIsDisabled" v-tooltip="'Salvar registro'" icon="pi pi-save" class="p-button-success" @click="save()"/>
                <Button disabled v-if="buttonIsDisabled" v-tooltip="'Salvar registro'" icon="pi pi-save" class="p-button-success" @click="save()"/>
              </template>
            </Toolbar>
          </div>
          <div class="p-col-12 p-md-2 p-d-flex p-flex-column p-ai-center p-jc-center">
            <img :src="actualSrc" width="180" height="180">
            <span class="p-buttonset p-mt-1" style="width: 100%; padding: 0 0.7rem">
              <input type="file" ref="fileInput" multiple accept="image/*" style="display:none" @change="handleFile">
              <Button icon="pi pi-upload" style="width: 50%" @click="uploadFile()"/>
              <Button icon="pi pi-trash" style="width: 50%" @click="deleteFile()" class="p-button-danger"/>
            </span>
          </div>
          <div class="p-col-12 p-md-10">
            <Fieldset legend="Dados Básicos">
              <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-6">
                    <label>Código</label>
                    <InputText type="text" disabled v-model="people.codpessoa"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label>CPF/CNPJ</label>
                    <InputText type="text" v-mask="'###.###.###-##'" disabled v-if="(!people || (!people.cpf && !people.cnpj)) || people.cpf" v-model="people.cpf"/>
                    <InputText type="text" v-mask="'##.###.###/####-##'" disabled v-if="!people.cpf && people.cnpj" v-model="people.cnpj"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label>Nome</label>
                    <InputText type="text" disabled v-model="people.nome"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label>E-mail</label>
                    <InputText type="text" disabled v-model="people.email"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                  <label>Celular</label>
                  <InputText type="text" disabled v-model="people.celular"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                  <label>Telefone</label>
                  <InputText type="text" disabled v-model="people.telefone"/>
                </div>
              </div>
            </Fieldset>
          </div>
          <div class="p-col-12">
             <Fieldset legend="Dados Endereço">
              <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-6">
                    <label>Logradouro</label>
                    <InputText type="text" disabled v-model="people.logra_com"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label>Bairro</label>
                    <InputText type="text" disabled v-model="people.bairro"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label>Número</label>
                    <InputText type="text" disabled v-model="people.num_com"/>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label>Complemento</label>
                    <InputText type="text" disabled v-model="people.compl_com"/>
                </div>
              </div>
            </Fieldset>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CNPJ, CPF } from 'dochelper'
import axios from 'axios'

@Options({
  components: {
  },
})
export default class App extends Vue {
  [x: string]: any;
  public searchValue: string = '';
  // @ts-ignore
  public actualSrc: any = require('@/assets/images/avatar-fake.png');
  public buttonIsDisabled = true;
  public people: any = {};
  private file: File = {} as File;
  public loading = false;

  deleteFile() {
    // @ts-ignore
    this.actualSrc = require('@/assets/images/avatar-fake.png')
    this.file = {} as File;
    this.buttonIsDisabled = false;
  }

  uploadFile() {
    const elem: any = this.$refs.fileInput
    elem.click()
  }

  handleFile(event: any) {
    this.file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(this.file)
    reader.onload = () => {
      this.actualSrc = reader.result
    }
    this.buttonIsDisabled = false;
  }

  save() {
    const data = new FormData()
    if (this.file && this.file.name) {
      data.append('file', this.file, this.file.name)
    }
    if (this.people && this.people.codpessoa) {
      this.loading = true;
      axios.put(`/api/pessoas/${this.people.codpessoa}`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': `multipart/form-data`,
        }
      }).then((response: any) => {
        this.loading = false;
        this.buttonIsDisabled = true
        this.$toast.add({severity:'success', summary: 'Registro Salvo', detail: response.data.message, life: 3000})
      }).catch((error: any) => {
        this.loading = false;
        this.$toast.add({severity:'error', summary: 'Servidor', detail: error.response.data.message, life: 3000})
      })
    } else {
      this.$toast.add({severity:'error', summary: 'Registro não encontrado', detail:'Carregue um registro antes de salvar', life: 3000})
    }
  }

  searchPeople() {
    if (this.searchValue) {
      this.searchValue = this.searchValue.replace(/[^\d]/g, '')
      let attrToSearch = 'codpessoa'
      if (CNPJ.validate(this.searchValue)) {
        attrToSearch = 'cnpj'
      } else if (CPF.validate(this.searchValue)) {
        attrToSearch = 'cpf'
      }
      this.loading = true;
      axios.get(`/api/pessoas?${attrToSearch}=${this.searchValue}`)
        .then(async (response) => {
          this.loading = false;
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            this.people = response.data[0]
            this.buttonIsDisabled = true
            if (this.fileExists(`/storage/images/${this.people.codpessoa}`)) {
              this.actualSrc = `/storage/images/${this.people.codpessoa}`
            } else {
              // @ts-ignore
              this.actualSrc = require('@/assets/images/avatar-fake.png')
            }
          }
        }).catch((error: any) => {
          this.loading = false;
          this.$toast.add({severity:'error', summary: 'Servidor', detail: error.response.data.message, life: 3000})
        })
    } else {
      this.$toast.add({severity:'error', summary: 'Campo Obrigatório', detail:'É necessario preencher um valor para buscar', life: 3000})
    }
  }

  fileExists(url: string): boolean {
    const http = new XMLHttpRequest()
    http.open('HEAD', url, false)
    http.send()
    return http.status != 404
  }
}
</script>

<style lang="scss">
</style>
