import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  // ✅ Redux Provider 추가
import store from '../store/store.js'; // ✅ Redux 스토어 가져오기
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>  {/* ✅ Redux Provider 적용 */}
      <App />
    </Provider>
  </StrictMode>
);
