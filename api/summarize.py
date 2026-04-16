import sys
import json
import os
import re
import urllib.request
import urllib.error
import urllib.parse
from http.server import BaseHTTPRequestHandler

# As dependências podem falhar em ambiente local se não instaladas.
# A Vercel cuida disso automaticamente ao ler o requirements.txt
try:
    from youtube_transcript_api import YouTubeTranscriptApi
    import trafilatura
    from google import genai
    from google.genai import types
except ImportError:
    pass

def get_youtube_id(url):
    """Extrai o ID do video a partir de URLs do youtube."""
    query = urllib.parse.urlparse(url)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            p = urllib.parse.parse_qs(query.query)
            return p.get('v', [None])[0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    return None

def extract_youtube(url):
    video_id = get_youtube_id(url)
    if not video_id:
        raise ValueError("URL do YouTube inválida.")
    
    # Tenta transcrever. Primeiro pt, depois auto-generated pt, depois en.
    try:
         transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['pt', 'en'])
    except Exception as e:
         raise ValueError(f"Não foi possível obter as legendas do vídeo: {str(e)}")
         
    text = " ".join([item['text'] for item in transcript])
    return f"Contexto (Vídeo do YouTube): {text}"

def extract_reddit(url):
    # Reddit permite append de .json para puxar dados
    # Removendo query params e final / se tiver
    clean_url = url.split('?')[0].rstrip('/')
    json_url = f"{clean_url}.json"
    
    req = urllib.request.Request(
        json_url, 
        data=None, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AIStudyHub/1.0'
        }
    )
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
    except Exception as e:
         raise ValueError(f"Falha ao ler o Reddit: {str(e)}")
         
    post_data = data[0]['data']['children'][0]['data']
    title = post_data.get('title', '')
    selftext = post_data.get('selftext', '')
    
    content = f"Contexto (Postagem no Reddit):\nTítulo: {title}\nConteúdo Original: {selftext}\n\nPrincipais comentários:\n"
    
    # Tentando pegar top 3 comentários raíz
    try:
        comments_data = data[1]['data']['children']
        count = 0
        for comment in comments_data:
            if count >= 3: break
            if 'body' in comment['data'] and comment['data']['body'] not in ('[deleted]', '[removed]'):
                content += f"- {comment['data']['body']}\n"
                count += 1
    except Exception:
        pass # Ignora erros de parse nos comentários

    return content

def extract_general(url):
    # Trafilatura é excelente para puxar texto de páginas em geral sem poluição visual.
    downloaded = trafilatura.fetch_url(url)
    if not downloaded:
        raise ValueError("Não foi possível acessar a URL informada (bloqueio ou página inexistente).")
        
    text = trafilatura.extract(downloaded)
    if not text:
        raise ValueError("Estrutura da página não permitiu extração do conteúdo central.")
        
    return f"Contexto (Artigo/Pagina Web):\n{text}"

ALLOWED_MODELS = {
    'gemini-3.1-flash-preview',
    'gemini-3.1-pro-preview',
    # Fallbacks estáveis caso os preview fiquem indisponíveis
    'gemini-2.5-flash',
    'gemini-2.5-pro',
}
DEFAULT_MODEL = 'gemini-2.5-flash'

def summarize_with_gemini(text, instructions="", model=DEFAULT_MODEL):
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("VITE_GEMINI_API_KEY")
    if not api_key:
        raise ValueError("A chave da API do Gemini (GEMINI_API_KEY) não foi configurada no ambiente da Vercel.")

    if model not in ALLOWED_MODELS:
        model = DEFAULT_MODEL

    client = genai.Client(api_key=api_key)

    # Fallback map: se o preview falhar (model not found / rate limit), cai pro estável
    FALLBACK_MAP = {
        'gemini-3.1-flash-preview': 'gemini-2.5-flash',
        'gemini-3.1-pro-preview': 'gemini-2.5-pro',
    }

    prompt = f"""Você é um assistente acadêmico e técnico (AI Study Hub).
Você processa conteúdos capturados e os resume extraindo as informações mais valiosas.
Seja direto, focado no aprendizado e liste insights-chave (bullet points são muito bem vindos).

MUITO IMPORTANTE: No final de sua resposta Markdown limpa, você DEVE incluir OBRIGATORIAMENTE um bloco de código JSON final (```json) com os campos "title" (título do conteúdo) e "summary" (um resumo muito breve de 1 frase). Exemplo do final da resposta:
```json
{{
  "title": "Título do Resumo",
  "summary": "Resumo super curto de uma frase."
}}
```

Instruções específicas do usuário: {instructions}

Abaixo o conteúdo bruto capturado:
----------------------------------
{text}
"""

    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt,
        )
        return response.text
    except Exception as primary_err:
        fallback = FALLBACK_MAP.get(model)
        if not fallback:
            raise
        # Tenta o modelo estável equivalente
        response = client.models.generate_content(
            model=fallback,
            contents=prompt,
        )
        return response.text

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        self.end_headers()
        
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            url = body.get('url', '')
            platform = body.get('platform', 'geral') # youtube | reddit | twitter | geral
            instructions = body.get('instructions', '')
            model = body.get('model', DEFAULT_MODEL)
            
            if not url:
                self._send_response({'error': 'A URL não foi fornecida.'}, 400)
                return
                
            # Logica de extração de texto bruto
            raw_text = ""
            if platform == 'youtube' or 'youtube.com' in url or 'youtu.be' in url:
                raw_text = extract_youtube(url)
            elif platform == 'reddit' or 'reddit.com' in url:
                raw_text = extract_reddit(url)
            elif platform == 'twitter' or 'x.com' in url or 'twitter.com' in url:
                # O Twitter raspar não é garantido. Passaremos só o link e pediremos para o Gemini buscar nativamente caso o modelo seja o Gemini Experimental ou algo assim (buscas com ferramentas).
                # Aqui vamos fazer um fallback para extract default.
                raw_text = extract_general(url) 
                
            else:
                raw_text = extract_general(url)
                
            # Validar limite de string para não estourar payload/timeout (10MB)
            if len(raw_text) > 2000000: # Corte suave por segurança
                raw_text = raw_text[:2000000]
                
            # Sumarização via Gemini
            summary = summarize_with_gemini(raw_text, instructions=instructions, model=model)
            
            self._send_response({
                'success': True,
                'summary': summary,
                'platform_detected': platform
            }, 200)

        except Exception as e:
            self._send_response({'success': False, 'error': str(e)}, 500)
            
    def _send_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
