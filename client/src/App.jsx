// client/src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [icons, setIcons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => alert('Грешка при зареждане на категориите!'));
  }, []);

  const loadIcons = (category) => {
    setSelectedCategory(category);
    setLoading(true);
    fetch(`http://localhost:3001/api/icons/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setIcons(data);
        setLoading(false);
      })
      .catch(() => {
        alert('Грешка при зареждане на иконите!');
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>Icon Browser</h1>

      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => loadIcons(category)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <div>Зареждане...</div>}

      <div className="icons">
        {icons.map((icon) => (
          <div key={icon.name} className="icon">
            <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
            <div className="icon-name">{icon.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
