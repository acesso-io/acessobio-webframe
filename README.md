# AcessoBio Web Frame

Este projeto visa facilitar a implementação do frame de captura biométrica via JavaScript nativo através de algoritimos de abertura de câmera modernos, visão computacional e abertura de câmeras . Ajudando desta forma no melhor enquadramento para captura e otimizando as imagens antes de serem enviadas ao motor biométrico.

## Começando

Estas instruções farão com que você consiga implementar a abertura câmera e obter/manipular os dados de retorno.
 
Esta biblioteca utiliza os recursos nativos do HTML 5, JavaScript e CSS e funciona em todos os browsers modernos.


## Compatibilidade 

- SO a partir do iOS 11.0 e Android 5.0. 
- Google Chrome a partir da versão 60 e Safari a partir da versão 11. 
- Suporte nativo em navegadores modernos, como o Google Chrome, Firefox, Opera e Edge para Android e Safari para iOS. 
- Browsers com suporte a WebRTC. 

**Nota: O câmera inteligente por usar visão computacional com as tecnologias face-api e tfjs, 
   normalmente celurares com Android 6 ou menor, Iphone 4 ou menor, e alguns celulares que não possuem suporte aos recursos necessários para o funcionamento das mesmas
   tecnologias, portanto nesses casos a câmera normal irá ser acionanado permitindo que o usuário faça a captura manual.***

 ## Características

- **CÂMERA NORMAL:** Exibe um frame com silhueta ajustavel automaticamente com base na proporcão da tela do usuário com captura manual. 
- **CÂMERA INTELIGENTE:** Exibe um frame com silhueta ajustavel automaticamente com base na proporcão da tela do usuário, usando visão computacional na identificação da face, auxílio no enquadramento da face e captura automática.

## Instalando

A instalação e implementação do Mobbio Web em seu projeto é muito simples e em poucos passos o seu frame estará pronto para ser utilizado. Segue abaixo: 

- Adicione o nosso projeto a sua máquina através do Github ou download do mesmo. 
- Remomeie a classe ``index.html`` para um nome que se enquadre ao contexto geral do seu projeto ou mantenha o nome afim de projetos do aspecto poc.

Pronto! O seu projeto já está pronto para o uso de nossa ferramenta.

## CÂMERA NORMAL

Para manipular o objeto com base64 da imagem capturada e log, os métodos de callback como demonstrados abaixo e disponíveis na classe index.html:

```javascript

document.addEventListener("DOMContentLoaded", () => {

    onSuccessCaptureJS = onSuccessCapture;
    onFailedCaptureJS = onFailedCapture;

    function onSuccessCapture(obj) {
        console.log(obj);
    }

    function onFailedCapture(err) {
        console.log(err);
    }

    initCameraNormal('#fff');   
});
  
```

O método ``initCameraInteligence`` receberá um parâmetro como:

  - **COLOR_SILHUETTE_PRIMARY:** Cor em hexadecimal da silhueta.

## CÂMERA INTELIGENTE

Para manipular o objeto com base64 da imagem capturada e log, os métodos de callback como demonstrados abaixo e disponíveis na classe index.html:

```javascript      
document.addEventListener("DOMContentLoaded", () => {

    onSuccessCaptureJS = onSuccessCapture;
    onFailedCaptureJS = onFailedCapture;

    function onSuccessCapture(obj) {
        console.log(obj);
    }

    function onFailedCapture(err) {
        console.log(err);
    }

    initCameraInteligence('#2980ff', '#fff', '#fff'); 
});
  
```

O método ``initCameraInteligence`` receberá três parâmetros como:

  - **COLOR_SILHUETTE_PRIMARY:** Cor em hexadecimal que ao encontrar a face e estiver enquadrada corretamente irá mostrar na silhueta.
  - **COLOR_SILHUETTE_SECONDARY:** Cor em hexadecimal que ao não encontrar a face ou não estiver enquadrada corretamente irá mostrar na silhueta.
  - **COLOR_SILHUETTE_CAMERA_NORMAL:** Cor em hexadecimal da silhueta do CÂMERA NORMAL para os casos de celulares que não possuem recursos para que o CÂMERA INTELIGENTE funcione corretamente como mencionado na sessão de compatibilidade.

O método onSuccessCaptureJS retorna um objeto com as seguintes propredades:

```javascript
{
    base64: string,
    Log: {
        TYPE_PROCESS_INITIAL: int,
        TYPE_PROCESS: int,
        TOTAL_SECONDS: int,
        Device: string,
        Silhuette: {
            width: int,
            height: int
        },
        video: {
            width: int,
            height: int
        },
        radio: float,
        screen: {
            width: int,
            height: int
        }
    }
}
```
 O log será útil na identificação de possíveis problemas de tamanho de silhueta ou qual tipo de captura foi realmente realizada pelo usuário:
 
 - **TYPE_PROCESS_INITIAL:** Tipo de processo de captura invocado inicialmente como CÂMERA NORMAL ou CÂMERA INTELIGENTE. Celulares mais antigos não 
 possuem suporte a IA na qual o CÂMERA INTELIGENTE precisa, caso não possua será aberto o câmera normal com captura manual e neste caso o tipo de processo invocado será diferente do realizado pelo usuário.
 - **TYPE_PROCESS:** Tipo de processo de captura utilizado pelo usuário, como dito acima, alguns celulares não possuem suporte a IA ou caso ocorra algum problema com face-api é utilizado o processo de CÂMERA NORMAL.
 - **TOTAL_SECONDS:** Total de segundos do processo.
 - **Device:** Descrição do dispositivo.
 - **Silhuette:** Tamanho da silhueta criada.
 - **video:** Resuloção do vídeo.
 - **radio:** Aspect radio.
 - **screen:** Tamanho do screen.
 
## Customizações

O arquivo ``pop-ups.css`` possui estilos dos pop-ups de Carregando, Orientação, Compatibilidade, Concluído e Mensagem de enquadramento. Fazem parte do fluxo e podem ser customizados com as devidas especificações abaixo:

   - **Carregando:** Acionado no início do carregamento dos arquivos até que esteja tudo pronto para o usuário realizar a captura. O html interno do ``#box--loading`` pode ser subtituído por html de acordo com sua aplicação.
   - **Orientação:** Acionado nos casos que o usuário está no modo LANDSCAPE. O html interno do ``#box--orientation`` pode ser customizado de acordo com sua aplicação.
   - **Compatibilidade:** Acionado nos casos de Browsers não suportados, o html interno ao ``box--support`` e regras css referentes não devem ser alteradas pois a api usa para alternar entre visualizações de browsers suportados de acordo com SO de cada dispositivo.
   - **Concluído:** Usado no início do carregamento dos arquivos até que esteja tudo pronto para o usuário realizar a captura.
   - **Mensagem de enquadramento:** Label usada para auxiliar o usuário no enquadramento de face no modo CÂMERA INTELIGENTE. Adicionar regras css que afetam a posição do box ou tamanho, deverá causar mau funcionamento, pois a posição do box é calculada automaticamente em tempo real. Siga abaixo o exemplo de como alterar a cor do fundo e fonte:
   
   ```
   #box-camera #message {
      background-color: rgba(41, 128, 255, 1) !important;
      color: #fff !important;
   }
   ```
 
## DEMO

Câmera normal - * [Clique aqui para abrir a demonstração](https://biodevelopment.acesso.io/Crediario/mobbioweb/?type=1)

Câmera inteligente - * [Clique aqui para abrir a demonstração](https://biodevelopment.acesso.io/Crediario/mobbioweb/?type=2)


## Construido com

* [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Framework de análise biométrica.


## Versionamento

Nós usamos [Github](https://github.com/) para versionar. Para as versões disponíveis, veja as [tags do repositório](https://github.com/acesso-io/mobbioweb/releases). 

## Autores

* **Lucas Ibiapina** - *Engenheiro Mobile* - [GitHub](https://github.com/lucas-ibiapina)
* **Matheus Domingos** - *Engenheiro Mobile* - [GitHub](https://github.com/MatheusDomingos)

Veja também nossa lista de [contribuidores](https://github.com/acesso-io/mobbioweb/graphs/contributors) que participaram deste projeto.

## Licença

Este proje é licenciado pela MIT License - veja [LICENSE.md](LICENSE.md) o arquivo para detalhes
