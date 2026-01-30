from pydantic import BaseModel, Field
from enum import Enum


class ProviderEnum(str, Enum):
    """Available AI providers."""
    openai = "openai"
    anthropic = "anthropic"
    google = "google"
    openrouter = "openrouter"
    groq = "groq"
    deepseek = "deepseek"
    mistral = "mistral"
    cohere = "cohere"
    perplexity = "perplexity"
    together = "together"


PROVIDER_LABELS = {
    ProviderEnum.openai: "OpenAI",
    ProviderEnum.anthropic: "Anthropic",
    ProviderEnum.google: "Google AI (Gemini)",
    ProviderEnum.openrouter: "OpenRouter",
    ProviderEnum.groq: "Groq",
    ProviderEnum.deepseek: "DeepSeek",
    ProviderEnum.mistral: "Mistral AI",
    ProviderEnum.cohere: "Cohere",
    ProviderEnum.perplexity: "Perplexity",
    ProviderEnum.together: "Together AI",
}


# Available models for each provider
PROVIDER_MODELS = {
    ProviderEnum.openai: [
        # GPT-5 series (latest)
        {"id": "gpt-5", "name": "GPT-5"},
        {"id": "gpt-5-turbo", "name": "GPT-5 Turbo"},
        {"id": "gpt-5-mini", "name": "GPT-5 Mini"},
        {"id": "gpt-5.2", "name": "GPT-5.2"},
        {"id": "gpt-5.1", "name": "GPT-5.1"},
        # GPT-4 series
        {"id": "gpt-4o", "name": "GPT-4o"},
        {"id": "gpt-4o-mini", "name": "GPT-4o Mini"},
        {"id": "gpt-4-turbo", "name": "GPT-4 Turbo"},
        {"id": "gpt-4-turbo-preview", "name": "GPT-4 Turbo Preview"},
        {"id": "gpt-4", "name": "GPT-4"},
        {"id": "gpt-4-32k", "name": "GPT-4 32K"},
        # GPT-3.5 series
        {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo"},
        {"id": "gpt-3.5-turbo-16k", "name": "GPT-3.5 Turbo 16K"},
        # o1 reasoning models
        {"id": "o1", "name": "o1"},
        {"id": "o1-preview", "name": "o1 Preview"},
        {"id": "o1-mini", "name": "o1 Mini"},
        {"id": "o3-mini", "name": "o3 Mini"},
    ],
    ProviderEnum.anthropic: [
        # Claude 4 series (latest)
        {"id": "claude-opus-4-20250514", "name": "Claude Opus 4"},
        {"id": "claude-sonnet-4-20250514", "name": "Claude Sonnet 4"},
        # Claude 3.5 series
        {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet v2"},
        {"id": "claude-3-5-sonnet-20240620", "name": "Claude 3.5 Sonnet"},
        {"id": "claude-3-5-haiku-20241022", "name": "Claude 3.5 Haiku"},
        # Claude 3 series
        {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus"},
        {"id": "claude-3-sonnet-20240229", "name": "Claude 3 Sonnet"},
        {"id": "claude-3-haiku-20240307", "name": "Claude 3 Haiku"},
    ],
    ProviderEnum.openrouter: [
        # Free models (актуальные на январь 2026)
        {"id": "qwen/qwen3-coder:free", "name": "Qwen3 Coder (FREE)"},
        {"id": "qwen/qwen3-next-80b-a3b-instruct:free", "name": "Qwen3 80B (FREE)"},
        {"id": "openai/gpt-oss-120b:free", "name": "GPT-OSS 120B (FREE)"},
        {"id": "openai/gpt-oss-20b:free", "name": "GPT-OSS 20B (FREE)"},
        {"id": "nvidia/nemotron-nano-9b-v2:free", "name": "Nemotron Nano 9B (FREE)"},
        {"id": "nvidia/nemotron-3-nano-30b-a3b:free", "name": "Nemotron 30B (FREE)"},
        {"id": "z-ai/glm-4.5-air:free", "name": "GLM 4.5 Air (FREE)"},
        {"id": "upstage/solar-pro-3:free", "name": "Solar Pro 3 (FREE)"},
        {"id": "liquid/lfm-2.5-1.2b-instruct:free", "name": "LFM 1.2B (FREE)"},
        {"id": "arcee-ai/trinity-large-preview:free", "name": "Trinity Large (FREE)"},
        # Paid - OpenAI via OpenRouter
        {"id": "openai/gpt-5", "name": "GPT-5"},
        {"id": "openai/gpt-4o", "name": "GPT-4o"},
        {"id": "openai/gpt-4o-mini", "name": "GPT-4o Mini"},
        {"id": "openai/o1", "name": "o1"},
        {"id": "openai/o1-mini", "name": "o1 Mini"},
        # Paid - Anthropic via OpenRouter
        {"id": "anthropic/claude-opus-4", "name": "Claude Opus 4"},
        {"id": "anthropic/claude-sonnet-4", "name": "Claude Sonnet 4"},
        {"id": "anthropic/claude-3.5-sonnet", "name": "Claude 3.5 Sonnet"},
        {"id": "anthropic/claude-3-haiku", "name": "Claude 3 Haiku"},
        # Paid - Google via OpenRouter
        {"id": "google/gemini-2.0-flash", "name": "Gemini 2.0 Flash"},
        {"id": "google/gemini-pro-1.5", "name": "Gemini Pro 1.5"},
        {"id": "google/gemini-flash-1.5", "name": "Gemini Flash 1.5"},
        # Paid - Meta via OpenRouter
        {"id": "meta-llama/llama-3.3-70b-instruct", "name": "Llama 3.3 70B"},
        {"id": "meta-llama/llama-3.1-405b-instruct", "name": "Llama 3.1 405B"},
        # Paid - Other
        {"id": "deepseek/deepseek-chat", "name": "DeepSeek Chat"},
        {"id": "deepseek/deepseek-r1", "name": "DeepSeek R1"},
        {"id": "mistralai/mistral-large", "name": "Mistral Large"},
        {"id": "qwen/qwen-2.5-72b-instruct", "name": "Qwen 2.5 72B"},
    ],
    ProviderEnum.google: [
        # Gemini 2.0 series (latest - January 2026)
        {"id": "gemini-2.0-flash-exp", "name": "Gemini 2.0 Flash (Experimental)"},
        {"id": "gemini-2.0-flash-thinking-exp", "name": "Gemini 2.0 Flash Thinking"},
        # Gemini 1.5 series
        {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro"},
        {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash"},
        {"id": "gemini-1.5-flash-8b", "name": "Gemini 1.5 Flash 8B"},
        # Gemini Pro
        {"id": "gemini-pro", "name": "Gemini Pro"},
    ],
    ProviderEnum.groq: [
        # Meta models on Groq (fastest inference)
        {"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B"},
        {"id": "llama-3.1-70b-versatile", "name": "Llama 3.1 70B"},
        {"id": "llama-3.1-8b-instant", "name": "Llama 3.1 8B (Instant)"},
        {"id": "llama-guard-3-8b", "name": "Llama Guard 3 8B"},
        # Mixtral on Groq
        {"id": "mixtral-8x7b-32768", "name": "Mixtral 8x7B"},
        # Gemma on Groq
        {"id": "gemma2-9b-it", "name": "Gemma 2 9B"},
        {"id": "gemma-7b-it", "name": "Gemma 7B"},
    ],
    ProviderEnum.deepseek: [
        # DeepSeek V3 (January 2026 - latest)
        {"id": "deepseek-chat", "name": "DeepSeek Chat (V3)"},
        {"id": "deepseek-reasoner", "name": "DeepSeek Reasoner (R1)"},
        # DeepSeek V2.5
        {"id": "deepseek-coder", "name": "DeepSeek Coder"},
    ],
    ProviderEnum.mistral: [
        # Mistral Large (latest)
        {"id": "mistral-large-latest", "name": "Mistral Large (Latest)"},
        {"id": "mistral-large-2411", "name": "Mistral Large 2411"},
        # Mistral Medium/Small
        {"id": "mistral-medium-latest", "name": "Mistral Medium"},
        {"id": "mistral-small-latest", "name": "Mistral Small"},
        # Open models
        {"id": "open-mistral-nemo", "name": "Mistral Nemo (12B)"},
        {"id": "open-mixtral-8x7b", "name": "Mixtral 8x7B"},
        {"id": "open-mixtral-8x22b", "name": "Mixtral 8x22B"},
    ],
    ProviderEnum.cohere: [
        # Command R series (latest)
        {"id": "command-r-plus", "name": "Command R+"},
        {"id": "command-r", "name": "Command R"},
        # Command series
        {"id": "command", "name": "Command"},
        {"id": "command-light", "name": "Command Light"},
    ],
    ProviderEnum.perplexity: [
        # Perplexity models (with search)
        {"id": "llama-3.1-sonar-large-128k-online", "name": "Sonar Large 128K (Online)"},
        {"id": "llama-3.1-sonar-small-128k-online", "name": "Sonar Small 128K (Online)"},
        {"id": "llama-3.1-sonar-large-128k-chat", "name": "Sonar Large 128K (Chat)"},
        {"id": "llama-3.1-sonar-small-128k-chat", "name": "Sonar Small 128K (Chat)"},
    ],
    ProviderEnum.together: [
        # Meta Llama models
        {"id": "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", "name": "Llama 3.1 405B Turbo"},
        {"id": "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", "name": "Llama 3.1 70B Turbo"},
        {"id": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", "name": "Llama 3.1 8B Turbo"},
        # Qwen models
        {"id": "Qwen/Qwen2.5-72B-Instruct-Turbo", "name": "Qwen 2.5 72B Turbo"},
        {"id": "Qwen/Qwen2.5-7B-Instruct-Turbo", "name": "Qwen 2.5 7B Turbo"},
        # Mixtral
        {"id": "mistralai/Mixtral-8x7B-Instruct-v0.1", "name": "Mixtral 8x7B"},
        {"id": "mistralai/Mixtral-8x22B-Instruct-v0.1", "name": "Mixtral 8x22B"},
    ],
}


class ModelInfo(BaseModel):
    """Model information."""
    id: str
    name: str


class ProviderInfo(BaseModel):
    """Provider information for frontend."""
    value: str
    label: str
    models: list[ModelInfo] = []


class TestApiRequest(BaseModel):
    """Request to test an API key."""
    provider: ProviderEnum
    api_key: str = Field(..., min_length=1)


class TestApiResponse(BaseModel):
    """Response from API key test."""
    success: bool
    message: str


class GenerateRequest(BaseModel):
    """Request schema for prompt generation."""

    business: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Business description",
        examples=["Автосервис в Москве, 5 сотрудников, специализация — ремонт японских автомобилей"]
    )
    role: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Business role for prompt generation (free text input)",
        examples=["Менеджер", "HR-специалист", "Заместитель директора", "Директор"]
    )
    provider: ProviderEnum = Field(
        ...,
        description="AI provider to use for generation"
    )
    api_key: str = Field(
        ...,
        min_length=1,
        description="API key for the provider"
    )
    model: str = Field(
        default="",
        description="Model ID to use (if empty, uses default for provider)"
    )
    system_prompt: str = Field(
        default="",
        description="Custom system prompt (if empty, uses default)"
    )


class GenerateResponse(BaseModel):
    """Response schema for generated prompts."""

    prompts: list[str] = Field(
        ...,
        description="List of generated prompts"
    )
    role: str = Field(
        ...,
        description="Role name"
    )
    business: str = Field(
        ...,
        description="Original business description"
    )
    provider: str = Field(
        ...,
        description="AI provider used"
    )
    model: str = Field(
        ...,
        description="Model used"
    )
