import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';

function Home() {
  return (
    <div>
      <Header /> {/* 헤더 표시 */}
      
      <main className="home-container">
        <h1>홈 페이지입니다</h1>
        <p>여기에 콘텐츠를 추가하세요</p>

        {/* ✅ 테이블 컴포넌트 삽입 */}
        <Task />
      </main>

      <Footer /> {/* 푸터 표시 */}
    </div>
  );
}

export default Home;
