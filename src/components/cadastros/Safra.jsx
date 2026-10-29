import { useState } from 'react'

function Safra() {
  const [id, setId] = useState('')
  const [nomeSafra, setNomeSafra] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')

  function salvar(event) {
    event.preventDefault()

    const novosErros = {}

    if (id.trim() === '') {
      novosErros.id = 'Informe o ID'
    }

    if (nomeSafra.trim() === '') {
      novosErros.nomeSafra = 'Informe o nome da safra'
    }

    if (dataInicio === '') {
      novosErros.dataInicio = 'Informe a data de início'
    }

    if (dataFim === '') {
      novosErros.dataFim = 'Informe a data de fim'
    }

    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) {
      setMensagem('')
      return
    }

    setMensagem('Safra cadastrada com sucesso!')
  }

  return (
    <section className="p-4">
      <h2 className="mb-4">Cadastro de Safra</h2>

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
          <label className="form-label">Nome da Safra</label>

          <input
            type="text"
            className={`form-control ${
              erros.nomeSafra ? 'is-invalid' : ''
            }`}
            value={nomeSafra}
            onChange={(event) => setNomeSafra(event.target.value)}
          />

          {erros.nomeSafra && (
            <div className="invalid-feedback">
              {erros.nomeSafra}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Data de Início</label>

          <input
            type="date"
            className={`form-control ${
              erros.dataInicio ? 'is-invalid' : ''
            }`}
            value={dataInicio}
            onChange={(event) => setDataInicio(event.target.value)}
          />

          {erros.dataInicio && (
            <div className="invalid-feedback">
              {erros.dataInicio}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Data de Fim</label>

          <input
            type="date"
            className={`form-control ${
              erros.dataFim ? 'is-invalid' : ''
            }`}
            value={dataFim}
            onChange={(event) => setDataFim(event.target.value)}
          />

          {erros.dataFim && (
            <div className="invalid-feedback">
              {erros.dataFim}
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

export default Safra