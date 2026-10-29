import { useState } from 'react'

function UnidadeMedida() {
  const [id, setId] = useState('')
  const [nome, setNome] = useState('')
  const [simbolo, setSimbolo] = useState('')
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')

  function salvar(event) {
    event.preventDefault()

    const novosErros = {}

    if (id.trim() === '') {
      novosErros.id = 'Informe o ID'
    }

    if (nome.trim() === '') {
      novosErros.nome = 'Informe o nome'
    }

    if (simbolo.trim() === '') {
      novosErros.simbolo = 'Informe o símbolo'
    }

    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) {
      setMensagem('')
      return
    }

    setMensagem('Unidade de medida cadastrada com sucesso!')
  }

  return (
    <section className="p-4">
      <h2 className="mb-4">Cadastro de Unidade de Medida</h2>

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
          <label className="form-label">Símbolo</label>

          <input
            type="text"
            className={`form-control ${
              erros.simbolo ? 'is-invalid' : ''
            }`}
            value={simbolo}
            onChange={(event) => setSimbolo(event.target.value)}
          />

          {erros.simbolo && (
            <div className="invalid-feedback">
              {erros.simbolo}
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

export default UnidadeMedida