
const API_URL = 'http://127.0.0.1:1880/api/indicadores'

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes)

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}`)
  }

  if (resposta.status === 204) return null

  const texto = await resposta.text()
  return texto ? JSON.parse(texto) : null
}

export const indicadorService = {
  listar: () => requisicao(API_URL),
  consultar: (id) => requisicao(`${API_URL}/${id}`),
  cadastrar: (dados) => requisicao(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  }),
  atualizar: (id, dados) => requisicao(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  }),
  excluir: (id) => requisicao(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
}
