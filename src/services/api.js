const BASE = 'http://127.0.0.1:1880'

// Rotas conferidas nos nós HTTP do fluxo local do Node-RED.
export const ROTAS = {
  safras: '/api/safras',
  unidades: '/api/unidades',
  unidadesMedida: '/api/unidades-medida',
  equipamentos: '/api/equipamentos',
  tiposInformacao: '/api/tipos-informacao',
  medicoes: '/api/medicoes'
}

export async function api(recurso, metodo = 'GET', dados = null, id = null) {
  const rota = ROTAS[recurso]

  if (!rota) {
    throw new Error(`Recurso ou rota não configurado: ${recurso}`)
  }

  const url = `${BASE}${rota}${id == null ? '' : `/${encodeURIComponent(id)}`}`
  let resposta

  try {
    resposta = await fetch(url, {
      method: metodo,
      headers: dados == null ? undefined : { 'Content-Type': 'application/json' },
      body: dados == null ? undefined : JSON.stringify(dados)
    })
  } catch (erro) {
    throw new Error(`Não foi possível conectar à API (${metodo} ${url}): ${erro.message}`)
  }

  const texto = resposta.status === 204 ? '' : await resposta.text()
  let corpo = null

  if (texto) {
    try {
      corpo = JSON.parse(texto)
    } catch {
      if (resposta.ok) {
        throw new Error(`A API retornou uma resposta que não é JSON (${metodo} ${url}).`)
      }
      corpo = texto
    }
  }

  if (!resposta.ok) {
    const detalhe = typeof corpo === 'string'
      ? corpo
      : corpo?.erro || corpo?.message || `HTTP ${resposta.status}`
    throw new Error(`${detalhe} (${metodo} ${url})`)
  }

  return corpo
}
