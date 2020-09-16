# AcessoBio Web Frame

Este projeto visa facilitar a implementação do frame de captura biométrica via JavaScript nativo através de algoritimos de abertura de câmera modernos e visão computacional e abertura de câmeras . Ajudando desta forma no melhor enquadramento para captura e otimizando as imagens antes de serem enviadas ao motor biomé
trico.

## Começando

Estas instruções farão com que você consiga implementar a abertura câmera e obter/manipular os dados de retorno.
 
Esta biblioteca utiliza os recursos nativos do HTML 5, JavaScript e CSS e funciona em todos os browsers modernos.


## Compatibilidade 

- SO a partir do iOS 11.0 e Android 5.0. 
- Google Chrome a partir da versão 60 e Safari a partir da versão 11. 
- Suporte nativo em navegadores modernos, como o Google Chrome, Firefox, Opera e Edge para Android e Safari para iOS. 
- Browsers com suporte a WebRTC. 

 ## Características

- Exibe um frame com silhueta ajustavel automaticamente com base na proporcão da tela do usuário. 

 
## Instalando

A instalação e implementação do Mobbio Web em seu projeto é muito simples e em poucos passos o seu frame estará pronto para ser utilizado. Segue abaixo: 

- Adicione o nosso projeto a sua maquina através do Github ou download do mesmo. 
- Remomeie a classe ``index.html`` para um nome que se enquadre ao contexto geral do seu projeto ou mantenha o nome afim de projetos do aspecto poc. 

Pronto! O seu projeto já está pronto para o uso de nossa ferramenta. 

## Manuseio

Para manipular o base64 da imagem capturada, os métodos de callback como demonstrados abaixo e disponíveis na classe index.html:

  ```javascript
      onSuccessCaptureJS = onSuccessCapture;
      onFailedCaptureJS = onFailedCapture;
  
      function onSuccessCapture(base64) {
        console.log(base64);
      }
  
      function onFailedCapture(err) {
        console.log(err);
      }
  
```
 
## DEMO

* [Clique aqui para abrir a demonstração](https://biodevelopment.acesso.io/Crediario/mobbioweb/)


## Construido com

* [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Framework de análise bimétrica.


## Versionamento

Nós usamos [Github](https://github.com/) para versionar. Para as versões disponíveis, veja as [tags do repositório](https://github.com/acesso-io/mobbioweb/releases). 

## Autores

* **Lucas Ibiapina** - *Engenheiro Mobile* - [GitHub](https://github.com/lucas-ibiapina)
* **Matheus Domingos** - *Engenheiro Mobile* - [GitHub](https://github.com/MatheusDomingos)

Veja também nossa lista de [contribuidores](https://github.com/acesso-io/mobbioweb/graphs/contributors) que participaram deste projeto.

## Licença

Este proje é licenciado pela MIT License - veja [LICENSE.md](LICENSE.md) o arquivo para detalhes
