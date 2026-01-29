from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from ..schemas.prompt import (
    GenerateRequest,
    GenerateResponse,
    ProviderInfo,
    ModelInfo,
    ProviderEnum,
    TestApiRequest,
    TestApiResponse,
    PROVIDER_LABELS,
    PROVIDER_MODELS,
)
from ..services.ai_service import generate_prompts, test_api_key
from ..models.prompt import PromptRequest, GeneratedPrompt

router = APIRouter(prefix="/api", tags=["generate"])


@router.get("/providers", response_model=list[ProviderInfo])
async def list_providers():
    """
    Get list of all AI providers with their available models.

    Returns provider info including:
    - value: provider ID for API calls
    - label: human-readable name
    - models: list of available models
    """
    return [
        ProviderInfo(
            value=provider.value,
            label=PROVIDER_LABELS[provider],
            models=[ModelInfo(**m) for m in PROVIDER_MODELS.get(provider, [])],
        )
        for provider in ProviderEnum
    ]


@router.post("/test-api", response_model=TestApiResponse)
async def test_api(request: TestApiRequest):
    """
    Test if an API key is valid for the specified provider.

    Use this to verify API keys before generating prompts.
    """
    result = await test_api_key(request.provider, request.api_key)
    return TestApiResponse(**result)


@router.post("/generate", response_model=GenerateResponse)
async def generate(
    request: GenerateRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Generate prompts for a business role using AI.

    **For N8N / API Integration:**

    ```json
    POST /api/generate
    {
        "business": "Автосервис в Москве, 5 сотрудников",
        "role": "Менеджер",
        "provider": "openrouter",
        "api_key": "sk-or-v1-xxx",
        "model": "anthropic/claude-3.5-sonnet"
    }
    ```

    **Providers:** openai, anthropic, openrouter, xai, zai

    **Returns:** List of 5 AI-generated prompts for the specified role.
    """
    try:
        # Generate prompts using selected provider
        prompts, model_used = await generate_prompts(
            provider=request.provider,
            api_key=request.api_key,
            model=request.model,
            business=request.business,
            role=request.role,
            system_prompt=request.system_prompt,
        )

        # Save request to database
        db_request = PromptRequest(
            business_description=request.business,
            role=request.role,
        )
        session.add(db_request)
        await session.flush()

        # Save generated prompts
        for prompt_content in prompts:
            db_prompt = GeneratedPrompt(
                request_id=db_request.id,
                content=prompt_content,
            )
            session.add(db_prompt)

        await session.commit()

        return GenerateResponse(
            prompts=prompts,
            role=request.role,
            business=request.business,
            provider=PROVIDER_LABELS[request.provider],
            model=model_used,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка генерации: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
