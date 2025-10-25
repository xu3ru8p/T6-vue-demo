from db_service import get_scam_message, get_scam_message_analysis, get_scam_categories, get_scam_message_sources, get_db_connection
import random
import time
import uuid

class GameService:
    def __init__(self):
        self.game_sessions = {}  # 存儲遊戲會話

    def get_message_by_criteria(self):
        # 獲取所有可用的類別和來源
        categories = get_scam_categories()
        sources = get_scam_message_sources()

        if not categories or not sources:
            return []

        # 嘗試多個類別和來源組合，直到找到足夠的訊息
        max_combinations = 10
        attempts = 0
        
        while attempts < max_combinations:
            # 隨機選擇一個類別和來源
            selected_category = random.choice(categories)
            selected_source = random.choice(sources)
            
            messages = []
            used_ids = set()

            # 獲取2個詐騙訊息
            scam_count = 0
            max_message_attempts = 20
            message_attempts = 0

            while scam_count < 2 and message_attempts < max_message_attempts:
                scam_message = get_scam_message(selected_category, selected_source, False)
                if scam_message and scam_message[0] not in used_ids:
                    messages.append(scam_message)
                    used_ids.add(scam_message[0])
                    scam_count += 1
                message_attempts += 1

            # 獲取1個真實訊息
            real_count = 0
            message_attempts = 0

            while real_count < 1 and message_attempts < max_message_attempts:
                real_message = get_scam_message(selected_category, selected_source, True)
                if real_message and real_message[0] not in used_ids:
                    messages.append(real_message)
                    used_ids.add(real_message[0])
                    real_count += 1
                message_attempts += 1

            # 檢查是否獲得了正確的組合
            if len(messages) == 3:
                scam_messages = [msg for msg in messages if not msg[3]]  # is_truth_message = False
                real_messages = [msg for msg in messages if msg[3]]      # is_truth_message = True
                
                if len(scam_messages) == 2 and len(real_messages) == 1:
                    # 隨機打亂順序
                    random.shuffle(messages)
                    return messages
            
            attempts += 1
        
        # 如果所有組合都失敗，返回空列表
        print(f"警告：無法找到足夠的訊息組合，嘗試了 {max_combinations} 次")
        return []

    def get_round_question(self, user_id, game_mode="normal"):
        """獲取五個關卡的題目，確保不重複"""
        session_id = f"game_{user_id}_{int(time.time())}"
        
        # 生成五個關卡的題目
        all_rounds = []
        used_message_ids = set()
        
        for round_num in range(1, 6):  # 5關
            max_attempts = 20
            attempts = 0
            round_questions = []
            
            while len(round_questions) < 3 and attempts < max_attempts:
                # 調用 get_message_by_criteria 獲取題目
                messages = self.get_message_by_criteria()
                
                # 過濾已使用的訊息
                new_messages = [msg for msg in messages if msg[0] not in used_message_ids]
                
                if len(new_messages) >= 3:
                    round_questions = new_messages[:3]
                    break
                elif len(new_messages) > 0:
                    # 只添加需要的數量，確保不超過3個
                    needed = 3 - len(round_questions)
                    round_questions.extend(new_messages[:needed])
                
                attempts += 1
            
            # 記錄已使用的訊息ID
            for msg in round_questions:
                used_message_ids.add(msg[0])
            
            all_rounds.append({
                'round_number': round_num,
                'questions': round_questions
            })
        
        # 創建遊戲會話
        self.game_sessions[session_id] = {
            'user_id': user_id,
            'game_mode': game_mode,
            'rounds': all_rounds,
            'current_round': 1,
            'score': 0,
            'start_time': time.time(),
            'used_message_ids': used_message_ids
        }
        
        return {
            'session_id': session_id,
            'total_rounds': 5,
            'game_mode': game_mode,
            'rounds': all_rounds,
            'status': 'ready'
        }
    
    def get_round_by_number(self, session_id, round_number):
        """根據回合號獲取特定關卡的題目"""
        if session_id not in self.game_sessions:
            return None
        
        session = self.game_sessions[session_id]
        
        if round_number < 1 or round_number > len(session['rounds']):
            return None
        
        return session['rounds'][round_number - 1]

    def create_game_session(self, user_id, username, game_mode="normal"):
        """創建遊戲會話並存儲到資料庫"""
        session_id = f"game_{user_id}_{int(time.time())}"
        
        conn = get_db_connection()
        if conn is None:
            return None
            
        try:
            cursor = conn.cursor()
            
            # 插入遊戲會話
            cursor.execute("""
                INSERT INTO game_sessions (user_id, session_id, username, game_mode, status)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, session_id, username, game_mode, 'active'))
            
            # 插入初始分數記錄
            cursor.execute("""
                INSERT INTO game_scores (session_id, total_score, correct_score, speed_score, correct_answers, wrong_answers, accuracy_rate)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (session_id, 0, 0, 0, 0, 0, 0.0))
            
            conn.commit()
            return session_id
            
        except Exception as e:
            print(f"創建遊戲會話失敗: {e}")
            conn.rollback()
            return None
        finally:
            cursor.close()
            conn.close()

    def record_round_result(self, session_id, round_number, user_choice_id, correct_answer_id, is_correct, response_time):
        """記錄單回合結果"""
        conn = get_db_connection()
        if conn is None:
            return False
            
        try:
            cursor = conn.cursor()
            
            # 計算基礎分數和速度獎勵
            base_score = 10 if is_correct else 0
            speed_bonus = self._calculate_speed_bonus(response_time, is_correct)
            total_round_score = base_score + speed_bonus
            
            # 插入回合記錄
            cursor.execute("""
                INSERT INTO game_rounds (session_id, round_number, user_choice_id, correct_answer_id, is_correct, response_time, base_score, speed_bonus, total_round_score)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (session_id, round_number, user_choice_id, correct_answer_id, is_correct, response_time, base_score, speed_bonus, total_round_score))
            
            conn.commit()
            return True
            
        except Exception as e:
            print(f"記錄回合結果失敗: {e}")
            conn.rollback()
            return False
        finally:
            cursor.close()
            conn.close()

    def _calculate_speed_bonus(self, response_time, is_correct):
        """計算速度獎勵分數 - 只有答對才有速度獎勵"""
        if not is_correct:
            return 0  # 答錯的話速度獎勵為0
        
        if response_time <= 1000:  # 1秒內
            return 15
        elif response_time <= 2000:  # 2秒內
            return 10
        elif response_time <= 3000:  # 3秒內
            return 5
        else:
            return 0

    def update_game_score(self, session_id):
        """更新遊戲總分數"""
        conn = get_db_connection()
        if conn is None:
            return False
            
        try:
            cursor = conn.cursor()
            
            # 計算總分數
            cursor.execute("""
                SELECT 
                    SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
                    SUM(CASE WHEN is_correct THEN 0 ELSE 1 END) as wrong_answers,
                    SUM(base_score) as correct_score,
                    SUM(speed_bonus) as speed_score,
                    SUM(total_round_score) as total_score
                FROM game_rounds 
                WHERE session_id = %s
            """, (session_id,))
            
            result = cursor.fetchone()
            if result:
                correct_answers, wrong_answers, correct_score, speed_score, total_score = result
                
                # 計算準確率
                total_questions = correct_answers + wrong_answers
                accuracy_rate = correct_answers / total_questions if total_questions > 0 else 0.0
                
                # 更新分數表
                cursor.execute("""
                    UPDATE game_scores 
                    SET total_score = %s, correct_score = %s, speed_score = %s, 
                        correct_answers = %s, wrong_answers = %s, accuracy_rate = %s
                    WHERE session_id = %s
                """, (total_score, correct_score, speed_score, correct_answers, wrong_answers, accuracy_rate, session_id))
                
                conn.commit()
                return True
            
        except Exception as e:
            print(f"更新遊戲分數失敗: {e}")
            conn.rollback()
            return False
        finally:
            cursor.close()
            conn.close()

    def complete_game_session(self, session_id):
        """完成遊戲會話"""
        conn = get_db_connection()
        if conn is None:
            return False
            
        try:
            cursor = conn.cursor()
            
            # 更新會話狀態為完成
            cursor.execute("""
                UPDATE game_sessions 
                SET status = 'completed' 
                WHERE session_id = %s
            """, (session_id,))
            
            conn.commit()
            return True
            
        except Exception as e:
            print(f"完成遊戲會話失敗: {e}")
            conn.rollback()
            return False
        finally:
            cursor.close()
            conn.close()

    def get_leaderboard(self, limit=100):
        """獲取排行榜數據"""
        conn = get_db_connection()
        if conn is None:
            return []
            
        try:
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT 
                    gs.username,
                    gsc.total_score,
                    gsc.correct_answers,
                    gsc.wrong_answers,
                    gsc.accuracy_rate,
                    gsc.speed_score,
                    gsc.correct_score
                FROM game_sessions gs
                JOIN game_scores gsc ON gs.session_id = gsc.session_id
                WHERE gs.status = 'completed'
                ORDER BY gsc.total_score DESC
                LIMIT %s
            """, (limit,))
            
            leaderboard = cursor.fetchall()
            return leaderboard
            
        except Exception as e:
            print(f"獲取排行榜失敗: {e}")
            return []
        finally:
            cursor.close()
            conn.close()

    def get_user_game_history(self, user_id, limit=10):
        """獲取用戶遊戲歷史"""
        conn = get_db_connection()
        if conn is None:
            return []
            
        try:
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT 
                    gs.session_id,
                    gs.game_mode,
                    gsc.total_score,
                    gsc.correct_answers,
                    gsc.wrong_answers,
                    gsc.accuracy_rate,
                    gsc.speed_score
                FROM game_sessions gs
                JOIN game_scores gsc ON gs.session_id = gsc.session_id
                WHERE gs.user_id = %s AND gs.status = 'completed'
                ORDER BY gsc.total_score DESC
                LIMIT %s
            """, (user_id, limit))
            
            history = cursor.fetchall()
            return history
            
        except Exception as e:
            print(f"獲取用戶遊戲歷史失敗: {e}")
            return []
        finally:
            cursor.close()
            conn.close()

    def get_game_session_details(self, session_id):
        """獲取遊戲會話詳細信息"""
        conn = get_db_connection()
        if conn is None:
            return None
            
        try:
            cursor = conn.cursor()
            
            # 獲取會話基本信息
            cursor.execute("""
                SELECT gs.*, gsc.*
                FROM game_sessions gs
                JOIN game_scores gsc ON gs.session_id = gsc.session_id
                WHERE gs.session_id = %s
            """, (session_id,))
            
            session_info = cursor.fetchone()
            if not session_info:
                return None
            
            # 獲取回合詳情
            cursor.execute("""
                SELECT round_number, user_choice_id, correct_answer_id, is_correct, 
                       response_time, base_score, speed_bonus, total_round_score
                FROM game_rounds
                WHERE session_id = %s
                ORDER BY round_number
            """, (session_id,))
            
            rounds = cursor.fetchall()
            
            return {
                'session_info': session_info,
                'rounds': rounds
            }
            
        except Exception as e:
            print(f"獲取遊戲會話詳情失敗: {e}")
            return None
        finally:
            cursor.close()
            conn.close()

    