<template>
  <div>
    <div
      class="form-inline d-flex align-items-center justify-content-center"
      v-on:change="emitDate"
    >
      <label for="ads_number"> Numéro d'ADS </label>
      <input
        id="ads_number"
        name="ads_number"
        class="form-control-inline"
        v-model="ads_number"
      />
    </div>
    <br />
    <div class="d-flex justify-content-center" v-on:change="emitDate">
      <vc-calendar
        ref="calendar"
        locale="fr"
        v-model="dates"
        @dayclick="onDayClick"
        :attributes="attributes"
        :disabled-dates="{ weekdays: [1, 7] }"
        :columns="$screens({ default: 1, md: 2, lg: 3 })"
      />
    </div>
    <br />

    <div class="form-inline d-flex" v-on:change="emitDate">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="report"
          id="report"
          v-on:change="emitDate"
        />

        <label class="" for="report"> Inclure un rapport écrit </label>

        <vc-date-picker locale="fr" v-model="report_date" v-if="report">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="bg-white border px-2 py-1 rounded"
              placeholder="date du rapport"
              :value="inputValue"
              v-on="inputEvents"
              v-on:change="emitDate"
            />
          </template>
        </vc-date-picker>
      </div>
    </div>

    <br />
  </div>
</template>

<script>
import Vue from "vue";
import VCalendar from "v-calendar";

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: "vc",
});

export default {
  name: "ADS",
  data() {
    return {
      report: false,
      report_date: new Date(),
      ads_number: "",
      days: [],
    };
  },
  props: ["index"],
  computed: {
    dates() {
      // do not show the reports in the calendar
      return this.days.filter((day) => day.kind !== "REPORT").map((day) => day.date);
    },
    attributes() {
      return this.dates.map((date) => ({
        highlight: true,
        dates: date,
      }));
    },
  },
  methods: {
    onDayClick(day) {
      const idx = this.days.findIndex((d) => d.id === day.id);
      if (idx >= 0) {
        this.days.splice(idx, 1);
      } else {
        this.days.push({
          id: day.id,
          eu_format: day.id.split("-").reverse().join(" / "),
          date: day.date,
          kind: "CLASSIC",  // this does not exist, but is used to trigger the kind from the ADS
        });
      }
      this.emitDate();
    },
    emitDate() {
      let new_dates = {
        days: [...this.days],
        ads_number: this.ads_number,
      };
      if (this.report) {
        var formatted_date = this.report_date.toISOString().split("T")[0];
        new_dates.days.push({
          id: formatted_date,
          eu_format: formatted_date.split("-").reverse().join(" / "),
          date: this.report_date,
          kind: "REPORT",
        });
      } else {
        new_dates.days = new_dates.days.filter((day) => day.kind !== "REPORT");
      }
      this.$emit("receive", this.index, new_dates);
    },
  },
};
</script>

<style>
#ads_number {
  margin-left: 8px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  max-width: 300px;
}
</style>
