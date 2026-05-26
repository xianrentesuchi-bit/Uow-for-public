<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>お探しのページは見つかりませんでした。</p>
    <router-link to="/">トップページへ戻る</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px 20px;
  font-family: sans-serif;
}
h1 { color: #dc3545; }
a { color: #007bff; text-decoration: none; }
</style>
