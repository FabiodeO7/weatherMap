# 🌍 WeatherMap - Previsão de Tempo Interativa

Uma aplicação web moderna e responsiva para consultar previsão de tempo de qualquer cidade do mundo, com imagens e dados meteorológicos detalhados.

## 📋 Características

✨ **Funcionalidades Principais:**
- 🔍 Busca de cidades em tempo real
- 🌡️ Temperatura atual e sensação térmica
- 📊 Dados meteorológicos detalhados (umidade, vento, pressão, visibilidade)
- 📈 Previsão para 5 dias
- 🖼️ Imagens de alta qualidade das cidades pesquisadas
- 📱 Design responsivo (mobile, tablet, desktop)
- ⚡ Interface rápida e fluida
- 🎨 Design moderno com gradientes e animações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo com flexbox e grid
- **JavaScript ES6+** - Lógica e integração de APIs

### APIs Externas
- **Open-Meteo API** - Dados meteorológicos (gratuita, sem chave)
  - Documentação: https://open-meteo.com/
  - Sem limites de taxa para uso pessoal
  
- **Unsplash API** - Imagens de cidades (gratuita com chave)
  - Documentação: https://unsplash.com/developers
  - Baixa latência, histórico de requisições
  - Créditos atribuídos automaticamente

## 📁 Estrutura do Projeto

```
weatherMap/
├── index.html          # Arquivo HTML principal
├── style.css          # Estilos CSS (responsivo)
├── script.js          # Lógica JavaScript e integração de APIs
└── README.md          # Esta documentação
```

### Descrição dos Arquivos

#### **index.html**
Estrutura HTML da página com:
- Header com título e subtitle
- Seção de busca com input e botões de cidades populares
- Indicador de carregamento
- Mensagem de erro
- Seção de clima (imagem, dados atuais, previsão)
- Estado vazio (quando nenhuma cidade foi selecionada)

#### **style.css**
Sistema de estilos com:
- Variáveis CSS para tema (cores, sombras, transições)
- Design moderno com gradientes
- Animações suaves (fade-in, spin, slide-down)
- Media queries para responsividade
- Breakpoints: 768px (tablets) e 480px (celulares)

#### **script.js**
Lógica da aplicação com:
- Integração com APIs (geocoding, clima, imagens)
- Tratamento de erros e validações
- Manipulação do DOM
- Event listeners para interatividade
- Comentários detalhados para cada função

## 🚀 Como Usar

### 1. Abrir a Aplicação
Basta abrir o arquivo `index.html` no navegador:
- Clique duplo no arquivo, ou
- Abra via navegador (Ctrl+O no Windows, Cmd+O no Mac)

### 2. Buscar uma Cidade
**Opção 1 - Busca Manual:**
- Digite o nome da cidade no input
- Pressione Enter ou clique em "Buscar"

**Opção 2 - Cidades Rápidas:**
- Clique em um dos botões de cidades populares
- São sugeridas: São Paulo, Rio de Janeiro, New York, Londres, Tóquio, Paris

### 3. Visualizar Dados
A página exibirá:
- 📸 Imagem da cidade
- 🌡️ Temperatura atual em Celsius
- 💭 Descrição do clima
- 📊 Cartões com detalhes (umidade, vento, pressão, visibilidade)
- 📅 Previsão de 5 dias com temperaturas e precipitação

## 🔧 Configuração

### API Key do Unsplash
A API key já está configurada no arquivo `script.js`:
```javascript
const UNSPLASH_API_KEY = 'DCC1xsuazF372czz6_mWiXNlqQnjrzm5-MkhhbL2fB0';
```

Se quiser usar sua própria chave:
1. Acesse https://unsplash.com/developers
2. Crie uma conta (se não tiver)
3. Crie uma nova aplicação
4. Copie sua Access Key
5. Substitua no `script.js` (linha ~15)

### API de Clima (Open-Meteo)
- ✅ **Não requer autenticação**
- Gratuita e sem limites para uso pessoal
- Documentação: https://open-meteo.com/

## 📡 Como Funciona a Integração de APIs

### 1. **Geocodificação (Buscar Coordenadas)**
```
Entrada: "São Paulo"
    ↓
API: https://geocoding-api.open-meteo.com/v1/search
    ↓
Saída: latitude: -23.5505, longitude: -46.6333
```

### 2. **Dados Meteorológicos**
```
Entrada: latitude, longitude
    ↓
API: https://api.open-meteo.com/v1/forecast
    ↓
Saída: temperatura, umidade, vento, previsão (5 dias)
```

### 3. **Imagens da Cidade**
```
Entrada: "São Paulo"
    ↓
API: https://api.unsplash.com/search/photos
    ↓
Saída: URL de imagem de alta qualidade
```

## 💡 Padrões de Programação Utilizados

### 1. **Separação de Responsabilidades**
- Funções utilitárias UI (mostrar/esconder elementos)
- Funções de API (buscar dados)
- Funções de interpretação (converter códigos em texto)
- Funções de atualização (modificar DOM)

### 2. **Async/Await**
- Operações assíncronas claras e legíveis
- Tratamento de erros com try/catch
- Promise.all() para requisições paralelas (melhor performance)

### 3. **Estado da Aplicação**
```javascript
const appState = {
    currentCity: null,
    currentCoordinates: null,
    isLoading: false
};
```
Centraliza dados compartilhados entre funções.

### 4. **Validações e Tratamento de Erros**
- Validação de entrada do usuário
- Fallbacks em caso de erro
- Mensagens de erro amigáveis
- Logs detalhados no console

### 5. **Código Documentado**
- JSDoc comments para todas as funções
- Explicações de parâmetros e retornos
- Comentários em seções principais

## 📱 Responsividade

A aplicação é 100% responsiva com 3 breakpoints principais:

### Desktop (≥ 769px)
- Layout completo com todas as informações
- Grade de 4 colunas para detalhes de clima

### Tablet (769px - 480px)
- Elementos redimensionados
- Grade de 2 colunas para detalhes
- Botões de cidades em 2 linhas

### Mobile (< 480px)
- Layout vertical otimizado
- Fonte reduzida mas legível
- Botões de cidades ocupam 50% da largura

## 🔐 Segurança

### Proteção de Dados
- ✅ API Key do Unsplash configurada (não expõe dados sensíveis)
- ✅ Todas as requisições feitas via HTTPS
- ✅ Sem armazenamento de dados pessoais
- ✅ Sem cookies ou localStorage (exceto cache do navegador)

## 📊 Interpretação de Códigos WMO

A aplicação converte códigos WMO (World Meteorological Organization) em descrições legíveis:

| Código | Descrição | Emoji |
|--------|-----------|-------|
| 0 | Céu limpo | ☀️ |
| 1-3 | Parcialmente nublado | 🌤️⛅ |
| 45-48 | Nebuloso | 🌫️ |
| 51-65 | Chuva | 🌧️⛈️ |
| 71-86 | Neve | ❄️🌨️ |
| 95-99 | Tempestade | ⛈️ |

## 🐛 Resolução de Problemas

### "Cidade não encontrada"
- Verifique a ortografia
- Tente usar o nome em inglês
- Alguns nomes podem variar (ex: "Moscou" vs "Moscow")

### Imagem não carrega
- Verifique sua conexão de internet
- Algumas cidades podem não ter imagens disponíveis (usa fallback)
- Verá uma imagem padrão neste caso

### Dados de clima não aparecem
- Verifique sua conexão (precisa de internet)
- Experimente outra cidade
- Abra o console (F12) para ver logs de erro

### Aplicação lenta
- Primeira requisição pode ser mais lenta
- Muito depende da sua conexão
- APIs são gratuitas, então têm algum delay

## 📚 Referências e Documentações

- **Open-Meteo API**: https://open-meteo.com/
- **Unsplash API**: https://unsplash.com/developers
- **Códigos WMO**: https://open-meteo.com/en/docs/forecast-api
- **MDN Web Docs**: https://developer.mozilla.org/
- **CSS Grid**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 🎯 Melhorias Futuras

Ideias para expansão da aplicação:

- [ ] Geolocalização automática do usuário
- [ ] Histórico de cidades buscadas (localStorage)
- [ ] Modo escuro/claro
- [ ] Menu de unidades (Celsius/Fahrenheit, km/h vs mph)
- [ ] Alertas de tempo severo
- [ ] Gráficos de previsão mais detalhados
- [ ] Compartilhamento de dados nas redes sociais
- [ ] Notificações push
- [ ] Offline mode (service workers)
- [ ] Integração com mapas (Google Maps/Leaflet)

## 📄 Licença

Projeto desenvolvido para fins educacionais e de portfólio.
As APIs utilizadas possuem suas próprias licenças:
- **Open-Meteo**: Creative Commons Attribution 4.0 International
- **Unsplash**: Unsplash License (uso livre)

## 👨‍💻 Autor

Desenvolvido como exemplo de aplicação web moderna com:
- ✅ Código limpo e bem documentado
- ✅ Boas práticas de programação
- ✅ Design responsivo e moderno
- ✅ Integração com APIs externas
- ✅ Tratamento completo de erros

## 💬 Contato e Suporte

Se encontrar algum erro ou tiver dúvidas:
1. Verifique o console do navegador (F12)
2. Consulte a seção de resolução de problemas
3. Verifique a documentação das APIs

---

**Versão**: 1.0  
**Última atualização**: Março 2026  
**Status**: ✅ Pronto para produção
