# Imagens de Fundo

## Como usar sua própria imagem de fundo

1. Coloque sua imagem na pasta `public/images/`
2. Modifique o arquivo `index.html` na linha 20, substituindo a URL atual por:
   ```css
   url('./images/sua-imagem.jpg')
   ```

## Formatos suportados
- JPG/JPEG
- PNG
- WebP
- SVG

## Tamanho recomendado
- Largura: 1920px ou mais
- Altura: 1080px ou mais
- Proporção: 16:9 ou similar

## Exemplo de uso
```css
background-image:
    url('./images/biblioteca-fundo.jpg'),
    radial-gradient(circle at 20% 80%, rgba(52, 104, 140, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(74, 125, 92, 0.1) 0%, transparent 50%);
```
