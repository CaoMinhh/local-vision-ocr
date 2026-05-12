/* nemotron3 — OCR UI: i18n, preview, stream, GPU (split from index.html) */

    var ocrLocale = "vi";
    try {
      var _ocrLs = localStorage.getItem("ocrLocale");
      if (_ocrLs === "en" || _ocrLs === "vi") ocrLocale = _ocrLs;
    } catch (_eLs) {}

    var OCR_MSG = {
      vi: {
        doc_title: "OCR → Markdown / JSON",
        nav_brand: "OCR Local",
        nav_tagline: "Ollama vision ·",
        lang_vi_title: "Tiếng Việt",
        lang_en_title: "English",
        lang_group_aria: "Chọn ngôn ngữ giao diện",
        lang_vi_native: "Tiếng Việt",
        lang_en_native: "English",
        intro_line: "Tải ảnh hoặc PDF",
        form_config: "Cấu hình",
        form_file: "File",
        form_file_hint: "(nhiều ảnh / PDF)",
        form_pick_folder: "Chọn thư mục",
        folder_none_supported: "Không có file PDF hoặc ảnh hợp lệ trong thư mục đã chọn.",
        empty_source_files: "Tệp",
        empty_source_folder: "Thư mục",
        empty_source_group_aria: "Chọn cách thêm tài liệu: tệp hoặc cả thư mục",
        empty_source_files_title: "Chọn một hoặc nhiều ảnh / PDF",
        empty_source_folder_title: "Chọn cả thư mục (chỉ PDF và ảnh được lấy)",
        form_output: "Đầu ra",
        form_merge: "PDF nhiều trang",
        merge_opt_true: "Gộp (md/latex) / theo trang (json)",
        merge_opt_false: "Tách từng trang (md/latex)",
        form_model: "Model Ollama",
        form_ollama_think: "Suy luận Ollama (think)",
        btn_run_ocr: "Chạy OCR",
        gpu_nv_section_aria: "NVIDIA-SMI realtime",
        gpu_live_title: "Đang làm mới",
        gpu_pause: "Tạm dừng",
        gpu_vram_section_aria: "VRAM GPU",
        gpu_mem_loading: "Đang tải…",
        gpu_nv_loading: "Đang tải nvidia-smi…",
        preview_title: "Ảnh / tài liệu",
        btn_new: "Tạo mới",
        btn_new_title: "Xóa hết ảnh/tài liệu đã chọn và làm mới phiên",
        empty_title: "Chưa có file",
        empty_hint: "Chọn file, kéo thả, hoặc dán ảnh từ clipboard.",
        paste_shortcut_aria: "Phím tắt dán ảnh",
        preview_alt: "Xem trước",
        pdf_preview_title: "Xem trước PDF",
        thumbs_aria: "Lưới xác nhận file (ảnh / PDF) sẽ gửi OCR",
        pdf_pages_label: "Xem OCR theo trang:",
        pdf_page_toolbar_aria: "Chọn trang",
        btn_hero_title: "Gửi ảnh/PDF đã chọn để OCR (theo cấu hình phía trên)",
        result_title: "Văn bản OCR",
        ocr_page_title: "Tất cả hoặc từng trang (PDF nhiều trang)",
        ocr_page_aria: "Phạm vi hiển thị OCR",
        page_all: "Tất cả",
        page_option: "Trang {n}",
        ocr_page_btn_aria: "OCR trang {n}",
        btn_copy: "Sao chép",
        btn_copy_title: "Sao chép nội dung đang hiển thị",
        btn_run_preview: "Chạy",
        btn_run_preview_title: "Markdown → xem trước HTML; JSON → cây thu gọn",
        btn_download: "Tải xuống",
        btn_download_title: "Tải file kết quả (Markdown hoặc JSON)",
        btn_download_zip: "Tải ZIP",
        btn_download_zip_title: "Nhiều file đầu vào: tải ZIP, mỗi file một .md / .tex / .json",
        out_aria: "Kết quả OCR (raw)",
        out_placeholder: "Kết quả hiển thị ở đây sau khi chạy OCR.",
        run_pane_aria: "Xem Markdown hoặc cây JSON",
        run_pane_title: "Kéo thanh ngang để chỉnh chiều cao vùng xem",
        run_pane_splitter_title: "Kéo thanh ngang lên hoặc xuống để chỉnh chiều cao",
        run_pane_header: "Biên dịch OCR",
        run_pane_resize_hint: "Kéo thanh phía trên",
        token_title:
          "Theo Ollama (prompt_eval_count / eval_count). PDF nhiều trang: cộng dồn mỗi trang.",
        token_aria: "Token đầu vào và đầu ra OCR",
        token_label: "Token",
        token_in: "Vào",
        token_out: "Ra",
        modal_close_aria: "Đóng",
        image_fallback: "Ảnh",
        copy_done: "Đã chép",
        err_pick_file: "Hãy chọn hoặc dán ít nhất một ảnh/PDF.",
        err_jszip_missing: "Thiếu thư viện JSZip (CDN). Tải lại trang.",
        err_zip_build: "Không tạo được file ZIP.",
        status_ocr_running: "Đang OCR…",
        status_done: "Xong.",
        err_ocr_generic: "Lỗi OCR",
        msg_no_result: "Không nhận được kết quả OCR.",
        stream_pdf_pages: "PDF — {n} trang",
        stream_ocr_page: "Hiển thị trang {cur} / {total}",
        stream_done_page: "Đã xong trang {cur} / {total}",
        pdf_progress_hint:
          "Có thể gửi tối đa {parallel} request tới Ollama cùng lúc (song song theo trang). Thanh tiến độ và phần văn bản đang chảy bên dưới vẫn hiện theo đúng thứ tự trang 1 → 2 → 3…",
        ocr_thinking_label: "Suy luận (thinking)",
        ocr_stream_label: "Luồng từ Ollama (kết quả OCR)",
        ocr_thinking_toggle_hide: "Ẩn suy luận",
        ocr_thinking_toggle_show: "Hiện suy luận",
        ocr_thinking_toggle_aria: "Bật hoặc tắt hiển thị suy luận của model",
        ocr_bg_job_label: "Chạy ngầm (PDF dài)",
        ocr_bg_job_out_placeholder:
          "OCR đang chạy ngầm. Xem thông báo góc màn hình; bạn có thể chuyển trang khác.",
        ocr_bg_job_started: "Đã bắt đầu job chạy ngầm.",
        ocr_bg_job_poll_err: "Không đọc được trạng thái job.",
        ocr_bg_job_failed: "OCR ngầm thất bại.",
        ocr_bg_job_done_title: "OCR xong",
        ocr_bg_job_progress: "Trang {cur} / {total}",
        ocr_bg_job_queued: "Đang xếp hàng…",
        ocr_bg_job_resumed: "Đã nối lại job OCR chạy ngầm (sau khi tải lại trang).",
        ocr_bg_job_toast_click: "Nhấn để mở khung Văn bản OCR và tải phần đã OCR.",
        loading_ocr: "Đang OCR…",
        loading_sub: "Đang gửi tới Ollama (có thể mất vài phút).",
        gpu_paused: "Đã tạm dừng",
        gpu_err_generic: "Lỗi",
        nvsmi_empty: "(nvidia-smi trả rỗng)",
        unknown_error: "Lỗi không xác định",
        files_label_multi: "{n} file",
        files_label_pdf_multi: "{n} file PDF — bấm ô để xem trong cửa sổ",
        grid_remove_aria: "Xóa ảnh",
        grid_drag_title: "Kéo ô để đổi thứ tự",
        missing_renderjson: "Thiếu thư viện renderjson (CDN).",
        missing_marked: "Thiếu marked hoặc DOMPurify (CDN).",
        json_invalid_prefix: "JSON không hợp lệ: ",
        unknown_format: "Không rõ định dạng.",
        latex_preview_note:
          "LaTeX không dựng trước ở đây. Xem và tải mã nguồn ở khung raw phía trên, hoặc dùng trình biên dịch TeX.",
        gpu_dot_active: "GPU đang hoạt động ({n}%)",
        gpu_dot_idle: "GPU idle ({n}%)",
        nav_main: "OCR",
        nav_history: "Lịch sử OCR",
        nav_config: "Cấu hình",
        nav_session_tokens_title:
          "Tổng token đầu vào/ra đã lưu trong lịch sử OCR (cộng dồn mọi bản ghi; đọc từ trường usage trên MongoDB hoặc file lịch sử).",
        config_title: "Cấu hình server",
        config_intro_storage_title: "Lưu cấu hình đi đâu",
        config_intro_storage_body:
          "Sau khi bạn bấm Lưu, các ô Ollama, OCR, GPU và lịch sử được ghi vào MongoDB (khi MONGODB_URI trong .env kết nối được) hoặc vào data/app_settings.json nếu chưa dùng MongoDB.",
        config_intro_precedence_title: "Trùng tên với biến trong .env",
        config_intro_precedence_li1:
          "Giá trị đã lưu qua trang này sẽ ghi đè giá trị cùng tên trong .env sau khi server khởi động xong.",
        config_intro_precedence_li2:
          ".env vẫn dùng cho lần chạy đầu, CI/CD và các biến không có trong form (ví dụ SERVER_PORT).",
        config_intro_env_only_title: "MongoDB và biến hệ thống",
        config_intro_env_only_body:
          "Chuỗi kết nối và tên collection (MONGODB_URI, MONGODB_DB_NAME, MONGODB_COLLECTION_*) chỉ sửa trong file .env trên server; đổi xong thường cần khởi động lại app.",
        config_mongo_env_note:
          "Chỉ cấu hình trong file .env trên server (MONGODB_URI, MONGODB_DB_NAME, MONGODB_COLLECTION_*). Khởi động lại app sau khi sửa .env.",
        mongo_badge_off: "MongoDB: chưa cấu hình",
        mongo_badge_ok: "MongoDB: đã kết nối",
        mongo_badge_err: "MongoDB: không kết nối được",
        config_group_ollama: "Ollama",
        config_ollama_think_hint:
          "Bật/tắt tham số think trong request Ollama /api/chat (chỉ model hỗ trợ). Mặc định theo OLLAMA_THINK.",
        config_ollama_keep_alive_hint:
          "keep_alive gửi kèm /api/chat: để trống = mặc định Ollama (thường giữ model trong VRAM). 0 = gỡ model sau mỗi request (nhả VRAM, lần sau chậm hơn). Có thể dùng dạng thời gian như 5m, 30s.",
        config_group_ocr: "OCR / PDF",
        config_group_gpu: "Bảng GPU",
        config_group_mongo: "MongoDB",
        config_group_history: "Lịch sử & khác",
        config_save: "Lưu cấu hình",
        config_saved_ok: "Đã lưu cấu hình ứng dụng.",
        config_save_err: "Không lưu được.",
        config_load_err: "Không tải được cấu hình.",
        config_mongo_none: "(chưa cấu URI)",
        config_mongo_uri_placeholder: "Để trống để giữ URI hiện tại; dán URI mới để thay",
        history_title: "Lịch sử OCR",
        history_refresh: "Làm mới",
        history_file_hint:
          "Lịch sử đang lưu cục bộ (data/ocr_history.json). Khi bạn thêm MONGODB_URI vào .env và khởi động lại, các bản ghi cũ sẽ được đưa vào MongoDB tự động.",
        history_empty: "Chưa có bản ghi OCR nào.",
        history_loading: "Đang tải…",
        history_err_load: "Không tải được lịch sử.",
        history_tab_meta: "Tóm tắt",
        history_tab_inputs: "File đầu vào",
        history_tab_output_fmt: "Kết quả ({label})",
        history_fmt_md: "Markdown",
        history_fmt_latex: "LaTeX",
        history_fmt_json: "JSON",
        history_badge_pages: "{n} trang",
        history_badge_pdf: "PDF",
        history_badge_merge: "Gộp",
        history_badge_split: "Tách",
        history_row_id_label: "ID",
        history_detail_title: "OCR · {id}",
        history_meta_ocr_id: "Mã OCR",
        history_meta_row_id: "ID trong kho",
        history_dl_result_btn: "Tải kết quả",
        history_dl_result_hint: "Tệp theo định dạng đã chọn khi OCR.",
        history_omit_pdf_over_limit: "PDF vượt quá giới hạn lưu (OCR_HISTORY_MAX_INPUT_BYTES).",
        history_omit_size_limit: "File vượt quá giới hạn kích thước.",
        history_omit_disabled: "Đã tắt lưu base64 đầu vào.",
        history_omit_document_cap: "Đã bỏ file khỏi bản ghi do vượt giới hạn kích thước MongoDB.",
        history_omit_pdf_document_cap: "PDF đã bỏ khỏi bản ghi do vượt giới hạn kích thước MongoDB.",
        history_col_file: "Tên file",
        history_col_type: "Loại MIME",
        history_col_size: "Kích thước",
        history_meta_created: "Thời gian",
        history_meta_model: "Model",
        history_meta_format: "Định dạng",
        history_meta_merge: "Gộp trang",
        history_meta_rendered: "Trang render",
        history_meta_tokens: "Token vào / ra",
        history_col_download: "Tải",
        history_dl_btn: "Tải file gốc",
        history_dl_unavailable: "Không có file",
      },
      en: {
        doc_title: "OCR → Markdown / JSON",
        nav_brand: "OCR Local ",
        nav_tagline: "Ollama vision ·",
        lang_vi_title: "Vietnamese",
        lang_en_title: "English",
        lang_group_aria: "Choose interface language",
        lang_vi_native: "Vietnamese",
        lang_en_native: "English",
        intro_line: "Upload images or PDF; multi-page PDFs are rendered page-by-page and sent to the model.",
        form_config: "Settings",
        form_file: "File",
        form_file_hint: "(multiple images / PDF)",
        form_pick_folder: "Choose folder",
        folder_none_supported: "No supported PDF or image files in the selected folder.",
        empty_source_files: "Files",
        empty_source_folder: "Folder",
        empty_source_group_aria: "Choose how to add documents: files or whole folder",
        empty_source_files_title: "Pick one or more images / PDFs",
        empty_source_folder_title: "Pick a folder (only PDFs and images are used)",
        form_output: "Output",
        form_merge: "Multi-page PDF",
        merge_opt_true: "Merge (md/latex) / by page (json)",
        merge_opt_false: "Split per page (md/latex)",
        form_model: "Ollama model",
        form_ollama_think: "Ollama reasoning (think)",
        btn_run_ocr: "Run OCR",
        gpu_nv_section_aria: "NVIDIA-SMI realtime",
        gpu_live_title: "Live refresh",
        gpu_pause: "Pause",
        gpu_vram_section_aria: "GPU VRAM",
        gpu_mem_loading: "Loading…",
        gpu_nv_loading: "Loading nvidia-smi…",
        preview_title: "Image / document",
        btn_new: "New",
        btn_new_title: "Clear all selected files and reset the session",
        empty_title: "No file yet",
        empty_hint: "Choose a file, drag and drop, or paste an image from the clipboard.",
        paste_shortcut_aria: "Paste shortcut",
        preview_alt: "Preview",
        pdf_preview_title: "PDF preview",
        thumbs_aria: "File grid — images / PDFs to be sent for OCR",
        pdf_pages_label: "OCR by page:",
        pdf_page_toolbar_aria: "Select page",
        btn_hero_title: "Run OCR on selected images/PDF (uses settings above)",
        result_title: "OCR text",
        ocr_page_title: "All pages or each page (multi-page PDF)",
        ocr_page_aria: "OCR view scope",
        page_all: "All",
        page_option: "Page {n}",
        ocr_page_btn_aria: "OCR page {n}",
        btn_copy: "Copy",
        btn_copy_title: "Copy displayed content",
        btn_run_preview: "Run",
        btn_run_preview_title: "Markdown → HTML preview; JSON → foldable tree",
        btn_download: "Download",
        btn_download_title: "Download result (Markdown or JSON)",
        btn_download_zip: "Download ZIP",
        btn_download_zip_title: "Multiple inputs: ZIP with one .md / .tex / .json per source file",
        out_aria: "Raw OCR result",
        out_placeholder: "Results appear here after running OCR.",
        run_pane_aria: "Markdown preview or JSON tree",
        run_pane_title: "Drag the horizontal bar to resize the preview",
        run_pane_splitter_title: "Drag the bar up or down to resize height",
        run_pane_header: "OCR compilation",
        run_pane_resize_hint: "Drag the bar above",
        token_title:
          "From Ollama (prompt_eval_count / eval_count). Multi-page PDF: summed per page.",
        token_aria: "OCR input and output tokens",
        token_label: "Token",
        token_in: "In",
        token_out: "Out",
        modal_close_aria: "Close",
        image_fallback: "Image",
        copy_done: "Copied",
        err_pick_file: "Choose or paste at least one image/PDF.",
        err_jszip_missing: "JSZip library missing (CDN). Reload the page.",
        err_zip_build: "Could not build ZIP file.",
        status_ocr_running: "Running OCR…",
        status_done: "Done.",
        err_ocr_generic: "OCR error",
        msg_no_result: "No OCR result received.",
        stream_pdf_pages: "PDF — {n} pages",
        stream_ocr_page: "Showing page {cur} / {total}",
        stream_done_page: "Finished page {cur} / {total}",
        pdf_progress_hint:
          "Up to {parallel} concurrent Ollama calls; the label and stream below still advance page-by-page in order.",
        ocr_thinking_label: "Reasoning (thinking)",
        ocr_stream_label: "Ollama stream (OCR output)",
        ocr_thinking_toggle_hide: "Hide reasoning",
        ocr_thinking_toggle_show: "Show reasoning",
        ocr_thinking_toggle_aria: "Toggle visibility of model reasoning (thinking)",
        ocr_bg_job_label: "Background (long PDFs)",
        ocr_bg_job_out_placeholder: "OCR is running in the background. Watch the notification; you can switch pages.",
        ocr_bg_job_started: "Background job started.",
        ocr_bg_job_poll_err: "Could not read job status.",
        ocr_bg_job_failed: "Background OCR failed.",
        ocr_bg_job_done_title: "OCR finished",
        ocr_bg_job_progress: "Page {cur} / {total}",
        ocr_bg_job_queued: "Queued…",
        ocr_bg_job_resumed: "Reconnected to the background OCR job (after page reload).",
        ocr_bg_job_toast_click: "Click to open OCR text and load progress so far.",
        loading_ocr: "Running OCR…",
        loading_sub: "Sending to Ollama (It might take a few minutes).",
        gpu_paused: "Paused",
        gpu_err_generic: "Error",
        nvsmi_empty: "(nvidia-smi returned empty)",
        unknown_error: "Unknown error",
        files_label_multi: "{n} files",
        files_label_pdf_multi: "{n} PDF files — click a tile to preview in a window",
        grid_remove_aria: "Remove image",
        grid_drag_title: "Drag to reorder",
        missing_renderjson: "renderjson library missing (CDN).",
        missing_marked: "marked or DOMPurify missing (CDN).",
        json_invalid_prefix: "Invalid JSON: ",
        unknown_format: "Unknown output format.",
        latex_preview_note:
          "LaTeX is not previewed here. Use the raw pane above or a TeX engine.",
        gpu_dot_active: "GPU active ({n}%)",
        gpu_dot_idle: "GPU idle ({n}%)",
        nav_main: "OCR",
        nav_history: "OCR history",
        nav_config: "Settings",
        nav_session_tokens_title:
          "Total input/output tokens from saved OCR history (sum of usage on each record; MongoDB or local history file).",
        config_title: "Server settings",
        config_intro_storage_title: "Where settings are saved",
        config_intro_storage_body:
          "After you click Save, the Ollama, OCR, GPU, and history fields are written to MongoDB (when MONGODB_URI in .env connects) or to data/app_settings.json if MongoDB is not used.",
        config_intro_precedence_title: "Same name as a variable in .env",
        config_intro_precedence_li1:
          "Values saved through this page override the same key from .env once the server has finished starting.",
        config_intro_precedence_li2:
          ".env is still used for the first boot, CI/CD, and variables that are not on this form (e.g. SERVER_PORT).",
        config_intro_env_only_title: "MongoDB and system-only variables",
        config_intro_env_only_body:
          "Connection string and collection names (MONGODB_URI, MONGODB_DB_NAME, MONGODB_COLLECTION_*) are edited only in the server .env file; restart the app after changes.",
        config_mongo_env_note:
          "Configure only in the server .env file (MONGODB_URI, MONGODB_DB_NAME, MONGODB_COLLECTION_*). Restart the app after changing .env.",
        mongo_badge_off: "MongoDB: not configured",
        mongo_badge_ok: "MongoDB: connected",
        mongo_badge_err: "MongoDB: connection failed",
        config_group_ollama: "Ollama",
        config_ollama_think_hint:
          "Turns the think flag on Ollama /api/chat requests (supported models only). Default follows OLLAMA_THINK.",
        config_ollama_keep_alive_hint:
          "Sent as keep_alive on /api/chat: empty = Ollama default (model often stays in VRAM). 0 = unload after each request (frees VRAM; next run slower). Or a duration like 5m, 30s.",
        config_group_ocr: "OCR / PDF",
        config_group_gpu: "GPU panel",
        config_group_mongo: "MongoDB",
        config_group_history: "History & other",
        config_save: "Save settings",
        config_saved_ok: "Application settings saved.",
        config_save_err: "Save failed.",
        config_load_err: "Could not load settings.",
        config_mongo_none: "(no URI)",
        config_mongo_uri_placeholder: "Leave empty to keep current URI; paste a new URI to replace",
        history_title: "OCR history",
        history_refresh: "Refresh",
        history_file_hint:
          "History is stored locally (data/ocr_history.json). When you add MONGODB_URI to .env and restart, existing entries are uploaded to MongoDB automatically.",
        history_empty: "No OCR records yet.",
        history_loading: "Loading…",
        history_err_load: "Could not load history.",
        history_tab_meta: "Summary",
        history_tab_inputs: "Input files",
        history_tab_output_fmt: "Result ({label})",
        history_fmt_md: "Markdown",
        history_fmt_latex: "LaTeX",
        history_fmt_json: "JSON",
        history_badge_pages: "{n} pages",
        history_badge_pdf: "PDF",
        history_badge_merge: "Merge pages",
        history_badge_split: "Split pages",
        history_row_id_label: "ID",
        history_detail_title: "OCR · {id}",
        history_meta_ocr_id: "OCR run ID",
        history_meta_row_id: "Storage row ID",
        history_dl_result_btn: "Download result",
        history_dl_result_hint: "File matches the OCR output format.",
        history_omit_pdf_over_limit: "PDF exceeds storage limit (OCR_HISTORY_MAX_INPUT_BYTES).",
        history_omit_size_limit: "File exceeds size limit.",
        history_omit_disabled: "Input base64 storage is disabled.",
        history_omit_document_cap: "Binary omitted: document exceeded MongoDB size cap.",
        history_omit_pdf_document_cap: "PDF omitted: exceeded MongoDB document size cap.",
        history_col_file: "Filename",
        history_col_type: "MIME type",
        history_col_size: "Size",
        history_meta_created: "Time",
        history_meta_model: "Model",
        history_meta_format: "Format",
        history_meta_merge: "Merge pages",
        history_meta_rendered: "Rendered pages",
        history_meta_tokens: "Tokens in / out",
        history_col_download: "Download",
        history_dl_btn: "Download original",
        history_dl_unavailable: "Not stored",
      },
    };

    function ocrT(key) {
      var pack = OCR_MSG[ocrLocale] || OCR_MSG.vi;
      var v = pack[key];
      if (v === undefined || v === "") v = OCR_MSG.vi[key];
      return v !== undefined ? v : key;
    }

    function ocrTf(key, reps) {
      var s = ocrT(key);
      if (reps) {
        Object.keys(reps).forEach(function (k) {
          s = s.split("{" + k + "}").join(String(reps[k]));
        });
      }
      return s;
    }

    function applyOcrI18n() {
      document.documentElement.lang = ocrLocale === "en" ? "en" : "vi";
      var docTitleEl = document.getElementById("ocrDocTitle");
      if (docTitleEl) docTitleEl.textContent = ocrT("doc_title");
      document.title = ocrT("doc_title");
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var k = el.getAttribute("data-i18n");
        if (k) el.textContent = ocrT(k);
      });
      document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
        var k = el.getAttribute("data-i18n-title");
        if (k) el.title = ocrT(k);
      });
      document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
        var k = el.getAttribute("data-i18n-aria");
        if (k) el.setAttribute("aria-label", ocrT(k));
      });
      document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
        var k = el.getAttribute("data-i18n-alt");
        if (k) el.setAttribute("alt", ocrT(k));
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        var kp = el.getAttribute("data-i18n-placeholder");
        if (kp) el.setAttribute("placeholder", ocrT(kp));
      });
      void refreshNavTokenTotals();
    }

    function setOcrLocale(lang, skipSave) {
      if (lang !== "vi" && lang !== "en") return;
      ocrLocale = lang;
      if (!skipSave) {
        try {
          localStorage.setItem("ocrLocale", lang);
        } catch (eSave) {}
      }
      var bVi = document.getElementById("langVi");
      var bEn = document.getElementById("langEn");
      if (bVi) bVi.classList.toggle("ocr-lang-active", lang === "vi");
      if (bEn) bEn.classList.toggle("ocr-lang-active", lang === "en");
      applyOcrI18n();
    }

    const f = document.getElementById("f");
    const fileInput = document.getElementById("file");
    const btnEmptyPickFiles = document.getElementById("btnEmptyPickFiles");
    const btnEmptyPickFolder = document.getElementById("btnEmptyPickFolder");
    const fileFolder = document.getElementById("fileFolder");
    const btn = document.getElementById("btn");
    const statusEl = document.getElementById("status");
    const out = document.getElementById("out");
    const btnDownloadOcr = document.getElementById("btnDownloadOcr");
    const btnDownloadOcrZip = document.getElementById("btnDownloadOcrZip");
    const btnCopyOcr = document.getElementById("btnCopyOcr");
    const btnRunOcr = document.getElementById("btnRunOcr");
    const ocrRunPane = document.getElementById("ocrRunPane");
    const outRun = document.getElementById("outRun");
    const ocrRunPaneSplitter = document.getElementById("ocrRunPaneSplitter");

    function wireOcrRunPaneSplitter() {
      if (!ocrRunPane || !ocrRunPaneSplitter) return;
      var minH = 96;
      function clamp(n, lo, hi) {
        return Math.max(lo, Math.min(hi, n));
      }
      function getMaxH() {
        var cap = Math.min(Math.floor(window.innerHeight * 0.65), 576);
        var shellEl = document.getElementById("ocrRunPaneShell");
        if (shellEl) {
          var top = shellEl.getBoundingClientRect().top;
          var room = Math.floor(window.innerHeight - top - 28);
          if (room > minH) return Math.min(cap, room);
        }
        return cap;
      }
      function applyHeight(px) {
        ocrRunPane.style.height = clamp(px, minH, getMaxH()) + "px";
        ocrRunPane.style.flex = "0 0 auto";
      }
      function endDrag() {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        try {
          localStorage.setItem("ocrRunPaneHeightPx", String(ocrRunPane.offsetHeight));
        } catch (e0) {}
      }
      ocrRunPaneSplitter.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        var startY = e.clientY;
        var startH = ocrRunPane.offsetHeight;
        function onMove(ev) {
          applyHeight(startH + (ev.clientY - startY));
        }
        function onUp() {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          endDrag();
        }
        document.body.style.cursor = "ns-resize";
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
      ocrRunPaneSplitter.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        e.preventDefault();
        var step = e.shiftKey ? 32 : 10;
        applyHeight(ocrRunPane.offsetHeight + (e.key === "ArrowDown" ? step : -step));
        endDrag();
      });
      try {
        var saved = localStorage.getItem("ocrRunPaneHeightPx");
        if (saved) {
          var px = parseInt(saved, 10);
          if (!isNaN(px) && px >= minH) applyHeight(px);
        }
      } catch (e1) {}
      window.addEventListener("resize", function () {
        if (!ocrRunPane || ocrRunPane.classList.contains("d-none")) return;
        applyHeight(ocrRunPane.offsetHeight);
      });
    }
    wireOcrRunPaneSplitter();

    function setOcrExportButtonsEnabled(on) {
      if (btnDownloadOcr) btnDownloadOcr.disabled = !on;
      var zipOn =
        on &&
        lastOcrSourceOutputs &&
        Array.isArray(lastOcrSourceOutputs) &&
        lastOcrSourceOutputs.length > 1;
      if (btnDownloadOcrZip) btnDownloadOcrZip.disabled = !zipOn;
      if (btnCopyOcr) btnCopyOcr.disabled = !on;
      if (btnRunOcr) btnRunOcr.disabled = !on;
    }

    function clearOcrRunPane() {
      if (outRun) {
        outRun.innerHTML = "";
        outRun.classList.remove("ocr-md-preview");
      }
      if (ocrRunPane) ocrRunPane.classList.add("d-none");
    }

    function escapeHtmlOcr(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function runOcrCompiledPreview() {
      if (!out || !outRun || !ocrRunPane) return;
      if (out.classList.contains("placeholder") || out.classList.contains("ocr-output-loading-wrap")) return;
      var raw = (out.textContent || "").trim();
      if (!raw) return;
      var outputVal = document.getElementById("output").value;
      outRun.innerHTML = "";
      outRun.classList.remove("ocr-md-preview");
      ocrRunPane.classList.remove("d-none");

      try {
        if (outputVal === "json") {
          try {
            var data = JSON.parse(raw);
            if (typeof renderjson !== "undefined") {
              renderjson.set_show_to_level(2);
              renderjson.set_sort_objects(true);
              renderjson.set_icons("▶ ", "▼ ");
              outRun.appendChild(renderjson(data));
            } else {
              outRun.innerHTML =
                '<p class="text-warning small mb-0">' + escapeHtmlOcr(ocrT("missing_renderjson")) + "</p>";
            }
          } catch (err) {
            outRun.innerHTML =
              '<p class="text-danger small mb-0">' +
              escapeHtmlOcr(ocrT("json_invalid_prefix")) +
              escapeHtmlOcr(err.message || err) +
              "</p>";
          }
          return;
        }

        if (outputVal === "md") {
          if (typeof marked !== "undefined" && typeof DOMPurify !== "undefined") {
            var html = marked.parse(raw, { breaks: true, gfm: true });
            outRun.innerHTML = DOMPurify.sanitize(html);
            outRun.classList.add("ocr-md-preview");
          } else {
            outRun.innerHTML =
              '<p class="text-warning small mb-0">' + escapeHtmlOcr(ocrT("missing_marked")) + "</p>";
          }
          return;
        }

        if (outputVal === "latex") {
          outRun.innerHTML =
            '<p class="text-secondary small mb-0">' + escapeHtmlOcr(ocrT("latex_preview_note")) + "</p>";
          return;
        }

        outRun.innerHTML =
          '<p class="text-secondary small mb-0">' + escapeHtmlOcr(ocrT("unknown_format")) + "</p>";
      } finally {
        requestAnimationFrame(function () {
          window.dispatchEvent(new Event("resize"));
        });
      }
    }
    var lastOcrText = "";
    var lastOcrDownloadFilename = "";
    var lastOcrSourceOutputs = null;
    var lastOcrFullText = "";
    var lastOcrPageList = null;

    function splitOcrByPageMarkers(full, isLatex) {
      var re = isLatex
        ? /\r?\n\r?\n% --- Trang (\d+) ---\s*\r?\n\r?\n/g
        : /\r?\n\r?\n## Trang (\d+)\s*\r?\n\r?\n/g;
      var hits = [];
      var m;
      while ((m = re.exec(full)) !== null) {
        hits.push({
          page: parseInt(m[1], 10),
          headerStart: m.index,
          headerEnd: m.index + m[0].length,
        });
      }
      if (hits.length === 0) return null;
      var pages = [];
      for (var i = 0; i < hits.length; i++) {
        var bodyStart = hits[i].headerEnd;
        var bodyEnd = i + 1 < hits.length ? hits[i + 1].headerStart : full.length;
        pages.push({ page: hits[i].page, text: full.slice(bodyStart, bodyEnd).trim() });
      }
      return pages.length >= 2 ? pages : null;
    }

    function buildOcrPageModel(data, outputVal) {
      if (data.format === "latex" && data.pages && data.pages.length > 1) {
        var list = data.pages.map(function (p) {
          return { page: p.page, text: (p.latex || "").trim() };
        });
        return {
          full: list
            .map(function (p) {
              return p.text;
            })
            .join("\n\n"),
          pages: list,
        };
      }
      if (data.format === "md" && data.pages && data.pages.length > 1) {
        var listM = data.pages.map(function (p) {
          return { page: p.page, text: (p.markdown || "").trim() };
        });
        return {
          full: listM
            .map(function (p) {
              return p.text;
            })
            .join("\n\n"),
          pages: listM,
        };
      }
      if (data.format === "json" && data.pages && data.pages.length > 1) {
        var listJ = data.pages.map(function (p) {
          var chunk = p.data !== undefined ? p.data : p;
          return { page: p.page, text: JSON.stringify(chunk, null, 2) };
        });
        return {
          full: JSON.stringify(data, null, 2),
          pages: listJ,
        };
      }
      var full = null;
      if (data.latex !== undefined) full = data.latex;
      else if (data.markdown !== undefined) full = data.markdown;
      if (full == null || outputVal === "json") return null;
      var parsed =
        outputVal === "latex" ? splitOcrByPageMarkers(full, true) : splitOcrByPageMarkers(full, false);
      if (!parsed) return null;
      return { full: full, pages: parsed };
    }

    function pdfBaseUrlNoHash() {
      if (!previewUrl) return "";
      var i = previewUrl.indexOf("#");
      return i >= 0 ? previewUrl.slice(0, i) : previewUrl;
    }

    function syncPdfViewerToPage(n) {
      var base = pdfBaseUrlNoHash();
      if (!base) return;
      var pageUrl = base + "#page=" + n;
      var modalEl = document.getElementById("pdfPreviewModal");
      if (modalEl && modalEl.classList.contains("show") && previewPdfModal) {
        previewPdfModal.src = pageUrl;
        return;
      }
      if (!previewPdf || !previewPdfFrame || previewPdfFrame.classList.contains("d-none")) return;
      previewPdf.src = pageUrl;
    }

    function applyOcrPageView(mode) {
      if (!lastOcrPageList || lastOcrPageList.length < 2) return;
      if (mode === "all" || mode === "") {
        out.textContent = lastOcrFullText;
        return;
      }
      var n = typeof mode === "number" ? mode : parseInt(mode, 10);
      if (isNaN(n)) return;
      var found = null;
      for (var i = 0; i < lastOcrPageList.length; i++) {
        if (lastOcrPageList[i].page === n) {
          found = lastOcrPageList[i];
          break;
        }
      }
      out.textContent = found ? found.text : lastOcrFullText;
    }

    function rebuildOcrPageControls(pageModel) {
      if (!ocrPageSelect || !pdfPageBar || !pdfPageBarWrap) return;
      if (!pageModel || !pageModel.pages || pageModel.pages.length < 2) {
        ocrPageSelect.classList.add("d-none");
        pdfPageBarWrap.classList.add("d-none");
        pdfPageBar.innerHTML = "";
        ocrPageSelect.innerHTML =
          '<option value="all">' + escapeHtmlOcr(ocrT("page_all")) + "</option>";
        lastOcrPageList = null;
        return;
      }
      lastOcrPageList = pageModel.pages;
      lastOcrFullText = pageModel.full;
      ocrPageSelect.classList.remove("d-none");
      pdfPageBarWrap.classList.remove("d-none");
      ocrPageSelect.innerHTML =
        '<option value="all">' + escapeHtmlOcr(ocrT("page_all")) + "</option>";
      pageModel.pages.forEach(function (p) {
        var o = document.createElement("option");
        o.value = String(p.page);
        o.textContent = ocrTf("page_option", { n: p.page });
        ocrPageSelect.appendChild(o);
      });
      ocrPageSelect.value = "all";
      pdfPageBar.innerHTML = "";
      pageModel.pages.forEach(function (p) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-sm btn-outline-info";
        b.textContent = String(p.page);
        b.setAttribute("aria-label", ocrTf("ocr_page_btn_aria", { n: p.page }));
        b.addEventListener("click", function () {
          ocrPageSelect.value = String(p.page);
          applyOcrPageView(p.page);
          syncPdfViewerToPage(p.page);
        });
        pdfPageBar.appendChild(b);
      });
    }

    const dropZone = document.getElementById("dropZone");
    const emptyPh = document.getElementById("emptyPh");
    const previewImg = document.getElementById("previewImg");
    const previewPdf = document.getElementById("previewPdf");
    const previewPdfFrame = document.getElementById("previewPdfFrame");
    const previewPdfModal = document.getElementById("previewPdfModal");
    const pdfPreviewModalEl = document.getElementById("pdfPreviewModal");
    const previewDropStack = document.getElementById("previewDropStack");
    const ocrPageSelect = document.getElementById("ocrPageSelect");
    const pdfPageBar = document.getElementById("pdfPageBar");
    const pdfPageBarWrap = document.getElementById("pdfPageBarWrap");
    const fileLabel = document.getElementById("fileLabel");
    const nvsmiPre = document.getElementById("nvsmi");
    const gpuFetched = document.getElementById("gpuFetched");
    const gpuPause = document.getElementById("gpuPause");
    const gpuLiveDot = document.getElementById("gpuLiveDot");

    if (ocrPageSelect) {
      ocrPageSelect.addEventListener("change", function () {
        var v = ocrPageSelect.value;
        applyOcrPageView(v === "all" ? "all" : parseInt(v, 10));
        if (v !== "all") syncPdfViewerToPage(parseInt(v, 10));
      });
    }

    let previewUrl = null;
    var draftFiles = [];
    var previewThumbUrls = [];
    var mainImageDraftIndex = 0;
    const btnOcrHero = document.getElementById("btnOcrHero");
    const btnNewSession = document.getElementById("btnNewSession");

    function syncHeroOcrButton() {
      if (!btn) return;
      var busy = !!btn.disabled;
      if (btnOcrHero) btnOcrHero.disabled = busy || !draftFiles.length;
      if (fileInput) fileInput.disabled = busy;
      if (btnEmptyPickFiles) btnEmptyPickFiles.disabled = busy;
      if (btnEmptyPickFolder) btnEmptyPickFolder.disabled = busy;
      if (btnNewSession) btnNewSession.disabled = busy;
      if (dropZone) {
        dropZone.classList.toggle("ocr-dropzone--ocr-busy", busy);
        if (busy) dropZone.setAttribute("aria-disabled", "true");
        else dropZone.removeAttribute("aria-disabled");
      }
    }

    const GPU_WS_RECONNECT_MS = 2500;
    let gpuWs = null;
    let gpuReconnectTimer = null;

    function stopGpuPoll() {
      if (gpuReconnectTimer) {
        clearTimeout(gpuReconnectTimer);
        gpuReconnectTimer = null;
      }
      if (gpuWs) {
        gpuWs.onclose = null;
        gpuWs.close(1000);
        gpuWs = null;
      }
      if (gpuLiveDot) gpuLiveDot.style.visibility = "hidden";
    }

    function scheduleGpuReconnect() {
      if (gpuPause && gpuPause.checked) return;
      if (gpuReconnectTimer) return;
      gpuReconnectTimer = setTimeout(function () {
        gpuReconnectTimer = null;
        connectGpuWs();
      }, GPU_WS_RECONNECT_MS);
    }

    function connectGpuWs() {
      if (gpuPause && gpuPause.checked) return;
      if (gpuWs && gpuWs.readyState === WebSocket.OPEN) return;
      if (gpuWs) {
        gpuWs.onclose = null;
        gpuWs.close(1000);
        gpuWs = null;
      }
      var proto = location.protocol === "https:" ? "wss:" : "ws:";
      var url = proto + "//" + location.host + "/ws/gpu";
      gpuWs = new WebSocket(url);
      gpuWs.onopen = function () {
        if (gpuLiveDot) gpuLiveDot.style.visibility = "visible";
      };
      gpuWs.onmessage = function (ev) {
        try {
          var msg = JSON.parse(ev.data);
          if (msg.type === "tick") applyGpuTick(msg);
        } catch (err) {}
      };
      gpuWs.onclose = function () {
        gpuWs = null;
        if (gpuLiveDot) gpuLiveDot.style.visibility = "hidden";
        if (!gpuPause || !gpuPause.checked) scheduleGpuReconnect();
      };
      gpuWs.onerror = function () {};
    }

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function applyNvidiaSmiPayload(j) {
      if (!j) return;
      if (j.ok)
        nvsmiPre.textContent = j.text && j.text.length ? j.text : ocrT("nvsmi_empty");
      else {
        var err = j.error || ocrT("unknown_error");
        nvsmiPre.textContent = err + (j.text ? "\n\n" + j.text : "");
      }
    }

    function applyGpuTick(msg) {
      if (gpuPause && gpuPause.checked) return;
      if (msg.fetched_at) {
        var t = new Date(msg.fetched_at);
        gpuFetched.textContent = t.toLocaleString();
      }
      if (msg.nvidia_smi) applyNvidiaSmiPayload(msg.nvidia_smi);
      if (msg.memory) applyGpuMemoryPayload(msg.memory);
    }

    const GPU_SEG_COUNT = 36;
    const GPU_UTIL_IDLE_BELOW = 8;

    function formatGpuTitleUpper(name) {
      var s = name.replace(/^NVIDIA\s+/i, "").trim();
      s = s.replace(/-SXM\d*-(\d+)GB/i, " · $1GB");
      if (s.indexOf("·") < 0) {
        var m = s.match(/^(.+?)[-\s]+(\d+)GB$/i);
        if (m) s = m[1].replace(/-+$/g, "").trim() + " · " + m[2] + "GB";
      }
      var full = /^NVIDIA/i.test(name) ? "NVIDIA " + s : s;
      return full.toUpperCase();
    }

    /** MiB → GB label (1024 MiB = 1 GiB); show as GB for readability. */
    function formatVramGbFromMib(mib) {
      var x = mib / 1024;
      if (x < 10) {
        return x.toLocaleString("en-US", { maximumFractionDigits: 3, minimumFractionDigits: 0 });
      }
      return x.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    }

    function buildSegBarHtml(pct) {
      var filled = Math.round((Math.min(100, Math.max(0, pct)) / 100) * GPU_SEG_COUNT);
      var parts = [];
      parts.push(
        '<div class="gpu-seg-bar mt-1" role="progressbar" aria-valuenow="' +
          pct +
          '" aria-valuemin="0" aria-valuemax="100" title="' +
          pct +
          '% VRAM">'
      );
      for (var i = 0; i < GPU_SEG_COUNT; i++) {
        parts.push('<span class="gpu-seg' + (i < filled ? " gpu-seg--on" : "") + '" aria-hidden="true"></span>');
      }
      parts.push("</div>");
      return parts.join("");
    }

    function applyGpuMemoryPayload(j) {
      const list = document.getElementById("gpuMemList");
      if (!j) return;
      if (!j.ok) {
        list.className = "small text-secondary";
        list.innerHTML =
          '<p class="text-danger mb-0">' +
          escapeHtml(j.error || ocrT("gpu_err_generic")) +
          "</p>" +
          (j.text
            ? '<pre class="gpu-smi mt-2 mb-0 p-2" style="max-height:140px;font-size:0.62rem">' +
              escapeHtml(j.text) +
              "</pre>"
            : "");
        return;
      }
      list.className = "d-flex flex-column gap-3";
      list.innerHTML = j.gpus
          .map(function (g) {
            var util = typeof g.utilization_gpu === "number" ? g.utilization_gpu : 0;
            var active = util >= GPU_UTIL_IDLE_BELOW;
            var dotClass = active ? "gpu-status-dot--active" : "gpu-status-dot--idle";
            var dotTitle = active
              ? ocrTf("gpu_dot_active", { n: util })
              : ocrTf("gpu_dot_idle", { n: util });
            var pct =
              g.total_mib > 0 ? Math.min(100, Math.round((g.used_mib / g.total_mib) * 1000) / 10) : 0;
            var usedGb = formatVramGbFromMib(g.used_mib);
            var totalGb = formatVramGbFromMib(g.total_mib);
            var mibHint =
              g.used_mib.toLocaleString("en-US") + " MiB / " + g.total_mib.toLocaleString("en-US") + " MiB";
            var titleMain = formatGpuTitleUpper(g.name);
            return (
              '<div class="gpu-vram-panel">' +
              '<div class="d-flex justify-content-between align-items-center gap-2 mb-2">' +
              '<div class="d-flex align-items-center gap-2 min-w-0 flex-grow-1">' +
              '<span class="gpu-status-dot ' +
              dotClass +
              '" title="' +
              escapeHtml(dotTitle) +
              '"></span>' +
              '<span class="gpu-vram-title-line text-truncate" title="' +
              escapeHtml(g.name) +
              '">' +
              escapeHtml(titleMain) +
              "</span></div>" +
              '<span class="gpu-vram-pct flex-shrink-0">' +
              pct +
              "%</span></div>" +
              buildSegBarHtml(pct) +
              '<div class="d-flex justify-content-between align-items-baseline mt-3" title="' +
              escapeHtml(mibHint) +
              '">' +
              '<div class="gpu-vram-used-big">' +
              usedGb +
              ' <span class="unit">GB</span></div>' +
              '<div class="gpu-vram-total-small">/ ' +
              totalGb +
              " GB</div></div></div>"
            );
          })
          .join("");
    }

    function startGpuPoll() {
      if (gpuPause && gpuPause.checked) return;
      if (gpuReconnectTimer) {
        clearTimeout(gpuReconnectTimer);
        gpuReconnectTimer = null;
      }
      connectGpuWs();
    }

    gpuPause.addEventListener("change", () => {
      if (gpuPause.checked) {
        stopGpuPoll();
        gpuFetched.textContent = ocrT("gpu_paused");
      } else startGpuPoll();
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && (!gpuPause || !gpuPause.checked)) {
        if (!gpuWs || gpuWs.readyState !== WebSocket.OPEN) connectGpuWs();
      }
    });

    startGpuPoll();

    function showOcrLoadingInOutput(isPdf) {
      clearOcrRunPane();
      out.classList.remove("placeholder", "ocr-output-text");
      out.classList.add("ocr-output-loading-wrap");
      out.setAttribute("aria-busy", "true");
      var pdfBlock = "";
      if (isPdf) {
        var parHint = 1;
        var cfgPar = document.getElementById("cfgOCR_MAX_PARALLEL");
        if (cfgPar && String(cfgPar.value).trim() !== "") {
          var pn = parseInt(cfgPar.value, 10);
          if (!isNaN(pn) && pn > 0) parHint = pn;
        }
        pdfBlock =
          '<div class="ocr-pdf-progress text-start mb-4 px-2 w-100" style="max-width:28rem;margin:0 auto">' +
          '<div class="d-flex justify-content-between small text-secondary mb-1">' +
          '<span id="ocrProgLabel">PDF — …</span>' +
          '<span id="ocrProgPct" class="font-monospace text-info">0%</span></div>' +
          '<div class="progress rounded-pill" style="height:10px">' +
          '<div id="ocrProgBar" class="progress-bar progress-bar-striped progress-bar-animated bg-info" ' +
          'style="width:0%" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>' +
          '<p id="ocrPdfProgressHint" class="small text-secondary mt-2 mb-0">' +
          escapeHtmlOcr(ocrTf("pdf_progress_hint", { parallel: parHint })) +
          "</p></div>";
      }
      var streamBlock =
        '<div class="ocr-stream-live w-100 mt-3 px-2 text-start align-self-stretch" style="max-width:42rem;margin:0 auto">' +
        '<div id="ocrThinkingWrap" class="d-none mb-2">' +
        '<div class="small text-secondary mb-1"><span data-i18n="ocr_thinking_label">Thinking</span></div>' +
        '<div id="ocrLiveThinking" class="ocr-live-thinking font-monospace" style="white-space:pre-wrap;max-height:22vh;overflow:auto;font-size:0.82rem;line-height:1.35" aria-live="polite"></div>' +
        "</div>" +
        '<div class="small text-body-secondary mb-1"><span data-i18n="ocr_stream_label">Output stream</span></div>' +
        '<div id="ocrLiveStream" class="ocr-live-stream font-monospace w-100" style="white-space:pre-wrap;max-height:40vh;overflow:auto;font-size:0.88rem;line-height:1.4"></div>' +
        "</div>";
      out.innerHTML =
        '<div class="ocr-output-loading d-flex flex-column align-items-center justify-content-center py-5 px-4" role="status">' +
        pdfBlock +
        streamBlock +
        '<div class="spinner-border text-primary ' +
        (isPdf ? "mb-2 mt-2" : "mb-4 mt-2") +
        '" style="width:2.5rem;height:2.5rem" aria-hidden="true"></div>' +
        '<p class="fs-6 fw-semibold text-body mb-2">' +
        escapeHtmlOcr(ocrT("loading_ocr")) +
        "</p>" +
        '<p class="text-secondary small mb-0 px-2 text-center">' +
        escapeHtmlOcr(ocrT("loading_sub")) +
        "</p>" +
        "</div>";
      applyOcrI18n();
    }

    function buildOcrDownloadFilename(uploadName, model, outputVal) {
      var ext =
        outputVal === "json" ? "json" : outputVal === "latex" ? "tex" : "md";
      var base = (uploadName && String(uploadName).trim()) || "ocr";
      var dot = base.lastIndexOf(".");
      var stem = dot > 0 ? base.slice(0, dot) : base;
      var modelSlug = String(model || "model")
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (!modelSlug) modelSlug = "model";
      return stem + ".final_ocr." + modelSlug + "." + ext;
    }

    function downloadOcrZip() {
      if (
        !lastOcrSourceOutputs ||
        !Array.isArray(lastOcrSourceOutputs) ||
        lastOcrSourceOutputs.length < 2
      )
        return;
      if (typeof JSZip === "undefined") {
        if (statusEl) statusEl.textContent = ocrT("err_jszip_missing");
        return;
      }
      var zip = new JSZip();
      for (var z = 0; z < lastOcrSourceOutputs.length; z++) {
        var ent = lastOcrSourceOutputs[z];
        if (!ent || typeof ent !== "object") continue;
        var name = ent.filename ? String(ent.filename) : "file-" + (z + 1);
        var body =
          ent.markdown !== undefined && ent.markdown !== null
            ? String(ent.markdown)
            : ent.latex !== undefined && ent.latex !== null
              ? String(ent.latex)
              : ent.json !== undefined && ent.json !== null
                ? String(ent.json)
                : "";
        zip.file(name, body);
      }
      var zipName = (lastOcrDownloadFilename || "ocr-export.md").replace(/\.[^.]+$/, "") + ".zip";
      zip
        .generateAsync({ type: "blob" })
        .then(function (blob) {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = zipName;
          a.rel = "noopener";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(a.href);
        })
        .catch(function () {
          if (statusEl) statusEl.textContent = ocrT("err_zip_build");
        });
    }

    function downloadOcrBlob() {
      if (!lastOcrText || !lastOcrDownloadFilename) return;
      var isJson = /\.json$/i.test(lastOcrDownloadFilename);
      var isTex = /\.tex$/i.test(lastOcrDownloadFilename);
      var mime = isJson
        ? "application/json;charset=utf-8"
        : isTex
          ? "text/x-tex;charset=utf-8"
          : "text/markdown;charset=utf-8";
      var blob = new Blob([lastOcrText], { type: mime });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = lastOcrDownloadFilename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    }

    function setOcrPdfProgressBar(pct) {
      var bar = document.getElementById("ocrProgBar");
      var pctEl = document.getElementById("ocrProgPct");
      var p = Math.max(0, Math.min(100, Math.round(pct)));
      if (bar) {
        bar.style.width = p + "%";
        bar.setAttribute("aria-valuenow", String(p));
      }
      if (pctEl) pctEl.textContent = p + "%";
    }

    function resetOcrTokenBox() {
      var pin = document.getElementById("ocrTokIn");
      var pout = document.getElementById("ocrTokOut");
      if (pin) pin.textContent = "—";
      if (pout) pout.textContent = "—";
    }

    async function refreshNavTokenTotals() {
      var navIn = document.getElementById("navTokInSum");
      var navOut = document.getElementById("navTokOutSum");
      try {
        var r = await fetch("/api/ocr/history/token-totals");
        if (!r.ok) throw new Error("bad status");
        var j = await r.json();
        if (j && j.ok === true && j.prompt_tokens != null && j.completion_tokens != null) {
          var pi = coerceUsageInt(j.prompt_tokens);
          var po = coerceUsageInt(j.completion_tokens);
          if (navIn) navIn.textContent = pi.toLocaleString();
          if (navOut) navOut.textContent = po.toLocaleString();
          return;
        }
      } catch (eTok) {}
      if (navIn) navIn.textContent = "—";
      if (navOut) navOut.textContent = "—";
    }

    function coerceUsageInt(v) {
      if (typeof v === "number" && !isNaN(v)) return Math.max(0, Math.floor(v));
      if (typeof v === "string" && /^-?\d+$/.test(v.trim())) return Math.max(0, parseInt(v, 10));
      return 0;
    }

    function updateOcrTokenBox(usage) {
      if (!usage) return;
      var pin = document.getElementById("ocrTokIn");
      var pout = document.getElementById("ocrTokOut");
      var pi = coerceUsageInt(usage.prompt_tokens);
      var po = coerceUsageInt(usage.completion_tokens);
      if (pin) pin.textContent = pi.toLocaleString();
      if (pout) pout.textContent = po.toLocaleString();
    }

    async function runOcrStream(formData) {
      var r = await fetch("/api/ocr/stream", { method: "POST", body: formData });
      if (!r.ok) {
        var errText = await r.text();
        throw new Error(errText || r.statusText);
      }
      var reader = r.body.getReader();
      var dec = new TextDecoder();
      var buffer = "";
      var finalData = null;
      var streamUiReady = false;
      var sawThinkingThisPage = false;
      var sawContentThisPage = false;

      function onFirstOcrStreamActivity() {
        if (streamUiReady) return;
        streamUiReady = true;
        var live = document.getElementById("ocrLiveStream");
        if (live) {
          var spin = out.querySelector(".spinner-border");
          if (spin) spin.classList.add("d-none");
        } else {
          out.classList.remove("ocr-output-loading-wrap", "placeholder");
          out.classList.add("ocr-output-text");
          out.removeAttribute("aria-busy");
          out.textContent = "";
        }
      }

      function handleEvent(ev) {
        if (!ev || !ev.event) return;
        if (ev.event === "meta") {
          resetOcrTokenBox();
          var tp = ev.total_pages || 1;
          var lab = document.getElementById("ocrProgLabel");
          if (lab) lab.textContent = ocrTf("stream_pdf_pages", { n: tp });
          setOcrPdfProgressBar(0);
          var hintEl = document.getElementById("ocrPdfProgressHint");
          if (hintEl) {
            var omp = ev.ocr_max_parallel;
            var parN =
              typeof omp === "number" && omp > 0
                ? omp
                : (function () {
                    var el = document.getElementById("cfgOCR_MAX_PARALLEL");
                    if (!el || String(el.value).trim() === "") return 1;
                    var x = parseInt(el.value, 10);
                    return !isNaN(x) && x > 0 ? x : 1;
                  })();
            hintEl.textContent = ocrTf("pdf_progress_hint", { parallel: parN });
          }
          var thM = document.getElementById("ocrLiveThinking");
          if (thM) thM.textContent = "";
          var liveM = document.getElementById("ocrLiveStream");
          if (liveM) liveM.textContent = "";
          var twM = document.getElementById("ocrThinkingWrap");
          if (twM) twM.classList.add("d-none");
        } else if (ev.event === "delta") {
          if (!sawContentThisPage && sawThinkingThisPage) {
            var twAuto = document.getElementById("ocrThinkingWrap");
            var thAuto = document.getElementById("ocrLiveThinking");
            if (thAuto) thAuto.textContent = "";
            if (twAuto) twAuto.classList.add("d-none");
          }
          sawContentThisPage = true;
          onFirstOcrStreamActivity();
          var live = document.getElementById("ocrLiveStream");
          if (live) {
            live.textContent += ev.text || "";
            live.scrollTop = live.scrollHeight;
          } else {
            out.textContent += ev.text || "";
            out.scrollTop = out.scrollHeight;
          }
        } else if (ev.event === "thinking_delta") {
          sawThinkingThisPage = true;
          onFirstOcrStreamActivity();
          var tw = document.getElementById("ocrThinkingWrap");
          if (tw) tw.classList.remove("d-none");
          var th = document.getElementById("ocrLiveThinking");
          if (th) {
            th.textContent += ev.text || "";
            th.scrollTop = th.scrollHeight;
          }
        } else if (ev.event === "page_start") {
          sawThinkingThisPage = false;
          sawContentThisPage = false;
          var thClr = document.getElementById("ocrLiveThinking");
          if (thClr) thClr.textContent = "";
          var liveClr = document.getElementById("ocrLiveStream");
          if (liveClr) liveClr.textContent = "";
          var twClr = document.getElementById("ocrThinkingWrap");
          if (twClr) twClr.classList.add("d-none");
          var lab2 = document.getElementById("ocrProgLabel");
          if (lab2)
            lab2.textContent = ocrTf("stream_ocr_page", {
              cur: ev.page,
              total: ev.total_pages,
            });
          var p0 =
            ev.total_pages > 0 ? Math.round(((ev.page - 1) / ev.total_pages) * 100) : 0;
          setOcrPdfProgressBar(p0);
        } else if (ev.event === "page_done") {
          var p1 =
            ev.total_pages > 0 ? Math.round((ev.page / ev.total_pages) * 100) : 100;
          setOcrPdfProgressBar(p1);
          var lab3 = document.getElementById("ocrProgLabel");
          if (lab3)
            lab3.textContent = ocrTf("stream_done_page", {
              cur: ev.page,
              total: ev.total_pages,
            });
          updateOcrTokenBox(ev.usage);
        } else if (ev.event === "complete") {
          finalData = ev.result;
          var uComplete = ev.usage || (ev.result && ev.result.usage);
          updateOcrTokenBox(uComplete);
        } else if (ev.event === "error") {
          throw new Error(ev.detail || ocrT("err_ocr_generic"));
        }
      }

      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        buffer += dec.decode(chunk.value, { stream: true });
        var nl;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          var line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line) continue;
          var ev;
          try {
            ev = JSON.parse(line);
          } catch (parseErr) {
            continue;
          }
          handleEvent(ev);
        }
      }
      buffer += dec.decode();
      var rem = buffer.trim();
      if (rem) {
        try {
          handleEvent(JSON.parse(rem));
        } catch (parseEnd) {}
      }
      if (!finalData) throw new Error(ocrT("msg_no_result"));
      return finalData;
    }

    var ocrBackgroundTimers = {};
    var OCR_BG_JOB_SS_KEY = "nemotron3_ocr_bg_job_id";

    function readStoredBackgroundOcrJobId() {
      try {
        var s = sessionStorage.getItem(OCR_BG_JOB_SS_KEY);
        return s && String(s).trim() ? String(s).trim() : "";
      } catch (eSs) {
        return "";
      }
    }

    function setStoredBackgroundOcrJobId(jobId) {
      try {
        if (jobId) sessionStorage.setItem(OCR_BG_JOB_SS_KEY, String(jobId));
      } catch (eSet) {}
    }

    function clearStoredBackgroundOcrJobId() {
      try {
        sessionStorage.removeItem(OCR_BG_JOB_SS_KEY);
      } catch (eRm) {}
    }

    function ensureOcrJobToastStack() {
      var s = document.getElementById("ocrJobToastStack");
      if (!s) {
        s = document.createElement("div");
        s.id = "ocrJobToastStack";
        s.className = "position-fixed bottom-0 end-0 p-3";
        s.style.zIndex = "1080";
        s.style.maxWidth = "22rem";
        document.body.appendChild(s);
      }
      return s;
    }

    function applyOcrSuccessFromData(data) {
      if (!out || !data) return;
      /* Luôn gỡ placeholder / loading: nếu đã có ocr-output-text (vd. stream ghi thẳng vào #out),
         nhánh cũ bỏ qua và để lại .placeholder → chữ xám, Copy/Chạy không hoạt động. */
      out.classList.remove("ocr-output-loading-wrap", "placeholder");
      out.classList.add("ocr-output-text");
      out.removeAttribute("aria-busy");
      out.innerHTML = "";
      var modelUsed =
        (document.getElementById("model") && document.getElementById("model").value.trim()) || "nemotron3:33b";
      var outputVal = (document.getElementById("output") && document.getElementById("output").value) || "md";
      var displayText = null;
      if (data.latex !== undefined) displayText = data.latex;
      else if (data.markdown !== undefined) displayText = data.markdown;
      else if (data.format === "latex" && data.pages && data.pages.length) {
        displayText = data.pages
          .map(function (p) {
            return p.latex || "";
          })
          .join("\n\n");
      } else if (data.format === "md" && data.pages && data.pages.length) {
        displayText = data.pages
          .map(function (p) {
            return p.markdown || "";
          })
          .join("\n\n");
      }
      if (displayText !== null) {
        out.textContent = displayText;
        lastOcrText = displayText;
      } else {
        var jsonStr = JSON.stringify(data, null, 2);
        out.textContent = jsonStr;
        lastOcrText = jsonStr;
      }
      var usageForUi = null;
      if (data.usage && typeof data.usage === "object") usageForUi = data.usage;
      else if (
        data.result &&
        typeof data.result === "object" &&
        data.result.usage &&
        typeof data.result.usage === "object"
      )
        usageForUi = data.result.usage;
      if (usageForUi) {
        updateOcrTokenBox(usageForUi);
      }
      void refreshNavTokenTotals();
      var pageModel = buildOcrPageModel(data, outputVal);
      if (pageModel && pageModel.pages && pageModel.pages.length >= 2) {
        rebuildOcrPageControls(pageModel);
      } else {
        rebuildOcrPageControls(null);
      }
      var dlStem =
        draftFiles.length === 1
          ? draftFiles[0].name
          : draftFiles.length + "-files.clipboard-batch";
      lastOcrDownloadFilename = buildOcrDownloadFilename(dlStem, modelUsed, outputVal);
      lastOcrSourceOutputs =
        data.source_outputs && Array.isArray(data.source_outputs) && data.source_outputs.length > 1
          ? data.source_outputs
          : null;
      setOcrExportButtonsEnabled(true);
      try {
        if (location.search) {
          history.replaceState(null, "", location.pathname + location.hash);
        }
      } catch (histErr) {}
    }

    function applyBackgroundJobPartialToOutput(job) {
      if (!out || !job) return;
      var text = job.partial_preview;
      if (typeof text !== "string" || !text.trim()) return;
      out.classList.remove("ocr-output-loading-wrap", "placeholder");
      out.classList.add("ocr-output-text");
      out.removeAttribute("aria-busy");
      out.innerHTML = "";
      out.textContent = text;
      lastOcrText = text;
      var modelUsed =
        (job.model && String(job.model).trim()) ||
        (document.getElementById("model") && document.getElementById("model").value.trim()) ||
        "nemotron3:33b";
      var outputVal = (document.getElementById("output") && document.getElementById("output").value) || "md";
      var dlStem =
        draftFiles.length === 1
          ? draftFiles[0].name
          : draftFiles.length + "-files.clipboard-batch";
      lastOcrDownloadFilename = buildOcrDownloadFilename(dlStem, modelUsed, outputVal);
      lastOcrSourceOutputs = null;
      if (job.usage) updateOcrTokenBox(job.usage);
      setOcrExportButtonsEnabled(true);
      var syn = null;
      try {
        if (outputVal === "json") {
          syn = JSON.parse(text);
        } else if (outputVal === "latex") {
          syn = { format: "latex", latex: text };
        } else {
          syn = { format: "md", markdown: text };
        }
      } catch (eSyn) {
        syn = null;
      }
      if (syn) {
        var pm = buildOcrPageModel(syn, outputVal);
        rebuildOcrPageControls(pm);
      } else {
        rebuildOcrPageControls(null);
      }
    }

    function pollOneBackgroundOcrJob(jobId, toastEl) {
      fetch("/api/ocr/job/" + encodeURIComponent(jobId))
        .then(function (r) {
          return r.json().then(function (j) {
            return { ok: r.ok, j: j };
          });
        })
        .then(function (pack) {
          if (!pack.ok || !pack.j.job) {
            throw new Error(ocrT("ocr_bg_job_poll_err"));
          }
          var job = pack.j.job;
          var st = job.status;
          var line = "";
          if (st === "pending") line = ocrT("ocr_bg_job_queued");
          else if (st === "running") {
            var tot = job.total_pages || 0;
            var pg = job.page || 0;
            if (tot > 0) line = ocrTf("ocr_bg_job_progress", { cur: pg, total: tot });
            else line = ocrT("status_ocr_running");
            if (job.usage) updateOcrTokenBox(job.usage);
          }
          if (
            (st === "running" || st === "pending") &&
            typeof job.partial_preview === "string" &&
            job.partial_preview.trim()
          ) {
            applyBackgroundJobPartialToOutput(job);
          }
          var title = "<strong>" + escapeHtmlOcr(ocrT("ocr_bg_job_label")) + "</strong><br/>";
          var sub = escapeHtmlOcr((job.label || "").slice(0, 120));
          toastEl.innerHTML =
            title +
            '<span class="small">' +
            sub +
            "</span><br/>" +
            '<span class="small text-secondary">' +
            escapeHtmlOcr(line) +
            "</span>";
          if (st === "done") {
            if (ocrBackgroundTimers[jobId]) {
              clearInterval(ocrBackgroundTimers[jobId]);
              delete ocrBackgroundTimers[jobId];
            }
            fetch("/api/ocr/job/" + encodeURIComponent(jobId) + "/result")
              .then(function (r2) {
                if (r2.status === 202) return Promise.resolve(null);
                if (!r2.ok) {
                  return r2.text().then(function (tx) {
                    try {
                      var ej = JSON.parse(tx);
                      throw new Error(ej.detail || r2.statusText);
                    } catch (eParse) {
                      throw new Error(tx || r2.statusText);
                    }
                  });
                }
                return r2.json();
              })
              .then(function (data) {
                if (!data) return;
                clearStoredBackgroundOcrJobId();
                toastEl.className = "alert alert-success py-2 px-3 mb-2 shadow small";
                toastEl.innerHTML =
                  "<strong>" +
                  escapeHtmlOcr(ocrT("ocr_bg_job_done_title")) +
                  "</strong><br/><span class=\"text-secondary\">" +
                  escapeHtmlOcr((job.label || "").slice(0, 80)) +
                  "</span>";
                try {
                  if (typeof setOcrAppView === "function") setOcrAppView("main", true);
                } catch (eNav) {}
                applyOcrSuccessFromData(data);
                if (statusEl) {
                  statusEl.innerHTML =
                    '<i class="fa-solid fa-circle-check text-success me-1"></i>' +
                    escapeHtmlOcr(ocrT("status_done"));
                }
                setTimeout(function () {
                  if (toastEl.parentNode) toastEl.remove();
                }, 8000);
              })
              .catch(function (e2) {
                clearStoredBackgroundOcrJobId();
                toastEl.className = "alert alert-danger py-2 px-3 mb-2 shadow small";
                toastEl.textContent = String(e2.message || e2);
              });
          } else if (st === "error") {
            if (ocrBackgroundTimers[jobId]) {
              clearInterval(ocrBackgroundTimers[jobId]);
              delete ocrBackgroundTimers[jobId];
            }
            clearStoredBackgroundOcrJobId();
            toastEl.className = "alert alert-danger py-2 px-3 mb-2 shadow small";
            toastEl.textContent = job.detail || ocrT("ocr_bg_job_failed");
          }
        })
        .catch(function (e) {
          if (ocrBackgroundTimers[jobId]) {
            clearInterval(ocrBackgroundTimers[jobId]);
            delete ocrBackgroundTimers[jobId];
          }
          clearStoredBackgroundOcrJobId();
          toastEl.className = "alert alert-danger py-2 px-3 mb-2 shadow small";
          toastEl.textContent = String(e.message || e);
        });
    }

    function syncOcrOutputWithActiveBackgroundJob() {
      var jobId = readStoredBackgroundOcrJobId();
      if (!jobId || !out) return;
      fetch("/api/ocr/job/" + encodeURIComponent(jobId))
        .then(function (r) {
          return r.json().then(function (j) {
            return { ok: r.ok, j: j };
          });
        })
        .then(function (pack) {
          if (!pack.ok || !pack.j || !pack.j.job) return;
          var job = pack.j.job;
          var st = job.status;
          if (st !== "pending" && st !== "running") return;
          if (job.usage) updateOcrTokenBox(job.usage);
          if (typeof job.partial_preview === "string" && job.partial_preview.trim()) {
            applyBackgroundJobPartialToOutput(job);
          }
        })
        .catch(function () {});
    }

    function startBackgroundOcrPolling(jobId) {
      if (!jobId) return;
      if (ocrBackgroundTimers[jobId]) return;
      setStoredBackgroundOcrJobId(jobId);
      var stack = ensureOcrJobToastStack();
      var toastEl = document.createElement("div");
      toastEl.className = "alert alert-info py-2 px-3 mb-2 shadow small";
      toastEl.style.cursor = "pointer";
      toastEl.title = ocrT("ocr_bg_job_toast_click");
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("data-ocr-job-id", jobId);
      toastEl.addEventListener("click", function () {
        try {
          if (typeof setOcrAppView === "function") setOcrAppView("main", true);
        } catch (eTc) {}
      });
      stack.appendChild(toastEl);
      pollOneBackgroundOcrJob(jobId, toastEl);
      ocrBackgroundTimers[jobId] = setInterval(function () {
        pollOneBackgroundOcrJob(jobId, toastEl);
      }, 2000);
    }

    function resumeBackgroundOcrJobIfAny() {
      var jobId = readStoredBackgroundOcrJobId();
      if (!jobId || !/^[0-9a-f-]{8}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{12}$/i.test(jobId)) {
        if (jobId) clearStoredBackgroundOcrJobId();
        return;
      }
      fetch("/api/ocr/job/" + encodeURIComponent(jobId))
        .then(function (r) {
          return r.json().then(function (j) {
            return { ok: r.ok, j: j };
          });
        })
        .then(function (pack) {
          if (!pack.ok || !pack.j || !pack.j.job) {
            clearStoredBackgroundOcrJobId();
            return;
          }
          var job = pack.j.job;
          var st = job.status;
          if (st === "done") {
            if (job.usage) updateOcrTokenBox(job.usage);
            fetch("/api/ocr/job/" + encodeURIComponent(jobId) + "/result")
              .then(function (r2) {
                if (r2.status === 202) return Promise.resolve(null);
                if (!r2.ok) {
                  return r2.text().then(function (tx) {
                    throw new Error(tx || r2.statusText);
                  });
                }
                return r2.json();
              })
              .then(function (data) {
                if (!data) return;
                clearStoredBackgroundOcrJobId();
                try {
                  if (typeof setOcrAppView === "function") setOcrAppView("main", true);
                } catch (eNav2) {}
                applyOcrSuccessFromData(data);
                if (statusEl) {
                  statusEl.innerHTML =
                    '<i class="fa-solid fa-circle-check text-success me-1"></i>' +
                    escapeHtmlOcr(ocrT("status_done"));
                }
              })
              .catch(function () {});
            return;
          }
          if (st === "error") {
            clearStoredBackgroundOcrJobId();
            if (statusEl) {
              statusEl.innerHTML =
                '<i class="fa-solid fa-plug-circle-xmark text-danger me-1"></i>' +
                escapeHtmlOcr(String(job.detail || ocrT("ocr_bg_job_failed")));
            }
            return;
          }
          if (st === "pending" || st === "running") {
            try {
              if (typeof setOcrAppView === "function") setOcrAppView("main", true);
            } catch (eNav) {}
            if (statusEl) {
              statusEl.innerHTML =
                '<span class="text-secondary">' + escapeHtmlOcr(ocrT("ocr_bg_job_resumed")) + "</span>";
            }
            if (job.usage) updateOcrTokenBox(job.usage);
            if (typeof job.partial_preview === "string" && job.partial_preview.trim()) {
              applyBackgroundJobPartialToOutput(job);
            } else if (out) {
              out.classList.remove("ocr-output-loading-wrap");
              if (!out.classList.contains("ocr-output-text")) out.classList.add("ocr-output-text");
              out.classList.add("placeholder");
              out.removeAttribute("aria-busy");
              out.innerHTML = "";
              out.textContent = ocrT("ocr_bg_job_out_placeholder");
            }
            startBackgroundOcrPolling(jobId);
          }
        })
        .catch(function () {
          clearStoredBackgroundOcrJobId();
        });
    }

    function dismissPdfPreviewModal() {
      if (!pdfPreviewModalEl || typeof bootstrap === "undefined" || !bootstrap.Modal) return;
      var inst = bootstrap.Modal.getInstance(pdfPreviewModalEl);
      if (inst) inst.hide();
    }

    function revokePreview() {
      if (previewPdfModal) previewPdfModal.removeAttribute("src");
      dismissPdfPreviewModal();
      if (previewPdf) previewPdf.removeAttribute("src");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
      }
    }

    function draftPdfCount() {
      var n = 0;
      for (var i = 0; i < draftFiles.length; i++) {
        if (fileIsPdf(draftFiles[i])) n++;
      }
      return n;
    }

    function useMultiPdfModal() {
      return draftPdfCount() >= 2;
    }

    function showPdfMultiModal(file) {
      if (!pdfPreviewModalEl || !previewPdfModal || !previewUrl) return;
      if (previewPdfFrame) previewPdfFrame.classList.add("d-none");
      var titleEl = document.getElementById("pdfPreviewModalTitle");
      if (titleEl)
        titleEl.textContent = file.webkitRelativePath || file.name || ocrT("pdf_preview_title");
      var pageUrl = previewUrl;
      if (ocrPageSelect && ocrPageSelect.value && ocrPageSelect.value !== "all") {
        var pn = parseInt(ocrPageSelect.value, 10);
        if (!isNaN(pn)) pageUrl = previewUrl + "#page=" + pn;
      }
      previewPdfModal.src = pageUrl;
      if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(pdfPreviewModalEl).show();
      }
    }

    function revokeThumbUrls() {
      previewThumbUrls.forEach(function (u) {
        if (u) URL.revokeObjectURL(u);
      });
      previewThumbUrls = [];
    }

    function fileIsPdf(f) {
      if (!f) return false;
      return f.type === "application/pdf" || /\.pdf$/i.test(f.name || "");
    }

    function fileIsImage(f) {
      if (!f) return false;
      return (
        (f.type && f.type.startsWith("image/")) ||
        /\.(png|jpe?g|gif|webp|bmp|svg|avif|heic|heif)$/i.test(f.name || "")
      );
    }

    function ocrAcceptFile(f) {
      return fileIsImage(f) || fileIsPdf(f);
    }

    function applyDraftToFileInput() {
      try {
        var dt = new DataTransfer();
        draftFiles.forEach(function (f) {
          dt.items.add(f);
        });
        fileInput.files = dt.files;
      } catch (e) {}
    }

    function extFromMime(mime) {
      if (!mime) return "png";
      if (mime === "image/png") return "png";
      if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
      if (mime === "image/webp") return "webp";
      if (mime === "image/gif") return "gif";
      return "png";
    }

    function newClipboardId() {
      if (crypto.randomUUID) return crypto.randomUUID();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    function clipboardPastedFileName(blob) {
      return newClipboardId() + "-clipboard." + extFromMime(blob.type);
    }

    function removeDraftAt(i) {
      if (btn && btn.disabled) return;
      if (i < 0 || i >= draftFiles.length) return;
      draftFiles.splice(i, 1);
      if (mainImageDraftIndex > i) mainImageDraftIndex--;
      else if (mainImageDraftIndex === i)
        mainImageDraftIndex = Math.min(i, Math.max(0, draftFiles.length - 1));
      applyDraftToFileInput();
      updateMultiPreview();
      lastOcrText = "";
      lastOcrDownloadFilename = "";
      lastOcrSourceOutputs = null;
      clearOcrRunPane();
      setOcrExportButtonsEnabled(false);
      rebuildOcrPageControls(null);
    }

    function reorderDraftFiles(fromIdx, toIdx) {
      if (btn && btn.disabled) return;
      if (fromIdx === toIdx) return;
      if (fromIdx < 0 || toIdx < 0 || fromIdx >= draftFiles.length || toIdx >= draftFiles.length) return;
      var item = draftFiles.splice(fromIdx, 1)[0];
      draftFiles.splice(toIdx, 0, item);
      var m = mainImageDraftIndex;
      if (m === fromIdx) mainImageDraftIndex = toIdx;
      else if (fromIdx < m && toIdx >= m) mainImageDraftIndex = m - 1;
      else if (fromIdx > m && toIdx <= m) mainImageDraftIndex = m + 1;
      applyDraftToFileInput();
      updateMultiPreview();
    }

    function openOcrImageZoom(idx) {
      if (idx < 0 || idx >= draftFiles.length) return;
      if (!fileIsImage(draftFiles[idx])) return;
      var modalEl = document.getElementById("ocrImageZoomModal");
      var imgEl = document.getElementById("ocrImageZoomImg");
      var titleEl = document.getElementById("ocrImageZoomTitleLabel");
      if (!modalEl || !imgEl || !titleEl) return;
      var url = previewThumbUrls[idx];
      if (!url) return;
      imgEl.src = url;
      imgEl.alt = draftFiles[idx].name || "";
      titleEl.textContent =
        draftFiles[idx].webkitRelativePath || draftFiles[idx].name || ocrT("image_fallback");
      if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
    }

    function setPreviewHeaderIcon(kind) {
      var wrap = document.getElementById("previewTitleIcon");
      if (!wrap) return;
      var cls = "fa-solid fa-eye";
      if (kind === "pdf") cls = "fa-solid fa-file-pdf";
      else if (kind === "image") cls = "fa-solid fa-file-image";
      else if (kind === "mix") cls = "fa-solid fa-layer-group";
      wrap.innerHTML = '<i class="' + cls + '" aria-hidden="true"></i>';
    }

    function inferFileBadgeKind(files) {
      if (!files || !files.length) return null;
      if (files.every(fileIsPdf)) return "pdf";
      if (files.every(fileIsImage)) return "image";
      return "mix";
    }

    function setFileLabelBadge(text, titles, kind) {
      if (!fileLabel) return;
      fileLabel.title = titles || "";
      fileLabel.textContent = "";
      fileLabel.className =
        "badge text-bg-dark text-truncate max-w-100 d-inline-flex align-items-center gap-1";
      if (kind === "pdf" || kind === "image") {
        var ic = document.createElement("i");
        ic.setAttribute("aria-hidden", "true");
        ic.className =
          "fa-solid " + (kind === "pdf" ? "fa-file-pdf" : "fa-file-image") + " flex-shrink-0";
        fileLabel.appendChild(ic);
      } else if (kind === "mix") {
        var ic2 = document.createElement("i");
        ic2.setAttribute("aria-hidden", "true");
        ic2.className = "fa-solid fa-layer-group flex-shrink-0";
        fileLabel.appendChild(ic2);
      }
      fileLabel.appendChild(document.createTextNode(text));
    }

    function showDraftMainPreview(idx, opts) {
      opts = opts || {};
      var stripEl = document.getElementById("previewThumbs");
      if (stripEl) {
        var cells = stripEl.querySelectorAll(".ocr-grid-cell");
        for (var c = 0; c < cells.length; c++) {
          cells[c].classList.toggle("ocr-grid-cell--active", c === idx);
        }
      }
      if (idx < 0 || idx >= draftFiles.length) return;
      mainImageDraftIndex = idx;
      var sf = draftFiles[idx];
      if (opts.skipPdfPreview && fileIsPdf(sf) && useMultiPdfModal()) {
        revokePreview();
        previewImg.classList.add("d-none");
        if (previewPdfFrame) previewPdfFrame.classList.add("d-none");
        previewImg.removeAttribute("src");
        return;
      }
      revokePreview();
      previewImg.classList.add("d-none");
      if (previewPdfFrame) previewPdfFrame.classList.add("d-none");
      previewImg.removeAttribute("src");
      previewPdf.removeAttribute("src");
      sf = draftFiles[idx];
      if (fileIsPdf(sf)) {
        previewUrl = URL.createObjectURL(sf);
        if (useMultiPdfModal()) {
          showPdfMultiModal(sf);
        } else {
          if (previewPdf) previewPdf.src = previewUrl;
          if (previewPdfFrame) previewPdfFrame.classList.remove("d-none");
        }
      } else if (fileIsImage(sf)) {
        var tu = previewThumbUrls[idx];
        if (tu) {
          previewImg.src = tu;
          previewImg.classList.remove("d-none");
        }
      }
    }

    function updateMultiPreview() {
      revokePreview();
      revokeThumbUrls();
      if (previewDropStack) {
        previewDropStack.classList.remove("ocr-dropzone-stack--preview");
        previewDropStack.classList.remove("ocr-dropzone-stack--multi");
      }
      if (dropZone) dropZone.classList.remove("ocr-dropzone--multi-files");
      var strip = document.getElementById("previewThumbs");
      if (strip) {
        strip.innerHTML = "";
        strip.classList.add("d-none");
      }
      previewImg.classList.add("d-none");
      if (previewPdfFrame) previewPdfFrame.classList.add("d-none");
      previewImg.removeAttribute("src");
      previewPdf.removeAttribute("src");

      if (!draftFiles.length) {
        mainImageDraftIndex = 0;
        emptyPh.classList.remove("d-none");
        if (dropZone) dropZone.classList.remove("ocr-dropzone--has-pdf");
        setPreviewHeaderIcon("empty");
        fileLabel.textContent = "";
        fileLabel.title = "";
        fileLabel.className = "badge text-bg-dark text-truncate max-w-100";
        syncHeroOcrButton();
        return;
      }

      emptyPh.classList.add("d-none");
      if (previewDropStack) previewDropStack.classList.add("ocr-dropzone-stack--preview");
      var relTitles = draftFiles
        .map(function (f) {
          return f.webkitRelativePath || f.name;
        })
        .join("\n");

      if (draftFiles.length === 1) {
        var f0 = draftFiles[0];
        var onePdf = fileIsPdf(f0);
        if (dropZone) dropZone.classList.toggle("ocr-dropzone--has-pdf", !!onePdf);
        if (onePdf) {
          setPreviewHeaderIcon("pdf");
          previewUrl = URL.createObjectURL(f0);
          previewPdf.src = previewUrl;
          if (previewPdfFrame) previewPdfFrame.classList.remove("d-none");
          setFileLabelBadge(f0.name, relTitles, "pdf");
        } else {
          setPreviewHeaderIcon("image");
          mainImageDraftIndex = 0;
          previewUrl = URL.createObjectURL(f0);
          previewImg.classList.remove("d-none");
          previewImg.src = previewUrl;
          setFileLabelBadge(f0.name, relTitles, "image");
        }
        syncHeroOcrButton();
        return;
      }

      if (dropZone) {
        dropZone.classList.toggle(
          "ocr-dropzone--has-pdf",
          draftFiles.some(function (g) {
            return fileIsPdf(g);
          })
        );
      }
      var hk = inferFileBadgeKind(draftFiles);
      if (hk === "mix") setPreviewHeaderIcon("mix");
      else if (hk === "pdf") setPreviewHeaderIcon("pdf");
      else setPreviewHeaderIcon("image");
      var labelText =
        hk === "pdf"
          ? ocrTf("files_label_pdf_multi", { n: draftFiles.length })
          : ocrTf("files_label_multi", { n: draftFiles.length });
      setFileLabelBadge(labelText, relTitles, hk);

      var showIdx = Math.min(Math.max(0, mainImageDraftIndex), draftFiles.length - 1);
      mainImageDraftIndex = showIdx;

      if (!strip) {
        syncHeroOcrButton();
        return;
      }
      strip.classList.remove("d-none");
      strip.setAttribute("aria-label", ocrT("thumbs_aria"));
      if (previewDropStack) previewDropStack.classList.add("ocr-dropzone-stack--multi");
      if (dropZone) dropZone.classList.add("ocr-dropzone--multi-files");

      for (var i = 0; i < draftFiles.length; i++) {
        var f = draftFiles[i];
        var cell = document.createElement("div");
        cell.className = "ocr-grid-cell" + (i === showIdx ? " ocr-grid-cell--active" : "");
        var tip = f.webkitRelativePath || f.name;
        cell.title = tip;
        var badge = document.createElement("span");
        badge.className = "ocr-grid-badge";
        badge.textContent = String(i + 1);
        var btnRm = document.createElement("button");
        btnRm.type = "button";
        btnRm.className = "ocr-grid-remove";
        btnRm.setAttribute("aria-label", ocrT("grid_remove_aria"));
        btnRm.innerHTML = '<i class="fa-solid fa-times" aria-hidden="true"></i>';
        var dragH = document.createElement("div");
        dragH.className = "ocr-grid-drag-h";
        dragH.setAttribute("draggable", "false");
        dragH.setAttribute("aria-hidden", "true");
        dragH.title = ocrT("grid_drag_title");
        dragH.innerHTML = '<i class="fa-solid fa-grip-vertical" aria-hidden="true"></i>';
        cell.draggable = true;
        btnRm.draggable = false;

        var bodyWrap = null;
        if (fileIsImage(f)) {
          var u = URL.createObjectURL(f);
          previewThumbUrls.push(u);
          var imgWrap = document.createElement("div");
          imgWrap.className = "ocr-grid-img-wrap";
          var im = document.createElement("img");
          im.src = u;
          im.alt = f.name || "";
          im.draggable = false;
          im.setAttribute("draggable", "false");
          imgWrap.appendChild(im);
          bodyWrap = imgWrap;
        } else if (fileIsPdf(f)) {
          previewThumbUrls.push(null);
          var pdfWrap = document.createElement("div");
          pdfWrap.className = "ocr-grid-pdf-wrap";
          var ico = document.createElement("i");
          ico.className = "fa-solid fa-file-pdf ocr-grid-pdf-ico";
          ico.setAttribute("aria-hidden", "true");
          var fnSp = document.createElement("span");
          fnSp.className = "ocr-grid-fname";
          fnSp.textContent = f.name || "PDF";
          pdfWrap.appendChild(ico);
          pdfWrap.appendChild(fnSp);
          if (f.webkitRelativePath && f.webkitRelativePath !== f.name) {
            var rp = document.createElement("span");
            rp.className = "ocr-grid-relpath";
            rp.textContent = f.webkitRelativePath;
            pdfWrap.appendChild(rp);
          }
          bodyWrap = pdfWrap;
        } else {
          previewThumbUrls.push(null);
          var unk = document.createElement("div");
          unk.className = "ocr-grid-pdf-wrap";
          var icoU = document.createElement("i");
          icoU.className = "fa-solid fa-file ocr-grid-pdf-ico text-secondary";
          icoU.setAttribute("aria-hidden", "true");
          unk.appendChild(icoU);
          var fn2 = document.createElement("span");
          fn2.className = "ocr-grid-fname";
          fn2.textContent = f.name || "—";
          unk.appendChild(fn2);
          bodyWrap = unk;
        }

        (function (idx) {
          btnRm.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            removeDraftAt(idx);
          });
          cell.addEventListener("dragstart", function (e) {
            if (e.target && e.target.closest && e.target.closest(".ocr-grid-remove")) {
              e.preventDefault();
              return;
            }
            e.stopPropagation();
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(idx));
            cell.classList.add("ocr-grid-cell--dragging");
          });
          cell.addEventListener("dragend", function () {
            cell.classList.remove("ocr-grid-cell--dragging");
            strip.querySelectorAll(".ocr-grid-cell--drop-target").forEach(function (el) {
              el.classList.remove("ocr-grid-cell--drop-target");
            });
          });
          cell.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "move";
            cell.classList.add("ocr-grid-cell--drop-target");
          });
          cell.addEventListener("dragleave", function (e) {
            if (cell.contains(e.relatedTarget)) return;
            cell.classList.remove("ocr-grid-cell--drop-target");
          });
          cell.addEventListener("drop", function (e) {
            e.preventDefault();
            e.stopPropagation();
            cell.classList.remove("ocr-grid-cell--drop-target");
            var fromRaw = e.dataTransfer.getData("text/plain");
            var from = parseInt(fromRaw, 10);
            if (isNaN(from) || from < 0 || from >= draftFiles.length) return;
            reorderDraftFiles(from, idx);
          });
          if (bodyWrap) {
            bodyWrap.addEventListener("click", function (e) {
              e.stopPropagation();
              showDraftMainPreview(idx);
            });
            if (fileIsImage(draftFiles[idx])) {
              bodyWrap.addEventListener("dblclick", function (e) {
                e.preventDefault();
                e.stopPropagation();
                openOcrImageZoom(idx);
              });
            }
          }
        })(i);

        cell.appendChild(badge);
        cell.appendChild(btnRm);
        cell.appendChild(dragH);
        cell.appendChild(bodyWrap);
        strip.appendChild(cell);
      }

      showDraftMainPreview(showIdx, { skipPdfPreview: useMultiPdfModal() });
      syncHeroOcrButton();
    }

    function resetOcrNewSession() {
      var bid = readStoredBackgroundOcrJobId();
      if (bid && ocrBackgroundTimers[bid]) {
        try {
          clearInterval(ocrBackgroundTimers[bid]);
        } catch (eInt) {}
        delete ocrBackgroundTimers[bid];
      }
      clearStoredBackgroundOcrJobId();
      draftFiles = [];
      if (fileInput) fileInput.value = "";
      if (fileFolder)
        try {
          fileFolder.value = "";
        } catch (eFld) {}
      applyDraftToFileInput();
      updateMultiPreview();
      lastOcrText = "";
      lastOcrDownloadFilename = "";
      lastOcrSourceOutputs = null;
      clearOcrRunPane();
      setOcrExportButtonsEnabled(false);
      rebuildOcrPageControls(null);
      if (out) {
        out.classList.remove("ocr-output-loading-wrap");
        out.classList.add("ocr-output-text", "placeholder");
        out.removeAttribute("aria-busy");
        out.innerHTML = "";
        out.textContent = ocrT("out_placeholder");
      }
      if (statusEl) statusEl.innerHTML = "";
      resetOcrTokenBox();
    }

    function setPreviewFromFile(file) {
      if (!file) {
        draftFiles = [];
        applyDraftToFileInput();
        updateMultiPreview();
        return;
      }
      draftFiles = [file];
      applyDraftToFileInput();
      updateMultiPreview();
    }

    function appendDraftFiles(newFiles) {
      if (btn && btn.disabled) return;
      newFiles.forEach(function (f) {
        draftFiles.push(f);
      });
      applyDraftToFileInput();
      updateMultiPreview();
    }

    fileInput.addEventListener("change", () => {
      if (btn && btn.disabled) {
        try {
          fileInput.value = "";
        } catch (eCh) {}
        return;
      }
      draftFiles = Array.from(fileInput.files || []);
      updateMultiPreview();
      lastOcrText = "";
      lastOcrDownloadFilename = "";
      lastOcrSourceOutputs = null;
      clearOcrRunPane();
      setOcrExportButtonsEnabled(false);
      rebuildOcrPageControls(null);
    });

    if (fileFolder) {
      fileFolder.addEventListener("change", function () {
        if (btn && btn.disabled) {
          try {
            fileFolder.value = "";
          } catch (eF0) {}
          return;
        }
        var raw = Array.from(fileFolder.files || []);
        var allowed = raw.filter(ocrAcceptFile);
        allowed.sort(function (a, b) {
          var pa = a.webkitRelativePath || a.name || "";
          var pb = b.webkitRelativePath || b.name || "";
          return pa.localeCompare(pb, undefined, { sensitivity: "base" });
        });
        try {
          fileFolder.value = "";
        } catch (eF1) {}
        if (!allowed.length) {
          alert(ocrT("folder_none_supported"));
          return;
        }
        draftFiles = allowed;
        mainImageDraftIndex = 0;
        applyDraftToFileInput();
        updateMultiPreview();
        lastOcrText = "";
        lastOcrDownloadFilename = "";
        lastOcrSourceOutputs = null;
        clearOcrRunPane();
        setOcrExportButtonsEnabled(false);
        rebuildOcrPageControls(null);
      });
    }
    if (btnEmptyPickFiles && fileInput) {
      btnEmptyPickFiles.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (btn && btn.disabled) return;
        fileInput.click();
      });
    }
    if (btnEmptyPickFolder && fileFolder) {
      btnEmptyPickFolder.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (btn && btn.disabled) return;
        fileFolder.click();
      });
    }

    if (btnDownloadOcr) {
      btnDownloadOcr.addEventListener("click", function () {
        downloadOcrBlob();
      });
    }
    if (btnDownloadOcrZip) {
      btnDownloadOcrZip.addEventListener("click", function () {
        downloadOcrZip();
      });
    }
    if (btnCopyOcr) {
      btnCopyOcr.addEventListener("click", function () {
        var t = out && out.textContent ? out.textContent : "";
        if (!t.trim() || (out && out.classList.contains("placeholder"))) return;
        var label = btnCopyOcr.innerHTML;
        function revert() {
          btnCopyOcr.innerHTML = label;
          btnCopyOcr.disabled = false;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(
            function () {
              btnCopyOcr.innerHTML =
                '<i class="fa-solid fa-check me-1 text-success" aria-hidden="true"></i>' +
                escapeHtmlOcr(ocrT("copy_done"));
              btnCopyOcr.disabled = true;
              setTimeout(function () {
                revert();
                if (lastOcrText) setOcrExportButtonsEnabled(true);
              }, 1600);
            },
            function () {
              revert();
            }
          );
        }
      });
    }
    if (btnRunOcr) {
      btnRunOcr.addEventListener("click", function () {
        runOcrCompiledPreview();
      });
    }

    ["dragenter", "dragover"].forEach((ev) => {
      dropZone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (btn && btn.disabled) return;
        dropZone.classList.add("ocr-dragover");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      dropZone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove("ocr-dragover");
      });
    });
    dropZone.addEventListener("drop", (e) => {
      if (btn && btn.disabled) return;
      const list = e.dataTransfer && e.dataTransfer.files;
      if (!list || !list.length) return;
      var picked = [];
      for (var i = 0; i < list.length; i++) {
        var f = list[i];
        if (ocrAcceptFile(f)) picked.push(f);
      }
      if (!picked.length) return;
      draftFiles = picked;
      applyDraftToFileInput();
      updateMultiPreview();
      lastOcrText = "";
      lastOcrDownloadFilename = "";
      lastOcrSourceOutputs = null;
      clearOcrRunPane();
      setOcrExportButtonsEnabled(false);
      rebuildOcrPageControls(null);
    });

    dropZone.addEventListener("click", function (e) {
      if (!fileInput || (btn && btn.disabled)) return;
      var t = e.target;
      if (
        t &&
        t.closest &&
        t.closest(
          "#btnEmptyPickFiles, #btnEmptyPickFolder, #previewThumbs, .ocr-grid-remove, button, a, label, input, select",
        )
      )
        return;
      var bgJobId = readStoredBackgroundOcrJobId();
      if (bgJobId) {
        var onSingleDoc =
          (previewImg &&
            !previewImg.classList.contains("d-none") &&
            (t === previewImg || previewImg.contains(t))) ||
          (previewPdfFrame &&
            !previewPdfFrame.classList.contains("d-none") &&
            (t === previewPdfFrame ||
              previewPdfFrame.contains(t) ||
              t === previewPdf ||
              (previewPdf && previewPdf.contains(t))));
        if (onSingleDoc) {
          syncOcrOutputWithActiveBackgroundJob();
          return;
        }
      }
      if (
        previewImg &&
        !previewImg.classList.contains("d-none") &&
        (t === previewImg || previewImg.contains(t))
      )
        return;
      if (
        previewPdfFrame &&
        !previewPdfFrame.classList.contains("d-none") &&
        (t === previewPdfFrame ||
          previewPdfFrame.contains(t) ||
          t === previewPdf ||
          (previewPdf && previewPdf.contains(t)))
      )
        return;
      fileInput.click();
    });

    if (previewDropStack) {
      previewDropStack.addEventListener(
        "click",
        function (e) {
          if (!readStoredBackgroundOcrJobId()) return;
          if (e.target.closest && e.target.closest(".ocr-grid-remove, button, a, label, input, select")) return;
          syncOcrOutputWithActiveBackgroundJob();
        },
        true
      );
    }

    dropZone.addEventListener("keydown", function (e) {
      if (!fileInput || (btn && btn.disabled)) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      fileInput.click();
    });

    document.addEventListener("paste", function (e) {
      if (btn && btn.disabled) return;
      if (e.target.closest("#model") || e.target.closest("#output") || e.target.closest("#merge")) return;
      var items = e.clipboardData && e.clipboardData.items;
      if (!items || !items.length) return;
      var added = [];
      for (var j = 0; j < items.length; j++) {
        var it = items[j];
        if (it.kind !== "file") continue;
        var blob = it.getAsFile();
        if (!blob || !blob.type || !blob.type.startsWith("image/")) continue;
        var fname = clipboardPastedFileName(blob);
        added.push(new File([blob], fname, { type: blob.type }));
      }
      if (!added.length) return;
      e.preventDefault();
      appendDraftFiles(added);
      lastOcrText = "";
      lastOcrDownloadFilename = "";
      lastOcrSourceOutputs = null;
      clearOcrRunPane();
      setOcrExportButtonsEnabled(false);
      rebuildOcrPageControls(null);
    });

    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!draftFiles.length) {
        statusEl.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation text-warning me-1"></i>' +
          escapeHtmlOcr(ocrT("err_pick_file"));
        return;
      }
      var isPdf = draftFiles.some(function (f) {
        return f.type === "application/pdf" || /\.pdf$/i.test(f.name || "");
      });
      var bgEl = document.getElementById("ocrBackgroundJob");
      var wantBackground = !!(bgEl && bgEl.checked);
      lastOcrText = "";
      lastOcrDownloadFilename = "";
      lastOcrSourceOutputs = null;
      setOcrExportButtonsEnabled(false);
      rebuildOcrPageControls(null);
      const fd = new FormData();
      for (var fi = 0; fi < draftFiles.length; fi++) {
        fd.append("files", draftFiles[fi], draftFiles[fi].name);
      }
      fd.append("output", document.getElementById("output").value);
      fd.append("merge_pages", document.getElementById("merge").value);
      fd.append("model", document.getElementById("model").value.trim() || "nemotron3:33b");
      var thinkEl = document.getElementById("ollamaThink");
      fd.append("ollama_think", thinkEl && thinkEl.checked ? "1" : "0");

      if (wantBackground) {
        clearOcrRunPane();
        if (!out.classList.contains("ocr-output-text")) {
          out.classList.remove("ocr-output-loading-wrap", "placeholder");
          out.classList.add("ocr-output-text", "placeholder");
        }
        out.removeAttribute("aria-busy");
        out.textContent = ocrT("ocr_bg_job_out_placeholder");
        btn.disabled = true;
        syncHeroOcrButton();
        statusEl.innerHTML =
          '<span class="text-secondary">' + escapeHtmlOcr(ocrT("ocr_bg_job_started")) + "</span>";
        resetOcrTokenBox();
        try {
          var rBg = await fetch("/api/ocr/job", { method: "POST", body: fd });
          var jBg = await rBg.json();
          if (!rBg.ok) {
            var detBg = jBg.detail;
            throw new Error(typeof detBg === "string" ? detBg : JSON.stringify(detBg || rBg.statusText));
          }
          if (!jBg.job_id) throw new Error(ocrT("msg_no_result"));
          startBackgroundOcrPolling(jBg.job_id);
        } catch (errBg) {
          statusEl.innerHTML =
            '<i class="fa-solid fa-plug-circle-xmark text-danger me-1"></i>' + String(errBg);
          out.textContent = "";
          out.classList.add("placeholder");
        } finally {
          btn.disabled = false;
          syncHeroOcrButton();
        }
        return;
      }

      showOcrLoadingInOutput(isPdf);
      btn.disabled = true;
      syncHeroOcrButton();
      statusEl.innerHTML =
        '<span class="text-secondary">' + escapeHtmlOcr(ocrT("status_ocr_running")) + "</span>";
      resetOcrTokenBox();
      try {
        var data = await runOcrStream(fd);
        statusEl.innerHTML =
          '<i class="fa-solid fa-circle-check text-success me-1"></i>' +
          escapeHtmlOcr(ocrT("status_done"));
        applyOcrSuccessFromData(data);
      } catch (err) {
        clearOcrRunPane();
        out.classList.remove("ocr-output-loading-wrap");
        out.classList.add("ocr-output-text", "placeholder");
        out.removeAttribute("aria-busy");
        out.textContent = "";
        lastOcrText = "";
        lastOcrDownloadFilename = "";
        lastOcrSourceOutputs = null;
        setOcrExportButtonsEnabled(false);
        statusEl.innerHTML = '<i class="fa-solid fa-plug-circle-xmark text-danger me-1"></i>' + String(err);
        resetOcrTokenBox();
        rebuildOcrPageControls(null);
      } finally {
        btn.disabled = false;
        syncHeroOcrButton();
      }
    });

    if (btnOcrHero && f) {
      btnOcrHero.addEventListener("click", function () {
        f.requestSubmit();
      });
    }
    if (btnNewSession) {
      btnNewSession.addEventListener("click", function () {
        resetOcrNewSession();
      });
    }

    function refreshOcrI18nDynamic() {
      if (typeof updateMultiPreview === "function") updateMultiPreview();
      if (
        out &&
        out.classList.contains("ocr-output-text") &&
        out.classList.contains("placeholder") &&
        !out.classList.contains("ocr-output-loading-wrap")
      ) {
        out.textContent = ocrT("out_placeholder");
      }
      if (
        typeof lastOcrPageList !== "undefined" &&
        lastOcrPageList &&
        lastOcrPageList.length >= 2 &&
        typeof lastOcrFullText === "string"
      ) {
        rebuildOcrPageControls({ full: lastOcrFullText, pages: lastOcrPageList });
      }
      if (nvsmiPre) {
        var nvTrim = nvsmiPre.textContent.trim();
        if (nvTrim === "Đang tải nvidia-smi…" || nvTrim === "Loading nvidia-smi…")
          nvsmiPre.textContent = ocrT("gpu_nv_loading");
      }
      var memListEl = document.getElementById("gpuMemList");
      if (memListEl && !memListEl.querySelector(".gpu-vram-panel")) {
        var memTrim = memListEl.textContent.trim();
        if (memTrim === "Đang tải…" || memTrim === "Loading…")
          memListEl.textContent = ocrT("gpu_mem_loading");
      }
      if (gpuPause && gpuPause.checked && gpuFetched) {
        gpuFetched.textContent = ocrT("gpu_paused");
      }
      if (typeof draftFiles !== "undefined" && draftFiles.length > 1 && typeof updateMultiPreview === "function") {
        updateMultiPreview();
      }
      try {
        var histViewDyn = document.getElementById("ocrViewHistory");
        if (histViewDyn && !histViewDyn.classList.contains("d-none") && typeof loadOcrHistoryList === "function") {
          void loadOcrHistoryList();
        }
      } catch (eHistI18n) {}
    }

    function loadOllamaModelsIntoSelect() {
      var sel = document.getElementById("model");
      if (!sel || sel.tagName !== "SELECT") return;
      var fallback = (sel.value && sel.value.trim()) || "nemotron3:33b";
      var preferred = "";
      try {
        preferred = localStorage.getItem("ocrModel") || "";
      } catch (e0) {}
      fetch("/api/ollama/models")
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var models = (j && j.models) || [];
          var def = (j && j.default) || fallback;
          if (!models.length) models = [fallback];
          sel.innerHTML = "";
          models.forEach(function (name) {
            var o = document.createElement("option");
            o.value = name;
            o.textContent = name;
            sel.appendChild(o);
          });
          if (preferred && models.indexOf(preferred) >= 0) sel.value = preferred;
          else if (def && models.indexOf(def) >= 0) sel.value = def;
          else sel.value = models[0];
        })
        .catch(function () {});
      sel.addEventListener("change", function () {
        try {
          localStorage.setItem("ocrModel", sel.value);
        } catch (e1) {}
      });
    }

    function syncOllamaThinkCheckboxFromServer() {
      fetch("/api/config")
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var ot = document.getElementById("ollamaThink");
          if (!ot) return;
          var ef = (j && j.effective) || {};
          var v = String(ef.OLLAMA_THINK != null ? ef.OLLAMA_THINK : "1")
            .trim()
            .toLowerCase();
          ot.checked = v === "" || v === "1" || v === "true" || v === "yes" || v === "on";
        })
        .catch(function () {});
    }

    loadOllamaModelsIntoSelect();
    syncOllamaThinkCheckboxFromServer();

    var ocrViewMain = document.getElementById("ocrViewMain");
    var ocrViewHistory = document.getElementById("ocrViewHistory");
    var ocrViewConfig = document.getElementById("ocrViewConfig");
    var navOcrMain = document.getElementById("navOcrMain");
    var navOcrHistory = document.getElementById("navOcrHistory");
    var navOcrConfig = document.getElementById("navOcrConfig");
    var btnHistoryRefresh = document.getElementById("btnHistoryRefresh");
    var ocrHistoryList = document.getElementById("ocrHistoryList");
    var ocrHistoryFileHint = document.getElementById("ocrHistoryFileHint");
    var navMongoBadge = document.getElementById("navMongoBadge");
    var navMongoBadgeText = document.getElementById("navMongoBadgeText");
    var ocrHistoryEmpty = document.getElementById("ocrHistoryEmpty");
    var cfgForm = document.getElementById("cfgForm");
    var cfgStatus = document.getElementById("cfgStatus");

    var CFG_KEYS = [
      "OLLAMA_HOST",
      "OLLAMA_MODEL",
      "OLLAMA_THINK",
      "OLLAMA_KEEP_ALIVE",
      "OCR_PDF_SCALE",
      "OCR_MAX_PARALLEL",
      "OCR_MAX_EDGE",
      "OCR_JPEG_QUALITY",
      "OLLAMA_TIMEOUT_SEC",
      "NVIDIA_SMI_PATH",
      "NVIDIA_SMI_TIMEOUT_SEC",
      "GPU_WS_INTERVAL_SEC",
      "OCR_HISTORY_STORE_INPUT_B64",
      "OCR_HISTORY_MAX_INPUT_BYTES",
      "CORS_ALLOW_ORIGINS",
      "APP_TITLE",
      "APP_VERSION",
    ];

    function formatHistoryDate(iso) {
      if (!iso) return "—";
      try {
        var d = new Date(iso);
        return d.toLocaleString(ocrLocale === "en" ? "en-US" : "vi-VN");
      } catch (eD) {
        return String(iso);
      }
    }

    function formatHistoryBytes(n) {
      if (typeof n !== "number" || n < 0) return "—";
      if (n < 1024) return n + " B";
      if (n < 1048576) return (n / 1024).toFixed(1) + " KiB";
      return (n / 1048576).toFixed(2) + " MiB";
    }

    function historyFormatDisplayLabel(fmt) {
      var f = (fmt || "").toLowerCase();
      if (f === "md") return ocrT("history_fmt_md");
      if (f === "latex") return ocrT("history_fmt_latex");
      return ocrT("history_fmt_json");
    }

    function historyResultBodyText(rec) {
      var fmt = ((rec && rec.format) || "").toLowerCase();
      var res = (rec && rec.result) || {};
      if (fmt === "md") {
        if (typeof res.markdown === "string") return res.markdown;
        if (Array.isArray(res.pages))
          return res.pages
            .map(function (p) {
              return (p && p.markdown) || "";
            })
            .join("\n\n");
        return JSON.stringify(res, null, 2);
      }
      if (fmt === "latex") {
        if (typeof res.latex === "string") return res.latex;
        if (Array.isArray(res.pages))
          return res.pages
            .map(function (p) {
              return (p && p.latex) || "";
            })
            .join("\n\n");
        return JSON.stringify(res, null, 2);
      }
      return JSON.stringify(res, null, 2);
    }

    function historyResultDownloadFilename(rec) {
      var idPart = String((rec && (rec.ocr_id || rec._id)) || "ocr").replace(/[^a-zA-Z0-9._-]+/g, "_");
      if (idPart.length > 48) idPart = idPart.slice(0, 48);
      var fmt = ((rec && rec.format) || "json").toLowerCase();
      var ext = fmt === "md" ? ".md" : fmt === "latex" ? ".tex" : ".json";
      return "ocr-result-" + idPart + ext;
    }

    function downloadHistoryResultFile(rec) {
      var text = historyResultBodyText(rec);
      var fmt = ((rec && rec.format) || "json").toLowerCase();
      var mime =
        fmt === "md"
          ? "text/markdown;charset=utf-8"
          : fmt === "latex"
            ? "text/plain;charset=utf-8"
            : "application/json;charset=utf-8";
      try {
        var blob = new Blob([text], { type: mime });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = historyResultDownloadFilename(rec);
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      } catch (eDr) {
        alert(ocrT("history_err_load"));
      }
    }

    function historyInputOmitMessage(inp) {
      var r = inp && inp.input_omit_reason;
      if (r === "pdf_size_limit") return ocrT("history_omit_pdf_over_limit");
      if (r === "size_limit") return ocrT("history_omit_size_limit");
      if (r === "disabled") return ocrT("history_omit_disabled");
      if (r === "pdf_document_cap") return ocrT("history_omit_pdf_document_cap");
      if (r === "document_size_cap") return ocrT("history_omit_document_cap");
      return ocrT("history_dl_unavailable");
    }

    function downloadHistoryInputFile(inp) {
      var b64 = inp && inp.content_base64;
      if (!b64 || typeof b64 !== "string") return;
      var mime = (inp.content_type && String(inp.content_type).trim()) || "application/octet-stream";
      try {
        var bin = atob(b64);
        var len = bin.length;
        var arr = new Uint8Array(len);
        for (var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
        var blob = new Blob([arr], { type: mime });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        var fn = (inp.filename && String(inp.filename).trim()) || (inp.is_pdf ? "document.pdf" : "download.bin");
        a.download = fn;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      } catch (eDl) {
        alert(ocrT("history_err_load"));
      }
    }

    function setOcrAppView(which, skipUrl) {
      var isMain = which === "main";
      var isHist = which === "history";
      var isCfg = which === "config";
      if (ocrViewMain) ocrViewMain.classList.toggle("d-none", !isMain);
      if (ocrViewHistory) ocrViewHistory.classList.toggle("d-none", !isHist);
      if (ocrViewConfig) ocrViewConfig.classList.toggle("d-none", !isCfg);
      if (navOcrMain) {
        navOcrMain.classList.toggle("btn-secondary", isMain);
        navOcrMain.classList.toggle("btn-outline-secondary", !isMain);
      }
      if (navOcrHistory) {
        navOcrHistory.classList.toggle("btn-info", isHist);
        navOcrHistory.classList.toggle("btn-outline-info", !isHist);
      }
      if (navOcrConfig) {
        navOcrConfig.classList.toggle("btn-warning", isCfg);
        navOcrConfig.classList.toggle("btn-outline-warning", !isCfg);
      }
      [navOcrMain, navOcrHistory, navOcrConfig].forEach(function (a) {
        if (a) a.classList.remove("active");
      });
      if (isMain && navOcrMain) navOcrMain.classList.add("active");
      if (isHist && navOcrHistory) navOcrHistory.classList.add("active");
      if (isCfg && navOcrConfig) navOcrConfig.classList.add("active");
      if (!skipUrl) {
        var path = isHist ? "/history" : isCfg ? "/config" : "/";
        if (location.pathname !== path) {
          try {
            history.pushState({ ocrPage: which }, "", path);
          } catch (ePs) {}
        }
      }
      if (isHist) loadOcrHistoryList();
      if (isCfg) loadOcrConfigForm();
      if (isMain) syncOcrOutputWithActiveBackgroundJob();
    }

    function syncOcrAppViewFromPath() {
      var p = (location.pathname || "/").replace(/\/$/, "") || "/";
      if (p === "/history") setOcrAppView("history", true);
      else if (p === "/config") setOcrAppView("config", true);
      else setOcrAppView("main", true);
    }

    async function refreshMongoNavBadge() {
      if (!navMongoBadge) return;
      var setLabel = function (s) {
        if (navMongoBadgeText) navMongoBadgeText.textContent = s;
        else navMongoBadge.textContent = s;
      };
      try {
        var r = await fetch("/api/config");
        var j = await r.json();
        var ef = (j && j.effective) || {};
        var configured = ef._mongodb_configured === "1";
        var connected = ef._mongodb_connected === "1";
        navMongoBadge.classList.remove("bg-secondary", "bg-success", "bg-warning", "text-dark");
        if (!configured) {
          navMongoBadge.classList.add("bg-secondary");
          setLabel(ocrT("mongo_badge_off"));
        } else if (!connected) {
          navMongoBadge.classList.add("bg-warning", "text-dark");
          setLabel(ocrT("mongo_badge_err"));
        } else {
          navMongoBadge.classList.add("bg-success");
          setLabel(ocrT("mongo_badge_ok"));
        }
      } catch (eB) {
        navMongoBadge.classList.remove("bg-success", "bg-warning", "text-dark");
        navMongoBadge.classList.add("bg-secondary");
        setLabel(ocrT("mongo_badge_off"));
      }
      await refreshNavTokenTotals();
    }

    async function loadOcrConfigForm() {
      if (!cfgForm) return;
      if (cfgStatus) cfgStatus.textContent = "";
      try {
        var rCfg = await fetch("/api/config");
        var jCfg = await rCfg.json();
        var ef = (jCfg && jCfg.effective) || {};
        CFG_KEYS.forEach(function (key) {
          var el = cfgForm.querySelector('[name="' + key + '"]');
          if (!el) return;
          if (el.type === "checkbox") {
            var onc = String(ef[key] || "").toLowerCase();
            el.checked = onc === "1" || onc === "true" || onc === "yes";
            return;
          }
          el.value = ef[key] != null && ef[key] !== undefined ? String(ef[key]) : "";
        });
        var masked = document.getElementById("cfgMongoMasked");
        if (masked) {
          var m = ef._mongodb_uri_masked || "";
          var ok = ef._mongodb_configured === "1";
          masked.textContent = ok && m ? m : ocrT("config_mongo_none");
        }
        var dbDisp = document.getElementById("cfgMongoDbNameDisplay");
        if (dbDisp) dbDisp.textContent = ef.MONGODB_DB_NAME || "—";
        var collDisp = document.getElementById("cfgMongoCollDisplay");
        if (collDisp) collDisp.textContent = ef.MONGODB_COLLECTION_OCR || "—";
        refreshMongoNavBadge();
      } catch (eCfg) {
        if (cfgStatus) cfgStatus.textContent = ocrT("config_load_err");
      }
    }

    async function loadOcrHistoryList() {
      if (!ocrHistoryList) return;
      ocrHistoryList.innerHTML =
        '<div class="list-group-item list-group-item-dark text-secondary small">' +
        escapeHtmlOcr(ocrT("history_loading")) +
        "</div>";
      if (ocrHistoryFileHint) ocrHistoryFileHint.classList.add("d-none");
      if (ocrHistoryEmpty) ocrHistoryEmpty.classList.add("d-none");
      try {
        var r = await fetch("/api/ocr/history?limit=100");
        var j = await r.json();
        ocrHistoryList.innerHTML = "";
        if (ocrHistoryFileHint) {
          if (j.backend === "file") {
            ocrHistoryFileHint.textContent = ocrT("history_file_hint");
            ocrHistoryFileHint.classList.remove("d-none");
          } else {
            ocrHistoryFileHint.classList.add("d-none");
          }
        }
        var items = j.items || [];
        if (!items.length) {
          if (ocrHistoryEmpty) ocrHistoryEmpty.classList.remove("d-none");
          return;
        }
        items.forEach(function (it) {
          var row = document.createElement("button");
          row.type = "button";
          row.className =
            "list-group-item list-group-item-action list-group-item-dark ocr-history-row text-start border-secondary border-opacity-25";
          row.setAttribute("data-history-id", it._id);
          var pubId = it.ocr_id || it._id || "";
          var idShort = pubId.length > 14 ? pubId.slice(0, 12) + "…" : pubId;
          var fmtKey = (it.format || "").toLowerCase();
          var fmtClass =
            fmtKey === "md" ? "text-bg-primary" : fmtKey === "latex" ? "text-bg-warning" : "text-bg-info";
          var pagesN = it.rendered_pages != null ? Number(it.rendered_pages) : 0;
          var pagesBadge =
            pagesN > 0 ? '<span class="badge rounded-pill bg-secondary">' + escapeHtmlOcr(ocrTf("history_badge_pages", { n: pagesN })) + "</span>" : "";
          var hasPdf = (it.inputs || []).some(function (inp) {
            return inp && inp.is_pdf;
          });
          var pdfBadge = hasPdf
            ? '<span class="badge rounded-pill border border-secondary text-secondary">' +
              escapeHtmlOcr(ocrT("history_badge_pdf")) +
              "</span>"
            : "";
          var mergeOn = it.merge_pages === true || it.merge_pages === "true";
          var mergeBadge =
            '<span class="badge rounded-pill ' +
            (mergeOn ? "text-bg-success" : "text-bg-dark border border-secondary") +
            '">' +
            escapeHtmlOcr(ocrT(mergeOn ? "history_badge_merge" : "history_badge_split")) +
            "</span>";
          var sub = it.input_summary || "";
          row.innerHTML =
            '<div class="d-flex flex-wrap align-items-center gap-2 mb-1">' +
            '<span class="badge font-monospace text-bg-dark border border-secondary ocr-history-id-badge" title="' +
            escapeHtmlOcr(pubId) +
            '">' +
            escapeHtmlOcr(ocrT("history_row_id_label")) +
            " " +
            escapeHtmlOcr(idShort) +
            "</span>" +
            '<span class="badge ' +
            fmtClass +
            '">' +
            escapeHtmlOcr(historyFormatDisplayLabel(it.format)) +
            "</span>" +
            pagesBadge +
            pdfBadge +
            mergeBadge +
            "</div>" +
            '<div class="small text-body-secondary">' +
            escapeHtmlOcr(formatHistoryDate(it.created_at) + " · " + (it.model || "—")) +
            "</div>" +
            '<div class="small text-secondary text-truncate mt-1" title="' +
            escapeHtmlOcr(sub) +
            '">' +
            escapeHtmlOcr(sub) +
            "</div>";
          row.addEventListener("click", function () {
            openHistoryDetail(it._id);
          });
          ocrHistoryList.appendChild(row);
        });
        void refreshNavTokenTotals();
      } catch (errH) {
        ocrHistoryList.innerHTML =
          '<div class="list-group-item list-group-item-dark text-danger small">' +
          escapeHtmlOcr(ocrT("history_err_load")) +
          "</div>";
      }
    }

    async function openHistoryDetail(hid) {
      var modalEl = document.getElementById("ocrHistoryDetailModal");
      var titleEl = document.getElementById("ocrHistoryDetailTitle");
      var metaEl = document.getElementById("histDetailMeta");
      var tbody = document.getElementById("histDetailInputsBody");
      var outPre = document.getElementById("histDetailOutput");
      var tabOutBtn = document.getElementById("histTabOutputBtn");
      var outHint = document.getElementById("histDetailOutputHint");
      var btnDlRes = document.getElementById("histDetailDownloadResult");
      if (!modalEl || !hid) return;
      try {
        var r2 = await fetch("/api/ocr/history/" + encodeURIComponent(hid));
        if (!r2.ok) throw new Error(r2.statusText);
        var j2 = await r2.json();
        var rec = j2.record;
        if (!rec) throw new Error("empty");
        var dispId = rec.ocr_id || rec._id || hid;
        if (titleEl) titleEl.textContent = ocrTf("history_detail_title", { id: dispId });
        if (tabOutBtn)
          tabOutBtn.textContent = ocrTf("history_tab_output_fmt", {
            label: historyFormatDisplayLabel(rec.format),
          });
        if (outHint) outHint.textContent = ocrT("history_dl_result_hint");
        if (btnDlRes) {
          btnDlRes.onclick = function () {
            downloadHistoryResultFile(rec);
          };
        }
        if (metaEl) {
          var u = (rec.result && rec.result.usage) || rec.usage || {};
          metaEl.innerHTML =
            '<dl class="row mb-0">' +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_ocr_id")) +
            "</dt><dd class=\"col-sm-8 font-monospace small\">" +
            escapeHtmlOcr(rec.ocr_id || "—") +
            "</dd>" +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_row_id")) +
            "</dt><dd class=\"col-sm-8 font-monospace small\">" +
            escapeHtmlOcr(rec._id || "—") +
            "</dd>" +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_created")) +
            "</dt><dd class=\"col-sm-8\">" +
            escapeHtmlOcr(formatHistoryDate(rec.created_at)) +
            "</dd>" +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_model")) +
            "</dt><dd class=\"col-sm-8\">" +
            escapeHtmlOcr(rec.model || "—") +
            "</dd>" +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_format")) +
            "</dt><dd class=\"col-sm-8\">" +
            escapeHtmlOcr(rec.format || "—") +
            "</dd>" +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_merge")) +
            "</dt><dd class=\"col-sm-8\">" +
            escapeHtmlOcr(String(rec.merge_pages)) +
            "</dd>" +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_rendered")) +
            "</dt><dd class=\"col-sm-8\">" +
            escapeHtmlOcr(String(rec.rendered_pages != null ? rec.rendered_pages : "—")) +
            "</dd>" +
            '<dt class="col-sm-4 text-secondary">' +
            escapeHtmlOcr(ocrT("history_meta_tokens")) +
            "</dt><dd class=\"col-sm-8\">" +
            escapeHtmlOcr(
              (typeof u.prompt_tokens === "number" ? u.prompt_tokens : "—") +
                " / " +
                (typeof u.completion_tokens === "number" ? u.completion_tokens : "—"),
            ) +
            "</dd></dl>";
        }
        if (tbody) {
          tbody.innerHTML = "";
          (rec.inputs || []).forEach(function (inp) {
            var tr = document.createElement("tr");
            var td0 = document.createElement("td");
            td0.textContent = inp.filename || "—";
            var td1 = document.createElement("td");
            td1.textContent = inp.content_type || "—";
            var td2 = document.createElement("td");
            td2.className = "font-monospace";
            td2.textContent = formatHistoryBytes(inp.size_bytes);
            var td3 = document.createElement("td");
            td3.textContent = inp.is_pdf ? "✓" : "—";
            var td4 = document.createElement("td");
            if (inp.content_base64 && typeof inp.content_base64 === "string") {
              var btnDl = document.createElement("button");
              btnDl.type = "button";
              btnDl.className = "btn btn-sm btn-outline-success";
              btnDl.setAttribute("data-i18n", "history_dl_btn");
              btnDl.textContent = ocrT("history_dl_btn");
              btnDl.addEventListener("click", function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                downloadHistoryInputFile(inp);
              });
              td4.appendChild(btnDl);
            } else {
              td4.className = "text-secondary small";
              td4.textContent = historyInputOmitMessage(inp);
            }
            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tbody.appendChild(tr);
          });
        }
        if (outPre) {
          try {
            outPre.textContent = historyResultBodyText(rec);
          } catch (eJ) {
            outPre.textContent = String(rec.result);
          }
        }
        applyOcrI18n();
        var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      } catch (eOpen) {
        alert(ocrT("history_err_load"));
      }
    }

    function wireNavPage(el, which) {
      if (!el) return;
      el.addEventListener("click", function (ev) {
        ev.preventDefault();
        setOcrAppView(which);
      });
    }
    wireNavPage(navOcrMain, "main");
    wireNavPage(navOcrHistory, "history");
    wireNavPage(navOcrConfig, "config");
    window.addEventListener("popstate", syncOcrAppViewFromPath);

    if (cfgForm) {
      cfgForm.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (cfgStatus) cfgStatus.textContent = "";
        var payload = {};
        CFG_KEYS.forEach(function (key) {
          var el = cfgForm.querySelector('[name="' + key + '"]');
          if (!el) return;
          if (el.type === "checkbox") {
            payload[key] = el.checked;
            return;
          }
          var v = el.value.trim();
          if (key === "MONGODB_URI" && !v) return;
          payload[key] = v === "" ? null : v;
        });
        fetch("/api/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (r) {
            if (!r.ok) throw new Error(r.statusText);
            return r.json();
          })
          .then(function () {
            if (cfgStatus) cfgStatus.textContent = ocrT("config_saved_ok");
            loadOcrConfigForm();
            refreshMongoNavBadge();
            syncOllamaThinkCheckboxFromServer();
            applyOcrI18n();
          })
          .catch(function () {
            if (cfgStatus) cfgStatus.textContent = ocrT("config_save_err");
          });
      });
    }

    if (btnHistoryRefresh) {
      btnHistoryRefresh.addEventListener("click", function () {
        loadOcrHistoryList();
      });
    }

    var langViEl = document.getElementById("langVi");
    var langEnEl = document.getElementById("langEn");
    if (langViEl) {
      langViEl.addEventListener("click", function () {
        setOcrLocale("vi");
        refreshOcrI18nDynamic();
        refreshMongoNavBadge();
      });
    }
    if (langEnEl) {
      langEnEl.addEventListener("click", function () {
        setOcrLocale("en");
        refreshOcrI18nDynamic();
        refreshMongoNavBadge();
      });
    }
    setOcrLocale(ocrLocale, true);
    refreshOcrI18nDynamic();
    syncOcrAppViewFromPath();
    refreshMongoNavBadge();
    syncHeroOcrButton();
    resumeBackgroundOcrJobIfAny();
