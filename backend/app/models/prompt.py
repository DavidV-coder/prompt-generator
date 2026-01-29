from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional


class PromptRequest(SQLModel, table=True):
    """Model for storing prompt generation requests."""

    __tablename__ = "prompt_requests"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_description: str = Field(nullable=False)
    role: str = Field(max_length=50, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to generated prompts
    generated_prompts: list["GeneratedPrompt"] = Relationship(back_populates="request")


class GeneratedPrompt(SQLModel, table=True):
    """Model for storing generated prompts."""

    __tablename__ = "generated_prompts"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    request_id: Optional[UUID] = Field(default=None, foreign_key="prompt_requests.id")
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to parent request
    request: Optional[PromptRequest] = Relationship(back_populates="generated_prompts")
