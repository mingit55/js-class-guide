class HistoryPage {
  historyList = [];
  selectedYear = null;

  listWrapElem = null;
  tabWrapElem = null;

  init() {
    this.listWrapElem = document.querySelector(".history-list");
    this.tabWrapElem = document.querySelector(".tab");

    this.setEvent();
    this.load();
    this.render();
  }

  setEvent() {
    document.querySelector("#insert-form").addEventListener("submit", (e) => {
      e.preventDefault();

      let title = e.target[0].value;
      let date = e.target[1].value;

      this.historyList.push({ title, date });
      this.render();
      this.save();
    });
  }

  render() {
    // 초기화
    this.listWrapElem.innerHTML = ``;
    // 렌더링
    this.historyList.forEach((historyItem) => {
      let date = new Date(historyItem.date);
      let dateText = `${String(date.getMonth() + 1).padStart(2, '0')}. ${String(
        date.getDate()
      ).padStart(2, '0')}.`;
      let elem = $(`<div class="history-list__item">
        <div class="date">${dateText}</div>
        <div class="title">${historyItem.title}</div>
        <div class="button-wrap">
          <button class="btn-edit">수정</button>
          <button class="btn-remove">삭제</button>
        </div>
      </div>`)[0];

      elem.querySelector('.btn-edit').addEventListener('click', () => {
        
      });

      elem.querySelector('.btn-remove').addEventListener('click', () => {

      });

      this.listWrapElem.append(elem);

      $("#insert-form").modal("hide");
    });
  }

  save() {
    localStorage.setItem("historyList", JSON.stringify(this.historyList));
  }

  load() {
    let savedData = localStorage.getItem("historyList");
    if (!savedData) return;
    this.historyList = JSON.parse(savedData);
  }
}

window.addEventListener("load", () => {
  const app = new HistoryPage();
  app.init();
});
