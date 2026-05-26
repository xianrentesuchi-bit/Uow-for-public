<template>
  <Layout>

    <div class="iframe-container" :class="{ 'full-screen': isMaximized }">
      
      <h2 v-if="!isMaximized">ツールとゲーム</h2>
      
      <div v-if="!isMaximized" class="selection-menu">
        <button 
          :class="['menu-btn', { active: currentTarget === 'coderunner' }]" 
          @click="selectTarget('coderunner')"
        >
          coderunner
        </button>
        <button 
          :class="['menu-btn', { active: currentTarget === '2048' }]" 
          @click="selectTarget('2048')"
        >
          2048
        </button>
        <button 
          :class="['menu-btn', { active: currentTarget === 'sennintube' }]" 
          @click="selectTarget('sennintube')"
        >
          仙人tube（初代）
        </button>
      </div>

      <button v-if="isMaximized" class="exit-btn" @click="isMaximized = false">
        メニューに戻る
      </button>
      
      <iframe 
        :src="iframeSrc" 
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
      currentTarget: 'coderunner',
      // 画面いっぱいに表示されているかのフラグ
      isMaximized: false
    }
  },

  computed: {
    // 選択されたターゲットに応じてsrcを切り替え
    iframeSrc() {
      if (this.currentTarget === 'coderunner') {
        return '/htmls/code.html';
      } else if (this.currentTarget === '2048') {
        return '/htmls/2048.html';
      } else if (this.currentTarget === 'sennintube') {
        return '/htmls/sennintube.html';
      }
      return '/htmls/code.html';
    }
  },

  methods: {
    // カード（ボタン）が押された時の処理
    selectTarget(target) {
      this.currentTarget = target;
      // 押されたら画面いっぱいに表示する
      this.isMaximized = true;
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
  transition: all 0.2s ease;
}

/* 画面いっぱいに表示するスタイル（Layoutコンポーネント内を埋め尽くす設定） */
.iframe-container.full-screen {
  max-width: 100%;
  width: 100%;
  height: calc(100vh - 100px); /* Layoutのヘッダー等の高さを考慮したフルサイズ */
  display: flex;
  flex-direction: column;
}

/* 画面いっぱい時のiframe拡張 */
.iframe-container.full-screen .embedded-html {
  flex: 1;
  height: 100%;
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

/* 画面いっぱい表示から戻るためのソリッドなボタン */
.exit-btn {
  align-self: flex-start;
  padding: 8px 16px;
  background-color: #333;
  color: #fff;
  border: none;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 0; /* 角丸なし */
}

.exit-btn:hover {
  background-color: #555;
}

/* iframeのサイズや枠線の調整（シャープな長方形デザインへ最適化） */
.embedded-html {
  width: 100%;
  height: 500px; /* 通常時の表示したい高さ */
  border: 2px solid #333; /* 枠線をクッキリとした色に変更 */
  border-radius: 0; /* 角丸を完全に除去 */
  box-shadow: none; /* 装飾的な影をなくしフラットに */
  display: block;
}
</style>
