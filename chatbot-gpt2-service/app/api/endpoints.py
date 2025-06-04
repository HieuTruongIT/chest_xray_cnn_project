from fastapi import APIRouter, HTTPException
from app.schemas.request import ChatRequest, ChatResponse
from app.models.gpt2_model import get_model_and_tokenizer, generate_response
from app.core.config import settings

router = APIRouter(prefix="/api/v1/chatbot/message/chat")

model, tokenizer = get_model_and_tokenizer(settings.MODEL_PATH)

@router.post("/generate", response_model=ChatResponse)
def generate_chat_response(request: ChatRequest):
    prompt = f"User: {request.message}\nAssistant:"
    try:
        response = generate_response(model, tokenizer, prompt, max_length=settings.MAX_LENGTH)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
