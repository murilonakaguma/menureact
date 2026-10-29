import { useState } from 'react'

function Medicao() {
  const [id, setId] = useState('')
  const [safra, setSafra] = useState('')
  const [equipamento, setEquipamento] = useState('')
  const [tipoInformacao, setTipoInformacao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState('')
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')

  function salvar(event) {
    event.preventDefault()

    const novosErros = {}

    if (id.trim() === '') {
      novosErros.id = 'Informe o ID'
    }

    if (safra === '') {
      novosErros.safra = 'Selecione a safra'
    }

    if (equipamento === '') {
      novosErros.equipamento = 'Selecione o equipamento'
    }

    if (tipoInformacao === '') {
      novosErros.tipoInformacao = 'Selecione o tipo de informação'
    }

    if (valor.trim() === '') {
      novosErros.valor = 'Informe o valor'
    }

    if (data === '') {
      novosErros.data = 'Informe a data'
    }

    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) {
      setMensagem('')
      return
    }

    setMensagem('Medição cadastrada com sucesso!')
  }

  return (
    <section className="p-4">
      <h2 className="mb-4">Cadastro de Medição</h2>

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
          <label className="form-label">Safra</label>

          <select
            className={`form-select ${
              erros.safra ? 'is-invalid' : ''
            }`}
            value={safra}
            onChange={(event) => setSafra(event.target.value)}
          >
            <option value="">Selecione</option>
            <option value="1">Safra 1</option>
            <option value="2">Safra 2</option>
            <option value="3">Safra 3</option>
          </select>

          {erros.safra && (
            <div className="invalid-feedback">
              {erros.safra}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Equipamento</label>

          <select
            className={`form-select ${
              erros.equipamento ? 'is-invalid' : ''
            }`}
            value={equipamento}
            onChange={(event) => setEquipamento(event.target.value)}
          >
            <option value="">Selecione</option>
            <option value="1">Equipamento 1</option>
            <option value="2">Equipamento 2</option>
            <option value="3">Equipamento 3</option>
          </select>

          {erros.equipamento && (
            <div className="invalid-feedback">
              {erros.equipamento}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">
            Tipo de Informação
          </label>

          <select
            className={`form-select ${
              erros.tipoInformacao ? 'is-invalid' : ''
            }`}
            value={tipoInformacao}
            onChange={(event) => setTipoInformacao(event.target.value)}
          >
            <option value="">Selecione</option>
            <option value="1">Tipo de Informação 1</option>
            <option value="2">Tipo de Informação 2</option>
            <option value="3">Tipo de Informação 3</option>
          </select>

          {erros.tipoInformacao && (
            <div className="invalid-feedback">
              {erros.tipoInformacao}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Valor</label>

          <input
            type="number"
            step="0.01"
            className={`form-control ${
              erros.valor ? 'is-invalid' : ''
            }`}
            value={valor}
            onChange={(event) => setValor(event.target.value)}
          />

          {erros.valor && (
            <div className="invalid-feedback">
              {erros.valor}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Data</label>

          <input
            type="datetime-local"
            className={`form-control ${
              erros.data ? 'is-invalid' : ''
            }`}
            value={data}
            onChange={(event) => setData(event.target.value)}
          />

          {erros.data && (
            <div className="invalid-feedback">
              {erros.data}
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

export default Medicao