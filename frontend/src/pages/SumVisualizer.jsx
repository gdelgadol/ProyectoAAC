import { useState } from "react"
import { motion } from "framer-motion"
import Layout from "../components/Layout"

export default function SumVisualizer() {
  const [u, setU] = useState("")
  const [v, setV] = useState("")
  const [base, setBase] = useState(10)
  const [data, setData] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  const fetchSteps = async () => {
    try {
      const payload = { u: Number(u), v: Number(v), base: Number(base) }
      const res = await fetch("http://localhost:8000/suma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      setData(json)
      setCurrentStep(0)
    } catch (err) {
      alert("Failed to connect to backend")
    }
  }

  const nextStep = () => {
    if (data && currentStep < data.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (data && currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Layout>
      <div className="text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Suma paso a paso en base <span className="text-blue-400">{base}</span>
          </h1>

          {/* Formulario */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <input type="number" value={u} onChange={e => setU(e.target.value)} placeholder="u (decimal)"
              className="bg-gray-800 border border-gray-600 rounded px-4 py-2" />
            <input type="number" value={v} onChange={e => setV(e.target.value)} placeholder="v (decimal)"
              className="bg-gray-800 border border-gray-600 rounded px-4 py-2" />
            <input type="number" value={base} onChange={e => setBase(e.target.value)} placeholder="Base"
              className="bg-gray-800 border border-gray-600 rounded px-4 py-2" />
          </div>

          <div className="text-center mb-6">
            <button onClick={fetchSteps}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold transition-all">
              Calcular
            </button>
          </div>

          {data && (
            <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
              <div className="text-center text-lg font-semibold text-blue-300">Base: {data.base}</div>

              <ArrayDisplay label="carry" array={data.steps.map(s => s.carry_in)} highlight={currentStep} />
              <ArrayDisplay label="u" array={data.u_digits} highlight={currentStep} />
              <ArrayDisplay label="v" array={data.v_digits} highlight={currentStep} />
              <ArrayDisplay label="result" array={data.steps[currentStep].result} highlight={currentStep} />

              <p className="mt-4 text-center text-yellow-400 italic text-lg">
                {data.steps[currentStep].Resumen || data.steps[currentStep].summary}
              </p>

              <div className="flex justify-center space-x-4 mt-6">
                <button onClick={prevStep} disabled={currentStep === 0}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded disabled:opacity-40">← Anterior</button>
                <button onClick={nextStep} disabled={currentStep === data.steps.length - 1}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded disabled:opacity-40">Siguiente →</button>
              </div>

              <div className="mt-6 space-y-2 text-center text-sm text-gray-300">
                <p><strong>u (base {data.base}):</strong> {data.u_string}</p>
                <p><strong>v (base {data.base}):</strong> {data.v_string}</p>
                <p><strong>Resultado (base {data.base}):</strong> {data.result_string}</p>
                <p><strong>Resultado en base 10:</strong> {data.result_decimal}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function ArrayDisplay({ label, array, highlight }) {
  const reversed = array.slice().reverse()
  const reversedIndex = i => array.length - 1 - i

  return (
    <div className="flex items-center space-x-2 justify-center">
      <span className="font-mono text-sm text-gray-400">{label}:</span>
      {reversed.map((val, idx) => (
        <motion.span
          key={idx}
          initial={{ scale: 0.8 }}
          animate={{ scale: highlight === reversedIndex(idx) ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className={`w-10 h-10 flex items-center justify-center rounded text-lg font-mono border transition-all ${
            highlight === reversedIndex(idx)
              ? "bg-green-600 text-white border-green-400"
              : "bg-gray-700 border-gray-600"
          }`}
        >
          {val === null ? "" : val}
        </motion.span>
      ))}
    </div>
  )
}
