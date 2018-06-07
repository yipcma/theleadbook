<template>
 <div class="container">
  
  <el-row class="search-wrapper" :gutter="10">
    
    <el-col :lg="12" :md="12" :sm="12" :xs="24">
      <el-input placeholder="Filter by Name or interest" icon="search" v-model="filter" />
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
          <img :src="lead.profile_pic" :alt="lead.city">
        </div>
        <div> {{ lead.first_name }} {{ lead.last_name }} </div>
        <div> {{ lead.city }}, {{ lead.country }} <br> ({{ lead.members }} members)</div>
                <div class="box-subtitle" v-if="lead.about_me"> About me <br> {{ lead.about_me }} </div>
        <div class="box-subtitle">Skills <br> {{ [lead.skill_1, lead.skill_2, lead.skill_3].filter(skill => skill).join(', ') }}</div>
      </div>
    </el-col>

    <el-col v-if="getLeads.length === 0" :xs="24" :sm="24" :md="24">
      <div class="box box-empty"> No Match Found</div>
    </el-col>

  </el-row> <!-- results -->
    
 </div> <!-- container -->
</template>

<script>
import axios from 'axios'

export default {
  mounted() {
    axios.get('https://my.api.mockaroo.com/devc.json?key=e1874cf0').then(res => {
    this.leads = res.data
})
    },
  data() {
    return { 
      filter: '',
      sort: '',
      options: [
        { label: 'Default', value: 'none' },
        { label: 'Member counts', value: 'members' },
      ],
      leads: []
    }
  },
  computed: {
    getLeads() {
      var leads = this.leads.filter((lead) => {
          return Object.values(lead).join(' ').toLowerCase().includes(this.filter.toLowerCase()) ;
        });
      
      if (this.sort == 'members') {
        return leads.sort(function(a, b) {
          return b.members - a.members
        });
      } else {
        return leads;
      }
      
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

/* $material-shadow: 0 1px 3px 0 rgba(0,0,0,.15); */

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
  /* @media screen and (max-width: 767px) { display: none; } */
}

.container {
  max-width: 980px;
  margin: 20px auto;
  /* @media screen and (max-width: 1050px) { 
    width: 95%; 
  } */
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* box-shadow: $material-shadow; */
  min-height: 150px;
  border-radius: 5px;
  background-color: white;
  margin-bottom: 10px;
}

.box-subtitle { 
    color: lighten(grey, 15%); 
  }
  
.box-empty {
    background-color: transparent; box-shadow: none 
  }
  /* &:hover { cursor: pointer; } */

.el-select {
  width: 100%;
}
</style>