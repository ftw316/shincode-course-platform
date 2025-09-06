# チケット #007: 管理画面（講座・動画管理）

## 概要
管理者向けの講座・セクション・動画のCRUD操作ができる管理画面を実装する。

## 目標
- 管理者権限のアクセス制御
- 講座・セクション・動画の作成・編集・削除機能
- YouTube URL管理機能
- 公開/非公開の切り替え機能

## 詳細仕様

### 管理者権限
- 管理者ロール（role='admin'）のチェック
- 管理画面へのアクセス制御
- 一般ユーザーからの管理機能へのアクセス拒否

### 講座管理
- 講座一覧表示（公開・非公開含む）
- 新規講座作成フォーム
- 講座編集フォーム
- 講座削除機能
- 公開/非公開切り替え
- サムネイル画像のアップロード

### セクション管理
- 講座内のセクション一覧
- セクション作成・編集・削除
- セクションの順序変更（ドラッグ&ドロップ）

### 動画管理
- セクション内の動画一覧
- 動画作成・編集・削除
- YouTube URLの入力・検証
- 動画の順序変更
- プレビュー設定（is_preview）

## 管理画面の構成
```
/admin/
├── layout.tsx           # 管理画面共通レイアウト
├── page.tsx            # 管理ダッシュボード
├── courses/
│   ├── page.tsx        # 講座一覧
│   ├── new/
│   │   └── page.tsx    # 新規講座作成
│   └── [id]/
│       ├── page.tsx    # 講座詳細
│       ├── edit/
│       │   └── page.tsx # 講座編集
│       └── sections/
│           ├── page.tsx # セクション管理
│           └── [sectionId]/
│               └── videos/
│                   └── page.tsx # 動画管理
└── videos/
    └── page.tsx        # 全動画一覧
```

## 必要なフォームコンポーネント
- CourseForm（講座作成・編集）
- SectionForm（セクション作成・編集）
- VideoForm（動画作成・編集）
- ImageUpload（サムネイル）
- YouTubeUrlValidator（URL検証）
- DragDropList（順序変更）

## TODO
- [ ] 管理者権限チェック機能実装
- [ ] 管理画面用ミドルウェア作成
- [ ] 管理画面共通レイアウト作成
- [ ] 管理ダッシュボード作成
- [ ] 講座一覧ページ（管理用）作成
- [ ] 講座作成フォーム実装
- [ ] 講座編集フォーム実装
- [ ] 講座削除機能実装
- [ ] セクション管理ページ作成
- [ ] セクション作成・編集フォーム実装
- [ ] セクション順序変更機能実装
- [ ] 動画管理ページ作成
- [ ] 動画作成・編集フォーム実装
- [ ] YouTube URL検証機能実装
- [ ] 動画順序変更機能実装
- [ ] サムネイル画像アップロード機能
- [ ] 公開/非公開切り替え機能
- [ ] 管理画面のアクセス制御テスト

## YouTube URL検証
```typescript
function validateYouTubeUrl(url: string): { isValid: boolean; videoId?: string; error?: string } {
  try {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      return { isValid: false, error: '有効なYouTube URLを入力してください' };
    }
    return { isValid: true, videoId };
  } catch (error) {
    return { isValid: false, error: 'URLの形式が正しくありません' };
  }
}
```

## Server Actions
```typescript
// 講座関連
async function createCourse(data: CreateCourseData): Promise<Course>
async function updateCourse(id: string, data: UpdateCourseData): Promise<Course>
async function deleteCourse(id: string): Promise<void>
async function toggleCoursePublished(id: string): Promise<Course>

// セクション関連
async function createSection(data: CreateSectionData): Promise<Section>
async function updateSection(id: string, data: UpdateSectionData): Promise<Section>
async function deleteSection(id: string): Promise<void>
async function reorderSections(courseId: string, sectionIds: string[]): Promise<void>

// 動画関連
async function createVideo(data: CreateVideoData): Promise<Video>
async function updateVideo(id: string, data: UpdateVideoData): Promise<Video>
async function deleteVideo(id: string): Promise<void>
async function reorderVideos(sectionId: string, videoIds: string[]): Promise<void>
```

## 権限制御
```typescript
// 管理者チェック
async function checkAdminRole(userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  return profile?.role === 'admin';
}
```

## 完了条件
- [ ] 管理者のみアクセス可能
- [ ] 講座のCRUD操作が可能
- [ ] セクションのCRUD操作が可能
- [ ] 動画のCRUD操作が可能
- [ ] YouTube URLの検証が機能する
- [ ] 順序変更機能が動作する
- [ ] 公開/非公開切り替えが機能する
- [ ] サムネイル画像アップロードが機能する
- [ ] レスポンシブデザインが適用されている
- [ ] エラーハンドリングが適切に実装されている

## 関連チケット
- #001: データベース設計・構築
- #002: 認証システム実装
- #003: 基本ページ構造とルーティング設定
- #004: 講座・動画一覧表示