import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // 基础路径根据你的部署环境进行调整
  build: {
    rollupOptions: {
      output: {
        // 手动拆分 chunk，将大的依赖分离出来，减少主文件的大小
        manualChunks: {
          vendor: ['three'], // 例如，将 three.js 打包到单独的 chunk 中
        },
      },
    },
    // 调整 chunk 大小警告限制，避免警告
    chunkSizeWarningLimit: 1000, // 可以根据需要提高此值，默认500kB，这里设为1000kB
  },
})