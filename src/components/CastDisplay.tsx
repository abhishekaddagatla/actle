import React from 'react'
import { Actor } from '../types'
import { getImageUrl } from '../services/tmdb'

interface CastDisplayProps {
  actor: Actor | null
}

export const CastDisplay: React.FC<CastDisplayProps> = ({ actor }) => {
  return (
    <div className="cast-display-container">
      <div className="cast-display-label">[INPUT_FEED // CAST_IMAGE]</div>
      <div className="cast-display">
        {actor ? (
          <div className="cast-placeholder">
            <img
              src={getImageUrl(actor.profile_path, 'w300')}
              alt={actor.name}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/300x450?text=No+Image'
              }}
            />
          </div>
        ) : (
          <div className="cast-placeholder">
            <span>LOADING...</span>
          </div>
        )}
      </div>
      {actor && (
        <div className="cast-info">
          <div className="cast-detail">
            Character: <span>{actor.character || '—'}</span>
          </div>
          <div className="cast-detail">
            Actor: <span>{actor.name || '—'}</span>
          </div>
          <div className="cast-detail">
            Billing: <span>#{actor.billing}</span>
          </div>
        </div>
      )}
    </div>
  )
}
