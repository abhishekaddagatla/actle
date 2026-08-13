import React from 'react'
import { TMDBMovie } from '../types'

interface AutocompleteProps {
  suggestions: TMDBMovie[]
  isOpen: boolean
  onSelect: (movie: TMDBMovie) => void
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  isOpen,
  onSelect,
}) => {
  return (
    <div className={`autocomplete-dropdown ${isOpen ? 'active' : ''}`}>
      {suggestions.map((movie) => (
        <div
          key={movie.id}
          className="autocomplete-item"
          onClick={() => onSelect(movie)}
        >
          {movie.title} ({movie.release_date?.split('-')[0]})
        </div>
      ))}
    </div>
  )
}
