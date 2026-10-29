import { useEffect, useRef, useState } from 'react'

function Funcionarios() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [setor, setSetor] = useState('')

  const [foto, setFoto] = useState(null)
  const [previewFoto, setPreviewFoto] = useState('')
  const [cameraAberta, setCameraAberta] = useState(false)
  const [erroCamera, setErroCamera] = useState('')

  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  function pararCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraAberta(false)
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0]

    if (!arquivo) {
      return
    }

    if (!arquivo.type.startsWith('image/')) {
      setErroCamera('Selecione um arquivo de imagem válido.')
      return
    }

    pararCamera()

    setFoto(arquivo)
    setPreviewFoto(URL.createObjectURL(arquivo))
    setErroCamera('')
    setMensagem('')

    setErros((errosAtuais) => ({
      ...errosAtuais,
      foto: ''
    }))
  }

  async function abrirCamera() {
    try {
      setErroCamera('')
      setMensagem('')
      pararCamera()

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Câmera não suportada')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        },
        audio: false
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setCameraAberta(true)
    } catch (erro) {
      console.error('Erro ao acessar a câmera:', erro)

      setCameraAberta(false)
      setErroCamera(
        'Não foi possível acessar a câmera. Verifique a permissão do navegador ou selecione uma imagem do computador.'
      )
    }
  }

  function capturarFoto() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!cameraAberta || !video || video.videoWidth === 0) {
      setErroCamera('Abra a câmera e aguarde a imagem aparecer antes de capturar.')
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const contexto = canvas.getContext('2d')

    contexto.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const imagemCapturada = canvas.toDataURL(
      'image/jpeg',
      0.9
    )

    setFoto(null)
    setPreviewFoto(imagemCapturada)
    setErroCamera('')
    setMensagem('')

    setErros((errosAtuais) => ({
      ...errosAtuais,
      foto: ''
    }))

    pararCamera()
  }

  function removerFoto() {
    if (previewFoto.startsWith('blob:')) {
      URL.revokeObjectURL(previewFoto)
    }

    setFoto(null)
    setPreviewFoto('')
    setMensagem('')
  }

  function limparFormulario() {
    setNome('')
    setEmail('')
    setTelefone('')
    setSetor('')
    setFoto(null)
    setPreviewFoto('')
    setErros({})
    pararCamera()
  }

  function salvar(event) {
    event.preventDefault()

    const novosErros = {}

    if (nome.trim() === '') {
      novosErros.nome = 'Informe o nome'
    }

    if (email.trim() === '') {
      novosErros.email = 'Informe o e-mail'
    }

    if (telefone.trim() === '') {
      novosErros.telefone = 'Informe o telefone'
    }

    if (setor === '') {
      novosErros.setor = 'Selecione o setor'
    }

    if (!previewFoto) {
      novosErros.foto = 'Selecione ou capture uma foto'
    }

    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) {
      setMensagem('')
      return
    }

    const funcionario = {
      nome,
      email,
      telefone,
      setor,
      fotoSelecionada: foto,
      imagem: previewFoto
    }

    console.log('Funcionário cadastrado:', funcionario)

    setMensagem('Funcionário cadastrado com sucesso!')
    limparFormulario()
  }

  return (
    <section className="p-4">
      <h2 className="mb-4">Cadastro de Funcionário</h2>

      {mensagem && (
        <div className="alert alert-success">
          {mensagem}
        </div>
      )}

      {erroCamera && (
        <div className="alert alert-warning">
          {erroCamera}
        </div>
      )}

      <form onSubmit={salvar}>
        <div className="row">
          <div className="col-md-7">
            <div className="mb-3">
              <label
                htmlFor="nome"
                className="form-label"
              >
                Nome
              </label>

              <input
                id="nome"
                type="text"
                className={`form-control ${
                  erros.nome ? 'is-invalid' : ''
                }`}
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value)
                }}
              />

              {erros.nome && (
                <div className="invalid-feedback">
                  {erros.nome}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                className={`form-control ${
                  erros.email ? 'is-invalid' : ''
                }`}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                }}
              />

              {erros.email && (
                <div className="invalid-feedback">
                  {erros.email}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="telefone"
                className="form-label"
              >
                Telefone
              </label>

              <input
                id="telefone"
                type="tel"
                className={`form-control ${
                  erros.telefone ? 'is-invalid' : ''
                }`}
                value={telefone}
                onChange={(event) => {
                  setTelefone(event.target.value)
                }}
              />

              {erros.telefone && (
                <div className="invalid-feedback">
                  {erros.telefone}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="setor"
                className="form-label"
              >
                Setor
              </label>

              <select
                id="setor"
                className={`form-select ${
                  erros.setor ? 'is-invalid' : ''
                }`}
                value={setor}
                onChange={(event) => {
                  setSetor(event.target.value)
                }}
              >
                <option value="">Selecione</option>
                <option value="Administrativo">
                  Administrativo
                </option>
                <option value="Produção">
                  Produção
                </option>
                <option value="Manutenção">
                  Manutenção
                </option>
                <option value="TI">
                  TI
                </option>
              </select>

              {erros.setor && (
                <div className="invalid-feedback">
                  {erros.setor}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-5">
            <div className="mb-3">
              <label
                htmlFor="foto"
                className="form-label"
              >
                Foto do funcionário
              </label>

              <input
                id="foto"
                type="file"
                accept="image/*"
                className={`form-control ${
                  erros.foto ? 'is-invalid' : ''
                }`}
                onChange={selecionarFoto}
              />

              {erros.foto && (
                <div className="invalid-feedback">
                  {erros.foto}
                </div>
              )}
            </div>

            {previewFoto && (
              <div className="mb-3">
                <img
                  src={previewFoto}
                  alt="Pré-visualização do funcionário"
                  className="img-thumbnail d-block mb-2"
                  style={{
                    width: '220px',
                    height: '220px',
                    objectFit: 'cover'
                  }}
                />

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={removerFoto}
                >
                  Remover foto
                </button>
              </div>
            )}

            <div className="mb-3">
              {!cameraAberta ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={abrirCamera}
                >
                  Usar câmera
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-success me-2"
                    onClick={capturarFoto}
                  >
                    Capturar foto
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={pararCamera}
                  >
                    Fechar câmera
                  </button>
                </>
              )}
            </div>

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="img-thumbnail mb-3"
              style={{
                width: '320px',
                maxWidth: '100%',
                display: cameraAberta ? 'block' : 'none'
              }}
            />

            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Cadastrar
        </button>
      </form>
    </section>
  )
}

export default Funcionarios