import { useState } from 'react'

function Equipamento() {
  const [id, setId] = useState('')
  const [nome, setNome] = useState('')
  const [unidade, setUnidade] = useState('')
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')

  function salvar(event) {
    event.preventDefault()

    const novosErros = {}

    if (id.trim() === '') {
      novosErros.id = 'Informe o ID'
    }

    if (nome.trim() === '') {
      novosErros.nome = 'Informe o nome do equipamento'
    }

    if (unidade === '') {
      novosErros.unidade = 'Selecione a unidade'
    }

    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) {
      setMensagem('')
      return
    }

    setMensagem('Equipamento cadastrado com sucesso!')
  }

  return (
    <section className="p-4">
      <h2 className="mb-4">Cadastro de Equipamento</h2>

      {mensagem && (
        <div className="alert alert-success">
          {mensagem}
        </div>
      )}

      <form onSubmit={salvar}>

        <div className="mb-3">
          <label className="form-label">ID</label>

          <input
            type="number"
            className={`form-control ${erros.id ? 'is-invalid' : ''}`}
            value={id}
            onChange={(event) => setId(event.target.value)}
          />

          {erros.id && (
            <div className="invalid-feedback">
              {erros.id}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Nome</label>

          <input
            type="text"
            className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />

          {erros.nome && (
            <div className="invalid-feedback">
              {erros.nome}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Unidade</label>

          <select
            className={`form-select ${
              erros.unidade ? 'is-invalid' : ''
            }`}
            value={unidade}
            onChange={(event) => setUnidade(event.target.value)}
          >
            <option value="">Selecione</option>
            <option value="1">Unidade 1</option>
            <option value="2">Unidade 2</option>
            <option value="3">Unidade 3</option>
          </select>

          {erros.unidade && (
            <div className="invalid-feedback">
              {erros.unidade}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>

      </form>
    </section>
  )
}

export default Equipamento