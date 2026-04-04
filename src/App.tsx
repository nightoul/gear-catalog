import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PedalTable from './components/PedalTable'
import PedalDetail from './components/PedalDetail'

function App() {
  return (
    <BrowserRouter basename="/gear-catalog">
      <Routes>
        <Route path="/" element={<PedalTable />} />
        <Route path="/pedal/:id" element={<PedalDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App