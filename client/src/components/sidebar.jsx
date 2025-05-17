import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import SidebarLogo from "./sidebar-logo";

function SidebarItem({category, selectedCategory, onCategorySelect}) {
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onCategorySelect(category.name);
        }}
        className={`flex items-center p-1 text-gray-900 text-sm rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group 
          ${ category.name === selectedCategory
            ? "bg-pink-50 text-black ring-2 ring-pink-300 dark:bg-pink-600 dark:text-white dark:ring-2 dark:ring-pink-700"
            : ""
        }`}
      >
        {category.name === selectedCategory ? (
          <FaRegFolderOpen />
        ) : (
          <FaRegFolder />
        )}
        <span className="flex-1 ms-3 whitespace-nowrap">
          {category.name}
        </span>
        <span className="inline-flex items-center justify-center min-w-3 h-3 p-2 ms-3 text-xs font-medium text-pink-800 bg-pink-100 rounded-full dark:bg-pink-700 dark:text-pink-300">
          {category.count}
        </span>
      </a>
    </li>
  );

}

export default function Sidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  sidebarOpen,
}) {
  return (
    <aside
      id="default-sidebar"
      className={`fixed top-0 left-0 z-40 w-[17rem] h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
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
            <SidebarItem
              key={category.name}
              category={category}
              selectedCategory={selectedCategory}
              onCategorySelect={onCategorySelect}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}