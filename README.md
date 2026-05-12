
# 🧠 Local Vision OCR – Batch Document & Image OCR via Ollama

> **Markdown • LaTeX • JSON** – A local OCR web app for batch-processing images and PDF documents with Ollama vision models.

<div align="center">
  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiBVSfEHFUCXBPtWvPGRFC9J291p5NgpGMeVXsnI99DfeY0ruxa2tuRZvtIimKVDl5x3N7uJSnoflyzc16caxqqbax43Yr9D6k9PG-0Tr37zjq1zna8r8fJoLzmcK9a3MpmImKSPf3c6dp7qFXEqGOKhrlX_yBXABpeEOZcQ9iPuaxUAjq3taamOlt/s16000/2.png" width="85%" alt="Local Vision OCR banner">
</div>

<p align="center">
  <a href="#-demo"><strong>📸 Demo</strong></a> •
  <a href="#-features"><strong>✨ Features</strong></a> •
  <a href="#-installation--local-setup"><strong>⚙️ Installation</strong></a> •
  <a href="#-api-endpoints"><strong>🔌 API</strong></a> •
  <a href="#-environment--configuration"><strong>🔧 Configuration</strong></a>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white" alt="Ollama">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/PyMuPDF-333333?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="PyMuPDF">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-MIT-f5de53?style=for-the-badge" alt="MIT License">
</div>

---

## ✨ Features

- 🖼️ **Image OCR** for common image formats such as PNG, JPG, JPEG, and WebP
- 📄 **Multi-page PDF OCR** using PyMuPDF-based page rasterization
- 📦 **Batch OCR workflow** for processing large numbers of documents and images
- 🧠 **Ollama vision model support** via the Ollama `/api/chat` endpoint
- 🔁 Works with **many Ollama-compatible vision models**, not tied to one specific model
- 📤 Export OCR results as **Markdown**, **LaTeX**, or clean **JSON**
- 🚀 **Per-page streaming output** with SSE / NDJSON for real-time progress updates
- ⏳ **Background jobs** for long-running or large batch OCR tasks
- 🗜️ Download results as a **ZIP archive** after batch processing
- 🧠 Optional **thinking / reasoning mode** with `OLLAMA_THINK=1`, when supported by the selected model
- 💾 Optional **OCR history storage** using MongoDB or local file storage
- 🔁 Configurable original image and metadata storage through environment variables

> **Note:** PPT and PPTX files are currently **not supported**.  
> Supported inputs are images and PDF documents.

---

## 📸 Demo

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGK6smt5I-zUd6zgkzXy3nwXoBByMAElS0Jsco9celYTQu-b5G9xm7dq8AJ83fl3HVgWRYXxgDkjxAQY5Gm_AWXeBaJOy1uqpyeEtbOPontf8_9QdLZxOzvj0PwwYpdeE78papT_j5tVPzp10rA_sHiv9xtRBZkfNNg8LywmVFP1paHQ_SfaRLAird/s16000/1.png" width="400">
        <br/>
        <b>Web interface – file upload</b>
      </td>
      <td align="center">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8BqekvEKiPJNabgrERRVOj6EstHglZuZttHqmZX5O-CZQESWhtFRhVLXCDqYzxsOC7j04lzhlPP0itqaMl6ipph3IncERnCO9hOiTAPUkioHDQonofh4AzSz78BH5ZP6_9w9td6wPw-m749TfkSPslRC7ImiG7Wfo8EKIQzM64starSPu3wCibb2p/s16000/latexocr.png" width="400">
        <br/>
        <b>Markdown + LaTeX OCR output</b>
      </td>
    </tr>
  </table>
</div>

---

## 🧰 Requirements

- Python 3.11+
- [Ollama](https://ollama.com/) running locally or on a reachable server
- At least one Ollama-compatible **vision model**
- Recommended: NVIDIA GPU with enough VRAM for larger vision models
- Optional: MongoDB, if OCR history storage is needed

Example supported model choices depend on your Ollama installation. You can use any compatible vision model that accepts image input through Ollama.

---

## ⚙️ Installation & Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/CaoMinhh/local-vision-ocr.git
cd local-vision-ocr
````

### 2. Create a virtual environment and install dependencies

You can use either `venv` or `conda`. For faster dependency installation, this project uses `uv`.

#### Option A: Using `venv` + `uv`

```bash
python -m venv .venv

source .venv/bin/activate      # Linux/macOS
# .venv\Scripts\activate       # Windows

pip install uv
uv pip install -r requirements.txt
```

#### Option B: Using `conda` + `uv`

```bash
conda create -n local-vision-ocr python=3.11 -y
conda activate local-vision-ocr

pip install uv
uv pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env based on your local setup
```

See the configuration table below for the most important options.

### 4. Pull an Ollama vision model

```bash
ollama pull <your-vision-model>
```

Example:

```bash
ollama pull nemotron3:33b
```

Then verify that the model is available:

```bash
ollama list
```

### 5. Run the application

```bash
python app.py
```

By default, the server runs at:

```text
http://0.0.0.0:8000
```

Open the web interface at:

```text
http://localhost:8000
```

---

## 🔧 Environment & Configuration

Important variables in `.env`:

| Variable            | Description                                               | Example                  |
| ------------------- | --------------------------------------------------------- | ------------------------ |
| `OLLAMA_HOST`       | Ollama API base URL                                       | `http://localhost:11434` |
| `OLLAMA_MODEL`      | Name of the Ollama vision model to use                    | `llama3.2-vision`        |
| `OLLAMA_THINK`      | Enable thinking/reasoning mode if the model supports it   | `1` or `0`               |
| `OLLAMA_KEEP_ALIVE` | Keep the model loaded in memory                           | `5m` or empty            |
| `OCR_MAX_PARALLEL`  | Number of PDF pages processed in parallel                 | `2`                      |
| `MONGODB_URI`       | MongoDB connection string; leave empty to disable MongoDB | `mongodb+srv://...`      |

See `.env.example` for the full list of available options.

---

## 🔌 API Endpoints

| Method | Endpoint               | Description                                        |
| ------ | ---------------------- | -------------------------------------------------- |
| `POST` | `/ocr/upload`          | Upload an image or PDF and receive JSON output     |
| `POST` | `/ocr/upload-stream`   | Stream OCR output page by page using SSE           |
| `POST` | `/ocr/async`           | Create a background OCR job and receive a `job_id` |
| `GET`  | `/ocr/result/{job_id}` | Retrieve OCR job results                           |
| `GET`  | `/ocr/history`         | Retrieve OCR history, if MongoDB is enabled        |

Example API call with `curl`:

```bash
curl -X POST http://localhost:8000/ocr/upload \
  -F "file=@document.pdf" \
  -F "format=markdown"
```

Example response:

```json
{
  "filename": "document.pdf",
  "pages": [
    {
      "page": 1,
      "text": "# Title\nContent..."
    },
    {
      "page": 2,
      "text": "..."
    }
  ],
  "format": "markdown"
}
```

---

## 📦 Batch OCR Workflow

This project is designed for high-volume OCR workflows where you may need to process many files, including scanned documents, screenshots, book pages, forms, handwritten notes, or image-based PDFs.

Depending on your model and hardware, large batches may take a long time. For large workloads, use the async OCR endpoint and download the result package when the job is complete.

Supported input types:

* PNG
* JPG / JPEG
* WebP
* PDF

Currently unsupported input types:

* PPT
* PPTX
* DOC / DOCX
* XLS / XLSX

---

## 🗄️ MongoDB Optional History Storage

To enable OCR history storage, provide `MONGODB_URI` in your `.env` file.

Example MongoDB Atlas configuration:

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.../dbname?retryWrites=true&w=majority
MONGODB_DB_NAME=local_vision_ocr
MONGODB_COLLECTION_OCR=ocr_runs
```

When enabled, each OCR run can be saved with metadata and original images, depending on your configuration.

To store original images in history, enable:

```env
OCR_HISTORY_STORE_IMAGES=1
```

---

## 📁 Project Structure

```text
local-vision-ocr/
├── app.py                 # Main entry point
├── backend_ocr/           # OCR processing logic
├── frontend_ocr/                # Web UI assets: HTML, CSS, JS
├── Fig/                   # Demo screenshots
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🧠 Model Notes

This project does not require a specific vision model.

You can use any Ollama-compatible vision model that supports image input. OCR quality, formatting accuracy, multilingual recognition, LaTeX extraction, and table reconstruction may vary depending on the selected model.

Recommended considerations when choosing a model:

* Vision input support
* OCR quality for your target language
* Ability to preserve Markdown structure
* Ability to recognize formulas and LaTeX
* GPU/VRAM requirements
* Inference speed for large batches

## 💾 Recommended VRAM

VRAM usage depends on the selected vision model, quantization, context length, image resolution, batch size, and Ollama runtime settings. The numbers below are practical reference values from local testing.

| Model | Approx. VRAM Usage | Recommendation |
|---|---:|---|
| `gemma4:e4b` | ~12.14 GB | Recommended for GPUs with 16 GB+ VRAM |
| `nemotron3:33b` | ~31.05 GB | Recommended for GPUs with 40 GB+ VRAM |
| `qwen3-vl:8b` | ~45.31 GB | Recommended for GPUs with 48 GB+ VRAM |

> For large batch OCR jobs, leave extra VRAM headroom to avoid out-of-memory errors. If your GPU has limited VRAM, reduce parallel processing with `OCR_MAX_PARALLEL`, lower image/PDF rasterization resolution, or choose a smaller vision model.

---

## ⚠️ Limitations

* PPT and PPTX files are not currently supported.
* OCR quality depends heavily on the selected vision model.
* Very large PDFs may require more memory and longer processing time.
* Table reconstruction, handwriting recognition, and complex mathematical formatting may vary by model.
* Reasoning/thinking mode only works if the selected model supports it.
* Local inference speed depends on your CPU, GPU, VRAM, and Ollama configuration.

---

## 🤝 Contributing

Contributions are welcome.

Bug reports, feature requests, documentation improvements, and pull requests are appreciated. For large changes, please open an issue first to discuss the proposed update.

Create an issue here:

```text
https://github.com/CaoMinhh/local-vision-ocr/issues
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact / Support

* Open a GitHub issue: `https://github.com/CaoMinhh/local-vision-ocr/issues`