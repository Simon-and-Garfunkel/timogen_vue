<template>
  <!-- Therapist -->
  <div>
    <!-- name -->
    <!-- TODO: allow custom input -->
    <LabelizedField for="therapist_name" label="Nom">
      <!-- There is no ID because I do not want autofill on this field -->
      <multiselect v-model="therapistSelected" :options="therapistList" selectLabel="↵" selectedLabel="" deselectLabel="×"
        @search-change="retrieveTherapists" @open="retrieveTherapists" @input="updateSelected"
        placeholder="Commencez à écrire..." label="name" track-by="id">
        <template slot="noOptions"> ... </template>
        <template slot="noResult"> Pas de résultats. </template>
      </multiselect>
    </LabelizedField>

    <!-- Address -->
    <LabelizedField for="therapist_address" label="Adresse">
      <textarea id="therapist_address" name="therapist_address" rows="2" cols="50" maxlength="200" type="address"
        class="form-control" placeholder="" v-model="address" />
    </LabelizedField>

    <!-- inami -->
    <LabelizedField for="therapist_inami" label="Numéro INAMI">
      <input id="therapist_inami" name="therapist_inami" type="inami" class="form-control" placeholder="0-0000000-000"
        v-model="inami_nb" maxlength="13" />
    </LabelizedField>

    <!-- BCE -->
    <LabelizedField for="therapist_bce" label="BCE">
      <input id="therapist_bce" name="therapist_bce" type="bce" class="form-control" placeholder="0000.000.000"
        v-model="bce" maxlength="12" />
    </LabelizedField>

    <!-- Bank -->
    <LabelizedField for="therapist_ba" label="Numéro de compte">
      <input id="therapist_ba" name="therapist_ba" type="bank_account" class="form-control"
        placeholder="BE40 XXXX XXXX XXXX" v-model="bank_account" maxlength="19" />
    </LabelizedField>

    <!-- contracted -->
    <LabelizedField for="contracted" label="Conventionné">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" v-model="contracted" id="contracted" />
      </div>
    </LabelizedField>
  </div>
</template>

<script>
// import axios from "axios";
import { mapGetters, mapMutations } from "vuex";
import LabelizedField from "./elements/Label.vue";
import Multiselect from "vue-multiselect";
import therapistsJson from "../data/therapists.json";
import removeAccents from "remove-accents";


export default {
  name: "Thearpist",
  components: {
    LabelizedField,
    Multiselect,
  },
  data() {
    return {
      therapistList: [],
      listIsEmpty: "...",
    };
  },
  methods: {
    ...mapMutations("therapist", [
      "setTherapist",
      "setAddress",
      "setInamiNb",
      "setBce",
      "setBankAccount",
      "setContracted",
    ]),
    retrieveTherapists(input) {
      try {
        let filteredData = therapistsJson;

        if (input) {
          // Filter the data based on the input
          input = removeAccents(input);
          filteredData = filteredData.filter((therapist) => {
            const therapistNameWords = therapist.name.split(' ');
            const inputWords = input.split(' ');
            return inputWords.every((inputWord) => {
              return therapistNameWords.some((therapistNameWord) => {
                return removeAccents(therapistNameWord.toLowerCase()).startsWith(inputWord.toLowerCase());
              });
            });
          });
        }

        if (this.therapistSelected.id !== 0) {
          filteredData = [this.therapistSelected, ...filteredData];
        }

        this.therapistList = filteredData;
      } catch (error) {
        console.log(error);
      }
    },
    updateSelected(selected) {
      this.setTherapist(selected);
      this.therapistList = [];
    },
  },
  computed: {
    ...mapGetters("therapist", [
      "getTherapist",
      "getAddress",
      "getInamiNb",
      "getBce",
      "getBankAccount",
      "getContracted",
    ]),
    therapistSelected: {
      get() {
        return this.getTherapist;
      },
      set(new_value) {
        return new_value;
      },
    },
    address: {
      get() {
        return this.getAddress;
      },
      set(new_value) {
        return this.setAddress(new_value);
      },
    },
    inami_nb: {
      get() {
        return this.getInamiNb;
      },
      set(new_value) {
        return this.setInamiNb(new_value);
      },
    },
    bce: {
      get() {
        return this.getBce;
      },
      set(new_value) {
        return this.setBce(new_value);
      },
    },
    bank_account: {
      get() {
        return this.getBankAccount;
      },
      set(new_value) {
        return this.setBankAccount(new_value);
      },
    },
    contracted: {
      get() {
        return this.getContracted;
      },
      set(new_value) {
        return this.setContracted(new_value);
      },
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
.multiselect__tags {
  border: 1px solid #ced4da;
}
</style>
