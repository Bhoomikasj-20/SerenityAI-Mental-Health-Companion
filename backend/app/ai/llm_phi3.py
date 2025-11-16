"""
Phi-3 Mini LLM Chat Engine for SerenityAI
Uses microsoft/Phi-3-mini-4k-instruct for natural, empathetic conversations
"""

from typing import Optional, Dict, List
import logging
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

logger = logging.getLogger(__name__)


def build_prompt(history: List[Dict], emotion: str, sentiment: str) -> str:
    """
    Build structured prompt for Phi-3 with emotion context and chat history
    
    Args:
        history: List of dicts with 'role' and 'content' keys
        emotion: Detected emotion (happy, sad, stress, anxiety, anger, neutral)
        sentiment: Sentiment label (positive, negative, neutral)
    
    Returns:
        Formatted prompt string
    """
    # Build conversation history text (last 10 messages to avoid context overflow)
    recent_history = history[-10:] if len(history) > 10 else history
    history_text = ""
    for msg in recent_history:
        role = msg.get('role', 'user')
        content = msg.get('content', '')
        if content.strip():  # Only add non-empty messages
            history_text += f"<|{role}|>\n{content}\n<|end|>\n"
    
    # Emotion-based guidelines
    emotion_guidelines = {
        "happy": "The user is feeling positive. Reinforce their positivity and suggest gratitude journaling to maintain this feeling.",
        "sad": "The user is experiencing sadness. Be empathetic and supportive. Suggest journaling or emotional expression activities.",
        "stress": "The user is stressed. Suggest breathing exercises and relaxation activities. Be calming and practical.",
        "anxiety": "The user is anxious. Guide them towards breathing exercises and relaxation techniques. Be reassuring.",
        "anger": "The user is angry or frustrated. Guide them towards calming or grounding exercises. Help them process their feelings.",
        "neutral": "The user's emotional state is neutral. Be warm and supportive, ready to help with whatever they need."
    }
    
    guideline = emotion_guidelines.get(emotion, emotion_guidelines["neutral"])
    
    # Build system prompt with emotion context
    system_prompt = f"""You are SerenityAI, an empathetic mental health companion for students.
Be warm, human, and supportive. Write like a caring friend, not a robot.
Never give medical advice or make diagnostic claims.
Always validate the user's feelings first before offering suggestions.

Current context:
{guideline}

Guidelines for responses:
- Keep responses concise (2-3 sentences)
- Use natural, conversational language
- Avoid generic phrases like "I understand" or "That must be difficult"
- Don't repeat what you just said
- Be specific and genuine
- Show empathy through your words, not just stating it"""
    
    # Construct full prompt
    prompt = f"""<|system|>
{system_prompt}
<|end|>

<|emotion|>
Detected emotion: {emotion}
Sentiment: {sentiment}
<|end|>

<|conversation|>
{history_text}<|assistant|>
"""
    
    return prompt


class Phi3ChatModel:
    """Phi-3 Mini LLM chat model for SerenityAI"""
    
    def __init__(self, model_name: str = "microsoft/Phi-3-mini-4k-instruct-int4", device: str = "cpu"):
        """
        Initialize Phi-3 Mini model
        
        Args:
            model_name: HuggingFace model name (use int4 for speed on CPU)
            device: Device to run on (cpu for Intel Core Ultra 5)
        """
        self.model_name = model_name
        self.device = device
        self.tokenizer = None
        self.model = None
        self._loaded = False
        
    def _ensure_loaded(self):
        """Lazy load the model and tokenizer"""
        if self._loaded:
            return
            
        try:
            logger.info(f"Loading Phi-3 model: {self.model_name}")
            
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                trust_remote_code=True
            )
            
            # Set pad token if not set
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load model with CPU device map
            try:
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_name,
                    device_map=self.device,
                    torch_dtype=torch.float32,
                    trust_remote_code=True
                )
            except Exception as e:
                logger.warning(f"Failed to load quantized model, trying standard: {e}")
                # Fallback to standard model
                self.model = AutoModelForCausalLM.from_pretrained(
                    "microsoft/Phi-3-mini-4k-instruct",
                    device_map=self.device,
                    torch_dtype=torch.float32,
                    trust_remote_code=True
                )
            
            self.model.eval()  # Set to evaluation mode
            self._loaded = True
            logger.info("Phi-3 model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load Phi-3 model: {e}")
            raise
    
    def generate_response_with_history(
        self, 
        history: List[Dict], 
        emotion: str, 
        sentiment: str,
        max_length: int = 180
    ) -> str:
        """
        Generate response using Phi-3 with full conversation history and emotion context
        
        Args:
            history: List of dicts with 'role' and 'content' keys
            emotion: Detected emotion
            sentiment: Sentiment label
            max_length: Maximum response length in tokens
            
        Returns:
            Generated response text
        """
        try:
            self._ensure_loaded()
            
            if not self.model or not self.tokenizer:
                raise RuntimeError("Model not loaded")
            
            # Build structured prompt
            prompt = build_prompt(history, emotion, sentiment)
            
            # Tokenize
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=2048
            ).to(self.device)
            
            # Generate with improved parameters for warm, human responses
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=max_length,
                    temperature=0.8,  # Slightly higher for more natural variation
                    top_p=0.95,  # Higher for more diverse responses
                    top_k=50,  # Add top_k for better quality
                    do_sample=True,
                    repetition_penalty=1.1,  # Prevent repetition
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                )
            
            # Decode response (only the newly generated tokens)
            input_length = inputs['input_ids'].shape[1]
            generated_text = self.tokenizer.decode(
                outputs[0][input_length:],
                skip_special_tokens=True
            ).strip()
            
            # Clean up response - remove any special tokens or artifacts
            if generated_text:
                # Remove <|end|> tokens if present
                generated_text = generated_text.replace("<|end|>", "").strip()
                # Remove any remaining special tokens
                generated_text = generated_text.split("<|")[0].strip()
                # Remove trailing newlines
                generated_text = generated_text.strip()
                
            return generated_text if generated_text else "I'm here to support you. How are you feeling today?"
            
        except Exception as e:
            logger.error(f"Error generating response with Phi-3: {e}")
            # Fallback response
            return "I'm here to support you. Could you tell me more about what you're experiencing?"
    
    def generate_response(self, user_message: str, max_length: int = 300) -> str:
        """
        Legacy method for backward compatibility
        Generates response without history (single turn)
        """
        history = [{"role": "user", "content": user_message}]
        return self.generate_response_with_history(history, "neutral", "neutral", max_length)


# Global instance
_phi3_model: Optional[Phi3ChatModel] = None


def get_phi3_model() -> Phi3ChatModel:
    """Get or create global Phi-3 model instance"""
    global _phi3_model
    if _phi3_model is None:
        _phi3_model = Phi3ChatModel()
    return _phi3_model
