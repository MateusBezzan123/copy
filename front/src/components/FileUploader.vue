<template>
  <div>
    <input type="file" @change="uploadFile" />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    uploadFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      axios.post('http://localhost:3000/process-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        this.$emit('data-loaded', response.data);
      })
      .catch(error => {
        console.error('There was an error uploading the file:', error);
      });
    }
  }
};
</script>
