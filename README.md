### Introdução

Este projeto contém uma biblioteca JavaScript (API) que permite abrir o fluxo da câmera em uma página web e capturar uma imagem de forma a atender os padrões de captura biométrica exigidos pela ACESSO DIGITAL.

### Descrição

Esta biblioteca utiliza os recursos nativos do HTML 5 e funciona apenas em browsers modernos.

O fluxo de vídeo é colocado em um contêiner de sua escolha e é possível configurar algumas propriedades por meio da própria API e de seus elementos de interface.

### Características

* Roda no iOS 11 ou superior
* Roda no Android 4.4 ou superior
* Roda nativamente em navegadores modernos de PC's (Chrome, Firefox, Opera, Edge)
* Caso o navegador não tenha os recursos HTML 5 implementados (WebRTC), você pode ativar um fallback para realizar o upload do arquivo
* Exibição da silhueta do rosto para indicar onde a pessoa deve posicionar a face durante a captura
* Permite utilizar a câmera frontal ou traseira de dispositivos móveis

### Demonstração

Veja a bilbioteca em funcionamento. [Clique aqui](https://crediariohomolog.acesso.io/frame/)  

### Como utilizar

Referencie a biblioteca no header da página HTML juntamente com o JQuery e execute as chamadas necessárias.

### Utilização

```
$(document).ready(function () {

        var options = {
            showFrame: true, // Habilita ou desabilita a silhueta
            orientation: 'landscape', // Landscape ou portrait
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
        };     
        
        // Inicia a biblioteca 
        var acessoCameraManager = new AcessoCameraManager("#camera", options);
        acessoCameraManager.InitCamera();
        
        // Captura o frame atual do fluxo de captura
        //acessoCameraManager.GetBase64();
        
        // Finaliza o fluxo de captura
        //acessoCameraManager.StopCamera();
});

```
