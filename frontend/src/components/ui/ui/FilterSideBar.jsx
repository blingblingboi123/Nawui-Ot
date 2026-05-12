import React from 'react';

const FilterSideBar = ({
  allProduct = [],
  categories = 'All',
  setCategories,
}) => {
  const categoryList = allProduct.map((p) => p.category);
  const uniqueCategories = ['All', ...new Set(categoryList)];

  const handleCategoryClick = (value) => {
    setCategories(value);
  };

  return (
    <div className="w-35 bg-gray-100 mt-3 p-4 rounded-lg hidden md:block">
      <h1 className="text-xl font-semibold border-b pb-2">Category</h1>

      <div className="flex flex-col gap-3 mt-3">
        {uniqueCategories.map((item, index) => (
          <label
            key={index}
            htmlFor={item}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded flex items-center"
          >
            <input
              type="radio"
              checked={categories === item}
              onChange={() => handleCategoryClick(item)}
              name="category"
              id={item}
              className="mr-2"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSideBar;