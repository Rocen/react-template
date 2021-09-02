import './App.css';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';

function App() {

  const [result, setResult] = useState('请求中');
  const [data, setData] = useState([]);

  const _ajax = () => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/mock', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.response)
          resolve(res);
        }else {
          reject('请求失败')
        }
      }
    })
  }

  const getData = () => {
    axios.get('/api/mock')
    .then(function (res) {
      // 处理成功情况
      const {
        data: {
          success = true,
          data
        }
      } = res;
      if (success) {
        setResult('请求成功');
        setData(data.projects)
      }else {
        setResult('请求失败');
      }
    })
  }

  useEffect(() => {
    // getData();
    _ajax()
      .then(res => {
        const {
          data,
          success
        } = res;
        setResult('请求成功');
        setData(data.projects);
      })
      .catch(error => {
        throw(error);
      })
  }, [])


  return (
    <Suspense fallback={"加载中"}>
      <div className="App">
        <h1>{result}</h1>
        <ul>
          {
            data.map((i, k) => <li key={k}>{i.address}</li> )
          }
        </ul>
      </div>
    </Suspense>
  );
}

export default App;
