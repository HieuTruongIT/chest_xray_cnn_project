import asyncio
from fastapi import APIRouter, File, UploadFile
from typing import List
from predict.predict_pneumonia_detection import predict as detect_pneumonia
from predict.predict_pneumonia_severity import predict as severity_predict
from predict.predict_pneumonia_segmenter import predict as segmenter_predict
from PIL import Image
import io


router = APIRouter()

# Endpoint cho mô hình phát hiện viêm phổi (Pneumonia Detection)
@router.post("/predict_pneumonia_detection")
async def predict_pneumonia_detection(files: List[UploadFile] = File(...)):
    try:
        images = [Image.open(io.BytesIO(await file.read())) for file in files]
        results = await asyncio.gather(
            *[process_pneumonia_detection(image) for image in images]
        )
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}

# Endpoint cho mô hình đánh giá mức độ nghiêm trọng (Pneumonia Severity)
@router.post("/predict_pneumonia_severity")
async def predict_pneumonia_severity(files: List[UploadFile] = File(...)):
    try:
        images = [Image.open(io.BytesIO(await file.read())) for file in files]
        results = await asyncio.gather(
            *[process_pneumonia_severity(image) for image in images]
        )
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}

# Endpoint cho mô hình phát hiện tổn thương (Pneumonia Segmentation)
@router.post("/predict_pneumonia_segmentation")
async def predict_pneumonia_segmentation(files: List[UploadFile] = File(...)):
    try:
        images = [Image.open(io.BytesIO(await file.read())) for file in files]
        results = await asyncio.gather(
            *[process_pneumonia_segmentation(image) for image in images]
        )
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}

# Hàm xử lý từng ảnh cho mô hình Phát hiện viêm phổi
async def process_pneumonia_detection(image):
    return await asyncio.to_thread(detect_pneumonia, image)

# Hàm xử lý từng ảnh cho mô hình Đánh giá mức độ nghiêm trọng
async def process_pneumonia_severity(image):
    return await asyncio.to_thread(severity_predict, image)

# Hàm xử lý từng ảnh cho mô hình Phát hiện tổn thương
async def process_pneumonia_segmentation(image):
    return await asyncio.to_thread(segmenter_predict, image)
