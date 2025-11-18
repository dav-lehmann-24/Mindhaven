import React, { useState } from 'react';
import styles from './FilterSearch.module.css';
import Button from './Button';

const FilterSearch = ({ onApply }) => {
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState('title');
  const [sortBy, setSortBy] = useState('newest');

  const handleApply = () => {
    if (onApply) {
      onApply({ search, filterBy, sortBy });
    }
  };

  return (
    <div className={styles.filterSearchWrapper}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search journals..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select
        className={styles.dropdown}
        value={filterBy}
        onChange={e => setFilterBy(e.target.value)}
      >
        <option value="title">Filter by Title</option>
        <option value="tag">Filter by Tag</option>
      </select>
      <select
        className={styles.dropdown}
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
      >
        <option value="newest">Sort by Newest</option>
        <option value="oldest">Sort by Oldest</option>
      </select>
      <Button
        type="button"
        text="Apply"
        className={styles.applyBtn}
        onClick={handleApply}
      />
    </div>
  );
};

export default FilterSearch;
