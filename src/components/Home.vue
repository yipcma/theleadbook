<template>
<div class="container">
  <h1>theLeadBook</h1>
  <sui-grid :columns="2">
    <sui-grid-row>
      <sui-grid-column>
        <sui-input placeholder="Search..." icon="search" v-model="filter" style="width:100%;"/>
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
        <sui-image :src="lead.image" size="medium"/>
        <sui-dimmer blurring :active="cardActive === index">
          <sui-button><a :href="lead.group_url" target="_blank">View Group</a></sui-button>
        </sui-dimmer>
      </sui-dimmer-dimmable>
      <sui-card-content>
        <sui-card-header><a :href="lead.url" target="_blank">{{ lead.name }}</a></sui-card-header>
        <sui-card-meta>{{ lead.city }}, {{ lead.country }}</sui-card-meta>
        <sui-card-description v-if="lead.about_me">{{ lead.about_me }}</sui-card-description>
      </sui-card-content>
      <sui-card-content extra v-if="lead.skills">
        <sui-icon name="code" />{{ lead.skills }}</sui-card-content>
    </sui-card>
  </sui-card-group>
</div>
</template>

<script>
import axios from 'axios'
import * as yaml from 'js-yaml'

export default {
  mounted () {
    axios.get('https://raw.githubusercontent.com/yipcma/theleadbook/master/data/lead_profiles.yml').then(res => {
      this.leads = yaml.load(res.data)
    })
    axios.get('https://raw.githubusercontent.com/yipcma/theleadbook/master/data/map_data.yml').then(res => {
      this.circles = yaml.load(res.data)
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
      circles: [],
      cardActive: null
    }
  },
  computed: {
    getLeads () {
      let leads = this.leads.map(lead => ({...this.circles.find(circle => lead.city === circle.city), ...lead})).filter((lead) => {
        return lead.country && Object.values(lead).join(' ').toLowerCase().includes(this.filter.toLowerCase())
      })

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
      })

      switch (this.sort) {
        case 'members':
          leads = leads.sort(function (a, b) {
            return b.memberCount - a.memberCount
          })
          break

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

      return leads
    }
  }
}
</script>

<style  lang="scss">
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
