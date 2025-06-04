
# import streamlit as st
# import torch
# import torch.nn.functional as F
# import torchvision
# import skimage.io
# import skimage.filters
# import torchxrayvision as xrv
# import pickle
# import numpy as np
# import json
# import matplotlib.pyplot as plt
# import os

# # Đặt lại đường dẫn
# thispath = os.path.dirname(os.path.realpath(__file__))

# class PneumoniaSeverityNetStonyBrook(torch.nn.Module):
#     def __init__(self):
#         super(PneumoniaSeverityNetStonyBrook, self).__init__()
#         self.basemodel = xrv.models.DenseNet(weights="all")
#         self.basemodel.op_threshs = None
#         self.net_geo = self.create_network("C:\\Users\\trong\\Desktop\\chest_xray_cnn_project\\model\\pneumonia_severity\\mlp_geo.pkl")
#         self.net_opa = self.create_network("C:\\Users\\trong\\Desktop\\chest_xray_cnn_project\\model\\pneumonia_severity\\mlp_opa.pkl")

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
#         st.error("Error: Image dimensions are lower than 2.")
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

# # Streamlit app
# uploaded_file = st.file_uploader("Upload an X-ray image", type=["jpg", "jpeg", "png"])

# if uploaded_file is not None:
#     model_version = 2  # Sử dụng model version 2 (PneumoniaSeverityNetStonyBrook)
#     use_cuda = False
#     model = PneumoniaSeverityNetStonyBrook()  # Sử dụng mô hình StonyBrook

#     with open("/tmp/uploaded.png", "wb") as f:
#         f.write(uploaded_file.read())

#     outputs = process(model, "/tmp/uploaded.png", use_cuda)

#     if outputs:
#         geo = float(outputs["geographic_extent"].cpu().numpy())
#         opa = float(outputs["opacity"].cpu().numpy())

#         # Clamp and prepare X-ray image for display
#         img_display = np.clip(outputs["img"][0][0].detach().cpu().numpy(), 0.0, 1.0)

#         # Generate saliency map
#         saliency_img = None
#         img = outputs["img"]
#         img = img.requires_grad_()
#         if use_cuda:
#             model = model.cuda()
#             img = img.cuda()
#         outputs = model(img)
#         grads = torch.autograd.grad(outputs["geographic_extent"], img)[0][0][0]
#         blurred = skimage.filters.gaussian(grads.detach().cpu().numpy() ** 2, sigma=(5, 5), truncate=3.5)

#         # Create saliency map with matplotlib
#         my_dpi = 100
#         fig = plt.figure(frameon=False, figsize=(224 / my_dpi, 224 / my_dpi), dpi=my_dpi)
#         ax = plt.Axes(fig, [0., 0., 1., 1.])
#         ax.set_axis_off()
#         fig.add_axes(ax)
#         ax.imshow(img_display, cmap="gray", aspect='auto')
#         ax.imshow(blurred, alpha=0.5)
#         saliency_path = "/tmp/saliency_map.png"
#         plt.savefig(saliency_path, bbox_inches='tight', pad_inches=0)
#         plt.close(fig)

#         # Hiển thị 3 cột: ảnh gốc, ảnh saliency, dự đoán
#         col1, col2, col3 = st.columns([1, 1, 1])

#         with col1:
#             st.markdown("**Image**", unsafe_allow_html=True)
#             st.image(img_display, use_container_width=True)

#         with col2:
#             st.markdown("**Saliency map**", unsafe_allow_html=True)
#             st.image(saliency_path, use_container_width=True)
            
#         with col3:
#             st.markdown("**Predictions**", unsafe_allow_html=True)
#             st.write(f"**geographic_extent (0-8)**: {geo:.3f}")
#             st.write(f"**opacity (0-6)**: {opa * 6 / 8:.2f}")


import streamlit as st
import torch
import torchvision
import torch.nn.functional as F
import skimage.io
import skimage.filters
import torchxrayvision as xrv
import pickle
import numpy as np
import matplotlib.pyplot as plt
import os
import tempfile

# ==============================
# Load mô hình severity
# ==============================
class PneumoniaSeverityNetStonyBrook(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.basemodel = xrv.models.DenseNet(weights="all")
        self.basemodel.op_threshs = None
        self.net_geo = self.create_network("C:/Users/trong/Desktop/chest_xray_cnn_project/model/pneumonia_severity/mlp_geo.pkl")
        self.net_opa = self.create_network("C:/Users/trong/Desktop/chest_xray_cnn_project/model/pneumonia_severity/mlp_opa.pkl")

    def create_network(self, path):
        coefs, intercepts = pickle.load(open(path, "rb"))
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
        ret["geographic_extent"] = torch.clamp(self.net_geo(ret["feats"])[0], 0, 8)
        ret["opacity"] = torch.clamp(self.net_opa(ret["feats"])[0], 0, 8)
        return ret

# ==============================
# Xử lý ảnh đầu vào
# ==============================
def preprocess(img_bytes):
    img = skimage.io.imread(img_bytes)
    img = xrv.datasets.normalize(img, 255)
    if len(img.shape) > 2:
        img = img[:, :, 0]
    img = img[None, :, :]
    transform = torchvision.transforms.Compose([
        xrv.datasets.XRayCenterCrop(),
        xrv.datasets.XRayResizer(224)
    ])
    img = transform(img)
    return torch.from_numpy(img).unsqueeze(0)

# ==============================
# Saliency Overlay Generator
# ==============================
def generate_saliency_overlay(model, img_tensor, use_cuda=False):
    img_display = img_tensor[0][0].detach().cpu().numpy()
    img = img_tensor.clone().requires_grad_()

    if use_cuda:
        model = model.cuda()
        img = img.cuda()

    outputs = model(img)
    grads = torch.autograd.grad(outputs["geographic_extent"], img)[0][0][0]
    blurred = skimage.filters.gaussian(grads.detach().cpu().numpy()**2, sigma=5, truncate=3.5)

    # Vẽ overlay
    fig, ax = plt.subplots(figsize=(4, 4), dpi=100)
    ax.imshow(img_display, cmap="gray")
    ax.imshow(blurred / blurred.max(), cmap="plasma", alpha=0.5)
    ax.axis("off")

    tmp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    plt.savefig(tmp_file.name, bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    return tmp_file.name, float(outputs["geographic_extent"].cpu()), float(outputs["opacity"].cpu())

# ==============================
# Streamlit App
# ==============================
st.set_page_config(page_title="Severity Estimator", layout="centered")
st.title("🩻 Pneumonia Severity Detection (with Overlay)")

uploaded_file = st.file_uploader("Upload Chest X-ray Image", type=["png", "jpg", "jpeg"])

if uploaded_file is not None:
    use_cuda = False
    model = PneumoniaSeverityNetStonyBrook()

    # Lưu ảnh tạm thời
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        tmp.write(uploaded_file.read())
        img_path = tmp.name

    try:
        img_tensor = preprocess(img_path)
        overlay_path, geo, opa = generate_saliency_overlay(model, img_tensor, use_cuda)

        col1, col2, col3 = st.columns([1, 1, 1])

        with col1:
            st.markdown("**📷 Original Image**")
            st.image(img_tensor[0][0].numpy(), use_column_width=True, clamp=True, channels="L")

        with col2:
            st.markdown("**🧠 Saliency Overlay**")
            st.image(overlay_path, use_column_width=True)

        with col3:
            st.markdown("**📊 Prediction**")
            st.metric("Geographic Extent (0-8)", f"{geo:.2f}")
            st.metric("Opacity (0-6)", f"{opa * 6 / 8:.2f}")

    except Exception as e:
        st.error(f"Error: {e}")
