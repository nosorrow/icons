import { useEffect, useState } from "react";
import "./App.css";
import { Badge, Button, cardTheme } from "flowbite-react";

import { CiFolderOn } from "react-icons/ci";
import "flowbite";

function App() {
  const [categories, setCategories] = useState([]);
  const [icons, setIcons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // const url = "https://ico-lib.opark.bg";
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
    <div className="w-full">
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
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
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <a href="https://flowbite.com/" class="flex items-center ps-2.5 mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill-rule="evenodd"
              clip-rule="evenodd"
              image-rendering="optimizeQuality"
              shape-rendering="geometricPrecision"
              text-rendering="geometricPrecision"
              viewBox="0 0 2000 2000"
              id="atom"
            >
              <path
                fill="#808081"
                d="M1000 1149c-82,0 -149,-67 -149,-149 0,-82 67,-149 149,-149 82,0 149,67 149,149 0,82 -67,149 -149,149z"
              ></path>
              <path
                fill="#585858"
                d="M1000 1853c-100 0-193-90-262-255-67-160-103-372-103-598 0-226 36-438 103-598 69-165 162-255 262-255 86 0 166 65 231 189 4 8 1 19-7 23-8 4-18 1-22-7-59-111-130-172-202-172-85 0-169 86-231 235-65 156-101 364-101 585 0 221 36 429 101 585 62 149 146 235 231 235 72 0 143-61 201-171 5-8 15-11 23-7 8 4 11 14 7 22-65 124-145 189-231 189zM1270 1546c-2 0-4 0-5-1-9-3-14-12-11-21 50-147 78-333 78-524 0-190-28-376-78-523-3-9 2-18 11-21 9-3 18 1 21 10 51 150 79 340 79 534 0 194-28 384-79 535-3 7-9 11-16 11z"
              ></path>
              <path
                fill="#e2e3e3"
                d="M548 1658c-63,0 -115,-18 -151,-55 -71,-71 -73,-200 -5,-365 66,-161 190,-337 350,-496 137,-137 291,-252 433,-322 9,-4 19,-1 23,8 4,8 0,18 -8,22 -139,69 -290,181 -425,315 -156,157 -278,329 -342,485 -62,150 -63,270 -3,330 60,60 180,59 330,-3 156,-64 328,-186 485,-342 156,-157 278,-329 342,-485 62,-150 63,-270 3,-330 -50,-50 -143,-58 -260,-22 -9,3 -18,-2 -21,-11 -3,-9 2,-18 11,-21 132,-40 233,-30 293,31 71,71 73,200 5,365 -66,161 -190,337 -350,496 -159,160 -335,284 -496,350 -80,33 -152,50 -214,50z"
              ></path>
              <path
                fill="#ababab"
                d="M1000 1365c-226,0 -438,-36 -598,-103 -165,-69 -255,-162 -255,-262 0,-86 66,-166 190,-232 8,-4 18,-1 23,7 4,9 1,19 -7,23 -112,58 -173,130 -173,202 0,85 86,169 235,231 156,65 364,101 585,101 221,0 429,-36 585,-101 149,-62 235,-146 235,-231 0,-85 -86,-169 -235,-231 -156,-65 -364,-101 -585,-101 -190,0 -375,27 -522,77 -9,3 -18,-2 -21,-10 -3,-9 2,-19 10,-21 151,-51 340,-79 533,-79 226,0 438,36 598,103 165,69 255,162 255,262 0,100 -90,193 -255,262 -160,67 -372,103 -598,103z"
              ></path>
              <path
                fill="#989898"
                d="M1452 1658c-44 0-93-9-148-26-9-2-13-12-11-21 3-8 12-13 21-11 120 38 215 31 266-20 60-60 59-180-3-330-64-156-186-328-342-485-157-156-329-278-485-342-150-62-270-63-330-3-50 51-58 144-21 263 3 9-2 19-11 21-9 3-18-2-21-11-41-133-31-236 30-296 71-71 200-73 365-5 161 66 337 190 496 350 160 159 284 335 350 496 68 165 66 294-5 365-36 37-87 55-151 55zM1183 1582c-2 0-5-1-7-2-143-70-297-184-434-322-138-137-252-292-322-434-4-9-1-19 7-23 9-4 19 0 23 8 68 139 180 291 315 426 135 135 286 247 425 315 9 4 12 14 8 22-3 6-9 10-15 10z"
              ></path>
              <path
                fill="#b6b6b7"
                d="M1246 492c0,0 0,0 0,0 -48,0 -86,-38 -86,-85 0,-48 38,-86 86,-86 47,0 86,38 86,86 0,47 -39,85 -86,85z"
              ></path>
              <path
                fill="#e2e3e3"
                d="M1246 1680c-48,0 -86,-38 -86,-86 0,-47 38,-85 86,-85 47,0 86,38 86,85 0,48 -39,86 -86,86z"
              ></path>
              <path
                fill="#dbdbdc"
                d="M408 838c-48,0 -86,-38 -86,-85 0,-48 38,-86 86,-86 47,0 86,38 86,86 0,47 -39,85 -86,85z"
              ></path>
            </svg>

            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </a>
          <ul className="space-y-2 font-medium">
            {categories.map((category) => (
              <li key={category.name}>
                <a
                  href="#"
                  onClick={() => loadIcons(category.name)}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group
                     ${
                       category.name === selectedCategory
                         ? "bg-red-50 text-black border-2 border-red-400"
                         : ""
                     }`}
                >
                  <CiFolderOn />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {category.name}
                  </span>
                  <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {category.count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
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
          <div className="grid grid-cols-2 lg:grid-cols-10 gap-6 mt-12">
            {filteredIcons.map((icon) => (
              <div
                key={icon.key}
                className="py-4 flex flex-col items-center border border-gray-100 rounded-2xl"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                  className="icon"
                />
                <div className="mt-2 text-center text-xs">{icon.name}</div>
                <Button
                  color="alternative"
                  onClick={() => copyToClipboard(icon.svg)}
                  className="mt-2 text-xs"
                >
                  Copy
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
