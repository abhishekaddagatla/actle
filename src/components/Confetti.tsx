import React from 'react'

const EMOJIS = ['🎉', '🎊', '✨', '🥳']

export const Confetti: React.FC = () => {
  // create many confetti pieces with random positions
  const pieces = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="confetti">
      {pieces.map((i) => {
        const left = Math.round(Math.random() * 100)
        const delay = Math.round(Math.random() * 800)
        const size = 10 + Math.round(Math.random() * 18)
        const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
        const style: React.CSSProperties = {
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDelay: `${delay}ms`,
        }
        return (
          <span key={i} style={style}>
            {emoji}
          </span>
        )
      })}
    </div>
  )
}

export default Confetti
