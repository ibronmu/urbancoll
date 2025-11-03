interface Category {
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryFilterProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`card p-6 text-center transition-all duration-200 ${
                selectedCategory === category.name
                  ? 'ring-2 ring-primary-500 transform scale-105'
                  : 'hover:transform hover:scale-105'
              }`}
              onClick={() => onCategorySelect(category.name)}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="font-medium text-gray-900">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}