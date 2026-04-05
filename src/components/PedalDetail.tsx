import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import pedals from '../data/pedals.json'
import type { Pedal } from '../types'

export default function PedalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pedal = (pedals as Pedal[]).find(p => p.id === id)
  const [activeDocIndex, setActiveDocIndex] = useState(0)
  const [markdown, setMarkdown] = useState<string | null>(null)

  useEffect(() => {
    if (!pedal?.docs?.length) return
    const file = pedal.docs[activeDocIndex].file
    const url = `${import.meta.env.BASE_URL}${file.replace(/^\//, '')}`
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('not found')
        return res.text()
      })
      .then(text => setMarkdown(text))
      .catch(() => setMarkdown(null))
  }, [pedal, activeDocIndex])

  if (!pedal) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <p>Pedal not found.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>{pedal.name}</h1>
      </div>

      <div className="detail-layout">
        <aside className="doc-sidebar">
          {pedal.docs && pedal.docs.length > 0 ? (
            pedal.docs.map((doc, i) => (
              <button
                key={i}
                className={`sidebar-btn ${i === activeDocIndex ? 'active' : ''}`}
                onClick={() => setActiveDocIndex(i)}
              >
                {doc.title}
              </button>
            ))
          ) : (
            <p className="sidebar-empty">No docs</p>
          )}
        </aside>

        <div className="doc-content">
          {!pedal.docs?.length ? (
            <p className="doc-empty">No documentation yet.</p>
          ) : markdown === null ? (
            <p className="doc-empty">Loading...</p>
          ) : (
            <ReactMarkdown>{markdown}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}