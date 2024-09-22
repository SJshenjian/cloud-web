// 接受参数
export interface SSEChatParams {
    url: string,// sse 连接
        onmessage: (event: MessageEvent) => void,// 处理消息的函数
        onopen: () => void,// 建立连接触发的事件
        finallyHandler: () => void,// 相当于 try_finally 中的 finally 部分，不管出现异常或者关闭必然会执行的代码块
}


class SSEService {
    private eventSource: EventSource | null = null;

    private finallyHandler: (() => void) | undefined;

    // 建立连接
    connect(sseChatParams: SSEChatParams) {

        this.finallyHandler = sseChatParams.finallyHandler;

        this.eventSource = new EventSource(sseChatParams.url);

        if (sseChatParams.onopen != null) {
            this.eventSource.onopen = sseChatParams.onopen;
        }else{
            this.eventSource.onopen = () => {
                console.log('SSE 连接已开启');
            };
        }

        if (sseChatParams.onmessage != null) {
            this.eventSource.onmessage = sseChatParams.onmessage;
        } else {
            debugger
            this.eventSource.onmessage = (event) => {
                console.log('收到消息：', event.data);
            };
        }

        this.eventSource.onerror = (error) => {
            if (this.eventSource?.readyState === EventSource.CLOSED) {
                console.log("SSE 连接已关闭");
            } else {
                console.error("SSE 错误：", error);
            }
            sseChatParams.finallyHandler();
        };
    }

    // 关闭连接
    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            console.log("关闭 sse 连接")
            if (this.finallyHandler != null) {
                this.finallyHandler();
            }
        }
    }
}

export const sseService = new SSEService();
