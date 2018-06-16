<template>
<div class="container">
  <h1>theLeadBook (EMEA)</h1>
  <sui-statistics-group :columns="3">
    <sui-statistic in-group>
      <sui-statistic-value>{{ leads.length }}</sui-statistic-value>
      <sui-statistic-label>Leads</sui-statistic-label>
    </sui-statistic>
    <sui-statistic in-group>
      <sui-statistic-value>{{ nCircles }}</sui-statistic-value>
      <sui-statistic-label>Circles</sui-statistic-label>
    </sui-statistic>
    <sui-statistic in-group>
      <sui-statistic-value>{{ nMembers }}</sui-statistic-value>
      <sui-statistic-label>Members</sui-statistic-label>
    </sui-statistic>
  </sui-statistics-group>
  <sui-grid :columns="3">
    <sui-grid-row>
      <sui-grid-column>
        <sui-input placeholder="Search..." icon="search" v-model="filter" style="width:100%;"/>
      </sui-grid-column>
      <sui-grid-column>
        <sui-button-group style="width:100%;">
          <sui-button color="blue" inverted @click="region='Europe'">Europe</sui-button>
          <sui-button color="green" inverted @click="region='MENA'">MENA</sui-button>
          <sui-button color="red" inverted @click="region='SSA'">SSA</sui-button>
          <sui-button color="black" basic @click="region=null">All</sui-button>
        </sui-button-group>
      </sui-grid-column>
      <sui-grid-column>
        <sui-dropdown
              placeholder="Sort"
              selection
              :options="options"
              v-model="sort"
              style="width:100%;"
            />
      </sui-grid-column>
    </sui-grid-row>
  </sui-grid>
  <sui-card-group :items-per-row="4" class="doubling">
    <sui-card v-for="(lead, index) in getLeads" :key="'lead-' + index" :class="lead.regionColor" >
      <sui-dimmer-dimmable
        @mouseenter.native="cardActive = index"
        @mouseleave.native="cardActive = null">
        <sui-image v-if="lead.image" :src="lead.image" size="medium"/>
        <sui-dimmer blurring :active="cardActive === index">
          <sui-button><a :href="lead.groupurl" target="_blank">View Group</a></sui-button>
        </sui-dimmer>
      </sui-dimmer-dimmable>
      <sui-card-content>
        <sui-card-header><a :href="lead.url" target="_blank">{{ lead.name }}</a></sui-card-header>
        <sui-card-meta>{{ lead.city }}, {{ lead.country }}</sui-card-meta>
        <sui-card-description v-if="lead.aboutme">{{ lead.aboutme }}</sui-card-description>
      </sui-card-content>
      <sui-card-content extra v-if="lead.skills">
        <sui-icon name="code" />{{ lead.skills }}</sui-card-content>
    </sui-card>
  </sui-card-group>
</div>
</template>

<script>
import { rows } from 'google-spreadsheets'
import { promisify } from 'bluebird'

const getRows = promisify(rows)
const sheetId = '1NLf9uHCoVjVITKtmWzrwkXpgXSJ2b3NvhYl7P21l13I'

export default {
  mounted () {
    Promise.all([
      getRows({
        key: sheetId,
        worksheet: 1
      }),
      getRows({
        key: sheetId,
        worksheet: 2
      }).then(res => {
        this.nCircles = res.length
        const reducer = (accumulator, currentValue) => accumulator + currentValue
        this.nMembers = res.map(circle => Number(circle.membercount) || 0).reduce(reducer)
        return res
      })
    ]).then((res) => {
      const leads = res[0].map(lead => ({...res[1].find(circle => lead.city === circle.city), ...lead}))
      leads.forEach(lead => {
        switch (lead.region) {
          case 'Europe':
            lead.regionColor = 'blue'
            break
          case 'SSA':
            lead.regionColor = 'red'
            break
          case 'MENA':
            lead.regionColor = 'green'
        }
        lead.female = lead.female === 'TRUE'
        Object.keys(lead).forEach(key => (lead[key] === Object(lead[key])) && delete lead[key])
      })
      this.leads = leads.filter(lead => lead.country)
    })
  },
  data () {
    return {
      filter: '',
      sort: null,
      options: [
        { text: 'City alphabetical', value: 'city' },
        { text: 'Ladies first', value: 'female' }
      ],
      leads: [],
      cardActive: null,
      nCircles: null,
      nMembers: null,
      region: null
    }
  },
  computed: {
    getLeads () {
      let leads = this.leads.filter((lead) => {
        return Object.values(lead).join(' ').toLowerCase().includes(this.filter.toLowerCase())
      })

      switch (this.sort) {
        case 'female':
          leads = leads.sort(function (a, b) {
            if (a.female) return -1
            if (b.female) return 1
            return 0
          })
          break

        default:
          leads = leads.sort(function (a, b) {
            if (a.city < b.city) return -1
            if (a.city > b.city) return 1
            return 0
          })
      }

      return leads.filter(lead => {
        if (this.region === null) return true
        return lead.region === this.region
      })
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

[v-cloak] {
  display: none;
}

body {
  margin: 0;
  padding: 0;
  background-color: #F3F5F7;
  font-family: 'Open Sans', sans-serif;
}

.container {
  max-width: 980px;
  margin: 20px auto;
  @media screen and (max-width: 1050px) {
    width: 95%;
  }
}

</style>
