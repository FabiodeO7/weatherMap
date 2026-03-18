// ============================================
// CONFIGURAÇÕES E CONSTANTES
// ============================================

/**
 * API Key do Unsplash para buscar imagens de cidades
 * Documentação: https://unsplash.com/developers
 */
const UNSPLASH_API_KEY = 'DCC1xsuazF372czz6_mWiXNlqQnjrzm5-MkhhbL2fB0';

/**
 * URLs das APIs utilizadas
 * - Open-Meteo: API de clima gratuita, sem necessidade de chave
 * - Unsplash: API de imagens com busca de alta qualidade
 */
const API_URLS = {
    // Converte nome da cidade em coordenadas (latitude/longitude)
    geocoding: 'https://geocoding-api.open-meteo.com/v1/search',
    // Obtém dados meteorológicos das coordenadas
    weather: 'https://api.open-meteo.com/v1/forecast',
    // Obtém imagens relacionadas à busca
    unsplash: 'https://api.unsplash.com/search/photos'
};

// ============================================
// ELEMENTOS DO DOM
// ============================================

/**
 * Referências aos elementos HTML principais
 * Permite acesso rápido e organizado aos elementos da interface
 */
const DOMElements = {
    // Entrada de busca
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    
    // Indicadores
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Seções
    weatherSection: document.getElementById('weatherSection'),
    initialState: document.getElementById('initialState'),
    
    // Dados de clima atual
    cityName: document.getElementById('cityName'),
    currentTemp: document.getElementById('currentTemp'),
    weatherDescription: document.getElementById('weatherDescription'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    
    // Imagem
    cityImage: document.getElementById('cityImage'),
    
    // Previsão
    forecastContainer: document.getElementById('forecastContainer'),
    
    // Botões de cidades rápidas
    cityQuickButtons: document.querySelectorAll('.city-quick-btn')
};

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================

/**
 * Armazena o estado atual da aplicação
 * Útil para manter dados entre diferentes operações
 */
const appState = {
    currentCity: null,
    currentCoordinates: null,
    isLoading: false
};

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Configura todos os event listeners da aplicação
 * Executa ao carregar o script
 */
function initializeEventListeners() {
    // Busca ao clicar no botão
    DOMElements.searchBtn.addEventListener('click', handleSearch);
    
    // Busca ao pressionar Enter
    DOMElements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Botões de cidades rápidas
    DOMElements.cityQuickButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            DOMElements.cityInput.value = e.target.dataset.city;
            handleSearch();
        });
    });
}

// ============================================
// FUNÇÕES UTILITÁRIAS DE UI
// ============================================

/**
 * Exibe o indicador de carregamento
 */
function showLoading() {
    DOMElements.loadingIndicator.classList.remove('hidden');
    appState.isLoading = true;
}

/**
 * Oculta o indicador de carregamento
 */
function hideLoading() {
    DOMElements.loadingIndicator.classList.add('hidden');
    appState.isLoading = false;
}

/**
 * Exibe uma mensagem de erro
 * @param {string} message - Texto da mensagem de erro
 */
function showError(message) {
    DOMElements.errorMessage.textContent = message;
    DOMElements.errorMessage.classList.remove('hidden');
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        DOMElements.errorMessage.classList.add('hidden');
    }, 5000);
}

/**
 * Oculta a mensagem de erro
 */
function hideError() {
    DOMElements.errorMessage.classList.add('hidden');
}

/**
 * Alterna a visibilidade da seção de clima
 * @param {boolean} show - Se deve mostrar (true) ou esconder (false) a seção
 */
function toggleWeatherSection(show) {
    if (show) {
        DOMElements.weatherSection.classList.remove('hidden');
        DOMElements.initialState.classList.add('hidden');
    } else {
        DOMElements.weatherSection.classList.add('hidden');
        DOMElements.initialState.classList.remove('hidden');
    }
}

// ============================================
// API: GEOCODIFICAÇÃO (Buscar Coordenadas)
// ============================================

/**
 * Busca as coordenadas (latitude/longitude) de uma cidade
 * Utiliza a API Open-Meteo Geocoding
 * 
 * @param {string} cityName - Nome da cidade a buscar
 * @returns {Promise<Object|null>} Objeto com dados da cidade ou null se não encontrado
 * 
 * Resposta exemplo:
 * {
 *   name: "São Paulo",
 *   latitude: -23.5505,
 *   longitude: -46.6333,
 *   country: "Brazil"
 * }
 */
async function fetchCityCoordinates(cityName) {
    try {
        const params = new URLSearchParams({
            name: cityName,
            count: 1,           // Retorna o primeiro resultado mais relevante
            language: 'pt',     // Retorna nomes em português
            format: 'json'
        });
        
        const response = await fetch(
            `${API_URLS.geocoding}?${params.toString()}`
        );
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica se encontrou algum resultado
        if (!data.results || data.results.length === 0) {
            return null;
        }
        
        // Retorna o primeiro resultado (mais relevante)
        return data.results[0];
        
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        throw error;
    }
}

// ============================================
// API: CLIMA (Dados Meteorológicos)
// ============================================

/**
 * Busca dados meteorológicos para as coordenadas fornecidas
 * Utiliza a API Open-Meteo Weather
 * 
 * @param {number} latitude - Latitude da localização
 * @param {number} longitude - Longitude da localização
 * @returns {Promise<Object>} Objeto contendo dados de clima atual e previsão
 * 
 * Dados retornados:
 * - current: temperatura, umidade, vento, etc (dados atuais)
 * - daily: previsão para os próximos dias
 */
async function fetchWeatherData(latitude, longitude) {
    try {
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current: [
                'temperature_2m',
                'apparent_temperature',
                'weather_code',
                'relative_humidity_2m',
                'weather_code',
                'wind_speed_10m',
                'pressure_msl',
                'visibility'
            ].join(','),
            daily: [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'precipitation_sum'
            ].join(','),
            timezone: 'auto',   // Fuso horário automático baseado na localização
            forecast_days: 5    // Previsão para 5 dias
        });
        
        const response = await fetch(
            `${API_URLS.weather}?${params.toString()}`
        );
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Erro ao buscar dados de clima:', error);
        throw error;
    }
}

// ============================================
// API: IMAGENS (Unsplash)
// ============================================

/**
 * Busca uma imagem relacionada ao nome da cidade
 * Utiliza a API Unsplash
 * 
 * @param {string} cityName - Nome da cidade
 * @returns {Promise<string|null>} URL da imagem ou null se não encontrada
 * 
 * A busca procura por imagens com alta qualidade e popularidade
 */
async function fetchCityImage(cityName) {
    try {
        const params = new URLSearchParams({
            query: cityName,
            per_page: 1,
            order_by: 'relevant',
            client_id: UNSPLASH_API_KEY
        });
        
        const response = await fetch(
            `${API_URLS.unsplash}?${params.toString()}`
        );
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica se encontrou alguma imagem
        if (!data.results || data.results.length === 0) {
            // Se não encontrar, tenta uma busca genérica
            return await fetchCityImage('cidade');
        }
        
        // Retorna a URL da imagem com qualidade otimizada
        return data.results[0].urls.regular;
        
    } catch (error) {
        console.error('Erro ao buscar imagem:', error);
        // Retorna uma imagem padrão em caso de erro
        return 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80';
    }
}

// ============================================
// INTERPRETAÇÃO DE DADOS
// ============================================

/**
 * Converte código WMO (World Meteorological Organization) para descrição textual
 * Estes códigos são usados pela API Open-Meteo
 * 
 * @param {number} code - Código WMO
 * @param {boolean} isDay - Se é período diurno (influencia alguns códigos)
 * @returns {Object} Descrição do clima e emoji
 */
function interpretWeatherCode(code, isDay = true) {
    const weatherDescriptions = {
        0: { text: 'Céu limpo', emoji: '☀️' },
        1: { text: 'Principalmente céu limpo', emoji: '🌤️' },
        2: { text: 'Parcialmente nublado', emoji: '⛅' },
        3: { text: 'Nublado', emoji: '☁️' },
        4: { text: 'Muito nublado', emoji: '☁️' },
        45: { text: 'Nebuloso', emoji: '🌫️' },
        48: { text: 'Depósito de gelo em névoa', emoji: '🌫️' },
        51: { text: 'Garoa leve', emoji: '🌧️' },
        53: { text: 'Garoa moderada', emoji: '🌧️' },
        55: { text: 'Garoa densa', emoji: '🌧️' },
        61: { text: 'Chuva leve', emoji: '🌧️' },
        63: { text: 'Chuva moderada', emoji: '🌧️' },
        65: { text: 'Chuva intensa', emoji: '⛈️' },
        71: { text: 'Neve fraca', emoji: '❄️' },
        73: { text: 'Neve moderada', emoji: '❄️' },
        75: { text: 'Neve intensa', emoji: '❄️' },
        77: { text: 'Grãos de neve', emoji: '❄️' },
        80: { text: 'Chuva fraca', emoji: '🌧️' },
        81: { text: 'Chuva moderada', emoji: '🌧️' },
        82: { text: 'Chuva violenta', emoji: '⛈️' },
        85: { text: 'Neve leve', emoji: '🌨️' },
        86: { text: 'Neve intensa', emoji: '🌨️' },
        95: { text: 'Tempestade', emoji: '⛈️' },
        96: { text: 'Tempestade com granizo leve', emoji: '⛈️' },
        99: { text: 'Tempestade com granizo', emoji: '⛈️' }
    };
    
    return weatherDescriptions[code] || { text: 'Desconhecido', emoji: '❓' };
}

/**
 * Formata uma data para formato legível
 * @param {string} dateString - Data em formato ISO (YYYY-MM-DD)
 * @returns {string} Data formatada (ex: "20 Mar")
 */
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// ============================================
// ATUALIZAÇÃO DA INTERFACE
// ============================================

/**
 * Atualiza a seção de clima atual na interface
 * Exibe temperatura, descrição, sensação térmica e detalhes
 * 
 * @param {Object} cityData - Dados da cidade (nome, coordenadas)
 * @param {Object} weatherData - Dados meteorológicos da API
 */
function updateCurrentWeatherDisplay(cityData, weatherData) {
    const current = weatherData.current;
    const weatherInfo = interpretWeatherCode(current.weather_code);
    
    // Atualiza informações principais
    DOMElements.cityName.textContent = cityData.name;
    DOMElements.currentTemp.textContent = Math.round(current.temperature_2m);
    DOMElements.weatherDescription.textContent = weatherInfo.text;
    DOMElements.feelsLike.textContent = Math.round(current.apparent_temperature);
    
    // Atualiza cards de detalhes
    DOMElements.humidity.textContent = Math.round(current.relative_humidity_2m) + '%';
    DOMElements.windSpeed.textContent = Math.round(current.wind_speed_10m) + ' km/h';
    DOMElements.pressure.textContent = Math.round(current.pressure_msl) + ' hPa';
    DOMElements.visibility.textContent = (current.visibility / 1000).toFixed(1) + ' km';
}

/**
 * Atualiza a seção de previsão dos próximos dias
 * Cria cards individuais para cada dia
 * 
 * @param {Object} weatherData - Dados meteorológicos com informações diárias
 */
function updateForecastDisplay(weatherData) {
    const daily = weatherData.daily;
    DOMElements.forecastContainer.innerHTML = ''; // Limpa previsões anteriores
    
    // Itera sobre cada dia da previsão
    for (let i = 0; i < daily.time.length; i++) {
        const weatherInfo = interpretWeatherCode(daily.weather_code[i], true);
        
        // Cria elemento do card de previsão
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${formatDate(daily.time[i])}</div>
            <div class="forecast-icon">${weatherInfo.emoji}</div>
            <div class="forecast-temp">
                <span class="forecast-temp-max">${Math.round(daily.temperature_2m_max[i])}°</span>
                <span class="forecast-temp-min">${Math.round(daily.temperature_2m_min[i])}°</span>
            </div>
            <div class="forecast-rain">
                💧 ${daily.precipitation_sum[i].toFixed(1)}mm
            </div>
        `;
        
        DOMElements.forecastContainer.appendChild(forecastCard);
    }
}

// ============================================
// FUNÇÃO PRINCIPAL DE BUSCA
// ============================================

/**
 * Função principal que coordena toda a busca de dados
 * Fluxo:
 * 1. Valida entrada do usuário
 * 2. Busca coordenadas da cidade
 * 3. Busca dados meteorológicos
 * 4. Busca imagem da cidade
 * 5. Atualiza interface com todos os dados
 */
async function handleSearch() {
    // Obtém o texto da entrada
    const cityName = DOMElements.cityInput.value.trim();
    
    // Validação: verifica se a entrada está vazia
    if (!cityName) {
        showError('Por favor, digite o nome de uma cidade.');
        return;
    }
    
    // Evita múltiplas buscas simultâneas
    if (appState.isLoading) {
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        // 1. BUSCA COORDENADAS
        console.log(`Buscando coordenadas para: ${cityName}`);
        const cityData = await fetchCityCoordinates(cityName);
        
        if (!cityData) {
            showError(`Cidade "${cityName}" não encontrada. Tente outra.`);
            hideLoading();
            return;
        }
        
        // Armazena dados da cidade no estado
        appState.currentCity = cityData;
        console.log('Cidade encontrada:', cityData);
        
        // 2. BUSCA DADOS METEOROLÓGICOS (paralelo com imagem)
        console.log('Buscando dados meteorológicos...');
        const weatherDataPromise = fetchWeatherData(
            cityData.latitude,
            cityData.longitude
        );
        
        // 3. BUSCA IMAGEM (paralelo com clima)
        console.log('Buscando imagem da cidade...');
        const imageUrlPromise = fetchCityImage(cityData.name);
        
        // Aguarda ambas as requisições (paralelo para melhor performance)
        const [weatherData, imageUrl] = await Promise.all([
            weatherDataPromise,
            imageUrlPromise
        ]);
        
        // 4. ATUALIZA INTERFACE
        updateCurrentWeatherDisplay(cityData, weatherData);
        updateForecastDisplay(weatherData);
        DOMElements.cityImage.src = imageUrl;
        DOMElements.cityImage.alt = `Imagem de ${cityData.name}`;
        
        // 5. ALTERNA VISIBILIDADE DA SEÇÃO
        toggleWeatherSection(true);
        
        console.log('Dados carregados com sucesso!');
        
    } catch (error) {
        console.error('Erro durante a busca:', error);
        showError(
            'Erro ao buscar dados. Verifique sua conexão e tente novamente.'
        );
        toggleWeatherSection(false);
        
    } finally {
        hideLoading();
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa a aplicação quando o DOM está pronto
 * Configura event listeners e prepara a interface
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('WeatherMap - Aplicação iniciada');
    initializeEventListeners();
    
    // Focua automaticamente no input de busca
    DOMElements.cityInput.focus();
    
    // Log para verificar se tudo foi carregado corretamente
    console.log('Event listeners configurados com sucesso');
    console.log('Pronto para buscar cidades!');
});
