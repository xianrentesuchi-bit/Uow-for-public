<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { syncLocalStorageToCloud, syncCloudToLocalStorage } from '../api/account';

import Layout from '../components/layout/Layout.vue'

const isLoggedIn = ref<boolean>(false);
const username = ref<string>('');
const userId = ref<string>('');
const syncMessage = ref<string>('');

onMounted(() => {
  const savedStatus = localStorage.getItem('isLoggedIn');
  const savedName = localStorage.getItem('username');
  const savedId = localStorage.getItem('userId');

  if (savedStatus === 'true' && savedName && savedId) {
    isLoggedIn.value = true;
    username.value = savedName;
    userId.value = savedId;
  }
});

const handleUpload = async () => {
  if (!userId.value) return;
  syncMessage.value = 'クラウドへ保存中...';
  const result = await syncLocalStorageToCloud(userId.value);
  if (result.success) {
    syncMessage.value = '現在のデータをアカウントに紐付け保存しました。';
  } else {
    syncMessage.value = `保存失敗: ${result.message}`;
  }
};

const handleDownload = async () => {
  if (!username.value) return;
  syncMessage.value = 'クラウドから取得中...';
  const success = await syncCloudToLocalStorage(username.value);
  if (success) {
    syncMessage.value = 'アカウントのデータをローカルにインポートしました。';
    window.location.reload();
  } else {
    syncMessage.value = 'インポートに失敗しました。データが存在しないか、不正です。';
  }
};
</script>

<template>
  <Layout>

    <div class="max-w-xl mx-auto mt-10 p-6 bg-white border border-zinc-200 shadow-md rounded-xl">
      <h1 class="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined">account_circle</span>
        マイページ
      </h1>

      <div v-if="isLoggedIn" class="space-y-6">
        <div class="p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
          <p class="text-sm text-zinc-500">ログインユーザー</p>
          <p class="text-lg font-bold text-zinc-800">{{ username }}</p>
          <p class="text-xs text-zinc-400 mt-1 font-mono">固有ID: {{ userId }}</p>
        </div>

        <div class="border-t border-zinc-200 pt-4">
          <h2 class="text-sm font-bold text-zinc-700 mb-2">データの同期・共有設定（uotube）</h2>
          <p class="text-xs text-zinc-500 mb-4">
            ローカルのプレイリスト、チャンネル登録、再生履歴などのデータをアカウント情報と紐付けてバックアップ、またはインポートすることができます。
          </p>

          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="handleUpload" 
              class="flex-1 h-10 flex items-center justify-center gap-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <span class="material-symbols-outlined text-[18px]">cloud_upload</span>
              現在のデータをアカウントへ保存
            </button>
            
            <button 
              @click="handleDownload" 
              class="flex-1 h-10 flex items-center justify-center gap-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <span class="material-symbols-outlined text-[18px]">cloud_download</span>
              保存データからインポート
            </button>
          </div>

          <p v-if="syncMessage" class="text-xs font-medium text-blue-600 mt-3 text-center bg-blue-50 p-2 rounded">
            {{ syncMessage }}
          </p>
        </div>
      </div>

      <div v-else class="p-6 text-center border border-dashed border-zinc-300 rounded-lg">
        <p class="text-sm text-zinc-500">マイページを表示するにはログインしてください。</p>
      </div>
    </div>

  </Layout>
</template>
