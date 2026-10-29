import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import { CADASTROS } from '../config/cadastros'

const nomeItem = item => item?.NomeSafra ?? item?.Nome ?? `#${item?.Id ?? ''}`

function valorInput(valor, tipo) {
  if (valor == null) return ''
  if (tipo === 'date') return String(valor).slice(0, 10)
  if (tipo === 'datetime-local') return String(valor).replace(' ', 'T').slice(0, 16)
  return String(valor)
}

function valorCelula(valor, tipo) {
  if (valor == null || valor === '') return '—'
  if (tipo === 'date') return String(valor).slice(0, 10)
  if (tipo === 'datetime-local') return String(valor).replace('T', ' ').slice(0, 16)
  return String(valor)
}

export default function CadastroApi({ recurso }) {
  const cfg = CADASTROS[recurso]
  const [lista, setLista] = useState([])
  const [opcoes, setOpcoes] = useState({})
  const [form, setForm] = useState({})
  const [idEdicao, setIdEdicao] = useState(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const carregar = useCallback(async () => {
    if (!cfg) return
    setCarregando(true)
    setErro('')

    try {
      const origens = [...new Set(cfg.campos.filter(campo => campo.origem).map(campo => campo.origem))]
      const [dados, ...listasRelacionadas] = await Promise.all([
        api(recurso),
        ...origens.map(origem => api(origem))
      ])

      if (!Array.isArray(dados)) {
        throw new Error('A API deve retornar uma lista JSON para a listagem.')
      }

      const relacionadas = Object.fromEntries(origens.map((origem, indice) => {
        const itens = listasRelacionadas[indice]
        if (!Array.isArray(itens)) {
          throw new Error(`A API de ${CADASTROS[origem]?.titulo ?? origem} deve retornar uma lista JSON.`)
        }
        return [origem, itens]
      }))

      setLista(dados)
      setOpcoes(relacionadas)
    } catch (e) {
      setErro(e.message || 'Falha ao carregar os dados.')
    } finally {
      setCarregando(false)
    }
  }, [cfg, recurso])

  useEffect(() => {
    Promise.resolve().then(carregar)
  }, [carregar])

  if (!cfg) return <p className="p-4">Cadastro desconhecido.</p>

  function alterar(campo, valor) {
    setForm(anterior => ({ ...anterior, [campo]: valor }))
    setErro('')
    setMensagem('')
  }

  function editar(item) {
    setIdEdicao(item.Id)
    setForm(Object.fromEntries(cfg.campos.map(campo => [
      campo.nome,
      valorInput(item[campo.nome], campo.tipo)
    ])))
    setErro('')
    setMensagem('')
  }

  function cancelarEdicao() {
    setIdEdicao(null)
    setForm({})
    setErro('')
    setMensagem('')
  }

  async function salvar(event) {
    event.preventDefault()
    setErro('')
    setMensagem('')

    if (recurso === 'safras' && form.DataFim < form.DataInicio) {
      setErro('A data de fim não pode ser anterior à data de início.')
      return
    }

    const dados = {}
    for (const campo of cfg.campos) {
      const valor = form[campo.nome] ?? ''
      if (campo.tipo === 'number') {
        const numero = Number(valor)
        if (!Number.isFinite(numero)) {
          setErro(`${campo.rotulo} deve ser um número válido.`)
          return
        }
        dados[campo.nome] = numero
      } else if (campo.tipo === 'select') {
        const id = Number(valor)
        if (!Number.isInteger(id) || id <= 0) {
          setErro(`Selecione ${campo.rotulo.toLowerCase()}.`)
          return
        }
        dados[campo.nome] = id
      } else if (campo.tipo === 'datetime-local') {
        // O Node-RED armazena Data sem fuso horário, como YYYY-MM-DDTHH:mm:ss.
        dados[campo.nome] = `${valor}:00`
      } else {
        dados[campo.nome] = valor.trim()
      }
    }

    setSalvando(true)
    try {
      if (idEdicao == null) {
        await api(recurso, 'POST', dados)
        setMensagem('Registro cadastrado com sucesso.')
      } else {
        await api(recurso, 'PUT', { Id: idEdicao, ...dados }, idEdicao)
        setMensagem('Registro atualizado com sucesso.')
      }
      setIdEdicao(null)
      setForm({})
      await carregar()
    } catch (e) {
      setErro(e.message || 'Falha ao salvar os dados.')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(id) {
    if (!window.confirm(`Confirma a exclusão deste registro de ${cfg.titulo.toLowerCase()}?`)) return

    setErro('')
    setMensagem('')
    try {
      await api(recurso, 'DELETE', null, id)
      if (idEdicao === id) cancelarEdicao()
      setMensagem('Registro excluído com sucesso.')
      await carregar()
    } catch (e) {
      setErro(e.message || 'Falha ao excluir o registro.')
    }
  }

  function exibirCampo(campo, valor) {
    if (!campo.origem) return valorCelula(valor, campo.tipo)
    const item = (opcoes[campo.origem] ?? []).find(opcao => String(opcao.Id) === String(valor))
    return item ? nomeItem(item) : (valor == null ? '—' : `#${valor}`)
  }

  return (
    <section className="p-4">
      <h2 className="mb-4">Cadastro de {cfg.titulo}</h2>

      {mensagem && <div className="alert alert-success" role="status">{mensagem}</div>}
      {erro && <div className="alert alert-danger" role="alert">{erro}</div>}

      <form className="card card-body mb-4" onSubmit={salvar}>
        {cfg.campos.map(campo => (
          <div key={campo.nome} className="mb-3">
            <label className="form-label" htmlFor={`${recurso}-${campo.nome}`}>{campo.rotulo}</label>
            {campo.tipo === 'select' ? (
              <select
                id={`${recurso}-${campo.nome}`}
                className="form-select"
                required={campo.obrigatorio}
                value={form[campo.nome] ?? ''}
                onChange={event => alterar(campo.nome, event.target.value)}
              >
                <option value="">Selecione...</option>
                {(opcoes[campo.origem] ?? []).map(item => (
                  <option key={item.Id} value={item.Id}>{nomeItem(item)}</option>
                ))}
              </select>
            ) : (
              <input
                id={`${recurso}-${campo.nome}`}
                className="form-control"
                type={campo.tipo}
                required={campo.obrigatorio}
                maxLength={campo.maxLength}
                step={campo.tipo === 'number' ? 'any' : undefined}
                value={form[campo.nome] ?? ''}
                onChange={event => alterar(campo.nome, event.target.value)}
              />
            )}
          </div>
        ))}

        <div>
          <button className="btn btn-primary me-2" type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : idEdicao == null ? 'Cadastrar' : 'Salvar alterações'}
          </button>
          {idEdicao != null && (
            <button className="btn btn-secondary" type="button" onClick={cancelarEdicao}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="h5 mb-3">{cfg.titulo} cadastrados</h3>
      {carregando && <p>Carregando...</p>}
      {!carregando && !erro && lista.length === 0 && <p>Nenhum registro cadastrado.</p>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>ID</th>
              {cfg.campos.map(campo => <th key={campo.nome}>{campo.rotulo}</th>)}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(item => (
              <tr key={item.Id}>
                <td>{item.Id}</td>
                {cfg.campos.map(campo => (
                  <td key={campo.nome}>{exibirCampo(campo, item[campo.nome])}</td>
                ))}
                <td className="text-nowrap">
                  <button className="btn btn-warning btn-sm me-2 mb-1" type="button" onClick={() => editar(item)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm mb-1" type="button" onClick={() => excluir(item.Id)}>
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
