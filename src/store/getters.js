/**
 * @author shenjian
 * @since 2023/07/25
 */
const getters = {
    token: (state) =>
        state.user.token !== '' ? state.user.token : localStorage.getItem('token'),
    account: (state) =>
        state.user.name !== '' ? state.user.account : localStorage.getItem('account'),
    username: (state) =>
        state.user.username !== '' ? state.user.username : localStorage.getItem('username'),
    permissions: (state) =>
        state.user.permissions !== '' ? state.user.permissions : localStorage.getItem('permissions'),
    taskType: (state) =>
        state.task.taskType !== '' ? state.task.taskType : localStorage.getItem('taskType'), 
    patientJSON: (state) =>
        state.task.patientJSON !== '' ? state.task.patientJSON :localStorage.getItem('patient'),    
    patientId: (state) =>
        state.task.patientId !== '' ? state.task.patientId : localStorage.getItem('patientId'),   
    taskLogId: (state) =>
        state.task.taskLogId !== '' ? state.task.taskLogId : localStorage.getItem('taskLogId'),  
}

export default getters
