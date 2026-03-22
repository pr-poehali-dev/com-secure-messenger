CREATE TABLE t_p71740629_com_secure_messenger.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(32) UNIQUE NOT NULL,
  display_name VARCHAR(64) NOT NULL,
  bio VARCHAR(200),
  password_hash TEXT NOT NULL,
  public_key TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  is_online BOOLEAN DEFAULT FALSE
);

CREATE TABLE t_p71740629_com_secure_messenger.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES t_p71740629_com_secure_messenger.users(id),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE t_p71740629_com_secure_messenger.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p71740629_com_secure_messenger.chat_members (
  chat_id UUID REFERENCES t_p71740629_com_secure_messenger.chats(id),
  user_id UUID REFERENCES t_p71740629_com_secure_messenger.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(chat_id, user_id)
);

CREATE TABLE t_p71740629_com_secure_messenger.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES t_p71740629_com_secure_messenger.chats(id),
  sender_id UUID REFERENCES t_p71740629_com_secure_messenger.users(id),
  content TEXT NOT NULL,
  media_url TEXT,
  media_type VARCHAR(20),
  is_encrypted BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p71740629_com_secure_messenger.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES t_p71740629_com_secure_messenger.messages(id),
  user_id UUID REFERENCES t_p71740629_com_secure_messenger.users(id),
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

CREATE TABLE t_p71740629_com_secure_messenger.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES t_p71740629_com_secure_messenger.users(id),
  contact_id UUID REFERENCES t_p71740629_com_secure_messenger.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);

CREATE INDEX idx_msg_chat ON t_p71740629_com_secure_messenger.messages(chat_id);
CREATE INDEX idx_sess_token ON t_p71740629_com_secure_messenger.sessions(token);
CREATE INDEX idx_cm_user ON t_p71740629_com_secure_messenger.chat_members(user_id);
