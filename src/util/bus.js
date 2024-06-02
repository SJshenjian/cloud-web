/**
 * @description: 发布及订阅事件
 * @return {*}
 */
class EventBus {
    constructor() {
        console.log('bus constructor')
        // 事件集
        this.handles = {};
    }

    // 订阅事件
    on(eventType, handle) {
        if (!this.handles.hasOwnProperty(eventType)) {
            this.handles[eventType] = [];
        }
        if (typeof handle == 'function') {
            this.handles[eventType].push(handle);
        } else {
            throw new Error('缺少回调函数');
        }
        return this; // 实现链式操作
    }

    // 发布事件
    emit(eventType, ...args) {
        if (this.handles.hasOwnProperty(eventType)) {
            this.handles[eventType].forEach((item, key, arr) => {
                item.apply(null, args);
            });
        } else {
            throw new Error(eventType + "事件未注册");
        }
        return this; // 实现链式操作
    }

    // 取消订阅
    off(eventType, handle) {
        if (!this.handles.hasOwnProperty(eventType)) {
            throw new Error(eventType + "事件未注册");
        } else {
            this.handles[eventType].forEach((item, key, arr) => {
                if (item == handle) {
                    arr.splice(key, 1);
                }
            });
        }
        return this; // 实现链式操作
    }
}
EventBus.getInstance=function(){
    if(!this._instance){
        this._instance=new EventBus
    }
    return this._instance
}
export default EventBus