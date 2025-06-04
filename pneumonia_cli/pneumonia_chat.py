import streamlit as st
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel

@st.cache_resource
def load_model(model_path):
    tokenizer = GPT2Tokenizer.from_pretrained(model_path)
    model = GPT2LMHeadModel.from_pretrained(model_path)
    model.eval()
    return tokenizer, model

def generate_response(model, tokenizer, prompt, max_length=500):
    inputs = tokenizer.encode(prompt, return_tensors="pt")
    outputs = model.generate(
        inputs,
        max_length=max_length,
        num_return_sequences=1,
        pad_token_id=tokenizer.eos_token_id,
        do_sample=True,
        top_p=0.95,
        top_k=50,
        temperature=0.7,
    )
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    response = text[len(prompt):].strip()
    return response

def main():
    st.title("Pneumonia Chatbot - GPT-2 Fine-tuned")
    model_path = r"C:\Users\trong\Desktop\chest_xray_cnn_project\model\pneumonia_chat"

    tokenizer, model = load_model(model_path)

    if "history" not in st.session_state:
        st.session_state.history = []

    user_input = st.text_input("You:", "")
    if user_input:
        prompt = f"User: {user_input}\nAssistant:"
        response = generate_response(model, tokenizer, prompt)
        st.session_state.history.append({"user": user_input, "bot": response})

    for chat in st.session_state.history:
        st.markdown(f"**You:** {chat['user']}")
        st.markdown(f"**Bot:** {chat['bot']}")

if __name__ == "__main__":
    main()
