<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser, registerUser } from '../../api/account';

const router = useRouter();

// --- 状態管理用変数 ---
const isLoggedIn = ref<boolean>(false);
const username = ref<string>('');
const userId = ref<string>('');

// 入力用（独自UI用）
const message = ref<string>('');
const authMode = ref<'none' | 'login' | 'register'>('none'); // 表示する独自UIフォームの判定
const inputUsername = ref<string>('');
const inputPassword = ref<string>('');

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

// --- 独自フォームの表示切り替え ---
const showAuthForm = (mode: 'login' | 'register') => {
  authMode.value = mode;
  message.value = '';
  inputUsername.value = '';
  inputPassword.value = '';
};

const cancelAuth = () => {
  authMode.value = 'none';
  message.value = '';
};

// --- ログイン処理 ---
const handleLogin = async () => {
  if (!inputUsername.value || !inputPassword.value) {
    message.value = 'すべて入力してください';
    return;
  }

  message.value = 'ログイン中...';
  const result = await loginUser(inputUsername.value, inputPassword.value);

  if (result.success && result.username && result.userId) {
    isLoggedIn.value = true;
    username.value = result.username;
    userId.value = result.userId;

    // LocalStorageに保存
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', result.username);
    localStorage.setItem('userId', result.userId);
    
    authMode.value = 'none';
    alert('ログインに成功しました！');
  } else {
    message.value = `ログイン失敗: ${result.message}`;
  }
};

// --- 新規登録処理 ---
const handleRegister = async () => {
  if (!inputUsername.value || !inputPassword.value) {
    message.value = 'すべて入力してください';
    return;
  }

  message.value = 'アカウント作成中...';
  const result = await registerUser(inputUsername.value, inputPassword.value);

  if (result.success && result.username && result.userId) {
    isLoggedIn.value = true;
    username.value = result.username;
    userId.value = result.userId;

    // LocalStorageに保存
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', result.username);
    localStorage.setItem('userId', result.userId);
    
    authMode.value = 'none';
    alert('アカウントが作成され、ログインしました！');
  } else {
    message.value = `アカウント作成失敗: ${result.message}`;
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

// --- ルーティング遷移 ---
const goToMyPage = () => {
  router.push('/mypage');
};

const goToHelp = () => {
  router.push('/help');
};
</script>

<template>
  <div @click.stop class="absolute top-14 right-4 w-64 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-50">
    <div class="p-4 border-b border-zinc-100">
      <template v-if="!isLoggedIn">
        <template v-if="authMode === 'none'">
          <p class="text-sm text-zinc-600 mb-3">ログインすると、動画の評価、コメント、チャンネル登録の別端末間での連携ができるようになります。</p>
          <div class="flex flex-col gap-2">
            <button @click="showAuthForm('login')" class="w-full h-9 flex items-center justify-center border border-zinc-300 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors">
              ログイン
            </button>
            <button @click="showAuthForm('register')" class="w-full h-9 flex items-center justify-center bg-blue-600 rounded-full text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              新規登録
            </button>
          </div>
        </template>

        <template v-else>
          <p class="text-xs font-bold text-zinc-700 mb-2">
            {{ authMode === 'login' ? 'ログイン情報を入力' : '新規アカウント登録' }}
          </p>
          <div class="flex flex-col gap-2">
            <input 
              v-model="inputUsername" 
              type="text" 
              placeholder="ユーザー名" 
              class="w-full h-8 px-2 border border-zinc-300 rounded text-xs focus:outline-none focus:border-blue-500"
            />
            <input 
              v-model="inputPassword" 
              type="password" 
              placeholder="パスワード" 
              class="w-full h-8 px-2 border border-zinc-300 rounded text-xs focus:outline-none focus:border-blue-500"
            />
            
            <p v-if="message" class="text-[11px] text-red-500 font-medium">{{ message }}</p>

            <div class="flex gap-1 mt-1">
              <button 
                @click="cancelAuth" 
                class="flex-1 h-7 border border-zinc-300 rounded text-xs font-medium text-zinc-600 hover:bg-zinc-50"
              >
                戻る
              </button>
              <button 
                @click="authMode === 'login' ? handleLogin() : handleRegister()" 
                class="flex-1 h-7 bg-blue-600 rounded text-xs font-medium text-white hover:bg-blue-700"
              >
                {{ authMode === 'login' ? '完了' : '登録' }}
              </button>
            </div>
          </div>
        </template>
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
      <button @click="goToMyPage" class="w-full h-10 px-4 flex items-center gap-3 hover:bg-zinc-50 text-left text-sm text-zinc-800">
        <span class="material-symbols-outlined text-[20px] text-zinc-600">account_circle</span>
        <span>マイページへ</span>
      </button>
      <button @click="goToHelp" class="w-full h-10 px-4 flex items-center gap-3 hover:bg-zinc-50 text-left text-sm text-zinc-800">
        <span class="material-symbols-outlined text-[20px] text-zinc-600">help</span>
        <span>ヘルプ</span>
      </button>
    </div>
  </div>
</template>
