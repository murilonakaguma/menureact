export default function VisualizarIndicador({ indicador }) {
  if (!indicador) return <p>Selecione um indicador.</p>

  const url = indicador.Url
  let segura = false
  try {
    segura = ['http:', 'https:'].includes(new URL(url).protocol)
  } catch { /* URL inválida */ }

  if (!segura) return <p>URL do indicador inválida.</p>

  return (
    <section className="p-4">
      <h2>{indicador.Nome}</h2>
      <p>{indicador.Descricao}</p>
      <iframe title={indicador.Nome} src={url}
        style={{
          width: '100%', height: '75vh',
          border: '1px solid #ddd', borderRadius: 8
        }}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <p className="text-muted small mt-2">
        Se o painel não aparecer, o site pode bloquear iframes.
      </p>
    </section>
  )
}
