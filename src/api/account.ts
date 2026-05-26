import axios from 'axios';

// --- あなたのGAS（Webアプリ）のURLをここに貼り付けてください ---
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyUl2srbJcZxjTgVtlE0JPPOh_57TFnasLViHzvWTqSJL5YeK3TaMXCVStK8H0gctsD/exec';

/**
 * APIレスポンスの共通型定義
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
  username?: string;
  userId?: string;
}

/**
 * 1. うおtube側から新規アカウントを登録する
 * @param username ユーザー名
 * @param password パスワード
 */
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

/**
 * 2. うおtube側からログイン認証を行う
 * @param username ユーザー名
 * @param password パスワード
 */
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

/**
 * 3. うおtubeの情報をユーザーの「uotube」枠（D列）に送信・更新する
 * @param userId ユーザーの固有ID (id_xxx...)
 * @param uotubeData うおtube側から保存したい文字列や情報
 */
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
