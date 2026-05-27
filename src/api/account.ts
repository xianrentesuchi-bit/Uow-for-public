import axios from 'axios';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwYsl3issVM1SgFyeuRVCITmIfex6kc7lmuiRXVpxbD195ctM0aAsyUxBV_NZxVz9UH/exec';

export interface ApiResponse {
  success: boolean;
  message?: string;
  username?: string;
  userId?: string;
}

export interface BackupData {
  playlists?: any[];
  subscribers?: any[];
  'watch-history'?: any[];
}

export const registerUser = async (username: string, password: string): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  params.append('action', 'register');
  params.append('username', username);
  params.append('password', password);

  try {
    const response = await axios.post<ApiResponse>(GAS_API_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '新規登録中に通信エラーが発生しました。',
    };
  }
};

export const loginUser = async (username: string, password: string): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  params.append('action', 'login');
  params.append('username', username);
  params.append('password', password);

  try {
    const response = await axios.post<ApiResponse>(GAS_API_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'ログイン中に通信エラーが発生しました。',
    };
  }
};

export const updateUotubeData = async (userId: string, uotubeData: string): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('uotube', uotubeData);

  try {
    const response = await axios.post<ApiResponse>(GAS_API_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'uotubeデータの更新中に通信エラーが発生しました。',
    };
  }
};

export function exportLocalStorageData(): BackupData {
  const playlists = localStorage.getItem('playlists');
  const subscribers = localStorage.getItem('subscribers');
  const watchHistory = localStorage.getItem('watch-history');

  return {
    playlists: playlists ? JSON.parse(playlists) : [],
    subscribers: subscribers ? JSON.parse(subscribers) : [],
    'watch-history': watchHistory ? JSON.parse(watchHistory) : []
  };
}

export function importLocalStorageData(data: BackupData): boolean {
  try {
    if (data.playlists && !Array.isArray(data.playlists)) {
      throw new Error('Playlists data must be an array');
    }
    if (data.subscribers && !Array.isArray(data.subscribers)) {
      throw new Error('Subscribers data must be an array');
    }
    if (data['watch-history'] && !Array.isArray(data['watch-history'])) {
      throw new Error('Watch history data must be an array');
    }

    if (data.playlists) {
      localStorage.setItem('playlists', JSON.stringify(data.playlists));
    }
    if (data.subscribers) {
      localStorage.setItem('subscribers', JSON.stringify(data.subscribers));
    }
    if (data['watch-history']) {
      localStorage.setItem('watch-history', JSON.stringify(data['watch-history']));
    }

    return true;
  } catch (error) {
    console.error('Failed to import localStorage data:', error);
    return false;
  }
}

export const fetchUotubeData = async (username: string): Promise<{ success: boolean; uotube?: string; message?: string }> => {
  try {
    const response = await axios.get<{ success: boolean; uotube?: string; message?: string }>(GAS_API_URL, {
      params: { action: 'get_uotube', username: username }
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'データの取得に失敗しました。'
    };
  }
};

export const syncLocalStorageToCloud = async (userId: string): Promise<ApiResponse> => {
  const localData = exportLocalStorageData();
  const jsonString = JSON.stringify(localData);
  return await updateUotubeData(userId, jsonString);
};

export const syncCloudToLocalStorage = async (username: string): Promise<boolean> => {
  const result = await fetchUotubeData(username);
  if (result.success && result.uotube) {
    try {
      const backupData: BackupData = JSON.parse(result.uotube);
      return importLocalStorageData(backupData);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  return false;
};
