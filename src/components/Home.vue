<template>
<div class="container">
<h1>theLeadBook</h1>

  <el-row class="search-wrapper" :gutter="10">

    <el-col :lg="12" :md="12" :sm="12" :xs="24">
      <el-input placeholder="Filter by name, city, skill, any text" icon="search" v-model="filter" />
    </el-col>

    <el-col class="col-space" :lg="6" :md="6" :sm="6" :xs="24"> &nbsp; </el-col>

    <el-col :lg="6" :md="6" :sm="6" :xs="24">
      <el-select v-model="sort" placeholder="Sort by">
        <el-option
          v-for="(item, ind) in options"
          :label="item.label"
          :value="item.value"
          :key="'option-'+ind">
        </el-option>
      </el-select>
    </el-col>

  </el-row> <!-- search wrapper -->

  <el-row :gutter="10">
    <el-col v-for="(lead, ind) in getLeads" :key="'lead-'+ind" :xs="24" :sm="12" :md="8">
      <div class="box">
        <div>
          <a :href="lead.url"><img :src="lead.image" :alt="lead.city"></a>
        </div>
        <div>{{ lead.name }}</div>
        <div>{{ lead.city }}</div>
        <div>{{ lead.memberCount }} members</div>
        <div class="box__subtitle" v-if="lead.about_me">{{ lead.about_me }} </div>
        <div class="box__subtitle" v-if="lead.skills">Skills <br>{{ lead.skills }}</div>
      </div>
    </el-col>

    <el-col v-if="getLeads.length === 0" :xs="24" :sm="24" :md="24">
      <div class="box box__empty"> No Match Found</div>
    </el-col>

  </el-row> <!-- results -->

</div> <!-- container -->
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
      sort: '',
      options: [
        { label: 'City alphabetical', value: 'city' },
        { label: 'Member counts', value: 'members' },
        { label: 'Ladies first', value: 'female' }
      ],
      leads: [],
      circles: []
    }
  },
  computed: {
    getLeads () {
      let leads = this.leads.map(lead => ({...this.circles.find(circle => lead.city === circle.name), ...lead})).filter((lead) => {
        return Object.values(lead).join(' ').toLowerCase().includes(this.filter.toLowerCase())
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

$material-shadow: 0 1px 3px 0 rgba(0,0,0,.15);

[v-cloak] {
  display: none;
}

body {
  margin: 0;
  padding: 0;
  background-color: #F3F5F7;
  font-family: 'Open Sans', sans-serif;
}

.search-wrapper {
  margin: 10px 0;
}

.col-space {
  content: '&nbsp;';
  @media screen and (max-width: 767px) { display: none; }
}

.container {
  max-width: 980px;
  margin: 20px auto;
  @media screen and (max-width: 1050px) {
    width: 95%;
  }
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: $material-shadow;
  min-height: 150px;
  border-radius: 5px;
  background-color: white;
  margin-bottom: 10px;
  &__subtitle {
    color: lighten(grey, 15%);
  }
  &__empty {
    background-color: transparent; box-shadow: none
  }
  // &:hover { cursor: pointer; }
}

.el-select {
  width: 100%;
}
</style>
