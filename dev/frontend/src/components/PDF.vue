<template>
  <div id="pdf" class="pdf">
    <header>
      <div id="header1">
        <p>{{ therapist_name }}</p>
        <p style="white-space: pre-wrap">{{ therapist_address }}</p>
        <p>N° INAMI : {{ therapist_inami_nb }}</p>
      </div>

      <div id="header2">
        <p>{{ mutuality_name }}</p>
        <p style="white-space: pre-wrap">{{ mutuality_address }}</p>
      </div>
    </header>

    <p id="title">
      <u>Bordereau de prestations de kinésithérapie</u>
    </p>

    <p>
      <b>FACTURES : {{ ads_numbers.join(' - ') }}</b>
    </p>

    <div>
      <p>Concerne: {{ patient_name }}</p>
      <p>NISS: {{ patient_niss }}</p>
      <p>Adresse: {{ patient_address }}</p>
    </div>

    <div id="table">
      <table>
        <tr>
          <th style="width: 5%"></th>
          <th>Date de séance</th>
          <th>Codes de prestations</th>
          <th>Numéro de l'ADS</th>
          <th>Honoraires</th>
        </tr>

        <tr v-for="seance in seances" :key="seance.index">
          <td>{{ seance.index >= 1 ? seance.index : "" }}</td>
          <td>{{ seance.day.eu_format }}</td>
          <td>
            <div v-for="line in seance.lines" :key="line.id">
              {{ line.code }}
            </div>
          </td>
          <td>{{ seance.ads }}</td>
          <td>
            <div v-for="line in seance.lines" :key="line.id">
              {{ line[type_of_fee].toFixed(2) }}
            </div>
          </td>
        </tr>
      </table>
    </div>

    <p>
      Veuillez verser le montant de {{ total }} euros sur le compte bancaire
      {{ therapist_bank_account }}, relié au compte {{ therapist_bce }}.
    </p>

    <p>Sincère salutations.</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "App",
  computed: {
    ...mapGetters("patient", {
      patient_name: "getPatientName",
      patient_niss: "getPatientNiss",
      patient_address: "getPatientAddress",
      patient_special_tarif: "getPatientSpecialTarif",
      mutuality_name: "getMutualityName",
      mutuality_address: "getMutualityAddress",
    }),
    ...mapGetters("therapist", {
      therapist: "getTherapist",
      therapist_name: "getName",
      therapist_address: "getAddress",
      therapist_inami_nb: "getInamiNb",
      therapist_bce: "getBce",
      therapist_bank_account: "getBankAccount",
      therapist_contracted: "getContracted",
    }),
    ...mapGetters("seances", {
      first_seance: "getFirstSeance",
      ads_list: "getAdsList",
      ordered_seances: "getOrderedSeances",
      ads_numbers: "getAdsNumbers",
    }),
    ...mapGetters("patho", {
      location: "getSelectedLocation",
      patho: "getSelectedPatho",
      kind: "getSelectedKind",
      duration: "getSelectedTime",
    }),
    seances: {
      get() {
        this.ordered_seances.forEach((seance) => {
          var lines = []
          if (seance.index == 1) {
            lines = this.patho.lines.filter(line => line.kind === "INTAKE")
          }
          // set priority
          var priority =
            (this.patho.breakpoints.length &&
              seance.index > this.patho.breakpoints[0]) +
            (this.patho.breakpoints.length > 1 &&
              seance.index > this.patho.breakpoints[1])
          // find the right line
          for (priority; priority >= 0; priority--) {
            var good_lines = this.patho.lines.filter(
              (line) =>
                line.kind === seance.day.kind)
            if (!good_lines.length) {
              good_lines = this.patho.lines.filter(
              (line) =>
                (line.kind === this.kind &&
                  line.priority == priority &&
                  line.duration == this.duration
                )
              )
            }
            if (good_lines.length) {
              good_lines = good_lines.sort(line => -line.priority)
              lines.push(good_lines[0])
              break
            }
          }
          // Add the lines for domiciles (travel fees)
          var dom_kind = "autres catégories"
          this.location.lines
            .map((line) => line.kind)
            .forEach((kind) => {
              var last_word = kind.split(" ").pop().replace(/\W/g, "")
              if (
                this.patho.name.toUpperCase().search(last_word.toUpperCase()) >=
                0
              ) {
                dom_kind = kind
              }
            })
          if (this.location.lines.length)
            lines.push(
              this.location.lines.filter((line) => line.kind === dom_kind)[0]
            )
          seance.lines = lines
        })

        return this.ordered_seances
      },
    },
    type_of_fee: {
      get() {
        if (this.therapist_contracted) {
          if (this.patient_special_tarif) {
            return "bfees_c_p"
          } else {
            return "bfees_c_np"
          }
        } else {
          if (this.patient_special_tarif) {
            return "bfees_nc_p"
          } else {
            return "bfees_nc_np"
          }
        }
      },
    },
    total: {
      get() {
        var total = 0
        this.seances.forEach((seance) => {
          seance.lines.forEach((line) => {
            total += line[this.type_of_fee]
          })
        })
        return total.toFixed(2)
      },
    },
  },
}
</script>

<style>
#pdf {
  all: initial;
  * {
    all: unset;
  }
}

#pdf {
  font-size: 11px;
  line-height: 125%;
}

.pdf p {
  margin: 0px;
}

.pdf p,
.pdf th,
.pdf td {
  font-family: arial;
}

.pdf div[id="header2"] {
  text-align: right;
}

.pdf p[id="title"] {
  text-align: center;
  margin-top: 3%;
  margin-bottom: 3%;
}

.pdf table {
  border-collapse: collapse;
  width: 100%;
}

.pdf td,
.pdf th {
  border: 1px solid;
}

.pdf th {
  text-align: left;
}

.pdf td,
.pdf th {
  padding-left: 5px;
}

.pdf div {
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>
