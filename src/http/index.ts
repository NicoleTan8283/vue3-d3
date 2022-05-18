import axios  from "axios";
import { ElMessage } from "element-plus";
const baseURL = 'api';
const request = axios.create({
  baseURL,
  timeout: 60000
});
request.interceptors.request.use(
  config => {
    return config
  }
)
request.interceptors.response.use(
  (response) => {
    const { data } = response
    return data
  },
  (error) => {
    ElMessage({
      type:"error",
      message: error.message + error.data
    })
    return Promise.reject(error)
  }
)
export default request;


// export request;