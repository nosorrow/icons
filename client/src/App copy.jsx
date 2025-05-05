import { useEffect, useState } from "react";
import "./App.css";
import { Badge, Button } from "flowbite-react";

function App() {
  const [categories, setCategories] = useState([]);
  const [icons, setIcons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const url = "http://localhost:3000";

  useEffect(() => {
    fetch(`${url}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch(() => alert("Грешка при зареждане на категориите!"));
  }, []);

  const loadIcons = (category) => {
    setIcons([]); // Изчистване на предишните икони
    setSelectedCategory(category);
    setLoading(true);
    fetch(`${url}/api/icons/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setIcons(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Грешка при зареждане на иконите!");
        setLoading(false);
      });
  };

  const copyToClipboard = (svg) => {
    navigator.clipboard.writeText(svg).then(
      () => {
        alert("SVG копирано в паметта!");
      },
      () => {
        alert("Грешка при копиране!");
      }
    );
  };

  const filteredIcons = icons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">

        Icon Browser
      </h1>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => loadIcons(category.name)}
            className={`px-4 py-2 rounded ${
              category.name === selectedCategory
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {category.name}
            <Badge
              color="purple"
              className="ml-2 inline-flex"
              size="xs"
              style={{ fontSize: "0.75rem" }}
            >
              {category.count}
            </Badge>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Търси икона..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md px-4 py-2 border rounded-lg"
          />
        </div>
      )}

      {loading && <div className="text-center text-xl">Зареждане...</div>}

      <div className="grid grid-cols-2 md:grid-cols-8 gap-6 mt-12">
        {filteredIcons.map((icon) => (
          <div key={icon.name} className="py-4 flex flex-col items-center">
            <div
              dangerouslySetInnerHTML={{ __html: icon.svg }}
              className="icon"
            />
            <div className="text-sm mt-2 text-center">{icon.name}</div>
            <Button color="alternative"
              onClick={() => copyToClipboard(icon.svg)}
              className="mt-2"
            >
              Copy
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
