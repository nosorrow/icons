import { useEffect, useState } from "react";
import "./App.css";
// import SidebarLogo from "./components/sidebar-logo";
import Sidebar from "./components/sidebar";
import { Badge, Button } from "flowbite-react";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [categories, setCategories] = useState([]);
  const [icons, setIcons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const url = "https://ico-lib.opark.bg";
  const url = "http://localhost:3000";

  useEffect(() => {
    fetch(`${url}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch(() => toast.error("Грешка при зареждане на категориите!"));
  }, []);

  const loadIcons = (category) => {
    setIcons([]);
    setSelectedCategory(category);
    setLoading(true);
    fetch(`${url}/api/icons/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setIcons(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Грешка при зареждане на иконите!");
        setLoading(false);
      });

    // Затваряме sidebar-a на мобилни устройства
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  const copyToClipboard = (svg) => {
    navigator.clipboard.writeText(svg).then(
      () => {
        toast.success("SVG копирано в паметта!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      () => {
        toast.error("Грешка при копиране!");
      }
    );
  };

  const filteredIcons = icons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      {/* <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-72 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <SidebarLogo
            title="Icon Collections"
            size={35}
            textColor="text-indigo-900"
          />
          <ul className="space-y-2 font-medium">
            {categories.map((category) => (
              <li key={category.name}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    loadIcons(category.name);
                  }}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group
                     ${
                       category.name === selectedCategory
                         ? "bg-red-50 text-black ring-2 ring-red-400"
                         : ""
                     }`}
                >
                 { category.name === selectedCategory ? (<FaRegFolderOpen />): (<FaRegFolder />) }
                 
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {category.name}
                  </span>
                  <span className="inline-flex items-center justify-center min-w-3 h-3 p-2 ms-3 text-xs font-medium text-pink-800 bg-pink-100 rounded-full dark:bg-pink-900 dark:text-pink-300">
                    {category.count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside> */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={loadIcons}
        sidebarOpen={sidebarOpen}
      />
      <div className="p-4 sm:ml-72">
        <div>
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
        </div>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="grid grid-cols-2 lg:grid-cols-8 gap-6 mt-12">
            {filteredIcons.map((icon) => (
              <div
                key={icon.key}
                className="relative px-6 py-4 flex flex-col items-center border border-gray-100 rounded-2xl"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                  className="icon"
                />
                <div className="mt-2 text-center text-xs">{icon.name}</div>
                <Button
                  color="alternative"
                  onClick={() => copyToClipboard(icon.svg)}
                  className="mt-2 text-xs dark:bg-white dark:text-black transition-all duration-300"
                >
                  <FaRegCopy className="mr-2" /> Copy
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
