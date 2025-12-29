'use client'
export default function Features(){
  const items = [
    {title:'Fast editor', body:'Drag & drop, automatic layouts and simple controls.'},
    {title:'Premium printing', body:'Museum-grade papers and linen covers.'},
    {title:'Smart auto-layout', body:'AI-assisted layouts for stunning spreads.'},
  ]
  return (
    <div className="features">
      {items.map((it,idx)=>(
        <div key={idx} className="feature-card">
          <h3>{it.title}</h3>
          <p>{it.body}</p>
        </div>
      ))}
    </div>
  )
}
