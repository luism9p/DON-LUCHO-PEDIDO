export default function CategoryTabs({ categories, active, onSelect }) {
  return (
    <nav className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-tabs__tab ${cat === active ? 'is-active' : ''}`}
          onClick={() => onSelect(cat)}
          type="button"
        >
          {cat}
        </button>
      ))}
    </nav>
  )
}
