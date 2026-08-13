import React from 'react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="help-modal-close" onClick={onClose}>×</button>
        
        <div className="help-modal-title">How to Play</div>
        
        <div className="help-modal-section">
          <h3>The Goal</h3>
          <p>Guess the movie by identifying the cast members! You have 10 attempts to get it right.</p>
        </div>

        <div className="help-modal-section">
          <h3>How It Works</h3>
          <ul>
            <li>Each wrong guess reveals a new cast member from the movie</li>
            <li>Study the actors and try to recognize what movie they're from</li>
            <li>Type the movie title in the input box and submit your guess</li>
            <li>You can accept suggestions by selecting from the autocomplete dropdown</li>
          </ul>
        </div>

        <div className="help-modal-section">
          <h3>Tracking Progress</h3>
          <ul>
            <li><span className="status-box active">🟦</span> Current guess - the next person to be revealed</li>
            <li><span className="status-box wrong">🟥</span> Wrong guess - actors you've already seen</li>
            <li><span className="status-box correct">🟩</span> Correct guess - you won!</li>
            <li><span className="status-box blank">⬜</span> Unused - guesses you haven't made yet</li>
          </ul>
        </div>

        <div className="help-modal-section">
          <h3>Sharing</h3>
          <p>When you finish, copy your result card to share with friends. Your pattern of guesses will be included!</p>
        </div>

        <div className="help-modal-footer">
          Good luck! 🎬
        </div>

        <button className="help-modal-done" onClick={onClose}>GOT IT</button>
      </div>
    </div>
  )
}
