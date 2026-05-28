const timeNode = document.getElementById("statusTime");
const dateNode = document.getElementById("statusDate");
const updatesListNode = document.getElementById("updatesList");
const updatesDataUrl = "./data/updates.json";

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entityMap[char];
    });
}

function renderStatusCard(date, title, description, tag) {
    if (!updatesListNode) {
        return;
    }

    updatesListNode.innerHTML = `
        <article class="update-item">
            <span class="update-date">${escapeHtml(date)}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(description)}</p>
            <span class="update-tag">${escapeHtml(tag)}</span>
        </article>
    `;
}

function renderUpdates(updates) {
    if (!updatesListNode) {
        return;
    }

    updatesListNode.innerHTML = updates.map((update) => `
        <article class="update-item">
            <span class="update-date">${escapeHtml(update.date || "----.--")}</span>
            <h3>${escapeHtml(update.title || "未命名更新")}</h3>
            <p>${escapeHtml(update.description || "暂无描述。")}</p>
            <span class="update-tag">${escapeHtml(update.tag || "Update")}</span>
        </article>
    `).join("");
}

async function loadUpdates() {
    renderStatusCard("Loading", "正在加载更新", "页面正在读取独立的更新数据文件，请稍候。", "Data Driven");

    try {
        const response = await fetch(updatesDataUrl, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Failed to load updates: ${response.status}`);
        }

        const updates = await response.json();

        if (!Array.isArray(updates) || updates.length === 0) {
            renderStatusCard("Empty", "暂无更新记录", "请在 data/updates.json 中追加内容后刷新页面。", "No Data");
            return;
        }

        renderUpdates(updates);
    } catch (error) {
        console.error("Failed to render updates from JSON.", error);
        renderStatusCard(
            "Error",
            "更新加载失败",
            "请确认当前页面通过 HTTP 服务访问，并且 data/updates.json 路径可用。",
            "Load Error"
        );
    }
}

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const date = now.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });

    if (timeNode) {
        timeNode.textContent = "在线 · " + time;
    }

    if (dateNode) {
        dateNode.textContent = date;
    }
}

loadUpdates();
updateClock();
setInterval(updateClock, 1000);
