
import { useEffect, useState } from 'react'
import { indicadorService } from '../../services/indicadorService'

const vazio = { Nome: '', Descricao: '', Url: '' }

function Indicadores({ atualizarMenu }) {
  const [itens, setItens] = useState([])
  const [form, setForm] = useState({ ...vazio })
  const [idEdicao, setIdEdicao] = useState(null)
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function carregar() {
    try {
      setCarregando(true)
      const dados = await indicadorService.listar()

      if (!Array.isArray(dados)) {
        throw new Error('A API não retornou uma lista')
      }

      setItens(dados)
      setErro('')
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function alterar(event) {
    const { name, value } = event.target

    setForm(anterior => ({
      ...anterior,
      [name]: value
    }))

    setErros(anterior => ({
      ...anterior,
      [name]: ''
    }))
  }

  async function salvar(event) {
    event.preventDefault()

    const novosErros = {}

    if (!form.Nome.trim()) {
      novosErros.Nome = 'Informe o nome'
    }

    if (!form.Descricao.trim()) {
      novosErros.Descricao = 'Informe a descrição'
    }

    if (!form.Url.trim()) {
      novosErros.Url = 'Informe a URL'
    } else {
      try {
        const urlValidada = new URL(form.Url)

        if (!['http:', 'https:'].includes(urlValidada.protocol)) {
          novosErros.Url = 'A URL deve começar com http:// ou https://'
        }
      } catch {
        novosErros.Url = 'Informe uma URL válida'
      }
    }

    setErros(novosErros)
    setErro('')
    setMensagem('')

    if (Object.keys(novosErros).length > 0) {
      return
    }

    try {
      if (idEdicao === null) {
        await indicadorService.cadastrar(form)
        setMensagem('Indicador cadastrado com sucesso!')
      } else {
        await indicadorService.atualizar(idEdicao, {
          Id: idEdicao,
          ...form
        })

        setMensagem('Indicador atualizado com sucesso!')
      }

      setForm({ ...vazio })
      setIdEdicao(null)
      setErros({})

      await carregar()
      await atualizarMenu()
    } catch (e) {
      setErro(e.message || 'Falha ao salvar')
    }
  }

  function editar(item) {
    setIdEdicao(item.Id)

    setForm({
      Nome: item.Nome,
      Descricao: item.Descricao,
      Url: item.Url
    })

    setErros({})
    setErro('')
    setMensagem('')
  }

  function cancelarEdicao() {
    setIdEdicao(null)
    setForm({ ...vazio })
    setErros({})
    setErro('')
    setMensagem('')
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este indicador?')) {
      return
    }

    try {
      setErro('')
      setMensagem('')

      await indicadorService.excluir(id)

      if (idEdicao === id) {
        cancelarEdicao()
      }

      setMensagem('Indicador excluído com sucesso!')

      await carregar()
      await atualizarMenu()
    } catch (e) {
      setErro(e.message || 'Falha ao excluir')
    }
  }

  return (
    <section className="p-4">
      <h2 className="mb-4">Cadastro de Indicadores</h2>

      {mensagem && (
        <div className="alert alert-success">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="alert alert-danger">
          {erro}
        </div>
      )}

      <form className="card card-body mb-4" onSubmit={salvar}>
        <div className="mb-3">
          <label className="form-label">Nome</label>

          <input
            type="text"
            name="Nome"
            className={`form-control ${erros.Nome ? 'is-invalid' : ''}`}
            value={form.Nome}
            onChange={alterar}
            required
            maxLength={100}
          />

          {erros.Nome && (
            <div className="invalid-feedback">
              {erros.Nome}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>

          <textarea
            name="Descricao"
            className={`form-control ${
              erros.Descricao ? 'is-invalid' : ''
            }`}
            rows="4"
            value={form.Descricao}
            onChange={alterar}
          />

          {erros.Descricao && (
            <div className="invalid-feedback">
              {erros.Descricao}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">URL do indicador</label>

          <input
            type="url"
            name="Url"
            className={`form-control ${erros.Url ? 'is-invalid' : ''}`}
            value={form.Url}
            onChange={alterar}
            placeholder="https://..."
            required
          />

          {erros.Url && (
            <div className="invalid-feedback">
              {erros.Url}
            </div>
          )}
        </div>

        <div>
          <button type="submit" className="btn btn-primary me-2">
            {idEdicao === null
              ? 'Cadastrar'
              : 'Salvar alterações'}
          </button>

          {idEdicao !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelarEdicao}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="mb-3">Indicadores cadastrados</h3>

      {carregando && <p>Carregando...</p>}

      {!carregando && !erro && itens.length === 0 && (
        <p>Nenhum indicador cadastrado.</p>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>URL</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {itens.map(item => (
              <tr key={item.Id}>
                <td>{item.Id}</td>
                <td>{item.Nome}</td>
                <td>{item.Descricao}</td>
                <td className="text-break">{item.Url}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-warning btn-sm me-2 mb-1"
                    onClick={() => editar(item)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm mb-1"
                    onClick={() => excluir(item.Id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Indicadores
