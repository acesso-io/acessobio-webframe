### Sobre

AcessoBio Frame é uma biblioteca JavaScript que permite exibir um fluxo de câmera em uma página da web e, em seguida, capturar uma imagem deste fluxo. 

Esta biblioteca utiliza os recursos do HTML 5, portanto funciona somente em browsers modernos.

O fluxo de vídeo é colocado em um contêiner de sua escolha e você o controla por meio da API JavaScript e de seus próprios elementos de interface.

A ideia é baseada em uma biblioteca similar chamada JpegCamera. Além de trabalhar sem o Flash e oferecer uma API mais limpa e moderna, o AcessoBio Frame tem alguns novos recursos interessantes voltados a integração com o Acesso Bio.

### Features

* Funciona no iOS 11 ou superior
* Funciona nativamente nos navegadores modernos (Chrome, Firefox, Opera, Edge)
* Caso o navegador não tenha os recursos HTML 5 implementados, você pode ativar um fallback para upload de arquivo
* Desenho da silhueta do rosto para indicar onde a pessoa deve posicionar o rosto
* Pronta para utilizar o liveness da Acesso Digital
* Funciona com a camera da frente e traseira do dispositivo

### Demo

Veja a bilbioteca em funcionamento. [Clique aqui](https://crediariohomolog.acesso.io/frame/)  

### Instalação

Você pode carregar o AcessoBio Frame diretamente em qualquer página da web.

### Utilização

```
$(document).ready(function () {

        var options = {
            showFrame: true, // Habilita ou desabilita a silhueta
            orientation: 'landscape', // landscape ou portrait
            width: 640, // Largura do frame (Sempre deve respeitar a proporção HD (720*1280))
            height: 360, // Altura do frame (Sempre deve respeitar a proporção HD (720*1280))
            allowFallbackNativeCamera: true, // Em caso de falha abre a câmera nativa do celular
            allowFallbackImport: true, // Em caso de falha abre um botão para importar uma imagem
            facingMode:'environment', // Define qual câmera será inicializada (user - câmera frontal; environment - câmera traseira )
            btnCamera_onClick: function (base64) { // Handler quando o botão da câmera é acionado
                console.log(base64);
            },
            import_onChange: function (base64) { // Handler quando o botão importar é acionado
                console.log(base64);
            }
        }        
        
        // Inicia a biblioteca 
        var acessoCameraManager = new AcessoCameraManager("#camera", options);
        acessoCameraManager.InitCamera();
        
        // Captura o frame atual do fluxo de captura
        //acessoCameraManager.GetBase64();
        
        // Finaliza o fluxo de captura
        //acessoCameraManager.StopCamera();
    })

```
