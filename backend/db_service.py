import psycopg2
from psycopg2 import sql
import os

# --- 資料庫連線參數設定 ---
# 請替換成您自己的 PostgreSQL 連線資訊
DB_NAME = "scam_game_db" 
DB_USER = "postgres"
DB_PASSWORD = "111306061allen"
DB_HOST = "localhost" 
DB_PORT = "5432"

def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except psycopg2.Error as e:
        print(f"資料庫連線失敗: {e}")
        return None

#user table function
def get_user_data(username):
    conn = get_db_connection()
    if conn is None:
        return None
    
    cursor = conn.cursor()
    query = sql.SQL("SELECT * FROM users WHERE username = {username}").format(username=sql.Literal(username))
    cursor.execute(query)
    user_data = cursor.fetchone()
    cursor.close()
    conn.close()
    return user_data

def create_user(username, password, email):
    conn = get_db_connection()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = sql.SQL("INSERT INTO users (username, password, email) VALUES ({username}, {password}, {email}) RETURNING userid").format(username=sql.Literal(username), password=sql.Literal(password), email=sql.Literal(email))
    cursor.execute(query)
    conn.commit()
    cursor.close()
    conn.close()
    return True

def update_user(user_id, username, password, email):
    conn = get_db_connection()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = sql.SQL("UPDATE users SET username = {username}, password = {password}, email = {email} WHERE id = {user_id}").format(username=sql.Literal(username), password=sql.Literal(password), email=sql.Literal(email), user_id=sql.Literal(user_id))
    cursor.execute(query)
    conn.commit()
    cursor.close()
    conn.close()
    return True

def delete_user(user_id):
    conn = get_db_connection()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = sql.SQL("DELETE FROM users WHERE id = {user_id}").format(user_id=sql.Literal(user_id))
    cursor.execute(query)
    conn.commit()
    cursor.close()
    conn.close()
    return True

#scam_message table function
def get_scam_categories():
    """獲取所有詐騙題目的類別列表"""
    conn = get_db_connection()
    if conn is None:
        return []
    
    cursor = conn.cursor()
    query = sql.SQL("SELECT DISTINCT scam_category FROM scam_message WHERE is_truth_message = false ORDER BY scam_category")
    cursor.execute(query)
    categories = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # 將結果轉換為簡單的列表
    return [category[0] for category in categories]

def get_scam_message_sources():
    conn = get_db_connection()
    if conn is None:
        return []
    
    cursor = conn.cursor()
    query = sql.SQL("SELECT DISTINCT message_source FROM scam_message WHERE is_truth_message = false ORDER BY message_source")
    cursor.execute(query)
    sources = cursor.fetchall()
    cursor.close()
    conn.close()
    return [source[0] for source in sources]

def get_scam_message(scam_category, message_source, is_truth_message):
    conn = get_db_connection()
    if conn is None:
        return None
    
    cursor = conn.cursor()
    query = sql.SQL("SELECT message_id, message_source, message_text, is_truth_message, scam_category FROM scam_message WHERE scam_category = {scam_category} AND message_source = {message_source} AND is_truth_message = {is_truth_message} ORDER BY RANDOM()").format(scam_category=sql.Literal(scam_category), message_source=sql.Literal(message_source), is_truth_message=sql.Literal(is_truth_message))
    cursor.execute(query)
    message_data = cursor.fetchone()
    cursor.close()
    conn.close()
    return message_data

def get_scam_message_analysis(message_id):
    conn = get_db_connection()
    if conn is None:
        return None
    
    cursor = conn.cursor()
    query = sql.SQL("SELECT message_analysis FROM scam_message WHERE message_id = {message_id}").format(message_id=sql.Literal(message_id))
    cursor.execute(query)
    analysis_data = cursor.fetchone()
    cursor.close()
    conn.close()
    return analysis_data

def get_multiple_message_analysis(message_ids):
    """批量獲取多個訊息的解析"""
    conn = get_db_connection()
    if conn is None or not message_ids:
        return []
    
    cursor = conn.cursor()
    # 使用 IN 子句批量查詢
    placeholders = ','.join(['%s'] * len(message_ids))
    query = f"SELECT message_id, message_analysis FROM scam_message WHERE message_id IN ({placeholders})"
    cursor.execute(query, message_ids)
    analysis_data = cursor.fetchall()
    cursor.close()
    conn.close()
    return analysis_data

def get_message_with_analysis(message_id):
    """獲取訊息內容和解析"""
    conn = get_db_connection()
    if conn is None:
        return None
    
    cursor = conn.cursor()
    query = sql.SQL("""
        SELECT message_id, message_source, message_text, is_truth_message, scam_category, message_analysis
        FROM scam_message
        WHERE message_id = {message_id}
    """).format(message_id=sql.Literal(message_id))
    cursor.execute(query)
    message_data = cursor.fetchone()
    cursor.close()
    conn.close()
    return message_data

