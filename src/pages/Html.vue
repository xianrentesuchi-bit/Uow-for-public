<template>
  <Layout>

    <div class="iframe-container">
      <h2>ツールとゲーム</h2>
      
      <div class="selection-menu">
        <button 
          :class="['menu-btn', { active: currentTarget === 'coderunner' }]" 
          @click="currentTarget = 'coderunner'"
        >
          coderunner
        </button>
        <button 
          :class="['menu-btn', { active: currentTarget === '2048' }]" 
          @click="currentTarget = '2048'"
        >
          2048
        </button>
      </div>
      
      <iframe 
        :src="currentTarget === 'coderunner' ? '/htmls/code.html' : '/htmls/2049.html'" 
        class="embedded-html"
      ></iframe>
    </div>

  </Layout>
</template>

<script>
import Layout from '../components/layout/Layout.vue'

export default {
  name: 'HtmlViewer',

  components: {
    Layout
  },

  data() {
    return {
      // 初期状態はcoderunnerを選択
      currentTarget: 'coderunner'
    }
  }
}
</script>

<style scoped>
.iframe-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}

/* タイトルのスタイリング */
h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

/* UI強化：直線的でシンプルなボタンコンテナ */
.selection-menu {
  display: flex;
  gap: 2px;
  background-color: #eee;
  padding: 2px;
  margin-bottom: 10px;
  width: 100%;
}

/* 角丸を排除したソリッドな長方形ボタン */
.menu-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background-color: #f9f9f9;
  color: #666;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  text-align: center;
  border-radius: 0; /* 角丸を完全に除去 */
}

.menu-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

/* アクティブ状態：背景を反転させた明確なデザイン */
.menu-btn.active {
  background-color: #333;
  color: #fff;
}

/* iframeのサイズや枠線の調整（シャープな長方形デザインへ最適化） */
.embedded-html {
  width: 100%;
  height: 500px; /* 表示したい高さ */
  border: 2px solid #333; /* 枠線をクッキリとした色に変更 */
  border-radius: 0; /* 角丸を完全に除去 */
  box-shadow: none; /* 装飾的な影をなくしフラットに */
  display: block;
}
</style>
