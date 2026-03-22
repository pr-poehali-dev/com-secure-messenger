"""Авторизация: регистрация и вход по юзернейму/паролю"""
import os
import hashlib
import secrets
import psycopg

DB_URL = os.environ["DATABASE_URL"]
SCHEMA = "t_p71740629_com_secure_messenger"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg.connect(DB_URL, autocommit=True)


def q(val: str) -> str:
    return "'" + str(val).replace("'", "''") + "'"


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    raw = event.get("body") or "{}"
    body = raw if isinstance(raw, dict) else __import__("json").loads(raw)
    action = body.get("action")
    username = (body.get("username") or "").strip().lower()
    password = body.get("password") or ""
    display_name = (body.get("display_name") or "").strip()

    if not username or not password:
        return {"statusCode": 400, "headers": CORS, "body": {"error": "Заполни все поля"}}

    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        if not display_name:
            cur.close(); conn.close()
            return {"statusCode": 400, "headers": CORS, "body": {"error": "Введи имя"}}
        if len(username) < 3:
            cur.close(); conn.close()
            return {"statusCode": 400, "headers": CORS, "body": {"error": "Юзернейм слишком короткий"}}

        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username = {q(username)}")
        if cur.fetchone():
            cur.close(); conn.close()
            return {"statusCode": 409, "headers": CORS, "body": {"error": "Юзернейм уже занят"}}

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (username, display_name, password_hash) VALUES ({q(username)}, {q(display_name)}, {q(pw_hash)}) RETURNING id"
        )
        user_id = str(cur.fetchone()[0])

    elif action == "login":
        pw_hash = hash_password(password)
        cur.execute(
            f"SELECT id, display_name FROM {SCHEMA}.users WHERE username = {q(username)} AND password_hash = {q(pw_hash)}"
        )
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {"statusCode": 401, "headers": CORS, "body": {"error": "Неверный логин или пароль"}}
        user_id, display_name = str(row[0]), row[1]
        cur.execute(f"UPDATE {SCHEMA}.users SET is_online = TRUE, last_seen = NOW() WHERE id = {q(user_id)}")
    else:
        cur.close(); conn.close()
        return {"statusCode": 400, "headers": CORS, "body": {"error": "Неизвестное действие"}}

    token = secrets.token_hex(32)
    cur.execute(
        f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES ({q(user_id)}, {q(token)})"
    )
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": {
            "token": token,
            "user_id": user_id,
            "username": username,
            "display_name": display_name,
        }
    }