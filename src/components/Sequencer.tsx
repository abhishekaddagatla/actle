import React from 'react'

interface SequencerProps {
  revealedCount: number
}

export const Sequencer: React.FC<SequencerProps> = ({ revealedCount }) => {
  const slots = Array.from({ length: 10 }, (_, i) => i)

  return (
    <div className="sequencer-container">
      <div className="sequencer-label">[PROGRESS // CAST_SLOTS]</div>
      <div className="sequencer-bar">
        {slots.map((index) => (
          <div
            key={index}
            className={`slot ${index < revealedCount ? 'active' : ''} ${
              revealedCount === 10 && index < revealedCount ? 'correct' : ''
            }`}
          >
            <div className="slot-label">{String(index + 1).padStart(2, '0')}</div>
            <div className="slot-block">
              {index < revealedCount ? (revealedCount === 10 ? '🟩' : '🟧') : '⚪'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
