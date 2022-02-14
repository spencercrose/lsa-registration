<template>
  <div>
    <InputUser :init="true" />
  </div>
</template>

<script>

import InputUser from '@/components/inputs/InputUser'

export default {
  name: 'user-registration',
  components: {InputUser}
}
</script>
