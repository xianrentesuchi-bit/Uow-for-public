<template>
  <div id="app">
    <div v-if="view === 'list'">
        <header>
            <h1>Book Viewer</h1>
            <form @submit.prevent="searchBooks" class="search-box">
                <input 
                    type="text" 
                    v-model.trim="searchQuery" 
                    placeholder="本を検索..." 
                    class="search-input"
                    :disabled="loading"
                >
                <button type="submit" class="search-button" :disabled="loading">
                    {{ loading ? '検索中...' : '検索' }}
                </button>
            </form>
        </header>

        <div v-if="loading && results.length === 0" class="status-message">
            読み込み中...
        </div>
        <div v-else-if="searched && results.length === 0" class="status-message">
            該当する結果が見つかりませんでした。
        </div>

        <div class="grid" v-if="results.length > 0">
            <div 
                v-for="item in results" 
                :key="item.id" 
                class="card"
                @click="watchBook(item.id)"
            >
                <img 
                    :src="item.image || 'https://via.placeholder.com/200x280?text=No+Image'" 
                    :alt="item.title" 
                    class="card-thumbnail"
                    loading="lazy"
                >
                <div class="card-info">
                    <h2 class="card-title" :title="item.title">{{ item.title }}</h2>
                </div>
            </div>
        </div>
    </div>

    <div v-if="view === 'detail'" class="viewer-container">
        <div class="viewer-header">
            <button @click="backToList" class="btn-back">← 戻る</button>
            <h2 class="viewer-title">{{ currentBook.title }}</h2>
        </div>

        <div v-if="detailLoading" class="status-message">
            本を読み込んでいます...
        </div>

        <div v-else class="book-pages">
            <img 
                v-for="(img, index) in currentBook.images" 
                :key="index" 
                :src="img" 
                class="page-image"
                alt="ページ画像"
                loading="lazy"
            >
            <div v-if="currentBook.images.length === 0" class="status-message">
                画像が見つかりませんでした。
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { searchBooksApi, watchBookApi, SearchResult, BookDetail } from './api/bookvue';

export default defineComponent({
  name: 'App',
  setup() {
    const view = ref<'list' | 'detail'>('list');
    const searchQuery = ref('');
    const results = ref<SearchResult[]>([]);
    const loading = ref(false);
    const searched = ref(false);
    
    const detailLoading = ref(false);
    const currentBook = ref<BookDetail>({
        title: '',
        images: []
    });

    // 1. 検索APIの呼び出し
    const searchBooks = async () => {
        if (!searchQuery.value) return;
        
        loading.value = true;
        searched.value = true;
        
        try {
            results.value = await searchBooksApi(searchQuery.value);
        } catch (error) {
            console.error("検索エラー:", error);
            alert("検索中にエラーが発生しました。");
        } finally {
            loading.value = false;
        }
    };

    // 2. 詳細内容APIの呼び出し
    const watchBook = async (id: string) => {
        view.value = 'detail';
        detailLoading.value = true;
        currentBook.value = { title: '読み込み中...', images: [] };

        try {
            currentBook.value = await watchBookApi(id);
        } catch (error) {
            console.error("詳細取得エラー:", error);
            alert("本の読み込みに失敗しました。");
            view.value = 'list';
        } finally {
            detailLoading.value = false;
        }
    };

    // 一覧に戻る
    const backToList = () => {
        view.value = 'list';
        currentBook.value = { title: '', images: [] };
    };

    return {
        view,
        searchQuery,
        results,
        loading,
        searched,
        detailLoading,
        currentBook,
        searchBooks,
        watchBook,
        backToList
    };
  }
});
</script>

<style scoped>
:root {
    --bg-color: #f8f9fa;
    --card-bg: #ffffff;
    --text-color: #212529;
    --text-muted: #6c757d;
    --primary-color: #007bff;
    --primary-hover: #0056b3;
    --border-color: #dee2e6;
}

/* スコープ外のbodyやフォント設定を適用させるため、最初だけグローバルまたは親のスタイルを参照できるように考慮 */
#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Noto Sans JP', sans-serif;
    color: #212529;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

h1 {
    font-size: 1.8rem;
    color: #212529;
    margin-bottom: 20px;
}

/* 検索フォーム */
.search-box {
    display: flex;
    max-width: 600px;
    margin: 0 auto 30px auto;
    gap: 10px;
}

.search-input {
    flex: 1;
    padding: 12px 20px;
    font-size: 1rem;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
    background-color: #ffffff;
    color: #212529;
}

.search-input:focus {
    border-color: #007bff;
}

.search-button {
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 500;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.search-button:hover {
    background-color: #0056b3;
}

/* 状態表示 */
.status-message {
    text-align: center;
    color: #6c757d;
    margin: 40px 0;
    font-size: 1.1rem;
}

/* 検索結果グリッド */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.card {
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid #dee2e6;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.card-thumbnail {
    width: 100%;
    height: 280px;
    object-fit: cover;
    background-color: #eaeaea;
}

.card-info {
    padding: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-title {
    font-size: 0.95rem;
    font-weight: 500;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    color: #212529;
}

/* 詳細ビューア */
.viewer-container {
    background: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #dee2e6;
}

.viewer-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 15px;
}

.btn-back {
    padding: 8px 16px;
    background-color: #f1f3f5;
    color: #212529;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.btn-back:hover {
    background-color: #e9ecef;
}

.viewer-title {
    font-size: 1.3rem;
    margin: 0;
    flex: 1;
    color: #212529;
}

.book-pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    background-color: #f1f3f5;
    padding: 20px;
    border-radius: 8px;
    max-height: 80vh;
    overflow-y: auto;
}

.page-image {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background: white;
}

/* レスポンシブ */
@media (max-width: 600px) {
    .grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
    }
    .card-thumbnail {
        height: 200px;
    }
    .viewer-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
