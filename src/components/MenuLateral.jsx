
import { useState } from 'react'

function MenuLateral({
  paginaAtual,
  setPaginaAtual,
  indicadores = [],
  selecionarIndicador
}) {
  const [cadastroAberto, setCadastroAberto] = useState(true)
  const [indicadoresAbertos, setIndicadoresAbertos] = useState(true)

  function mudarPagina(pagina) {
    setPaginaAtual(pagina)
  }

  function classeBotao(pagina) {
    if (paginaAtual === pagina) {
      return 'btn btn-primary text-start w-100 mb-1'
    }

    return 'btn btn-outline-light text-start w-100 mb-1'
  }

  return (
    <aside
      className="bg-dark text-white p-3"
      style={{
        width: '270px',
        minWidth: '270px',
        minHeight: 'calc(100vh - 70px)'
      }}
    >
      <button
        type="button"
        className={classeBotao('inicio')}
        onClick={() => mudarPagina('inicio')}
      >
        Início
      </button>

      <button
        type="button"
        className={classeBotao('login')}
        onClick={() => mudarPagina('login')}
      >
        Login
      </button>

      <button
        type="button"
        className="btn btn-outline-light text-start w-100 mt-2 mb-2 d-flex justify-content-between align-items-center"
        onClick={() => setCadastroAberto(!cadastroAberto)}
      >
        <span>Cadastro</span>
        <span>{cadastroAberto ? '▲' : '▼'}</span>
      </button>

      {cadastroAberto && (
        <div className="ps-3">
          <button
            type="button"
            className={classeBotao('usuarios')}
            onClick={() => mudarPagina('usuarios')}
          >
            Usuários
          </button>

          <button
            type="button"
            className={classeBotao('funcionarios')}
            onClick={() => mudarPagina('funcionarios')}
          >
            Funcionários
          </button>

          <button
            type="button"
            className={classeBotao('equipamento')}
            onClick={() => mudarPagina('equipamento')}
          >
            Equipamentos
          </button>

          <button
            type="button"
            className={classeBotao('indicadores')}
            onClick={() => mudarPagina('indicadores')}
          >
            Indicadores
          </button>

          <button
            type="button"
            className={classeBotao('medicao')}
            onClick={() => mudarPagina('medicao')}
          >
            Medições
          </button>

          <button
            type="button"
            className={classeBotao('safra')}
            onClick={() => mudarPagina('safra')}
          >
            Safras
          </button>

          <button
            type="button"
            className={classeBotao('tipoInformacao')}
            onClick={() => mudarPagina('tipoInformacao')}
          >
            Tipos de informação
          </button>

          <button
            type="button"
            className={classeBotao('unidade')}
            onClick={() => mudarPagina('unidade')}
          >
            Unidades
          </button>

          <button
            type="button"
            className={classeBotao('unidadeMedida')}
            onClick={() => mudarPagina('unidadeMedida')}
          >
            Unidades de medida
          </button>
        </div>
      )}

      <hr className="border-secondary" />

      <button
        type="button"
        className="btn btn-outline-light text-start w-100 mb-2 d-flex justify-content-between align-items-center"
        onClick={() => setIndicadoresAbertos(!indicadoresAbertos)}
      >
        <span>Indicadores</span>
        <span>{indicadoresAbertos ? '▲' : '▼'}</span>
      </button>

      {indicadoresAbertos && (
        <div className="ps-3">
          {indicadores.length === 0 ? (
            <p className="text-secondary small">
              Nenhum indicador cadastrado.
            </p>
          ) : (
            indicadores.map(item => (
              <button
                key={item.Id}
                type="button"
                className={classeBotao(`visualizarIndicador-${item.Id}`)}
                onClick={() => {
                  if (selecionarIndicador) {
                    selecionarIndicador(item)
                  }
                }}
              >
                {item.Nome}
              </button>
            ))
          )}
        </div>
      )}
    </aside>
  )
}

export default MenuLateral
