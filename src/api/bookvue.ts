const apiBase = 'https://script.google.com/macros/s/AKfycbxvdx3EXJM2ClQJhqWEbxxKw9eBTCQl9N4s2Li5cp0m7row00F3NRT7xMiqFdBFJCDAkw/exec';

export interface SearchResult {
    id: string;
    image: string | null;
    title: string;
}

export interface BookDetail {
    title: string;
    images: string[];
}

/**
 * 1. 検索APIの呼び出し
 */
export async function searchBooksApi(query: string): Promise<SearchResult[]> {
    const response = await fetch(`${apiBase}?path=search&q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data.result || [];
}

/**
 * 2. 詳細内容APIの呼び出し
 */
export async function watchBookApi(id: string): Promise<BookDetail> {
    const response = await fetch(`${apiBase}?path=watch&id=${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error('Detail fetch failed');
    const data = await response.json();
    return {
        title: data.title || '無題',
        images: data.images || []
    };
}
