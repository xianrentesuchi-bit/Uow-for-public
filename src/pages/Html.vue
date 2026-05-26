<template>
  <div class="iframe-container">
    <h2>外部HTMLの実行画面</h2>
    
    <iframe 
      src="/htmls/sample.html" 
      class="embedded-html"
    ></iframe>
  </div>
</template>

<style scoped>
.iframe-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* iframeのサイズや枠線をお好みで調整します */
.embedded-html {
  width: 100%;
  height: 500px; /* 表示したい高さ */
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
