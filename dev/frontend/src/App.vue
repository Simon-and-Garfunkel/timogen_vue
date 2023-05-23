<template>
  <div id="app">
    <!-- <a id="go_home" href="./home.html">&larr; Accueil</a> -->
    <!-- <p>mutuality.name = {{mutuality.name}} </p> -->

    <div class="alert alert-info alert-dismissible">
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      <span class="alert-heading">Bienvenue sur Timogen. Les données utilisées datent du 1er Janvier 2023 (trouvable <a href="https://www.riziv.fgov.be/fr/themes/cout-remboursement/par-mutualite/prestations-individuelles/prix/Pages/kine-fr.aspx">ici</a>)</span>
    </div>

    <h1>Timogen</h1>
    <div class="container p-5 my-5 border bg-white text-dark">
      <h2>Thérapeute</h2>
      <Therapist />
      <hr />

      <h2>Patient</h2>
      <Patient />
      <hr />

      <h2>Pathologie</h2>
      <Patho />
      <hr />

      <h2>Séances</h2>
      <Seances />
      <hr />

      <div
        id="collapsable"
        class="d-flex flex-column bd-highlight d-none d-lg-block"
        style="
          right: 1px;
          border: 0px none;
          position: fixed;
          width: 40%;
          overflow: hidden;
          bottom: 0px;
        "
      >
        <button
          style="margin: 10px 20% -2px 50%"
          class="btn btn-warning"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseResult"
          aria-expanded="false"
          aria-controls="collapseResult"
        >
          &darr; résultat &darr;
        </button>

        <div class="collapse" id="collapseResult">
          <div
            class="card card-body"
            style="height: 600px; overflow: scroll; max-width: 800px"
          >
            <PDF />
          </div>
        </div>
      </div>

      <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="1400"
        filename="nooptions"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="p"
        pdf-content-width="680px"
        ref="html2Pdf"
        :html-to-pdf-options="htmltopdfoptions"
      >
        <section slot="pdf-content">
          <PDF />
        </section>
      </vue-html2pdf>

      <button
        type="button"
        class="container-fluid btn btn-warning"
        @click="generatePDF"
      >
        Générer mon justificatif
      </button>
    </div>
    <a class="d-block p-5 text-center" href="mailto:arthurgossuin+timogen@gmail.com">contactez-moi</a>
  </div>
</template>

<script>
import Therapist from "./components/Therapist.vue";
import Patient from "./components/Patient.vue";
import Patho from "./components/Patho.vue";
import Seances from "./components/Seances.vue";
import PDF from "./components/PDF.vue";
import VueHtml2pdf from "vue-html2pdf";
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {}
  },
  components: {
    Therapist,
    Patient,
    Patho,
    Seances,
    PDF,
    VueHtml2pdf,
  },
  computed: {
    ...mapGetters("seances", {
      last_seance: "getLastSeance",
      first_seance: "getFirstSeance",
      ads_numbers: "getAdsNumbers",
    }),
    ...mapGetters("patient", {
      patient_name: "getPatientName",
    }),
    file_name() {
      return (
        this.first_seance.toString() +
        "-" +
        this.last_seance.toString() +
        "." +
        this.toTitleCase(this.patient_name).split(" ").join("") +
        "." +
        this.ads_numbers.join("-")
      )
    },
    htmltopdfoptions() {
      return {
        margin: 15,
        html2canvas: {
          scale: 4,
        },
        filename: `${this.file_name}.pdf`,
      }
    },
  },
  methods: {
    toTitleCase(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    generatePDF() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 20px;
}

h1 {
  font-size: 10vmin;
  text-align: center;
  color: #3f7a82;
  pointer-events: none;
  user-select: none;
}

h2 {
  padding: 20px 0px 30px 0px;
  color: #fdc10a;
  user-select: none;
}

#collapsable {
  position: relative;
  z-index: 2;
}

#collapseResult {
  zoom: 0.8;
  -moz-transform: scale(0.8);
}

#go_home {
}

h3,
h4,
h5 {
  color: darkgrey;
  user-select: none;
}

.bg-cyan {
  background-image: url("assets/60-lines.png");
  background-color: #beedf7;
}

.form-check-input[type=checkbox] {
  margin-top: .6rem;
}
:-moz-any(.form-check-input[type=checkbox]) {
  margin-top: .9rem;
}

label {
  padding: 6px;
}

</style>
