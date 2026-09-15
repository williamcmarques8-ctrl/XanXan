import {useState} from "react"
import {fileTypeFromBlob} from "file-type";

export default function XanXan(){

    const [texto, setTexto] = useState("")
    const [arquivo, setArquivo] = useState(null)
    const [textocorrigido, setTextocorrigido] = useState("")
    const [loading, setLoading] = useState("")
    const [formatoarquivo, setFormatoarquivo] = useState("")

    const API_KEY = import.meta.env.VITE_GROQ_API_KEY

    function aocolocararquivo(evento){
        setArquivo(evento.target.files[0])
        indentificarformatoarquivo(evento.target.files[0])
    }


    function aodigitar(evento){
        setTexto(evento.target.value)
    }
        
    function aoclickar(){
        setLoading(true)
        identificarFormato(texto)
    }
    
    function baixararquivo(){
        const url = URL.createObjectURL(arquivo)
        const link = document.createElement("a")
        link.href = url
        link.download = `arquivo-covertido.${formatoarquivo}`
        link.click()
        URL.revokeObjectURL(url)
    }
    async function indentificarformatoarquivo(arquivo){
        const retornoFileType = await fileTypeFromBlob(arquivo)
        setFormatoarquivo(retornoFileType.ext)
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
        setLoading(false)
        return textoResposta.trim()
        
    }





    
    
return(
<div>
    {!arquivo && !textocorrigido && !loading &&
        <input type="file" onChange={aocolocararquivo}/>
    }

    {arquivo && !textocorrigido && !loading &&
        <div>
            <h2>Para qual arquivo deseja tranformar?</h2> 
            <input type="text" onChange={aodigitar}/>
            <button onClick={aoclickar}>Enviar</button>
        </div>  
    }

    {loading && 
        <h2>gerando arquivo...</h2>
    }

    {textocorrigido && 
        <div>
            <h2>Aqui esta, o seu arquivo foi de {formatoarquivo} para {textocorrigido}</h2>
            <button onClick={baixararquivo}>baixar arquivo</button>
        </div>
    }
</div>

)
}