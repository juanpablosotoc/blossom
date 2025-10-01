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
    name = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    profile_image = relationship(
        "ProfileImage",
        back_populates="user",
        uselist=False,           # one-to-one
        cascade="save-update, merge",  # do not auto-delete; DB has ON DELETE RESTRICT
        passive_deletes=True,
    )
    threads = relationship(
        "Thread",
        back_populates="user",
        cascade="all, delete-orphan",  # DB has ON DELETE CASCADE on threads.user_id
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} name={self.name!r}>"


# -----------------------
# profile_images (1:1 with users, PK = user_id)
# -----------------------
class ProfileImage(Base):
    __tablename__ = "profile_images"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), primary_key=True)
    thumbnail_s3_name = Column(String(512), nullable=False)
    normal_s3_name = Column(String(512), nullable=False)

    # Relationships
    user = relationship("User", back_populates="profile_image")

    def __repr__(self) -> str:
        return f"<ProfileImage user_id={self.user_id}>"


# -----------------------
# threads
# -----------------------
class Thread(Base):
    __tablename__ = "threads"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100))
    ai_name = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="threads")
    messages = relationship(
        "Message",
        back_populates="thread",
        cascade="all, delete-orphan",  # DB has ON DELETE CASCADE on messages.thread_id
        passive_deletes=True,
    )

    # Indexes to mirror KEYs in DDL
    __table_args__ = (
        Index("idx_threads_user", "user_id"),
        Index("idx_threads_created", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Thread id={self.id} user_id={self.user_id} ai_name={self.ai_name!r}>"


# -----------------------
# messages
# -----------------------
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    thread_id = Column(Integer, ForeignKey("threads.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    sender = Column(SAEnum("user", "ai", name="sender_enum"), nullable=False)

    # Relationships
    thread = relationship("Thread", back_populates="messages")
    assets = relationship(
        "Asset",
        back_populates="message",
        cascade="save-update, merge",  # DB has ON DELETE RESTRICT -> do NOT cascade delete
        passive_deletes=True,
    )

    __table_args__ = (
        Index("idx_messages_thread_created", "thread_id", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Message id={self.id} thread_id={self.thread_id} sender={self.sender}>"


# -----------------------
# assets
# -----------------------
class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, ForeignKey("messages.id", ondelete="RESTRICT"), nullable=False)
    s3_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    size = Column(Integer, nullable=False)  # UNSIGNED in MySQL; use validation in app if needed

    # Relationships
    message = relationship("Message", back_populates="assets")

    __table_args__ = (
        Index("idx_assets_message", "message_id"),
        Index("idx_assets_created", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Asset id={self.id} message_id={self.message_id} s3_name={self.s3_name!r}>"