
import { useEffect, useState } from 'react'

import Header from './components/Header'
import MenuLateral from './components/MenuLateral'

import Funcionarios from './components/cadastros/Funcionarios'
import Indicadores from './components/cadastros/Indicadores'
import Usuarios from './components/cadastros/Usuarios'
import CadastroApi from './components/CadastroApi'

import VisualizarIndicador from './components/VisualizarIndicador'
import Login from './components/Login'

import { indicadorService } from './services/indicadorService'

import './App.css'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('inicio')

  const [indicadores, setIndicadores] = useState([])
  const [indicadorSelecionado, setIndicadorSelecionado] = useState(null)

  async function atualizarMenu() {
    const dados = await indicadorService.listar()
    setIndicadores(Array.isArray(dados) ? dados : [])
  }

  useEffect(() => {
    atualizarMenu().catch((erro) => {
      console.error('Erro ao carregar indicadores:', erro)
    })
  }, [])

  function selecionarIndicador(item) {
    setIndicadorSelecionado(item)
    setPaginaAtual('visualizarIndicador')
  }

  function mostrarPagina() {
    switch (paginaAtual) {
      case 'equipamento':
        return <CadastroApi key="equipamentos" recurso="equipamentos" />

      case 'funcionarios':
        return <Funcionarios />

      case 'indicadores':
        return <Indicadores atualizarMenu={atualizarMenu} />

      case 'visualizarIndicador':
        return (
          <VisualizarIndicador
            indicador={indicadorSelecionado}
          />
        )

      case 'medicao':
        return <CadastroApi key="medicoes" recurso="medicoes" />

      case 'safra':
        return <CadastroApi key="safras" recurso="safras" />

      case 'tipoInformacao':
        return <CadastroApi key="tiposInformacao" recurso="tiposInformacao" />

      case 'unidade':
        return <CadastroApi key="unidades" recurso="unidades" />

      case 'unidadeMedida':
        return <CadastroApi key="unidadesMedida" recurso="unidadesMedida" />

      case 'usuarios':
        return <Usuarios />

      case 'login':
        return <Login />

      default:
        return (
          <section className="p-4">
            <div className="bg-white rounded shadow-sm p-4">
              <h2>Bem-vindo ao sistema</h2>

              <p className="text-secondary mb-0">
                Use o menu lateral para acessar as páginas do sistema.
              </p>
            </div>
          </section>
        )
    }
  }

  return (
    <div className="app">
      <Header />

      <div className="d-flex">
        <MenuLateral
          paginaAtual={paginaAtual}
          setPaginaAtual={setPaginaAtual}
          indicadores={indicadores}
          selecionarIndicador={selecionarIndicador}
        />

        <main
          className="flex-grow-1 bg-light"
          style={{
            minHeight: 'calc(100vh - 70px)',
            overflowX: 'hidden'
          }}
        >
          {mostrarPagina()}
        </main>
      </div>
    </div>
  )
}

export default App
