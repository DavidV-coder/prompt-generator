"""
Multi-provider AI service for prompt generation.
Supports: OpenAI, Anthropic (Claude), OpenRouter, xAI (Grok), ZAI
"""

import httpx
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic

from ..schemas.prompt import ProviderEnum, PROVIDER_MODELS


# Provider base URLs
PROVIDER_URLS = {
    ProviderEnum.openrouter: "https://openrouter.ai/api/v1",
    ProviderEnum.xai: "https://api.x.ai/v1",
    ProviderEnum.zai: "https://api.zai.chat/v1",
}

# Default models for each provider
DEFAULT_MODELS = {
    ProviderEnum.openai: "gpt-5",
    ProviderEnum.anthropic: "claude-opus-4-20250514",
    ProviderEnum.openrouter: "qwen/qwen3-coder:free",
    ProviderEnum.xai: "grok-3",
    ProviderEnum.zai: "zai-2",
}


DEFAULT_SYSTEM_PROMPT = """Вы — эксперт по созданию промптов для AI-ассистентов.

Описание бизнеса: {business}
Роль сотрудника: {role}

Ваша задача — создать 5 полезных промптов для сотрудника с указанной ролью.

Каждый промпт должен:
1. Быть конкретным и применимым к описанному бизнесу
2. Начинаться с обращения к AI (например, "Помоги мне...", "Составь...", "Проанализируй...")
3. Содержать контекст бизнеса и роли
4. Быть готовым к использованию без дополнительной модификации
5. Быть достаточно длинным и детальным (минимум 2-3 предложения)

Формат ответа — только список промптов, каждый с новой строки, без нумерации и лишнего текста."""


def get_system_prompt(role: str, business: str, custom_prompt: str = "") -> str:
    """Get system prompt with variables replaced."""
    template = custom_prompt if custom_prompt else DEFAULT_SYSTEM_PROMPT
    return template.replace("{role}", role).replace("{business}", business)


def get_user_message(business: str, role: str) -> str:
    """Simple user message - all instructions are in system prompt."""
    return "Сгенерируй промпты согласно инструкциям."


def parse_prompts(content: str) -> list[str]:
    """Parse prompts from AI response."""
    prompts = [
        line.strip()
        for line in content.split("\n")
        if line.strip() and not line.strip().startswith(("#", "-", "*", "•"))
    ]

    cleaned_prompts = []
    for prompt in prompts:
        if len(prompt) > 2 and prompt[0].isdigit() and prompt[1] in ".):":
            prompt = prompt[2:].strip()
        elif len(prompt) > 3 and prompt[:2].isdigit() and prompt[2] in ".):":
            prompt = prompt[3:].strip()
        if prompt:
            cleaned_prompts.append(prompt)

    return cleaned_prompts[:5] if cleaned_prompts else ["Не удалось сгенерировать промпты. Попробуйте ещё раз."]


async def test_api_key(provider: ProviderEnum, api_key: str) -> dict:
    """
    Test if an API key is valid for the given provider.
    Returns dict with 'success' and 'message' keys.
    """
    if not api_key:
        return {"success": False, "message": "API ключ не указан"}

    try:
        if provider == ProviderEnum.openai:
            client = AsyncOpenAI(api_key=api_key)
            await client.models.list()
            return {"success": True, "message": "API ключ OpenAI работает"}

        elif provider == ProviderEnum.anthropic:
            client = AsyncAnthropic(api_key=api_key)
            # Simple test - try to create a minimal message
            await client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=10,
                messages=[{"role": "user", "content": "Hi"}],
            )
            return {"success": True, "message": "API ключ Anthropic работает"}

        elif provider == ProviderEnum.openrouter:
            # Make a real API call to verify the key works
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{PROVIDER_URLS[provider]}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://prompt-generator.local",
                        "X-Title": "Prompt Generator",
                    },
                    json={
                        "model": "qwen/qwen3-coder:free",
                        "messages": [{"role": "user", "content": "Hi"}],
                        "max_tokens": 5,
                    },
                    timeout=30.0,
                )
                if response.status_code == 200:
                    return {"success": True, "message": "API ключ OpenRouter работает"}
                elif response.status_code == 401:
                    return {"success": False, "message": "Неверный API ключ"}
                elif response.status_code == 402:
                    return {"success": False, "message": "Недостаточно средств на счёте"}
                elif response.status_code == 429:
                    return {"success": False, "message": "Превышен лимит запросов, попробуйте позже"}
                else:
                    error_text = response.text[:200] if response.text else ""
                    return {"success": False, "message": f"Ошибка {response.status_code}: {error_text}"}

        elif provider == ProviderEnum.xai:
            # Make a real API call to verify the key works
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{PROVIDER_URLS[provider]}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "grok-beta",
                        "messages": [{"role": "user", "content": "Hi"}],
                        "max_tokens": 5,
                    },
                    timeout=30.0,
                )
                if response.status_code == 200:
                    return {"success": True, "message": "API ключ xAI работает"}
                elif response.status_code == 401:
                    return {"success": False, "message": "Неверный API ключ"}
                elif response.status_code == 402:
                    return {"success": False, "message": "Недостаточно средств на счёте"}
                elif response.status_code == 429:
                    return {"success": False, "message": "Превышен лимит запросов"}
                else:
                    error_text = response.text[:200] if response.text else ""
                    return {"success": False, "message": f"Ошибка {response.status_code}: {error_text}"}

        elif provider == ProviderEnum.zai:
            # Make a real API call to verify the key works
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{PROVIDER_URLS[provider]}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "zai-1",
                        "messages": [{"role": "user", "content": "Hi"}],
                        "max_tokens": 5,
                    },
                    timeout=30.0,
                )
                if response.status_code == 200:
                    return {"success": True, "message": "API ключ ZAI работает"}
                elif response.status_code == 401:
                    return {"success": False, "message": "Неверный API ключ"}
                elif response.status_code == 402:
                    return {"success": False, "message": "Недостаточно средств на счёте"}
                elif response.status_code == 429:
                    return {"success": False, "message": "Превышен лимит запросов"}
                else:
                    error_text = response.text[:200] if response.text else ""
                    return {"success": False, "message": f"Ошибка {response.status_code}: {error_text}"}

        return {"success": False, "message": "Неизвестный провайдер"}

    except Exception as e:
        return {"success": False, "message": f"Ошибка: {str(e)}"}


async def generate_with_openai(api_key: str, model: str, business: str, role: str, custom_prompt: str = "") -> str:
    """Generate using OpenAI API."""
    client = AsyncOpenAI(api_key=api_key)
    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": get_system_prompt(role, business, custom_prompt)},
            {"role": "user", "content": get_user_message(business, role)},
        ],
        temperature=0.7,
        max_tokens=2000,
    )
    return response.choices[0].message.content or ""


async def generate_with_anthropic(api_key: str, model: str, business: str, role: str, custom_prompt: str = "") -> str:
    """Generate using Anthropic API."""
    client = AsyncAnthropic(api_key=api_key)
    response = await client.messages.create(
        model=model,
        max_tokens=2000,
        system=get_system_prompt(role, business, custom_prompt),
        messages=[{"role": "user", "content": get_user_message(business, role)}],
    )
    return response.content[0].text if response.content else ""


async def generate_with_http(
    base_url: str, api_key: str, model: str, business: str, role: str, provider: ProviderEnum, custom_prompt: str = ""
) -> str:
    """Generate using HTTP API (OpenRouter, xAI, ZAI)."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    # OpenRouter requires additional headers for rate limiting
    if provider == ProviderEnum.openrouter:
        headers["HTTP-Referer"] = "https://prompt-generator.local"
        headers["X-Title"] = "Prompt Generator"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": get_system_prompt(role, business, custom_prompt)},
                    {"role": "user", "content": get_user_message(business, role)},
                ],
                "max_tokens": 2000,
                "temperature": 0.7,
            },
            timeout=60.0,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def generate_prompts(
    provider: ProviderEnum,
    api_key: str,
    model: str,
    business: str,
    role: str,
    system_prompt: str = "",
) -> tuple[list[str], str]:
    """
    Generate prompts using the specified AI provider.

    Args:
        provider: AI provider to use
        api_key: API key for the provider
        model: Model ID to use (if empty, uses default)
        business: Description of the business
        role: Business role (free text)
        system_prompt: Custom system prompt (if empty, uses default)

    Returns:
        Tuple of (list of prompts, model used)
    """
    if not api_key:
        raise ValueError("API ключ не указан")

    # Use default model if not specified
    if not model:
        model = DEFAULT_MODELS.get(provider, "")

    if provider == ProviderEnum.openai:
        content = await generate_with_openai(api_key, model, business, role, system_prompt)

    elif provider == ProviderEnum.anthropic:
        content = await generate_with_anthropic(api_key, model, business, role, system_prompt)

    elif provider in (ProviderEnum.openrouter, ProviderEnum.xai, ProviderEnum.zai):
        base_url = PROVIDER_URLS[provider]
        content = await generate_with_http(base_url, api_key, model, business, role, provider, system_prompt)

    else:
        raise ValueError(f"Неизвестный провайдер: {provider}")

    return parse_prompts(content), model


def get_models_for_provider(provider: ProviderEnum) -> list[dict]:
    """Get available models for a provider."""
    return PROVIDER_MODELS.get(provider, [])
