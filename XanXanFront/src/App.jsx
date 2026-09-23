import {useState} from "react"
import {fileTypeFromBlob} from "file-type";

export default function XanXan(){

    const API_KEY = import.meta.env.VITE_GROQ_API_KEY

    //guarda para qual formato de arquivo deseja tranformar
    const [texto, setTexto] = useState("")

    //guarda para qual formato de arquivo deseja tranformar, depois da API
    const [textocorrigido, setTextocorrigido] = useState("")

    //guarda o file
    const [arquivo, setArquivo] = useState(null)

    //guarda o formato do file
    const [formatoarquivo, setFormatoarquivo] = useState("")

    //Guarda o nome do arquivo file
    const [antigonome, setAntigonome] = useState("")

    //Guarda o nome do arquivo file corrigido
    const [nome, setNome] = useState("")
    
    //true enquanto a api estiver carregando
    const [loading, setLoading] = useState(false)



    // Funções ao coloca o arquivo
    function aocolocararquivo(evento){
        setArquivo(evento.target.files[0])
        indentificarformatoarquivo(evento.target.files[0])
        setAntigonome(evento.target.files[0].name)  
    }

    async function indentificarformatoarquivo(arquivo){
        const retornoFileType = await fileTypeFromBlob(arquivo)
        if (retornoFileType === undefined) {
            setFormatoarquivo("invalido")
            limpararquivo()
        }else{
            setFormatoarquivo(retornoFileType.ext)
    
        }
    }

    function limpararquivo() {
        setArquivo(null)
    }



    // função ao digitar
    function aodigitar(evento){
        setTexto(evento.target.value)
    }

    

    // funçoes apos clickar no botão que fala o nomo de arquivo
    async function aoclickar(){
        setLoading(true)
        await identificarFormato(texto)
        await converteArquivo(arquivo)
        nomearquivo(antigonome)
        setTextocorrigido("")
        setLoading(false)
    }
    
    async function identificarFormato(texto) {
        const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", 
            {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                    
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    
                    model: "openai/gpt-oss-120b",
                    messages: [
                        {
                            role: "user",
                            content: `O usuário digitou o seguinte texto tentando indicar um formato de arquivo: "${texto}".
                            Responda APENAS com a extensão do formato de arquivo, em minúsculas, sem aspas, sem pontuação, sem explicação nenhuma antes ou depois.  
                            Exemplos de resposta correta: pdf
                            jpg
                            docx
                            Se possivel indentificar erro de digitação, corrigir, exemplo: pdff, world
                            Se não for possível identificar um formato de arquivo válido, responda apenas: invalido`
                        }
                    ],
                    temperature: 0.1 
                })
            })
        const dados = await resposta.json()
        const textoResposta = dados.choices[0].message.content
        setTextocorrigido(textoResposta.trim())
    }

    async function converteArquivo(arquivo){
        const dadosParaEnviar = new FormData()
        dadosParaEnviar.append("file",arquivo)
        const arquivoConvertido = await fetch("http://localhost:8080/upload",
            {
                method: "POST",
                body: dadosParaEnviar
            }
            
        )
    }

    function nomearquivo(nome) {
        var nomesplit = nome.split(".")
        nomesplit.pop()
        var nomejoin = nomesplit.join(" ")
        setNome(nomejoin)
    }   


    // outras funções
    function baixararquivo(){
        const url = URL.createObjectURL(arquivo)
        const link = document.createElement("a")
        link.href = url
        link.download = `${nome}.${textocorrigido}`
        link.click()
        URL.revokeObjectURL(url)
    }


return(
    
<div>

    {formatoarquivo === "invalido" && 
    <div>
        <h2>Formato do arquivo invalido</h2>
    </div>
    }

    {!arquivo && !textocorrigido && !loading &&
    <div>
        <input type="file" onChange={aocolocararquivo}/>
    </div>
    }

    {textocorrigido === "invalido" &&
        <div>
            <h2>Não existe o formato de arquivo que você enseriu</h2>
        </div>
    }
    
    {((formatoarquivo != "invalido" && arquivo && !textocorrigido  && !loading) || (textocorrigido === "invalido")) && (
        <div>
            <h2>Para qual arquivo deseja tranformar?</h2> 
            <input type="text" onChange={aodigitar}/>
            <button onClick={aoclickar}>Enviar</button>
        </div>  
    )
    }
    
    {loading && 
    <div>
        <h2>gerando arquivo...</h2>
    </div>
        
    }

    {textocorrigido && textocorrigido != "invalido" && 
        <div>
            <h2>Aqui esta, o seu arquivo foi de {formatoarquivo} para {textocorrigido}</h2>
            <button onClick={baixararquivo}>baixar arquivo</button>
        </div>
    }

</div>

)
}