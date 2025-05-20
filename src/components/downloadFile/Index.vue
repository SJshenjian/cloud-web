<template>
  <div class="download-container">
    <el-button-group>
      <el-button
          @click="startDownload"
          :disabled="isDownloading"
          type="primary"
          icon="el-icon-download"
      >
        开始下载
      </el-button>
      <el-button
          @click="pauseDownload"
          :disabled="!isDownloading || isPaused"
          icon="el-icon-video-pause"
      >
        暂停
      </el-button>
      <el-button
          @click="resumeDownload"
          :disabled="!isPaused"
          icon="el-icon-caret-right"
      >
        继续
      </el-button>
      <el-button
          @click="cancelDownload"
          :disabled="!isDownloading"
          type="danger"
          icon="el-icon-close"
      >
        取消
      </el-button>
    </el-button-group>

    <el-progress
        :percentage="progressPercent"
        :status="progressStatus"
        :stroke-width="16"
        class="progress-bar"
    />
    <div class="download-info">
      <span v-if="speed">下载速度: {{ speed }} MB/s</span>
      <span>已下载: {{ formatFileSize(downloadedSize) }} / {{ formatFileSize(totalSize) }}</span>
    </div>
  </div>
</template>

<script>
import baseUrl from "../../util/baseUrl";
import store from "../../store";
import {md5} from "js-md5";

export default {
  name: "DownloadFile",
  props: {
    fileId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chunkSize: 5 * 1024 * 1024, // 5MB 分片
      maxRetries: 3,
      isDownloading: false,
      isPaused: false,
      progressPercent: 0,
      progressStatus: '',
      speed: '',
      downloadedSize: 0,
      totalSize: 0,
      controller: null,
      retryCount: 0,
      chunks: [],
      downloadStartTime: null,
      fileName: '',
      serverFileMD5: '' // 存储服务器提供的文件 MD5
    }
  },
  computed: {
    fileUrl() {
      return `${baseUrl.apiUrl}/download/download?fileId=${this.fileId}`;
    },
    estimatedTime() {
      if (!this.speed || this.speed <= 0) return '--';
      const remaining = (this.totalSize - this.downloadedSize) / (this.speed * 1024 * 1024);
      return remaining > 3600
          ? `${Math.floor(remaining / 3600)}小时${Math.floor((remaining % 3600) / 60)}分钟`
          : `${Math.floor(remaining / 60)}分钟${Math.floor(remaining % 60)}秒`;
    }
  },
  methods: {
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    async calculateMD5(data) {
      try {
        return md5(data); // Compute MD5 hash
      } catch (error) {
        console.error('MD5 error:', error);
        throw error;
      }
    },

    async startDownload() {
      if (this.isDownloading) return;

      try {
        this.resetState();
        this.isDownloading = true;
        this.downloadStartTime = Date.now();
        this.controller = new AbortController();

        // 获取文件元数据
        await this.fetchFileMetadata();

        // 恢复进度或开始新下载
        await this.downloadChunks();
      } catch (err) {
        this.handleError(err);
      }
    },

    async fetchFileMetadata() {
      const headRes = await fetch(this.fileUrl, {
        method: 'HEAD',
        headers: {
          Authorization: store.getters.token,
          'Cache-Control': 'no-cache'
        }
      });

      if (!headRes.ok) {
        throw new Error(`获取文件信息失败: ${headRes.statusText}`);
      }

      this.totalSize = parseInt(headRes.headers.get('Content-Length')) || 0;
      const contentDisposition = headRes.headers.get('Content-Disposition');
      this.fileName = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : this.fileId;
      this.serverFileMD5 = headRes.headers.get('File-MD5') || ''; // 获取服务器提供的 MD5

      if (!this.serverFileMD5) {
        console.warn('服务器未提供文件 MD5，无法进行完整性验证');
      }

      // 恢复进度
      const savedProgress = localStorage.getItem(this.getStorageKey());
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        this.downloadedSize = progressData.downloaded;
        this.progressPercent = Math.round((this.downloadedSize / this.totalSize) * 100);
      }
    },

    getStorageKey() {
      return `download-${btoa(this.fileUrl)}`;
    },

    async downloadChunks() {
      while (this.downloadedSize < this.totalSize && !this.isPaused) {
        const start = this.downloadedSize;
        const end = Math.min(start + this.chunkSize - 1, this.totalSize - 1);

        try {
          const chunkBlob = await this.downloadChunk(start, end);
          const customBlob = {
            blob: chunkBlob,
            start: start,
            end: end
          };
          this.chunks.push(customBlob);
          this.retryCount = 0;
        } catch (err) {
          if (err.name === 'AbortError') return;
          if (this.retryCount++ < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
            continue;
          }
          throw err;
        }
      }

      if (this.downloadedSize >= this.totalSize) {
        await this.completeDownload();
      }
    },

    async downloadChunk(start, end) {
      const startTime = Date.now();
      // 禁用缓存
      const response = await fetch(this.fileUrl, {
        headers: {
          Range: `bytes=${start}-${end}`,
          Authorization: store.getters.token,
          'Cache-Control': 'no-cache'
        },
        signal: this.controller.signal // 添加时间戳参数以避免浏览器缓存
      });

      if (!response.ok) {
        throw new Error(`下载失败: ${response.statusText}`);
      }
      // 方法1：直接使用 arrayBuffer() 方法（最简单）
      const contentRange = response.headers.get('Content-Range');
      console.log('Content-Range:', contentRange);  // 确保它匹配你请求的范围
      const arrayBuffer = await response.arrayBuffer();
      // 排查用户端与服务端的MD5校验
      // const chunk_md5 = response.headers.get('File-MD5')
      // const real_md5 = await this.calculateMD5(arrayBuffer)
      // console.log(arrayBuffer)
      // if (chunk_md5 !== real_md5) {
      //   console.error("MD5不一致：", chunk_md5, real_md5)
      //   console.log("HEX" + utils.toHex(arrayBuffer))
      // } else {
      //   console.error("MD5一致：", chunk_md5, real_md5)
      //   console.log("HEX" + utils.toHex(arrayBuffer))
      // }

      // 更新进度
      this.updateProgress(start, arrayBuffer.byteLength, startTime);

      return arrayBuffer;
      // const reader = response.body.getReader();
      // let receivedLength = 0;
      // const chunks = [];
      //
      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;
      //
      //   chunks.push(value);
      //   receivedLength += value.length;
      //
      //   // 更新进度
      //   this.updateProgress(start, receivedLength, startTime);
      // }
      // return chunks;
    },

    updateProgress(start, receivedLength, startTime) {
      this.downloadedSize = start + receivedLength;
      this.progressPercent = Math.round((this.downloadedSize / this.totalSize) * 100);

      // 计算下载速度
      const timeElapsed = (Date.now() - startTime) / 1000;
      this.speed = (receivedLength / 1024 / 1024 / timeElapsed).toFixed(2);

      // 保存进度
      localStorage.setItem(
          this.getStorageKey(),
          JSON.stringify({
            downloaded: this.downloadedSize,
            chunks: this.chunks.length
          })
      );
    },

    pauseDownload() {
      this.isPaused = true;
      this.controller.abort();
      this.progressStatus = 'warning';
      this.$message.warning('下载已暂停');
    },

    resumeDownload() {
      this.isPaused = false;
      this.progressStatus = '';
      this.controller = new AbortController();
      this.downloadChunks();
      this.$message.success('继续下载');
    },

    cancelDownload() {
      this.controller.abort();
      this.resetState();
      localStorage.removeItem(this.getStorageKey());
      this.$message.info('下载已取消');
    },

    async completeDownload() {
      try {
        this.progressStatus = 'success';
        await this.saveFile();
        this.$message.success('下载完成');
      } catch (err) {
        this.handleError(err);
      } finally {
        this.cleanup();
      }
    },

    async saveFile() {
      // 1. 排序分片
      const sortedChunks = this.chunks.sort((a, b) => a.start - b.start);
      const fullBlob = new Blob(sortedChunks.map(c => c.blob), { type: 'application/zip' });

      // 计算下载文件的 MD5
      let arrayBuffer;
      if (this.serverFileMD5) {
        arrayBuffer = await fullBlob.arrayBuffer();
        const downloadedMD5 = await this.calculateMD5(arrayBuffer);

        if (downloadedMD5 !== this.serverFileMD5) {
          this.progressStatus = 'exception';
          this.$message.error('文件校验失败：MD5 不匹配，文件可能已损坏');
          throw new Error('MD5 verification failed');
        }
      }

      // 检查 ZIP 文件头
      const uint8Array = new Uint8Array(arrayBuffer);
      const zipHeader = uint8Array.slice(0, 4);
      if (zipHeader[0] !== 80 || zipHeader[1] !== 75 || zipHeader[2] !== 3 || zipHeader[3] !== 4) {
        this.progressStatus = 'exception';
        this.$message.error('无效的 ZIP 文件：文件头错误');
        throw new Error('Invalid ZIP file header');
      }

      // 创建下载链接
      const url = URL.createObjectURL(fullBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      a.style.display = 'none';

      // 触发下载
      document.body.appendChild(a);
      a.click();

      // 延迟清理
      await new Promise(resolve => setTimeout(resolve, 100));
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    resetState() {
      this.isDownloading = false;
      this.isPaused = false;
      this.progressPercent = 0;
      this.progressStatus = '';
      this.speed = '';
      this.downloadedSize = 0;
      this.retryCount = 0;
      this.chunks = [];
      this.controller = null;
      this.serverFileMD5 = '';
    },

    cleanup() {
      this.isDownloading = false;
      localStorage.removeItem(this.getStorageKey());
    },

    handleError(err) {
      console.error('下载错误:', err);
      this.progressStatus = 'exception';
      this.$message.error(`下载失败: ${err.message}`);
      this.cleanup();
    }
  },
  beforeUnmount() {
    if (this.controller) {
      this.controller.abort();
    }
  }
}
</script>

<style scoped>
.download-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.el-button-group {
  margin-bottom: 15px;
}

.progress-bar {
  margin: 20px 0;
}

.download-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}

.download-info span {
  padding: 0 5px;
}
</style>
