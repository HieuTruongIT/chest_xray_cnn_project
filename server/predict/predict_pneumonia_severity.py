# import torch
# import torch.nn.functional as F
# import torchvision
# import skimage.io
# import skimage.filters
# import torchxrayvision as xrv
# import pickle
# import numpy as np
# import matplotlib.pyplot as plt
# import os
# from PIL import Image
# import io

# class PneumoniaSeverityNetStonyBrook(torch.nn.Module):
#     def __init__(self):
#         super(PneumoniaSeverityNetStonyBrook, self).__init__()
#         self.basemodel = xrv.models.DenseNet(weights="all")
#         self.basemodel.op_threshs = None
#         self.net_geo = self.create_network(r"C:\Users\trong\Desktop\chest_xray_cnn_project\model\pneumonia_severity/mlp_geo.pkl")
#         self.net_opa = self.create_network(r"C:\Users\trong\Desktop\chest_xray_cnn_project\model\pneumonia_severity/mlp_opa.pkl")

#     def create_network(self, path):
#         coefs, intercepts = pickle.load(open(path, "br"))
#         layers = []
#         for i, (coef, intercept) in enumerate(zip(coefs, intercepts)):
#             la = torch.nn.Linear(*coef.shape)
#             la.weight.data = torch.from_numpy(coef).T.float()
#             la.bias.data = torch.from_numpy(intercept).T.float()
#             layers.append(la)
#             if i < len(coefs) - 1:  # if not last layer
#                 layers.append(torch.nn.ReLU())
#         return torch.nn.Sequential(*layers)

#     def forward(self, x):
#         ret = {}
#         ret["feats"] = self.basemodel.features2(x)
        
#         ret["geographic_extent"] = self.net_geo(ret["feats"])[0]
#         ret["geographic_extent"] = torch.clamp(ret["geographic_extent"], 0, 8)
        
#         ret["opacity"] = self.net_opa(ret["feats"])[0]
#         ret["opacity"] = torch.clamp(ret["opacity"], 0, 8)
        
#         return ret


# def process(model, img_path, cuda=False):
#     img = skimage.io.imread(img_path)
#     img = xrv.datasets.normalize(img, 255)

#     if len(img.shape) > 2:
#         img = img[:, :, 0]
#     if len(img.shape) < 2:
#         return None

#     img = img[None, :, :]
    
#     transform = torchvision.transforms.Compose([xrv.datasets.XRayCenterCrop(),
#                                                 xrv.datasets.XRayResizer(224)])
    
#     img = transform(img)

#     with torch.no_grad():
#         img = torch.from_numpy(img).unsqueeze(0)
#         if cuda:
#             img = img.cuda()
#             model = model.cuda()

#         outputs = model(img)

#     outputs["img"] = img
#     return outputs

# def predict(image_path: str, model: PneumoniaSeverityNetStonyBrook, use_cuda=False):
#     outputs = process(model, image_path, use_cuda)
#     if outputs:
#         geo = float(outputs["geographic_extent"].cpu().numpy())
#         opa = float(outputs["opacity"].cpu().numpy())

#         img_display = np.clip(outputs["img"][0][0].detach().cpu().numpy(), 0.0, 1.0)

#         # Saliency map
#         img = outputs["img"]
#         img = img.requires_grad_()
#         if use_cuda:
#             model = model.cuda()
#             img = img.cuda()
#         outputs = model(img)
#         grads = torch.autograd.grad(outputs["geographic_extent"], img)[0][0][0]
#         blurred = skimage.filters.gaussian(grads.detach().cpu().numpy() ** 2, sigma=(5, 5), truncate=3.5)

#         # Saliency map
#         saliency_path = "/tmp/saliency_map.png"
#         my_dpi = 100
#         fig = plt.figure(frameon=False, figsize=(224 / my_dpi, 224 / my_dpi), dpi=my_dpi)
#         ax = plt.Axes(fig, [0., 0., 1., 1.])
#         ax.set_axis_off()
#         fig.add_axes(ax)
#         ax.imshow(img_display, cmap="gray", aspect='auto')
#         ax.imshow(blurred, alpha=0.5)
#         plt.savefig(saliency_path, bbox_inches='tight', pad_inches=0)
#         plt.close(fig)

#         return geo, opa, saliency_path, img_display
#     return None

import torch
import torch.nn.functional as F
import torchvision
import skimage.io
import skimage.filters
import torchxrayvision as xrv
import pickle
import numpy as np
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
import os
from PIL import Image
import io
import base64
import tempfile

# === Load model toàn cục ===
severity_model = None

class PneumoniaSeverityNetStonyBrook(torch.nn.Module):
    def __init__(self):
        super(PneumoniaSeverityNetStonyBrook, self).__init__()
        self.basemodel = xrv.models.DenseNet(weights="all")
        self.basemodel.op_threshs = None
        self.net_geo = self.create_network(r"C:\Users\trong\Desktop\chest_xray_cnn_project\model\pneumonia_severity/mlp_geo.pkl")
        self.net_opa = self.create_network(r"C:\Users\trong\Desktop\chest_xray_cnn_project\model\pneumonia_severity/mlp_opa.pkl")

    def create_network(self, path):
        coefs, intercepts = pickle.load(open(path, "br"))
        layers = []
        for i, (coef, intercept) in enumerate(zip(coefs, intercepts)):
            la = torch.nn.Linear(*coef.shape)
            la.weight.data = torch.from_numpy(coef).T.float()
            la.bias.data = torch.from_numpy(intercept).T.float()
            layers.append(la)
            if i < len(coefs) - 1:
                layers.append(torch.nn.ReLU())
        return torch.nn.Sequential(*layers)

    def forward(self, x):
        ret = {}
        ret["feats"] = self.basemodel.features2(x)
        ret["geographic_extent"] = self.net_geo(ret["feats"])[0]
        ret["geographic_extent"] = torch.clamp(ret["geographic_extent"], 0, 8)
        ret["opacity"] = self.net_opa(ret["feats"])[0]
        ret["opacity"] = torch.clamp(ret["opacity"], 0, 8)
        return ret

def _process(model, img_path, cuda=False):
    img = skimage.io.imread(img_path)
    img = xrv.datasets.normalize(img, 255)

    if len(img.shape) > 2:
        img = img[:, :, 0]
    if len(img.shape) < 2:
        return None

    img = img[None, :, :]

    transform = torchvision.transforms.Compose([
        xrv.datasets.XRayCenterCrop(),
        xrv.datasets.XRayResizer(224)
    ])
    img = transform(img)

    with torch.no_grad():
        img = torch.from_numpy(img).unsqueeze(0)
        if cuda:
            img = img.cuda()
            model = model.cuda()
        outputs = model(img)

    outputs["img"] = img
    return outputs

def _predict_with_model(image_path: str, model: PneumoniaSeverityNetStonyBrook, use_cuda=False):
    outputs = _process(model, image_path, use_cuda)
    if outputs is None:
        return None

    geo = float(outputs["geographic_extent"].cpu().numpy())
    opa = float(outputs["opacity"].cpu().numpy())
    img_display = np.clip(outputs["img"][0][0].detach().cpu().numpy(), 0.0, 1.0)

    # Saliency map (gradient)
    img = outputs["img"].requires_grad_()
    if use_cuda:
        model = model.cuda()
        img = img.cuda()
    outputs = model(img)
    grads = torch.autograd.grad(outputs["geographic_extent"], img)[0][0][0]
    blurred = skimage.filters.gaussian(grads.detach().cpu().numpy() ** 2, sigma=(5, 5), truncate=3.5)

    # Tạo ảnh overlay (X-quang gốc + saliency)
    fig, ax = plt.subplots(figsize=(4, 4), dpi=100)
    ax.imshow(img_display, cmap='gray')
    ax.imshow(blurred / blurred.max(), cmap='plasma', alpha=0.5)
    ax.axis('off')

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    buf.seek(0)
    overlay_img = Image.open(buf)

    # Convert overlay image to base64
    buffered = io.BytesIO()
    overlay_img.save(buffered, format="PNG")
    saliency_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return geo, opa, saliency_base64


def predict(image: Image.Image) -> dict:
    global severity_model
    if severity_model is None:
        severity_model = PneumoniaSeverityNetStonyBrook()

    # Save tạm ảnh vào file để dùng lại
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
        image.save(temp_file.name)
        temp_path = temp_file.name

    try:
        result = _predict_with_model(temp_path, severity_model)
        if result is None:
            return {"error": "Failed to process image."}
        geo, opa, saliency_base64 = result
        return {
            "geographic_extent": round(geo, 2),
            "opacity": round(opa, 2),
            "saliency_map_base64": saliency_base64
        }
    finally:
        os.remove(temp_path)