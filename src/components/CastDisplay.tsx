import React from 'react'
import { Actor } from '../types'
import { getImageUrl } from '../services/tmdb'

interface CastDisplayProps {
  actors: Actor[]
  bounce?: boolean
}

// Render a vertical list of revealed actor cards (1..N)
export const CastDisplay: React.FC<CastDisplayProps> = ({ actors, bounce }) => {
  return (
    <div className="cast-display-container">
      <div className="cast-display">
        {actors.length === 0 ? (
          <div className="cast-placeholder">
            <span>LOADING...</span>
          </div>
        ) : (
          <div className={`cast-grid ${bounce ? 'bounce' : ''}`}>
            {actors.map((actor) => (
              <div className="cast-card" key={actor.name + actor.billing}>
                <div className="cast-thumb">
                  <img
                    src={getImageUrl(actor.profile_path, 'w185')}
                    alt={actor.name}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      // Prevent infinite loop: remove handler before setting fallback
                      img.onerror = null
                      img.src = 'https://via.placeholder.com/185x278?text=No+Image'
                    }}
                  />
                </div>
                <div className="cast-name">{actor.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
