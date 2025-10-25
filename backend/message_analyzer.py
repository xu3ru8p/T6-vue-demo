import os
import json
from google import genai
from google.genai.errors import APIError
import psycopg2
import db_manager
import requests
import re

API_KEY = "AIzaSyAUqnzwb8oeiNAU5bjHpjFlV6GyvZItDUY"

LLM_MODEL = "gemini-2.0-flash"

def search_url_legitimacy(url):
    """搜索URL的合法性信息"""
    try:
        # 提取域名
        domain_match = re.search(r'https?://([^/]+)', url)
        if not domain_match:
            return "無法識別網址格式"
        
        domain = domain_match.group(1)
        
        # 使用 DuckDuckGo 搜索（免费）
        search_query = f"{domain} 詐騙 安全 官方網站"
        
        print(f"[搜索] 正在搜索網址合法性: {domain}")
        
        # 使用 DuckDuckGo Instant Answer API
        try:
            response = requests.get(f"https://api.duckduckgo.com/?q={search_query}&format=json&no_html=1&skip_disambig=1", timeout=10)
            if response.status_code == 200:
                data = response.json()
                abstract = data.get('Abstract', '')
                if abstract:
                    return f"網址 {domain} 的搜索結果：{abstract[:200]}..."
                else:
                    return f"網址 {domain} 的搜索結果：未找到相關信息，建議手動驗證"
            else:
                return f"網址 {domain} 的搜索結果：搜索服務暫時不可用"
        except requests.RequestException:
            return f"網址 {domain} 的搜索結果：網絡連接問題，請手動驗證此網址的合法性"
        
    except Exception as e:
        return f"搜索網址時發生錯誤: {e}"

def search_phone_number(phone):
    """搜索電話號碼的詐騙信息"""
    try:
        print(f"[搜索] 正在搜索電話號碼: {phone}")
        
        # 使用 DuckDuckGo 搜索電話號碼
        search_query = f"{phone} 詐騙 電話"
        
        try:
            response = requests.get(f"https://api.duckduckgo.com/?q={search_query}&format=json&no_html=1&skip_disambig=1", timeout=10)
            if response.status_code == 200:
                data = response.json()
                abstract = data.get('Abstract', '')
                if abstract:
                    return f"電話 {phone} 的搜索結果：{abstract[:200]}..."
                else:
                    return f"電話 {phone} 的搜索結果：未找到相關詐騙信息"
            else:
                return f"電話 {phone} 的搜索結果：搜索服務暫時不可用"
        except requests.RequestException:
            return f"電話 {phone} 的搜索結果：網絡連接問題，請手動驗證此電話號碼"
        
    except Exception as e:
        return f"搜索電話號碼時發生錯誤: {e}"

def extract_phone_numbers(message):
    """从消息中提取电话号码"""
    phone_pattern = r'(\d{2,4}-\d{3,4}-\d{3,4}|\d{3,4}-\d{3,4}-\d{3,4}|\d{8,10})'
    phones = re.findall(phone_pattern, message)
    return phones

def extract_urls_from_message(message):
    """从消息中提取所有URL"""
    url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
    urls = re.findall(url_pattern, message)
    return urls

def analyze_message(user_message: str):
    # 提取並搜索URL
    urls = extract_urls_from_message(user_message)
    url_analysis = ""
    
    if urls:
        print(f"\n[URL檢測] 發現 {len(urls)} 個網址:")
        url_results = []
        for url in urls:
            print(f"  - {url}")
            result = search_url_legitimacy(url)
            url_results.append(f"網址: {url}\n分析: {result}")
        
        url_analysis = "\n\n".join(url_results)
        print(f"[URL分析] {url_analysis}")
    
    # 提取並搜索電話號碼
    phones = extract_phone_numbers(user_message)
    phone_analysis = ""
    
    if phones:
        print(f"\n[電話檢測] 發現 {len(phones)} 個電話號碼:")
        phone_results = []
        for phone in phones:
            print(f"  - {phone}")
            result = search_phone_number(phone)
            phone_results.append(f"電話: {phone}\n分析: {result}")
        
        phone_analysis = "\n\n".join(phone_results)
        print(f"[電話分析] {phone_analysis}")
    
    # 分別獲取詐騙和合法關鍵詞
    scam_keywords_map = db_manager.get_scam_keywords()
    legitimate_keywords_map = db_manager.get_legitimate_keywords()
    
    if not scam_keywords_map and not legitimate_keywords_map:
        print("No keywords found in database")

    # 匹配詐騙特徵
    matched_scam_features = []
    for term, category in scam_keywords_map.items():
        if term.lower() in user_message.lower():
            matched_scam_features.append(f"詐騙特徵:'{term}' (分類:{category})")

    # 匹配合法特徵
    matched_legitimate_features = []
    for term, category in legitimate_keywords_map.items():
        if term.lower() in user_message.lower():
            matched_legitimate_features.append(f"合法特徵:'{term}' (分類:{category})")

    # 顯示匹配結果
    print("\n" + "=" * 80)
    print("資料庫比對結果")
    print("=" * 80)
    
    if matched_scam_features:
        print(f"[警訊] 匹配到 {len(matched_scam_features)} 個詐騙特徵：")
        for feature in matched_scam_features:
            print(f"  - {feature}")
    else:
        print("[資訊] 未匹配到任何詐騙特徵")
    
    if matched_legitimate_features:
        print(f"[佐證] 匹配到 {len(matched_legitimate_features)} 個合法特徵：")
        for feature in matched_legitimate_features:
            print(f"  - {feature}")
    else:
        print("[資訊] 未匹配到任何合法特徵")
    
    print("=" * 80)
    
    # 構建上下文
    scam_context = ""
    if matched_scam_features:
        scam_evidence = "\n".join(matched_scam_features)
        scam_context = f"以下由外部資料庫**精確比對出的詐騙特徵（強烈警訊）**：\n{scam_evidence}"
    else:
        scam_context = "外部資料庫**未比對到任何詐騙特徵**"
    
    legit_context = ""
    if matched_legitimate_features:
        legit_evidence = "\n".join(matched_legitimate_features)
        legit_context = f"以下由外部資料庫**精確比對出的合法特徵（佐證）**：\n{legit_evidence}"
    else:
        legit_context = "外部資料庫**未比對到任何合法特徵**"

    prompt = f"""
    你是一位專業的詐騙分析師，具備聯網搜索能力。
    請根據用戶提供的簡訊內容，結合以下信息做出最公正的判斷：
    
    **【簡訊內容】**
    "{user_message}"
    
    **【詐騙特徵證據 (警訊)】**
    {scam_context}

    **【合法特徵證據 (佐證)】**
    {legit_context}
    
    **【網址分析結果】**
    {url_analysis if url_analysis else "無網址需要分析"}
    
    **【電話號碼分析結果】**
    {phone_analysis if phone_analysis else "無電話號碼需要分析"}

    **【聯網搜索指示】**
    請在分析前進行以下聯網搜索：
    1. 搜索簡訊中提到的機構、公司或服務的真實性
    2. 搜索簡訊中提到的電話號碼是否為詐騙號碼
    3. 搜索簡訊中提到的網址是否為官方網站
    4. 搜索相關的詐騙案例和手法
    
    **【核心判斷標準】**
    1. **權衡證據：** 綜合考量兩組證據的數量與強度。
    2. **優先級：** 詐騙證據（如：索取密碼、緊急點擊）的權重遠高於合法證據。    
    3. **安全結論：** **高風險詐騙 (is_scam: true)：** 若簡訊包含明確的詐騙證據，即使同時存在少數合法詞彙，仍應判定為高風險。**
    4. **若無明顯詐騙證據，請自行判斷簡訊的語氣、有無連結、是否創造恐慌來判斷，並自訂風險指數。**
    5. **若有網址，請基於聯網搜索結果判斷網址是否為合法網址。**
    

    **判斷任務：**
    1.判斷這則簡訊是否為詐騙 (is_scam: true/false)。
    2.總結其詐騙手法和企圖，**必須引用或參考你所提供的參考特徵詞彙**（如果有的話），並且給出一句具體且詳細的分析。
    3.給出一個詐騙風險指數（scam_risk_index: 0 到 100 分，100 分為最危險）。

    請務必以單一、完整的 JSON 格式輸出結果，不要包含任何額外的文字或Markdown代碼塊之外的說明。

     **JSON 輸出格式範例:**
    {{
        "is_scam": true,
        "scam_risk_index": 95,
        "analysis": "這則簡訊製造了帳戶凍結的恐慌，且內容精確比對到「帳戶凍結」和「點擊連結」等高危險特徵，是典型的假冒銀行釣魚手法。",
        "keywords": [
            {{"term": "帳戶凍結", "type": "威脅誘餌"}},
            {{"term": "立即點擊", "type": "行動要求"}},
            {{"term": "輸入密碼", "type": "敏感操作"}},
            {{"term": "假冒銀行", "type": "機構身份"}}
        ]
    }}
    """

    try:
        client = genai.Client(api_key=API_KEY)

        response = client.models.generate_content(
            model=LLM_MODEL,
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        return response.text
    
    except APIError as e:
        print(f"API Error: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    test_message = "銀行不斷升息下多比較看看、潔軒經輕鬆借還，500萬資金內，還款彈性免押，當日放款，單一利率3.5%，備支票洽 04-22379380 謝美妮"



    result = analyze_message(test_message)
    if result:
        # result 已經是 JSON 字符串，直接打印
        print(result)
        # 或者解析後格式化打印
        # parsed = json.loads(result)
        # print(json.dumps(parsed, indent=4, ensure_ascii=False))
    else:
        print("Error: No result")