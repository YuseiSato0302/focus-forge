module.exports = {
  // TypeScript を ts-jest で変換
  preset: 'ts-jest',
  // Node環境でテスト
  testEnvironment: 'node',

  // ユニットテストだけを対象にする
  roots: ['<rootDir>/tests/unit'],

  // .ts のファイルをトランスフォーム
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },

  // 認識する拡張子
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
