export default function TrainingLayout({ children }) {
  return (
    <>
      <nav aria-label="Training navigation" style={{position:'sticky',top:0,zIndex:1000,display:'flex',gap:12,alignItems:'center',padding:'12px 20px',background:'#0e2333',borderBottom:'1px solid #426275'}}>
        <a href="/game?chooseTrade=1" style={{display:'inline-block',background:'#5de1aa',color:'#092c2d',padding:'10px 17px',borderRadius:9,fontWeight:800,textDecoration:'none'}}>⌂ Home / Choose trade</a>
        <span style={{color:'#e3f5ff',fontSize:14}}>Original FM Journey Training</span>
      </nav>
      {children}
    </>
  );
}
