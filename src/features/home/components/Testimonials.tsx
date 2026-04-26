'use client'
export default function Testimonials(){
  const data = [
    {name:'Anna', text:'We made a wedding album in an afternoon — the result is gorgeous.'},
    {name:'Mark', text:'The prints and paper quality feel so premium.'},
    {name:'Lea', text:'Great editor and elegant themes.'}
  ]
  return (
    <div className="testimonials">
      {data.map((t,i)=> (
        <blockquote key={i} className="testimonial">
          <p>“{t.text}”</p>
          <cite>— {t.name}</cite>
        </blockquote>
      ))}
    </div>
  )
}
