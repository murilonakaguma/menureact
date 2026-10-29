import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] =
    useState('info')

  const [carregandoLocalizacao, setCarregandoLocalizacao] =
    useState(false)

  function registrarAcesso(usuario, localizacao = null) {
    const acesso = {
      nome: usuario.nome,
      email: usuario.email,
      foto: usuario.foto,
      dataHora: new Date().toISOString(),
      latitude: localizacao?.latitude ?? null,
      longitude: localizacao?.longitude ?? null
    }

    sessionStorage.setItem(
      'acessoAtual',
      JSON.stringify(acesso)
    )
  }

  function solicitarLocalizacao(usuario) {
    if (!navigator.geolocation) {
      registrarAcesso(usuario)

      setTipoMensagem('warning')
      setMensagem(
        'Login realizado, mas a geolocalização não é suportada.'
      )

      return
    }

    setCarregandoLocalizacao(true)

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        registrarAcesso(usuario, {
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude
        })

        setCarregandoLocalizacao(false)
        setTipoMensagem('success')
        setMensagem(
          'Login realizado com sucesso! Localização obtida.'
        )
      },

      (erro) => {
        registrarAcesso(usuario)
        setCarregandoLocalizacao(false)
        setTipoMensagem('warning')

        if (erro.code === 1) {
          setMensagem(
            'Login realizado. Permissão de localização recusada.'
          )
        } else if (erro.code === 2) {
          setMensagem(
            'Login realizado. Localização indisponível.'
          )
        } else if (erro.code === 3) {
          setMensagem(
            'Login realizado. O tempo para obter a localização foi excedido.'
          )
        } else {
          setMensagem(
            'Login realizado, mas não foi possível obter a localização.'
          )
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  function entrar(event) {
    event.preventDefault()

    const textoUsuario =
      localStorage.getItem('usuario')

    if (!textoUsuario) {
      setTipoMensagem('danger')
      setMensagem('Nenhum usuário cadastrado.')
      return
    }

    try {
      const usuario = JSON.parse(textoUsuario)

      if (
        usuario.email !== email.trim() ||
        usuario.senha !== senha
      ) {
        setTipoMensagem('danger')
        setMensagem('E-mail ou senha inválidos.')
        return
      }

      setMensagem('')
      solicitarLocalizacao(usuario)
    } catch (erro) {
      setTipoMensagem('danger')
      setMensagem(
        'Os dados cadastrados estão inválidos. Cadastre o usuário novamente.'
      )
    }
  }

  return (
    <section className="p-4">
      <div
        className="card shadow-sm mx-auto"
        style={{ maxWidth: '450px' }}
      >
        <div className="card-body">
          <h2 className="h4 mb-4">
            Login
          </h2>

          {mensagem && (
            <div className={`alert alert-${tipoMensagem}`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={entrar}>
            <div className="mb-3">
              <label className="form-label">
                E-mail
              </label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Senha
              </label>

              <input
                type="password"
                className="form-control"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={carregandoLocalizacao}
            >
              {carregandoLocalizacao
                ? 'Obtendo localização...'
                : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login