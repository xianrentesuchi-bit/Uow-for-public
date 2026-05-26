<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loginUser, registerUser } from '@/api/account';

// --- 状態管理用変数 ---
const isLoggedIn = ref<boolean>(false);
const username = ref<string>('');
const userId = ref<string>('');

// 入力用（簡易的な prompt で実装し、デザイン構造の崩れを防ぎます）
const message = ref<string>('');

// 画面読み込み時にLocalStorageを確認
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

// --- ログイン処理 ---
const handleLogin = async () => {
  const inputUser = prompt('ユーザー名を入力してください:');
  if (!inputUser) return;
  const inputPass = prompt('パスワードを入力してください:');
  if (!inputPass) return;

  message.value = 'ログイン中...';
  const result = await loginUser(inputUser, inputPass);

  if (result.success && result.username && result.userId) {
    isLoggedIn.value = true;
    username.value = result.username;
    userId.value = result.userId;

    // LocalStorageに保存
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', result.username);
    localStorage.setItem('userId', result.userId);
    alert('ログインに成功しました！');
  } else {
    alert(`ログイン失敗: ${result.message}`);
  }
};

// --- 新規登録処理 ---
const handleRegister = async () => {
  const inputUser = prompt('登録するユーザー名を入力してください:');
  if (!inputUser) return;
  const inputPass = prompt('登録するパスワードを入力してください:');
  if (!inputPass) return;

  message.value = 'アカウント作成中...';
  const result = await registerUser(inputUser, inputPass);

  if (result.success && result.username && result.userId) {
    isLoggedIn.value = true;
    username.value = result.username;
    userId.value = result.userId;

    // LocalStorageに保存
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', result.username);
    localStorage.setItem('userId', result.userId);
    alert('アカウントが作成され、ログインしました！');
  } else {
    alert(`アカウント作成失敗: ${result.message}`);
  }
};

// --- ログアウト処理 ---
const handleLogout = () => {
  isLoggedIn.value = false;
  username.value = '';
  userId.value = '';

  // LocalStorageから削除
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  alert('ログアウトしました。');
};
</script>

<template>
  <div class="absolute top-14 right-4 w-64 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-50">
    <div class="p-4 border-b border-zinc-100">
      <template v-if="!isLoggedIn">
        <p class="text-sm text-zinc-600 mb-3">ログインすると、動画の評価、コメント、チャンネル登録ができるようになります。</p>
        <div class="flex flex-col gap-2">
          <button @click="handleLogin" class="w-full h-9 flex items-center justify-center border border-zinc-300 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors">
            ログイン
          </button>
          <button @click="handleRegister" class="w-full h-9 flex items-center justify-center bg-blue-600 rounded-full text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            新規登録
          </button>
        </div>
      </template>

      <template v-else>
        <p class="text-sm font-medium text-zinc-800 mb-1">ようこそ、{{ username }} さん！</p>
        <p class="text-xs text-zinc-400 mb-3 font-mono">ID: {{ userId }}</p>
        <div class="flex flex-col gap-2">
          <button @click="handleLogout" class="w-full h-9 flex items-center justify-center border border-red-300 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
            ログアウト
          </button>
        </div>
      </template>
    </div>

    <div class="py-2">
      <button class="w-full h-10 px-4 flex items-center gap-3 hover:bg-zinc-50 text-left text-sm text-zinc-800">
        <span class="material-symbols-outlined text-[20px] text-zinc-600">settings</span>
        <span>設定</span>
      </button>
      <button class="w-full h-10 px-4 flex items-center gap-3 hover:bg-zinc-50 text-left text-sm text-zinc-800">
        <span class="material-symbols-outlined text-[20px] text-zinc-600">help</span>
        <span>ヘルプ</span>
      </button>
    </div>
  </div>
</template>
