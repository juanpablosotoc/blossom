from sqlalchemy import (
    Integer, Boolean, DateTime, ForeignKey, Text, Column, String, Enum as SAEnum,
    Index
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


# -----------------------
# users
# -----------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_picture_url = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # Relationships
    threads = relationship(
        "Thread",
        back_populates="user",
        cascade="save-update, merge",   # DB has ON DELETE RESTRICT on threads.user_id
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} name={self.name!r}>"


# -----------------------
# threads  (PK = openai_thread_id)
# -----------------------
class Thread(Base):
    __tablename__ = "threads"

    openai_thread_id = Column(String(255), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="threads")
    messages = relationship(
        "Message",
        back_populates="thread",
        cascade="save-update, merge",   # DB has ON DELETE RESTRICT on messages.thread_id
        passive_deletes=True,
    )

    # Helpful indexes (FKs & created_at)
    __table_args__ = (
        Index("idx_threads_user", "user_id"),
        Index("idx_threads_created", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Thread openai_thread_id={self.openai_thread_id!r} user_id={self.user_id}>"


# -----------------------
# messages
# -----------------------
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(255), nullable=False)  # 'user' | 'cherry-unprocessed-info' | 'cherry-unprocessed-gutenberg' | 'cherry-processed-gutenberg'
    content = Column(Text, nullable=True)
    thread_id = Column(String(255), ForeignKey("threads.openai_thread_id", ondelete="RESTRICT"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    thread = relationship("Thread", back_populates="messages")
    file_attachments = relationship(
        "FileAttachment",
        back_populates="message",
        cascade="save-update, merge",   # DB has ON DELETE RESTRICT on file_attachments.message_id
        passive_deletes=True,
    )

    __table_args__ = (
        Index("idx_messages_thread", "thread_id"),
        Index("idx_messages_created", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Message id={self.id} thread_id={self.thread_id!r} type={self.type!r}>"


# -----------------------
# file_attachments
# -----------------------
class FileAttachment(Base):
    __tablename__ = "file_attachments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, ForeignKey("messages.id", ondelete="RESTRICT"), nullable=False)
    file_url = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    message = relationship("Message", back_populates="file_attachments")

    __table_args__ = (
        Index("idx_file_attachments_message", "message_id"),
        Index("idx_file_attachments_created", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<FileAttachment id={self.id} message_id={self.message_id} file_url={self.file_url!r}>"