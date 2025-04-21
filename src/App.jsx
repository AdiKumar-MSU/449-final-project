import './index.css'

function App() {
  return (
    <>
      <div className="page">
        <header className="header">
          <h1 className = "title">CYTC</h1>
          <h2 className = "yellow">Custom Youtube Cinema</h2>
        </header>
        <div className="body">
          <h3 className="KeyWords">Enter Key Search Words:</h3>
          <h3 className="DateRange">Enter Date Range Here:</h3>
          <button className="GenerateButton">Generate Video</button>
        </div>
      </div>
    </>  
  )
}

export default App
