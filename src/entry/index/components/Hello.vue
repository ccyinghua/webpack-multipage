<template>
  <div>
    Hello {{ name }}
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "admin"
      }
    },
    mounted(){
      //this.$http.get("/demo/api/userinfo").then(resp =>{
      //  this.name = resp.data.data;
      //});
    }
  }
</script>

<style>
</style>
