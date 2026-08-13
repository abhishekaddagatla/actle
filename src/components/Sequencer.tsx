import React from 'react'

interface SequencerProps {
  revealedCount: number
  solvedIndex?: number
  revealedBeforeSolve?: number
  isCompleted?: boolean
}

export const Sequencer: React.FC<SequencerProps> = ({ revealedCount, solvedIndex, revealedBeforeSolve, isCompleted }) => {
  const slots = Array.from({ length: 10 }, (_, i) => i)

  return (
    <div className="sequencer-container">
      <div className="sequencer-bar">
        {slots.map((index) => {
          let cls = ''
          let symbol = '⚪'

          if (typeof solvedIndex === 'number') {
            // Game solved: mark the solved slot green, previously revealed as wrong, others blank
            if (index === solvedIndex) {
              cls = 'correct'
              symbol = '🟩'
            } else if (typeof revealedBeforeSolve === 'number' && index < revealedBeforeSolve) {
              cls = 'wrong'
              symbol = '🟥'
            } else {
              cls = ''
              symbol = '⚪'
            }
          } else if (isCompleted && typeof solvedIndex === 'undefined') {
            // Game lost: all revealed slots are wrong, rest are blank
            if (index < revealedCount) {
              cls = 'wrong'
              symbol = '🟥'
            } else {
              cls = ''
              symbol = '⚪'
            }
          } else {
            // Game in progress: mark previous guessed slots as wrong, current active slot as active
            if (index < Math.max(0, revealedCount - 1)) {
              cls = 'wrong'
              symbol = '🟥'
            } else if (index === revealedCount - 1) {
              cls = 'active'
              symbol = '🟦'
            } else {
              cls = ''
              symbol = '⚪'
            }
          }

          return (
            <div key={index} className={`slot ${cls}`}>
              <div className="slot-label">{String(index + 1).padStart(2, '0')}</div>
              <div className="slot-block">{symbol}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
